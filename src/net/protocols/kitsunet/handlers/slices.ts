'use strict'

import { BaseHandler }  from './base'
import { Slice } from '../../../../slice'
import Kitsunet = require('../proto')

const { MsgType, Status } = Kitsunet

export class Slices extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('slices', MsgType.SLICES, rpcEngine, peerInfo)
  }

  async response (msg): Promise<any> {
    const slices = await this.rpcEngine.getSlices(msg.payload.slices)
    return {
      type: MsgType.SLICES,
      status: Status.OK,
      payload: {
        slices
      }
    }
  }

  async request (slices): Promise<any> {
    const res = await this.sendRequest({
      type: MsgType.SLICES,
      payload: {
        slices: slices ? slices.map((s) => s.serialize()) : null
      }
    })

    let _slices: Slice[] = []
    if (res.payload.slices) {
      _slices = res.payload.slices.map((s) => new Slice(s))
    }

    return _slices
  }
}
