'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('./proto').Kitsunet

const BN = require('bn.js')
const { SliceId } = require('../../slice')

class Identify extends BaseHandler {
  constructor (rpcEngine) {
    super('identify', MsgType.IDENTIFY, rpcEngine)
  }

  async handle (msg) {
    try {
      const block = await this.kitsunetRpc.getLatestBlock()
      return {
        type: MsgType.IDENTIFY,
        status: Status.OK,
        payload: {
          identify: {
            version: this.kitsunetRpc.VERSION,
            userAgent: this.kitsunetRpc.USER_AGENT,
            nodeType: this.kitsunetRpc.nodeType,
            latestBlock: block ? block.header.number : new BN(0).toBuffer(),
            sliceIds: this.kitsunetRpc.getSliceIds()
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

    this.version = res.payload.identify.version
    this.userAgent = res.payload.identify.userAgent

    this.sliceIds = res.payload.identify.sliceIds
      ? new Set(res.payload.identify.sliceIds.map((s) => new SliceId(s.toString())))
      : new Set()

    this.latestBlock = res.payload.identify.latestBlock
    this.nodeType = res.payload.identify.nodeType
    return res
  }
}

module.exports = Identify
