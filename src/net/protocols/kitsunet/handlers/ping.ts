'use strict'

import { KitsunetHandler } from '../kitsunet-handler'

import { MsgType, ResponseStatus } from '../interfaces'

export class Ping<P> extends KitsunetHandler<P> {
  constructor (rpcEngine, peerInfo) {
    super('ping', MsgType[MsgType.PING], rpcEngine, peerInfo)
  }

  async handle (): Promise<any> {
    return {
      type: MsgType.PING,
      status: ResponseStatus.OK
    }
  }

  async request (): Promise<any> {
    await this.send({
      type: MsgType.PING
    })

    return true
  }
}
