'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('../proto').Kitsunet

const BN = require('bn.js')
const { SliceId } = require('../../../slice')

class Identify extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('identify', MsgType.IDENTIFY, rpcEngine, peerInfo)
  }

  async handle (msg) {
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
      return this.errResponse(msg.type, e)
    }
  }

  async request () {
    const res = await this.sendRequest({
      type: MsgType.IDENTIFY
    })

    return res.payload.identify
  }
}

module.exports = Identify
