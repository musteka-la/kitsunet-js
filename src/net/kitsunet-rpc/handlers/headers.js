'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('./proto').Kitsunet

class Headers extends BaseHandler {
  constructor (rpcEngine) {
    super('headers', MsgType.HEADERS, rpcEngine)
  }

  async handle () {
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

module.exports = Headers
