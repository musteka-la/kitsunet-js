'use strict'

import BaseHandler from './base'
import { MsgType, Status } from '../proto')

export class Ping extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('ping', MsgType.PING, rpcEngine, peerInfo)
  }

  async handle () {
    return {
      type: MsgType.PING,
      status: Status.OK
    }
  }

  async request () {
    await this.sendRequest({
      type: MsgType.PING
    })

    return true
  }
}
