'use strict'

const EE = require('events')

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const { SliceId, Slice } = require('../../slice')
const BN = require('bn.js')

const debug = require('debug')
const log = debug('kitsunet:kitsunet-proto')

function errResponse (type) {
  const err = `unknown message type ${type}`
  log(err)
  return { status: Status.ERROR, error: err }
}

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
          log(e)
          return errResponse(msg.type, e)
        }
      }

      case MsgType.SLICES: {
        const slices = await this.kitsunetRpc.getSlices(msg.payload.slices)
        return {
          type: MsgType.SLICES,
          status: Status.OK,
          payload: {
            slices
          }
        }
      }

      case MsgType.SLICE_ID: {
        return {
          type: MsgType.SLICE_ID,
          status: Status.OK,
          payload: {
            sliceIds: this.kitsunetRpc.getSliceIds()
          }
        }
      }

      case MsgType.HEADERS: {
        return {
          type: MsgType.HEADERS,
          status: Status.OK,
          payload: {
            slices: await this.kitsunetRpc.getHeaders()
          }
        }
      }

      case MsgType.NODE_TYPE: {
        return {
          type: MsgType.NODE_TYPE,
          status: Status.OK,
          payload: {
            slices: this.kitsunetRpc.nodeType
          }
        }
      }

      case MsgType.PING: {
        return {
          type: MsgType.PING,
          status: Status.OK
        }
      }

      default: {
        errResponse(msg.type)
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

  /**
   * initiate the identify flow
   */
  async identify () {
    const res = await this._sendRequest({
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

  /**
   * Get all slice ids for the peer
   */
  async getSliceIds () {
    const res = await this._sendRequest({
      type: MsgType.SLICE_ID
    })

    let ids = []
    if (res.payload.sliceIds) {
      ids = new Set(res.payload.sliceIds.map((s) => s.toString()))
    }

    this.sliceIds = ids
    return ids
  }

  /**
  * Get slices for the provided ids or all the
  * slices the peer is holding
  *
  * TODO: this needs rethinking, do we really want to return all slices?
  * It might not be necessary and the complexity introduced when sending large
  * amounts of data might not worth it?
  * For now this just sends ALL the slices, so beware!
  *
  * @param {Array<SliceId>} slices - optional
  */
  async getSlices (slices) {
    const res = await this._sendRequest({
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

  /**
   * Get all headers
   */
  async headers () {
    const res = await this._sendRequest({
      type: MsgType.HEADERS
    })

    return res.payload.headers
  }

  /**
   * Get Node type - bridge, edge, node
   */
  async nodeType () {
    const res = await this._sendRequest({
      type: MsgType.NODE_TYPE
    })

    return res.payload.nodeType
  }

  /**
   * Ping peer
   */
  async ping () {
    await this._sendRequest({
      type: MsgType.PING
    })

    return true
  }
}

module.exports = RpcPeer
