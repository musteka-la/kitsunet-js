'use strict'

import { register } from 'opium-decorator-resolvers'
import promisify from 'promisify-this'
import Libp2p from 'libp2p'
import PeerInfo from 'peer-info'
import toIterator from 'pull-stream-to-async-iterator'
import pull from 'pull-stream'
import { Node } from '../node'
import { NetworkPeer } from '../peer'
import { Libp2pPeer } from './libp2p-peer'
import debug from 'debug'

import {
  IProtocol,
  NetworkType,
  IProtocolConstructor,
  INetwork
} from '../interfaces'

@register()
export class Libp2pNode extends Node<PeerInfo> {
  started: boolean = false

  get type (): NetworkType {
    return NetworkType.LIBP2P
  }

  constructor (@register() public node: Libp2p,
               @register() public peer: NetworkPeer<PeerInfo>,
               @register() protocolRegistry: IProtocolConstructor<PeerInfo>[]) {
    super()

    // mount this peers protos
    protocolRegistry.forEach((Protocol: IProtocolConstructor<PeerInfo>) => {
      const proto: IProtocol<PeerInfo> = new Protocol(this.peer.peer, this as INetwork<PeerInfo>)
      this.protocols.set(proto.id, proto)
      this.mount(proto)
    })

    // a peer has connected, store it
    node.on('peer:connected', (peer: PeerInfo) => {
      const libp2pPeer: Libp2pPeer = new Libp2pPeer(peer)
      let protos: Map<string, IProtocol<PeerInfo>> = new Map()
      protocolRegistry.forEach((Protocol: IProtocolConstructor<PeerInfo>) => {
        const proto = new Protocol(libp2pPeer, this as INetwork<PeerInfo>)
        protos.set(proto.codec, proto)
      })

      this.peers.set(libp2pPeer.id, new NetworkPeer(libp2pPeer, protos))
    })

    node.on('peer:disconnected', (peerInfo: PeerInfo) => {
      // remove disconnected peer
      this.peers.delete(peerInfo.id.toB58String())
    })
  }

  mount (protocol: IProtocol<PeerInfo>): void {
    this.node.handle(protocol.codec, async (codec: string, conn: any) => {
      return this.handleIncoming(codec, promisify(conn))
    })
  }

  unmount (protocol: IProtocol<PeerInfo>): void {
    this.node.unhandle(protocol.id)
  }

  private async handleIncoming (id: string, conn: any) {
    const peerInfo: PeerInfo = await conn.getPeerInfo()
    const peer: NetworkPeer<PeerInfo> | undefined = this.peers.get(peerInfo.id.toB58String())
    if (!peer) {
      return debug(`unknown peer ${peerInfo.id.toB58String()}`)
    }

    const protocol: IProtocol<PeerInfo> | undefined = peer.protocols.get(id)
    if (protocol) {
      return protocol.receive(toIterator(conn))
    }
  }

  async send<T, U = T> (msg: T,
                        protocol?: IProtocol<PeerInfo>,
                        peer?: PeerInfo): Promise<void | U | U[]> {
    if (!peer || !protocol) {
      throw new Error('both peer and protocol are required!')
    }

    const conn = await this.node.dialProtocol(peer, protocol.codec)
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
    this.peer.addrs.forEach((ma) => { console.log('libp2p listening on', ma.toString()) })
    this.started = true
  }

  async stop () {
    await this.node.stop()
    this.started = false
  }
}
