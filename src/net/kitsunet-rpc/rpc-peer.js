'use strict'

const EE = require('events')

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const debug = require('debug')
const log = debug('kitsunet:kitsunet-proto')

const {
  Identify,
  Headers,
  NodeType,
  Slices,
  SliceId: SliceIds,
  Ping
} = require('./handlers')

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

    this._identify = new Identify(kitsunetRpc)
    this._headers = new Headers(kitsunetRpc)
    this._slices = new Slices(kitsunetRpc)
    this._nodeType = new NodeType(kitsunetRpc)
    this._sliceIds = new SliceIds(kitsunetRpc)
    this._ping = new Ping(kitsunetRpc)

    this.handlers = {}
    this.handlers[MsgType.IDENTIFY] = this._identify
    this.handlers[MsgType.HEADERS] = this._headers
    this.handlers[MsgType.SLICES] = this._slices
    this.handlers[MsgType.NODE_TYPE] = this._nodeType
    this.handlers[MsgType.SLICE_ID] = this._sliceIds
    this.handlers[MsgType.PING] = this._ping
  }

  get idB58 () {
    return this.peerInfo.id.toB58String()
  }

  async _handleRpc (msg) {
    log('got request', msg)
    if (MsgType.indexOf(msg.type) > -1) {
      return this.handlers[msg.type].handle(msg)
    }

    return errResponse(msg.type)
  }

  /**
   * initiate the identify flow
   */
  async identify () {
    return this._identify.request()
  }

  /**
   * Get all slice ids for the peer
   */
  async getSliceIds () {
    return this._sliceIds.sliceIds()
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
    this._slices.request(slices)
  }

  /**
   * Get all headers
   */
  async headers () {
    return this._headers.request()
  }

  /**
   * Get Node type - bridge, edge, node
   */
  async nodeType () {
    return this._nodeType.request()
  }

  /**
   * Ping peer
   */
  async ping () {
    return this._ping.request()
  }
}

module.exports = RpcPeer
