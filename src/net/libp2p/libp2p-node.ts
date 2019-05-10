'use strict'

import Libp2p from 'libp2p'
import PeerInfo from 'peer-info'
import toIterator from 'pull-stream-to-async-iterator'
import pull from 'pull-stream'
import debug from 'debug'
import { inject } from 'opium-decorator-resolvers'
import { promisify } from 'promisify-this'
import { Node } from '../node'
import { NetworkPeer } from '../peer'
import { Libp2pPeer } from './libp2p-peer'

import {
  IProtocol,
  NetworkType,
  IProtocolConstructor,
  INetwork,
  IProtocolDescriptor,
  ICapability,
  IPeerDescriptor
} from '../interfaces'

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
    })

    node.on('peer:disconnected', (peerInfo: PeerInfo) => {
      // remove disconnected peer
      this.peers.delete(peerInfo.id.toB58String())
    })
  }

  mount (protocol: IProtocol<Libp2pPeer>): void {
    this.node.handle(this.mkCodec(protocol.id, protocol.versions),
                     async (codec: string, conn: any) => this.handleIncoming(codec, promisify(conn)))
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

    const conn = await this.node.dialProtocol(peer.peer, this.mkCodec(protocol.id, protocol.versions))
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

  receive<T, U> (readable: AsyncIterable<T>): AsyncIterable <U> {
    throw new Error('not implemented!')
  }

  async start () {
    await this.node.start()
    this.peer.addrs.forEach((ma) => {
      console.log('libp2p listening on', ma.toString())
    })
    this.started = true
  }

  async stop () {
    await this.node.stop()
    this.started = false
  }
}
