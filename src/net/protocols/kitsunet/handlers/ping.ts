'use strict'

import { KitsunetHandler } from '../kitsunet-handler'
import Kitsunet = require('../proto')

const { MsgType, Status } = Kitsunet

export class Ping<P> extends KitsunetHandler<P> {
  constructor (rpcEngine, peerInfo) {
    super('ping', MsgType.PING, rpcEngine, peerInfo)
  }

  async handle (): Promise<any> {
    return {
      type: MsgType.PING,
      status: Status.OK
    }
  }

  async request (): Promise<any> {
    await this.send({
      type: MsgType.PING
    })

    return true
  }
}
