'use strict'

import { NodeTypes } from '../../../constants'
import * as Handlers from './handlers'
import debug from 'debug'
import Kitsunet = require('./proto')
import { BaseProtocol } from '../base-protocol'
import { INetwork, IPeerDescriptor } from '../../interfaces'
import { BaseHandler } from './base-handler'
import { register } from 'opium-decorator-resolvers'
import { KsnEncoder } from './ksn-encoder'

const { MsgType, Status } = Kitsunet
const log = debug('kitsunet:kitsunet-proto')

function errResponse (type: number | string) {
  const err = `unknown message type ${type}`
  log(err)
  return { status: Status.ERROR, error: err }
}

const VERSION = '1.0.0'

@register()
export class KsnProtocol<P> extends BaseProtocol<P> {
  sliceIds: Set<any>
  type: NodeTypes
  handlers: { [key: string]: BaseHandler<P> }
  version: string = VERSION
  userAgent: string = 'ksn'
  latestBlock: number | null = null

  get id (): string {
    return 'ksn'
  }

  get codec (): string {
    return `/kitsunet/rpc/${VERSION}`
  }

  constructor (public peer: IPeerDescriptor<P>,
               public networkProvider: INetwork<P>) {
    super(peer, networkProvider, new KsnEncoder())
    this.sliceIds = new Set()
    this.type = NodeTypes.NODE

    this.handlers = {}
    Object.keys(Handlers).forEach((handler) => {
      const h = Reflect.construct(Handlers[handler], [this, this.peer])
      this.handlers[h.id] = h
    })
  }

  async *receive<T> (readable: AsyncIterable<T>): AsyncIterable<T> {
    for await (const msg of super.receive(readable)) {
      log('got request', msg)
      if (msg.type !== MsgType.UNKNOWN) {
        yield this.handlers[msg.type].handle(msg)
      }

      return errResponse(msg.type)
    }
  }

  async send<T, U> (msg: T): Promise<U> {
    return super.send(msg, this)
  }

  /**
   * initiate the identify flow
   */
  // async identiy () {
  //   const res = await this.handlers[MsgType.IDENTIFY].request()
  //   this.version = res.version
  //   this.userAgent = res.userAgent

  //   this.sliceIds = res.sliceIds
  //     ? new Set(res.sliceIds.map((s) => new SliceId(s.toString())))
  //     : new Set()

  //   this.latestBlock = res.latestBlock
  //   this.nodeType = res.nodeType

  //   return res
  // }

  /**
   * Get all slice ids for the peer
  */
//  async getSliceds () {
//     this.sliceIds = await this.handlers[MsgType.SLICE_ID].request()
//     return this.sliceIds
//   }

  /**
   * Get slices for the provided ids or all the
   * slices the peer is holding
   *
   * @param {Array<SliceId>} slices - optional
   *        async getSlicesyId(slices) {
    return this.handlers[MsgType.SLICES].request(slices)
  }

  /**
   * Get all headers

    async heders() {
    return this.handlers[MsgType.HEADERS].request()
  }

  /**
   * Get Node type - bridge, edge, node
      /
    async noeType() {
    this.type = await this.handlers[MsgType.NODE_TYPE].request()
    return this.type
  }

  /**
   * Ping peer
     */
  // async ping () {
  //   return this.handlers[MsgType.PING].request()
  // }
}
