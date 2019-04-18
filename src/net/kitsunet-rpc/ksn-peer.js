'use strict'

const EE = require('events')

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const { SliceId } = require('../../slice')

const debug = require('debug')
const log = debug('kitsunet:kitsunet-proto')

function errResponse (type) {
  const err = `unknown message type ${type}`
  log(err)
  return { status: Status.ERROR, error: err }
}

const Handlers = require('./handlers')

class KsnPeer extends EE {
  constructor (peerInfo, kitsunetRpc) {
    super()
    this.peerInfo = peerInfo
    this.kitsunetRpc = kitsunetRpc

    this.version = null
    this.userAgent = null
    this.sliceIds = new Set()
    this.latestBlock = null
    this.nodeType = NodeTypes.NODE

    this.handlers = {}
    Object.keys(Handlers).forEach((handler) => {
      const Clazz = Handlers[handler]
      const h = new Clazz(this.kitsunetRpc, this.peerInfo)
      this.handlers[h.id] = h
    })
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
    const res = await this.handlers[MsgType.IDENTIFY].request()
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
    this.sliceIds = await this.handlers[MsgType.SLICE_ID].request()
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
    return this.handlers[MsgType.SLICES].request()
  }

  /**
   * Get all headers
   */
  async headers () {
    return this.handlers[MsgType.HEADERS].request()
  }

  /**
   * Get Node type - bridge, edge, node
   */
  async nodeType () {
    this.nodeType = await this.handlers[MsgType.NODE_TYPE].request()
    return this.nodeType
  }

  /**
   * Ping peer
   */
  async ping () {
    return this.handlers[MsgType.PING].request()
  }
}

module.exports = KsnPeer
