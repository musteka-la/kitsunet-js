'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('./proto').Kitsunet

class SliceId extends BaseHandler {
  constructor (rpcEngine) {
    super('slice-id', MsgType.SLICE_ID, rpcEngine)
  }

  async handle () {
    return {
      type: MsgType.SLICE_ID,
      status: Status.OK,
      payload: {
        sliceIds: this.rpcEngine.getSliceIds()
      }
    }
  }

  async request () {
    const res = await this.sendRequest({
      type: MsgType.SLICE_ID
    })

    let ids = []
    if (res.payload.sliceIds) {
      ids = new Set(res.payload.sliceIds.map((s) => s.toString()))
    }

    this.request = ids
    return ids
  }
}

module.exports = SliceId
