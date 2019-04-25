'use strict'

import { BaseHandler } from './base'
import Kitsunet = require('../proto')

const { MsgType, Status } = Kitsunet

export class SliceId extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('slice-id', MsgType.SLICE_ID, rpcEngine, peerInfo)
  }

  async response (): Promise<any> {
    return {
      type: MsgType.SLICE_ID,
      status: Status.OK,
      payload: {
        sliceIds: this.rpcEngine.getSliceIds()
      }
    }
  }

  async request (): Promise<any> {
    const res = await this.sendRequest({
      type: MsgType.SLICE_ID
    })

    let ids: Set<string> = new Set()
    if (res.payload.sliceIds) {
      ids = new Set(res.payload.sliceIds.map((s) => s.toString()))
    }

    return ids
  }
}
