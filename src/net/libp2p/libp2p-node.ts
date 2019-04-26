'use strict'

import { register } from 'opium-decorator-resolvers'

import Libp2p from 'libp2p'
import PeerInfo from 'peer-info'
import toIterator from 'pull-stream-to-async-iterator'
import pull from 'pull-stream'
import pullPushable from 'pull-pushable'
import { Node, IProtocol, NodeType, Peer } from '../interfaces'

@register()
export class Libp2pNode implements Node<PeerInfo> {
  get peer (): Peer<PeerInfo> {
    return this
  }

  get info (): PeerInfo {
    return this.peerInfo
  }

  get sId (): string {
    return this.peerInfo.id.toB58String()
  }

  get addrs (): Set<string> {
    return new Set(this.peerInfo.multiaddrs.map((a) => a.toString()))
  }

  get type (): NodeType {
    return NodeType.LIBP2P
  }

  private node: Libp2p
  private peerInfo: PeerInfo
  constructor (peerInfo: PeerInfo,
               @register() node: Libp2p) {
    this.peerInfo = peerInfo
    this.node = node
  }

  async mount (protocol: IProtocol<PeerInfo>): Promise<boolean> {
    return new Promise((resolve) => {
      protocol.networkProvider = this
      this.node.handle(protocol.codec, (_, conn: any) => {
        protocol.handle(toIterator(conn))
      })
      resolve(true)
    })
  }

  async unmount (protocol: IProtocol<PeerInfo>): Promise<boolean> {
    this.node.unhandle(protocol.id)
    return true
  }

  async send<T extends Buffer, U> (msg: T,
                                   protocol: IProtocol<PeerInfo>): Promise<U> {
    const conn = await this.node.dial(protocol.info, protocol.codec)
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

  handle<T extends AsyncIterable<T>> (readable: T): void {
    throw new Error('Method not implemented!')
  }

  /**
   * Create a two way stream with remote
   *
   * @param readable - an async iterable to stream from
   * @returns - an async iterator to pull from
   */
  async *stream<T extends AsyncIterable<T & Buffer>, U> (readable: T,
                                                         protocol: IProtocol<PeerInfo>): AsyncIterator<U> {
    const conn = await this.node.dial(protocol.info, protocol.codec)

    const pushable = pullPushable()
    for await (const msg of readable) {
      pushable.push(msg)
    }

    pull(
      pushable,
      conn,
      pull.drain(function* (msg: T) {
        yield msg
      }))
  }

  async start () {
    await this.node.start()
    this.addrs.forEach((ma) => {
      console.log('Swarm listening on', ma.toString())
    })
  }

  async stop () {
    await this.node.stop()
  }
}
