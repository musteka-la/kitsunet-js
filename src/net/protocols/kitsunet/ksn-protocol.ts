'use strict'

import * as Handlers from './handlers'
import debug from 'debug'
import { BaseProtocol } from '../base-protocol'
import { INetwork, IPeerDescriptor } from '../../interfaces'
import { KitsunetHandler } from './kitsunet-handler'
import { register } from 'opium-decorator-resolvers'
import { KsnEncoder } from './ksn-encoder'
import { SliceId, Slice } from '../../../slice'

import {
  Message,
  MsgType,
  Status,
  IKsnProtocol,
  Identify,
  NodeType,
  BlockHeader
} from './interfaces'

const log = debug('kitsunet:kitsunet-proto')

function errResponse (type: number | string) {
  const err = `unknown message type ${type}`
  log(err)
  return { status: Status.ERROR, error: err }
}

const VERSION = '1.0.0'

@register()
export class KsnProtocol<P> extends BaseProtocol<P> implements IKsnProtocol {
  sliceIds: Set<any>
  type: NodeType
  handlers: { [key: string]: KitsunetHandler<P> }
  versions: string[] = [VERSION]
  userAgent: string = 'ksn'
  latestBlock: number | null = null

  get id (): string {
    return 'ksn'
  }

  constructor (public peer: IPeerDescriptor<P>,
               public networkProvider: INetwork<P>) {
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
        yield this.handlers[msg.type].handle<Message, U>(msg)
      }

      errResponse(msg.type)
    }
  }

  async send<Message, Buffer> (msg: Message): Promise<Buffer> {
    return super.send(msg, this)
  }

  /**
   * initiate the identify flow
   */
  async identify (): Promise<Identify> {
    const res = await this.handlers[MsgType.IDENTIFY].request()
    this.versions = res.version
    this.userAgent = res.userAgent

    this.sliceIds = res.sliceIds
      ? new Set(res.sliceIds.map((s) => new SliceId(s.toString())))
      : new Set()

    this.latestBlock = res.latestBlock
    this.type = res.nodeType

    return res
  }

  /**
   * Get all slice ids for the peer
   */
  async getSliceIds () {
    this.sliceIds = await this.handlers[MsgType.SLICE_ID].request()
    return this.sliceIds
  }

  /**
   * Get slices for the provided ids or all the
   * slices the peer is holding
   *
   * @param {Array<SliceId>} slices - optional
   */

  getSlicesById (slices: string[]): Promise<Slice[]> {
    return this.handlers[MsgType.SLICES].request(slices)
  }

  /**
   * Get all headers
   */
  async headers (): Promise<BlockHeader[]> {
    return this.handlers[MsgType.HEADERS].request()
  }

  /**
   * Get Node type - bridge, edge, node
   */
  async nodeType () {
    this.type = await this.handlers[MsgType.NODE_TYPE].request()
    return this.type
  }

  /**
   * Ping peer
   */
  async ping (): Promise<boolean> {
    return this.handlers[MsgType.PING].request()
  }
}
