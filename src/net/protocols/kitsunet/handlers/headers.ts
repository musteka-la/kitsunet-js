'use strict'

import { BaseHandler } from './base'
import { KsnRpc } from '../ksn-rpc'
import Kitsunet = require('../proto')

const { MsgType, Status } = Kitsunet

export class Header extends BaseHandler {
  constructor (rpcEngine: KsnRpc, peerInfo: any) {
    super('headers', MsgType.HEADERS, rpcEngine, peerInfo)
  }

  async response (): Promise<any> {
    return {
      type: MsgType.HEADERS,
      status: Status.OK,
      payload: {
        slices: await this.rpcEngine.getHeaders()
      }
    }
  }

  async request () {
    const res = await this.sendRequest({
      type: MsgType.HEADERS
    })
    return res.payload.headers
  }
}
