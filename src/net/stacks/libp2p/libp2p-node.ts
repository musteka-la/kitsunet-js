'use strict'

import Libp2p from 'libp2p'
import PeerInfo from 'peer-info'
import toIterator from 'pull-stream-to-async-iterator'
import pull from 'pull-stream'
import Debug from 'debug'
import pushable from 'pull-pushable'
import lp from 'pull-length-prefixed'
import * as semver from 'semver'
import { register } from 'opium-decorators'
import { Node } from '../../node'
import { Libp2pPeer } from './libp2p-peer'

import {
  IProtocol,
  NetworkType,
  IProtocolDescriptor,
  ICapability
} from '../../interfaces'
import { Libp2pDialer } from './libp2p-dialer'
import { EthChain, IBlockchain } from '../../../blockchain'

const debug = Debug('kitsunet:net:libp2p:node')

/**
 * Libp2p node
 *
 * @fires Libp2pNode#kitsunet:peer:connected - fires on new connected peer
 * @fires Libp2pNode#kitsunet:peer:disconnected - fires on new discovered peer
 */
@register()
export class Libp2pNode extends Node<Libp2pPeer> {
  started: boolean = false

  // the protocols that this node supports
  caps: ICapability[] = [
    {
      id: 'ksn',
      versions: ['1.0.0']
    },
    {
      id: 'eth',
      versions: ['62', '63']
    }
  ]

  get type (): NetworkType {
    return NetworkType.LIBP2P
  }

  constructor (public node: Libp2p,
               public peer: Libp2pPeer,
               private libp2pDialer: Libp2pDialer,
               @register(EthChain)
               public chain: IBlockchain,
               @register('protocol-registry')
               public protocolRegistry: IProtocolDescriptor<Libp2pPeer>[]) {
    super()

    // register own protocols
    this.registerProtos(protocolRegistry, this.peer)

    // a peer has connected, store it
    libp2pDialer.on('peer:dialed', this.handlePeer.bind(this))
    // node.on('peer:connected', this.handlePeer.bind(this))
    node.on('peer:disconnect', (peerInfo: PeerInfo) => {
      // remove disconnected peer
      const libp2pPeer: Libp2pPeer | undefined = this.peers.get(peerInfo.id.toB58String())
      if (libp2pPeer) {
        this.peers.delete(peerInfo.id.toB58String())
        this.emit('kitsunet:peer:disconnected', libp2pPeer)
      }
    })
  }

  async handlePeer (peer: PeerInfo): Promise<Libp2pPeer | undefined> {
    let libp2pPeer: Libp2pPeer | undefined = await this.peers.get(peer.id.toB58String())
    if (libp2pPeer) return libp2pPeer
    libp2pPeer = new Libp2pPeer(peer)
    this.peers.set(libp2pPeer.id, libp2pPeer)
    const protocols = this.registerProtos(this.protocolRegistry, libp2pPeer)
    try {
      await Promise.all(protocols.map(p => p.handshake()))
    } catch (e) {
      debug(e)
      this.libp2pDialer.banPeer(peer, 60 * 1000)
      return
    }

    this.emit('kitsunet:peer:connected', libp2pPeer)
    return libp2pPeer
  }

  mount (protocol: IProtocol<Libp2pPeer>): void {
    const codec = this.mkCodec(protocol.id, protocol.versions)
    this.node.handle(codec, async (_: any, conn: any) => {
      return this.handleIncoming(protocol.id, conn)
    })
  }

  unmount (protocol: IProtocol<Libp2pPeer>): void {
    this.node.unhandle(protocol.id)
  }

  private async handleIncoming (id: string, conn: any) {
    conn.getPeerInfo(async (err: Error, peerInfo: PeerInfo) => {
      if (err) throw err
      const peer: Libp2pPeer | undefined = await this.handlePeer(peerInfo)
      if (peer) {
        const protocol: IProtocol<Libp2pPeer> | undefined = peer.protocols.get(id)
        if (protocol) {
          try {
            const stream = pushable()
            pull(stream, lp.encode(), conn)
            const inStream = toIterator(pull(conn, lp.decode()))
            for await (const msg of protocol.receive(inStream)) {
              if (!msg) break
              stream.push(msg)
            }
            stream.end()
          } catch (err) {
            debug(err)
          }
        }
      }
    })
  }

  private mkCodec (id: string, versions: string[]): string {
    const v = versions.map((v) => {
      if (!semver.valid(v)) {
        return `${v}.0.0`
      }
      return v
    })
    return `/kitsunet/${id}/${semver.rsort(v)[0]}`
  }

  async send<T, U = T> (msg: T,
                        protocol?: IProtocol<Libp2pPeer>,
                        peer?: Libp2pPeer): Promise<void | U | U[]> {
    if (!peer || !protocol) {
      throw new Error('both peer and protocol are required!')
    }

    const conn = await this.node.dialProtocol(peer.peer, this.mkCodec(protocol.id, protocol.versions))
    return new Promise((resolve, reject) => {
      pull(
        pull.values([msg]),
        lp.encode(),
        conn,
        lp.decode(),
        pull.collect((err: Error, values: U[]) => {
          if (err) {
            // ignore generic stream ended message
            const re = new RegExp('stream ended with:0 but wanted:1')
            if (!re.test(err.message)) {
              debug('an error occurred sending message ', err)
              return reject(err)
            }
          }
          resolve(...values)
        }))
    })
  }

  async start () {
    const starter = new Promise<void>((resolve) => {
      this.node.on('start', async () => {
        await this.node._multicast.start()
        this.started = true
        this.peer.addrs.forEach((ma) => {
          console.log('libp2p listening on', ma.toString())
        })

        await this.libp2pDialer.start()
        return resolve()
      })
    })

    await this.node.start()
    return starter
  }

  async stop () {
    const stopper = new Promise<void>(async (resolve) => {
      await this.libp2pDialer.stop()
      return this.node.on('stop', async () => {
        await this.node._multicast.stop()
        this.started = false
        resolve()
      })
    })

    await this.node.stop()
    return stopper
  }
}
