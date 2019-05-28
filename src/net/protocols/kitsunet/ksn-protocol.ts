'use strict'

import * as Handlers from './handlers'
import debug from 'debug'
import { BaseProtocol } from '../../base-protocol'
import { INetwork, IPeerDescriptor } from '../../interfaces'
import { KitsunetHandler } from './kitsunet-handler'
import { KsnEncoder } from './ksn-encoder'
import { EthChain } from '../../../blockchain'

import {
  Message,
  MsgType,
  IKsnProtocol,
  Identify,
  NodeType} from './interfaces'
import { SliceId } from '../../../slice'

const log = debug('kitsunet:kitsunet-proto')

const VERSION = '1.0.0'

export class KsnProtocol<P extends IPeerDescriptor<any>> extends BaseProtocol<P> implements IKsnProtocol {
  sliceIds: Set<any>
  type: NodeType
  handlers: { [key: string]: KitsunetHandler<P> }
  versions: string[] = [VERSION]
  userAgent: string = 'ksn-client'
  latestBlock: number | null = null

  get id (): string {
    return 'ksn'
  }

  constructor (public peer: P,
               public networkProvider: INetwork<P>,
               public ethChain: EthChain) {
    super(peer, networkProvider, new KsnEncoder())
    this.sliceIds = new Set()
    this.type = NodeType.NODE

    this.handlers = {}
    Object.keys(Handlers).forEach((handler) => {
      const h = Reflect.construct(Handlers[handler], [this, this.peer])
      this.handlers[h.id] = h
    })
  }

  async *receive<Buffer, U> (readable: AsyncIterable<Buffer>): AsyncIterable<U> {
    for await (const msg of super.receive<Buffer, Message>(readable)) {
      if (msg.type !== MsgType.UNKNOWN_MSG) {
        yield await this.handlers[MsgType[msg.type]].handle<Message, U>(msg)
      }
    }
  }

  async send<Message, Buffer> (msg: Message): Promise<Buffer> {
    return super.send(msg, this)
  }

  /**
   * initiate the identify flow
   */
  async handshake (): Promise<void> {
    const res: Identify = await this.handlers[MsgType[MsgType.IDENTIFY]].request()
    this.versions = res.versions
    this.userAgent = res.userAgent

    this.sliceIds = res.sliceIds
      ? new Set(res.sliceIds.map((s) => new SliceId(s.toString())))
      : new Set()

    this.latestBlock = res.latestBlock
    this.type = res.nodeType
  }

  // /**
  //  * Get all slice ids for the peer
  //  */
  // async getSliceIds () {
  //   this.sliceIds = await this.handlers[MsgType.SLICE_ID].request()
  //   return this.sliceIds
  // }

  // /**
  //  * Get slices for the provided ids or all the
  //  * slices the peer is holding
  //  *
  //  * @param {Array<SliceId>} slices - optional
  //  */

  // getSlicesById (slices: string[]): Promise<Slice[]> {
  //   return this.handlers[MsgType.SLICES].request(slices)
  // }

  // /**
  //  * Get all headers
  //  */
  // async headers (): Promise<BlockHeader[]> {
  //   return this.handlers[MsgType.HEADERS].request()
  // }

  // /**
  //  * Get Node type - bridge, edge, node
  //  */
  // async nodeType () {
  //   this.type = await this.handlers[MsgType.NODE_TYPE].request()
  //   return this.type
  // }

  /**
   * Ping peer
   */
  // async ping (): Promise<boolean> {
  //   return this.handlers[MsgType.PING].request()
  // }
}
