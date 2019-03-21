'use strict'

const EE = require('safe-event-emitter')

const { Types: NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const Kitsunet = require('./')

const log = require('debug')('kitsunet:kitsunet-proto')

class Peer extends EE {
  constructor (peerInfo, ksnNode) {
    super()
    this.peerInfo = peerInfo
    this._ksnNode = ksnNode

    this.version = null
    this.userAgent = null
    this.sliceIds = new Set()
    this.latestBlock = null
    this.nodeType = NodeTypes.NODE
  }

  async _handleRpc (msg) {
    switch (msg.type) {
      case MsgType.HELLO: {
        this.version = Kitsunet.version
        this.userAgent = Kitsunet.userAgent
        this.sliceIds = msg.sliceIds ? msg.forEach(s => this.sliceIds.add(s)) : this.sliceIds
        this.latestBlock = msg.latestBlock
        this.nodeType = msg.nodeType

        return this.hello()
      }

      case MsgType.SLICES: {
        return {
          type: MsgType.SLICES,
          status: Status.OK,
          slices: this._ksnNode.slices
        }
      }

      case MsgType.SLICE_ID: {
        return {
          type: MsgType.SLICE_ID,
          status: Status.OK,
          slices: this._ksnNode.sliceIds
        }
      }

      case MsgType.HEADERS: {
        return {
          type: MsgType.HEADERS,
          status: Status.OK,
          slices: this._ksnNode.headers
        }
      }

      case MsgType.NODE_TYPE: {
        return {
          type: MsgType.NODE_TYPE,
          status: Status.OK,
          slices: this._ksnNode.nodeType
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
    const res = await this._ksnNode.sendRequest(this, msg)

    if (res.status !== Status.OK) {
      throw res.error ? new Error(this.error) : new Error('')
    }

    return res
  }

  async hello () {
    const res = await this._sendRequest({
      type: MsgType.HELLO,
      status: Status.OK,
      version: this._ksnNode.version,
      userAgent: this._ksnNode.userAgent,
      nodeType: this._ksnNode.nodeType,
      latestBlock: this._ksnNode.latestBlock,
      sliceIds: this._ksnNode.sliceIds
    })

    return res.sliceIds
  }

  async sliceIds () {
    const res = await this._sendRequest({
      type: MsgType.SLICE_ID
    })

    return res.sliceIds
  }

  async slices () {
    const res = await this._sendRequest({
      type: MsgType.SLICES
    })

    return res.slices
  }

  async headers () {
    const res = await this._sendRequest({
      type: MsgType.HEADERS
    })

    return res.headers
  }

  async nodeType () {
    const res = await this._sendRequest(this, {
      type: MsgType.NODE_TYPE
    })

    return res.nodeType
  }

  async ping () {
    await this._sendRequest(this, {
      type: MsgType.PING
    })

    return true
  }
}

module.exports = Peer
