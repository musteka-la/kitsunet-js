'use strict'

const EE = require('events')

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const { SliceId } = require('../../slice')

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

    this._identifyHandler = new Identify(kitsunetRpc, this.peerInfo)
    this._headersHandler = new Headers(kitsunetRpc, this.peerInfo)
    this._slicesHandler = new Slices(kitsunetRpc, this.peerInfo)
    this._nodeTypeHandler = new NodeType(kitsunetRpc, this.peerInfo)
    this._sliceIdsHandler = new SliceIds(kitsunetRpc, this.peerInfo)
    this._pingHandler = new Ping(kitsunetRpc, this.peerInfo)

    this.handlers = {}
    this.handlers[MsgType.IDENTIFY] = this._identifyHandler
    this.handlers[MsgType.HEADERS] = this._headersHandler
    this.handlers[MsgType.SLICES] = this._slicesHandler
    this.handlers[MsgType.NODE_TYPE] = this._nodeTypeHandler
    this.handlers[MsgType.SLICE_ID] = this._sliceIdsHandler
    this.handlers[MsgType.PING] = this._pingHandler
  }

  get idB58 () {
    return this.peerInfo.id.toB58String()
  }

  async _handleRpc (msg) {
    log('got request', msg)
    if (msg.type !== MsgType.UNKNOWN) {
      return this.handlers[msg.type].handle(msg)
    }

    return errResponse(msg.type)
  }

  /**
   * initiate the identify flow
   */
  async identify () {
    const res = await this._identifyHandler.request()
    this.version = res.version
    this.userAgent = res.userAgent

    this.sliceIds = res.sliceIds
      ? new Set(res.sliceIds.map((s) => new SliceId(s.toString())))
      : new Set()

    this.latestBlock = res.latestBlock
    this.nodeType = res.nodeType

    return res
  }

  /**
   * Get all slice ids for the peer
   */
  async getSliceIds () {
    this.sliceIds = await this._sliceIdsHandler.request()
    return this.sliceIds
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
    return this._slicesHandler.request(slices)
  }

  /**
   * Get all headers
   */
  async headers () {
    return this._headersHandler.request()
  }

  /**
   * Get Node type - bridge, edge, node
   */
  async nodeType () {
    return this._nodeTypeHandler.request()
  }

  /**
   * Ping peer
   */
  async ping () {
    return this._pingHandler.request()
  }
}

module.exports = RpcPeer
