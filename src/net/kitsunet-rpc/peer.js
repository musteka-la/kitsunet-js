'use strict'

const EE = require('events')

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const Kitsunet = require('./')

const log = require('debug')('kitsunet:kitsunet-proto')

class Peer extends EE {
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
    switch (msg.type) {
      case MsgType.IDENTIFY: {
        return {
          type: MsgType.IDENTIFY,
          status: Status.OK,
          data: {
            version: Kitsunet.version,
            userAgent: Kitsunet.userAgent,
            nodeType: this.kitsunetRpc.nodeType,
            latestBlock: this.kitsunetRpc.latestBlock,
            sliceIds: this.kitsunetRpc.sliceIds
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
    const res = await this.kitsunetRpc.sendRequest(this.peerInfo, msg)

    if (res && res.status !== Status.OK) {
      throw res.error ? new Error(this.error) : new Error('')
    }

    return res
  }

  async identify () {
    const res = await this._sendRequest({
      type: MsgType.IDENTIFY
    })

    this.version = res.data.version
    this.userAgent = res.data.userAgent
    this.sliceIds = res.data.sliceIds
    this.latestBlock = res.data.latestBlock
    this.nodeType = res.data.nodeType

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

module.exports = Peer
