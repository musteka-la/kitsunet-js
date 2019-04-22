'use strict'

const { NodeTypes } = require('../../constants')
const { MsgType, Status } = require('./proto').Kitsunet

const { SliceId } = require('../../slice')

const Protocol = require('../../protocol')

const debug = require('debug')
const log = debug('kitsunet:kitsunet-proto')

function errResponse (type) {
  const err = `unknown message type ${type}`
  log(err)
  return { status: Status.ERROR, error: err }
}

const Handlers = require('./handlers')

class KsnProto extends Protocol {
  constructor (peerInfo, ksnRpc) {
    super()
    this.peerInfo = peerInfo
    this.ksnRpc = ksnRpc

    this.version = null
    this.userAgent = null
    this.sliceIds = new Set()
    this.latestBlock = null
    this.nodeType = NodeTypes.NODE

    this.handlers = {}
    Object.keys(Handlers).forEach((handler) => {
      const h = Reflect.construct(Handlers[handler], [this.ksnRpc, this.peerInfo])
      this.handlers[h.id] = h
    })
  }

  get id () {
    return 'ksn'
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
  * @param {Array<SliceId>} slices - optional
  */
  async getSlicesById (slices) {
    return this.handlers[MsgType.SLICES].request(slices)
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

module.exports = KsnProto
