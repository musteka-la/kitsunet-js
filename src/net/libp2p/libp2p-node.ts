'use strict'

import Libp2p from 'libp2p'
import PeerInfo from 'peer-info'
import toIterator from 'pull-stream-to-async-iterator'
import pull from 'pull-stream'
import debug from 'debug'
import { register } from 'opium-decorators'
import { promisify } from 'promisify-this'
import { Node } from '../node'
import { Libp2pPeer } from './libp2p-peer'

import {
  IProtocol,
  NetworkType,
  IProtocolConstructor,
  INetwork,
  IProtocolDescriptor,
  ICapability
} from '../interfaces'
import { Libp2pDialer } from './libp2p-dialer'

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
               @register('protocol-registry')
               protocolRegistry: IProtocolDescriptor<Libp2pPeer>[]) {
    super()
    // register this nodes protos
    protocolRegistry.forEach((protoDescriptor: IProtocolDescriptor<Libp2pPeer>) => {
      if (this.isProtoSupported(protoDescriptor)) {
        const Protocol: IProtocolConstructor<Libp2pPeer> = protoDescriptor.constructor
        const proto: IProtocol<Libp2pPeer> = new Protocol(this.peer, this as INetwork<Libp2pPeer>)
        this.protocols.set(proto.id, proto)
        this.mount(proto)
      }
    })

    // a peer has connected, store it
    node.on('peer:connected', (peer: PeerInfo) => {
      const libp2pPeer: Libp2pPeer = new Libp2pPeer(peer)
      protocolRegistry.forEach((protoDescriptor: IProtocolDescriptor<Libp2pPeer>) => {
        if (peer.protocols.includes(protoDescriptor.cap.id)) {
          const Protocol: IProtocolConstructor<Libp2pPeer> = protoDescriptor.constructor
          const proto: IProtocol<Libp2pPeer> = new Protocol(libp2pPeer, this as INetwork<Libp2pPeer>)
          libp2pPeer.protocols.set(this.mkCodec(proto.id, proto.versions), proto)
        }
      })

      this.peers.set(libp2pPeer.id, libp2pPeer)
      this.emit('kitsunet:peer:connected', libp2pPeer)
    })

    node.on('peer:disconnected', (peerInfo: PeerInfo) => {
      // remove disconnected peer
      const libp2pPeer: Libp2pPeer | undefined = this.peers.get(peerInfo.id.toB58String())
      if (libp2pPeer) {
        this.peers.delete(peerInfo.id.toB58String())
        this.emit('kitsunet:peer:disconnected', libp2pPeer)
      }
    })
  }

  mount (protocol: IProtocol<Libp2pPeer>): void {
    this.node.handle(this.mkCodec(protocol.id, protocol.versions),
                     async (codec: string, conn: any) =>
                      this.handleIncoming(codec, promisify(conn)))
  }

  unmount (protocol: IProtocol<Libp2pPeer>): void {
    this.node.unhandle(protocol.id)
  }

  private async handleIncoming (id: string, conn: any) {
    const peerInfo: PeerInfo = await conn.getPeerInfo()
    const peer: Libp2pPeer | undefined = this.peers.get(peerInfo.id.toB58String())
    if (!peer) {
      return debug(`unknown peer ${peerInfo.id.toB58String()}`)
    }

    const protocol: IProtocol<Libp2pPeer> | undefined = peer.protocols.get(id)
    if (protocol) {
      return protocol.receive(toIterator(conn))
    }
  }

  private mkCodec (id: string, versions: string[]): string {
    return `/kitsunet/${id}/${Math.max(...versions.map(Number))}`
  }

  async send<T, U = T> (msg: T,
                        protocol?: IProtocol<Libp2pPeer>,
                        peer?: Libp2pPeer): Promise<void | U | U[]> {
    if (!peer || !protocol) {
      throw new Error('both peer and protocol are required!')
    }

    const conn = await this.libp2pDialer.dial(peer.peer, this.mkCodec(protocol.id, protocol.versions))
    return new Promise((resolve, reject) => {
      pull(
        pull.values(msg),
        conn,
        pull.collect((err: Error, values: U) => {
          if (err) return reject(err)
          resolve(values)
        }))
    })
  }

  async start () {
    const starter = new Promise<void>((resolve) => {
      this.node.on('start', async () => {
        this.started = true
        this.peer.addrs.forEach((ma) => {
          console.log('libp2p listening on', ma.toString())
        })

        return resolve()
      })
    })

    await this.node.start()
    return starter
  }

  async stop () {
    const stopper = new Promise<void>((resolve) => {
      return this.node.on('stop', () => {
        this.started = false
        resolve()
      })
    })

    await this.node.stop()
    return stopper
  }
}
