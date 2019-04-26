'use strict'

import { BaseHandler } from './base'
import Kitsunet = require('../proto')
import { KsnProtocol } from '../ksn-protocol'

const { MsgType, Status } = Kitsunet

export class NodeType extends BaseHandler {
  constructor (rpcEngine: KsnProtocol, peerInfo: any) {
    super('node-type', MsgType.NODE_TYPE, rpcEngine, peerInfo)
  }

  async response (): Promise<any> {
    return {
      type: MsgType.NODE_TYPE,
      status: Status.OK,
      payload: {
        slices: this.rpcEngine.nodeType
      }
    }
  }

  async request (): Promise<any> {
    const res = await this.sendRequest({
      type: MsgType.NODE_TYPE
    })

    return res.payload.nodeType
  }
}
