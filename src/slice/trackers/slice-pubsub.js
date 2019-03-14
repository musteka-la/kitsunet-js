'use strict'

const BaseTracker = require('./base')
const Cache = require('lru-cache')

const DEFAULT_TOPIC = `kitsunet:slice`
const DEFAULT_SLICE_TIMEOUT = 300 * 1000
const DEFAULT_DEPTH = 10

const log = require('debug')('kitsunet:kitsunet-pubsub-tracker')

const createCache = (options = { max: 100, maxAge: DEFAULT_SLICE_TIMEOUT }) => {
  return new Cache(options)
}

class KitsunetPubSub extends BaseTracker {
  constructor (node, slices, topic) {
    super()
    this.multicast = node.multicast
    this.topic = topic || DEFAULT_TOPIC
    this.forwardedSlicesCache = createCache()
    this.slices = new Set(slices)

    this.slicesHook = this._slicesHook.bind(this)
    this.handleSlice = this._handleSlice.bind(this)
  }

  /**
   * Helper to subscribe to a slice
   *
   * @param {Slice} slice - slice to subscribe to
   */
  _subscribe (slice) {
    this.multicast.addFrwdHook(this._makeSliceTopic(slice), [this.slicesHook])
    this.multicast.subscribe(this._makeSliceTopic(slice), this.handleSlice)
  }

  /**
   * Helper to unsubscribe from a slice
   *
   * @param {Slice} slice - slice to unsubscribe from
   */
  _unsubscribe (slice) {
    this.multicast.removeFrwdHook(this._makeSliceTopic(slice), this.slicesHook)
    this.multicast.unsubscribe(this._makeSliceTopic(slice), this.handleSlice)
  }

  /**
   * Helper to make a slice topic
   *
   * @param {Slice|SliceId} slice - a Slice object
   */
  _makeSliceTopic (slice) {
    const { path, depth } = slice
    return `${this.topic}-${path}-${depth || DEFAULT_DEPTH}`
  }

  /**
   * This is a hook that will be triggered on each pubsub message.
   *
   * This check if the slice has been already forwarded. This is
   * to check for duplicates at the application level, regardless of the msg id.
   *
   * @param {PeerInfo} peer - the peer sending the message
   * @param {Msg} msg - the pubsub message
   * @param {Function} cb - callback
   */
  _slicesHook (peer, msg, cb) {
    let slice = null
    try {
      slice = JSON.parse(msg.data.toString())
      if (!slice) {
        return cb(new Error(`No slice in message!`))
      }
    } catch (err) {
      log(err)
      return cb(err)
    }

    const peerId = peer.info.id.toB58String()
    const slices = this.forwardedSlicesCache.has(peerId) || createCache()
    if (!slices.has(slice.sliceId)) {
      slices.set(slice.sliceId, true)
      this.forwardedSlicesCache.set(peerId, slices)
      return cb(null, msg)
    }

    const skipMsg = `already forwarded to peer ${peerId}, skipping slice ${slice.sliceId}`
    log(skipMsg)
    return cb(skipMsg)
  }

  /**
   * Handle incoming pubsub messages.
   *
   * @param {Msg} msg - the pubsub message
   */
  _handleSlice (msg) {
    const data = msg.data.toString()
    try {
      const slice = JSON.parse(data)
      this.emit(`slice`, slice)
    } catch (err) {
      log(err)
    }
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrackSlices (slices) {
    slices.forEach(async (slice) => {
      await this.multicast.unsubscribe(this._makeSliceTopic(slice))
      this.slice.delete(slice)
    })
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async trackSlices (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    slices.forEach(async (slice) => {
      if (this.isTracking(slice)) return
      await this.multicast.subscribe(this._makeSliceTopic(slice), this.slicesHook)
      this.slices.add(slice)
    })
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    return (this.slices.has(slice) &&
    this.multicast.ls().indexOf(this._makeSliceTopic(slice)) > -1)
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publishSlice (slice) {
    if (!this.isTracking(slice)) {
      this.trackSlice(slice)
    }
    this.multicast.publish(this._makeSliceTopic(slice), slice)
  }

  async start () {
    this.trackSlices(this.slice)
  }

  async stop () {
    this.untrackSlices(this.slices)
  }
}

module.exports = KitsunetPubSub
