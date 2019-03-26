'use strict'

const EE = require('events')

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const { SliceId } = require('../../slice')
const BN = require('bn.js')

const log = require('debug')('kitsunet:kitsunet-proto')

class RpcPeer extends EE {
  constructor (peerInfo, kitsunetRpc) {
    super()
    this.peerInfo = peerInfo
    this.kitsunetRpc = kitsunetRpc

    this.version = null
    this.userAgent = null
    this.sliceIds = new Set()
    this.latestBlock = null
    this.nodeType = NodeTypes.NODE
  }

  get idB58 () {
    return this.peerInfo.id.toB58String()
  }

  async _handleRpc (msg) {
    log('got request', msg)
    switch (msg.type) {
      case MsgType.IDENTIFY: {
        const latestBlock = new BN(await this.kitsunetRpc.latestBlock)
        return {
          type: MsgType.IDENTIFY,
          status: Status.OK,
          data: {
            identify: {
              version: this.kitsunetRpc.VERSION,
              userAgent: this.kitsunetRpc.USER_AGENT,
              nodeType: this.kitsunetRpc.nodeType,
              latestBlock: latestBlock.toBuffer(),
              sliceIds: this.kitsunetRpc.sliceIds
            }
          }
        }
      }

      case MsgType.SLICES: {
        return {
          type: MsgType.SLICES,
          status: Status.OK,
          data: {
            slices: this.kitsunetRpc.slices
          }
        }
      }

      case MsgType.SLICE_ID: {
        return {
          type: MsgType.SLICE_ID,
          status: Status.OK,
          data: {
            slices: this.kitsunetRpc.sliceIds
          }
        }
      }

      case MsgType.HEADERS: {
        return {
          type: MsgType.HEADERS,
          status: Status.OK,
          data: {
            slices: this.kitsunetRpc.headers
          }
        }
      }

      case MsgType.NODE_TYPE: {
        return {
          type: MsgType.NODE_TYPE,
          status: Status.OK,
          data: {
            slices: this.kitsunetRpc.nodeType
          }
        }
      }

      default: {
        const err = `unknown message type ${msg.type}`
        log(err)
        return { status: Status.ERROR, error: err }
      }
    }
  }

  async _sendRequest (msg) {
    log('sending request', msg)
    const res = await this.kitsunetRpc.sendRequest(this.peerInfo, msg)

    if (res && res.status !== Status.OK) {
      const err = res.error ? new Error(this.error) : new Error('unknown error!')
      log(err)

      throw err
    }

    log('got response', res)
    return res
  }

  async identify () {
    const res = await this._sendRequest({
      type: MsgType.IDENTIFY
    })

    this.version = res.data.identify.version
    this.userAgent = res.data.identify.userAgent

    this.sliceIds = res.data.identify.sliceIds
      ? res.data.identify.sliceIds.map((s) => {
        return new SliceId(s.toString())
      }) : []

    this.latestBlock = res.data.identify.latestBlock ? new BN(res.data.identify.latestBlock) : new BN(0x0)
    this.nodeType = res.data.identify.nodeType

    return res
  }

  async sliceIds () {
    const res = await this._sendRequest({
      type: MsgType.SLICE_ID
    })
    return res.data.sliceIds
  }

  async slices () {
    const res = await this._sendRequest({
      type: MsgType.SLICES
    })

    return res.data.slices
  }

  async headers () {
    const res = await this._sendRequest({
      type: MsgType.HEADERS
    })

    return res.data.headers
  }

  async nodeType () {
    const res = await this._sendRequest(this, {
      type: MsgType.NODE_TYPE
    })

    return res.data.nodeType
  }

  async ping () {
    await this._sendRequest(this, {
      type: MsgType.PING
    })

    return true
  }
}

module.exports = RpcPeer
