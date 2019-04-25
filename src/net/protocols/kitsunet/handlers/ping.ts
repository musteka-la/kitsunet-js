'use strict'

import { BaseHandler } from './base'
import Kitsunet = require('../proto')

const { MsgType, Status } = Kitsunet

export class Ping extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('ping', MsgType.PING, rpcEngine, peerInfo)
  }

  async response (): Promise<any> {
    return {
      type: MsgType.PING,
      status: Status.OK
    }
  }

  async request (): Promise<any> {
    await this.sendRequest({
      type: MsgType.PING
    })

    return true
  }
}
