'use strict'

const Cache = require('lru-cache')
const cbor = require('borc')

const BaseTracker = require('./base')
const Slice = require('../slice')

const log = require('debug')('kitsunet:kitsunet-pubsub-tracker')

const DEFAULT_TOPIC_NAMESPACE = `/kitsunet/slice`
const DEFAULT_SLICE_TIMEOUT = 300 * 1000
const DEFAULT_DEPTH = 10

const createCache = (options = { max: 100, maxAge: DEFAULT_SLICE_TIMEOUT }) => {
  return new Cache(options)
}

class KitsunetPubSub extends BaseTracker {
  constructor ({ node, slices, namespace, depth }) {
    super()
    this._multicast = node.multicast
    this._namespace = namespace || DEFAULT_TOPIC_NAMESPACE
    this._depth = depth || DEFAULT_DEPTH
    this._forwardedSlicesCache = createCache()
    this._slices = new Set(slices) // slice ids

    this._slicesHook = this._slicesHook.bind(this)
    this._handleSlice = this._handleSlice.bind(this)
  }

  /**
   * Helper to subscribe to a slice
   *
   * @param {Slice} slice - slice to subscribe to
   */
  _subscribe (slice) {
    this._multicast.addFrwdHook(this._makeSliceTopic(slice), [this._slicesHook])
    this._multicast.subscribe(this._makeSliceTopic(slice), this._handleSlice)
  }

  /**
   * Helper to unsubscribe from a slice
   *
   * @param {Slice} slice - slice to unsubscribe from
   */
  _unsubscribe (slice) {
    this._multicast.removeFrwdHook(this._makeSliceTopic(slice), this._slicesHook)
    this._multicast.unsubscribe(this._makeSliceTopic(slice), this._handleSlice)
  }

  /**
   * Helper to make a slice topic
   *
   * @param {Slice|SliceId} slice - a Slice object
   * @returns {String} - a slice topic
   */
  _makeSliceTopic (slice) {
    const { path, depth } = slice
    return `${this._namespace}-${path}-${depth || this._depth}`
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
   * @returns {Function}
   */
  _slicesHook (peer, msg, cb) {
    let slice = null
    try {
      slice = cbor.parse(msg.data)
      if (!slice) {
        return cb(new Error(`No slice in message!`))
      }
    } catch (err) {
      log(err)
      return cb(err)
    }

    const peerId = peer.info.id.toB58String()
    const slices = this._forwardedSlicesCache.has(peerId) || createCache()
    if (!slices.has(slice.sliceId)) {
      slices.set(slice.sliceId, true)
      this._forwardedSlicesCache.set(peerId, slices)
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
    try {
      const slice = cbor.parse(msg.data)
      this.emit(`slice`, new Slice(slice))
    } catch (err) {
      log(err)
    }
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrack (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    slices.forEach(async (slice) => {
      await this._multicast.unsubscribe(this._makeSliceTopic(slice))
      this.slice.delete(slice)
    })
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    slices.forEach(async (slice) => {
      if (this.isTracking(slice)) return
      await this._multicast.subscribe(this._makeSliceTopic(slice), this._slicesHook)
      this._slices.add(slice)
    })
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    return (this._slices.has(slice) &&
    this._multicast.ls().indexOf(this._makeSliceTopic(slice)) > -1)
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publish (slice) {
    if (!this.isTracking(slice)) {
      this.trackSlice(slice)
    }
    this._multicast.publish(this._makeSliceTopic(slice), slice.serialize())
  }

  async start () {
    this.track(this.slice)
  }

  async stop () {
    this.untrack(this._slices)
  }
}

module.exports = KitsunetPubSub
