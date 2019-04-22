'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('../proto').Kitsunet

class NodeType extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('node-type', MsgType.NODE_TYPE, rpcEngine, peerInfo)
  }

  async handle () {
    return {
      type: MsgType.NODE_TYPE,
      status: Status.OK,
      payload: {
        slices: this.rpcEngine.nodeType
      }
    }
  }

  async request () {
    const res = await this.sendRequest({
      type: MsgType.NODE_TYPE
    })

    return res.payload.nodeType
  }
}

module.exports = NodeType
