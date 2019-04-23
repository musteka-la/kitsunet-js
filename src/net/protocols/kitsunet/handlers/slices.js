'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('../proto').Kitsunet

const { Slice } = require('../../../../slice')

class Slices extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('slices', MsgType.SLICES, rpcEngine, peerInfo)
  }

  async handle (msg) {
    const slices = await this.rpcEngine.getSlices(msg.payload.slices)
    return {
      type: MsgType.SLICES,
      status: Status.OK,
      payload: {
        slices
      }
    }
  }

  async request (slices) {
    const res = await this.sendRequest({
      type: MsgType.SLICES,
      payload: {
        slices: slices ? slices.map((s) => s.serialize()) : null
      }
    })

    let _slices = null
    if (res.payload.slices) {
      _slices = res.payload.slices.map((s) => new Slice(s))
    }

    return _slices
  }
}

module.exports = Slices
