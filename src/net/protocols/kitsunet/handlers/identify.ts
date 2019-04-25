'use strict'

import { BaseHandler } from './base'
import BN from 'bn.js'
import Kitsunet = require('../proto')
import { KsnRpc } from '../ksn-rpc'

const { MsgType, Status } = Kitsunet

export class Identify extends BaseHandler {
  constructor (rpcEngine: KsnRpc, peerInfo: any) {
    super('identify', MsgType.IDENTIFY, rpcEngine, peerInfo)
  }

  async response (): Promise<any> {
    try {
      const block = await this.rpcEngine.getLatestBlock()
      return {
        type: MsgType.IDENTIFY,
        status: Status.OK,
        payload: {
          identify: {
            version: this.rpcEngine.VERSION,
            userAgent: this.rpcEngine.USER_AGENT,
            nodeType: this.rpcEngine.nodeType,
            latestBlock: block ? block.header.number : new BN(0).toBuffer(),
            sliceIds: this.rpcEngine.getSliceIds()
          }
        }
      }
    } catch (e) {
      this.log(e)
      return this.errResponse(e)
    }
  }

  async request (): Promise<any> {
    const res = await this.sendRequest({
      type: MsgType.IDENTIFY
    })

    return res.payload.identify
  }
}
