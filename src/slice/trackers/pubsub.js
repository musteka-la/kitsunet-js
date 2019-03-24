'use strict'

const Cache = require('lru-cache')

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
    super({ slices })
    this._multicast = node.multicast
    this._node = node
    this._namespace = namespace || DEFAULT_TOPIC_NAMESPACE
    this._depth = depth || DEFAULT_DEPTH
    this._forwardedSlicesCache = createCache()

    this._slicesHook = this._slicesHook.bind(this)
    this._handleSlice = this._handleSlice.bind(this)
  }

  /**
   * Helper to subscribe to a slice
   *
   * @param {Slice} slice - slice to subscribe to
   */
  _subscribe (slice) {
    this._multicast.addFrwdHooks(this._makeSliceTopic(slice), [this._slicesHook])
    this._multicast.subscribe(this._makeSliceTopic(slice), this._handleSlice)
  }

  /**
   * Helper to unsubscribe from a slice
   *
   * @param {Slice} slice - slice to unsubscribe from
   */
  _unsubscribe (slice) {
    this._multicast.removeFrwdHooks(this._makeSliceTopic(slice), this._slicesHook)
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
    return `${this._namespace}/${path}-${depth || this._depth}`
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
      slice = new Slice(msg.data)
      if (!slice) {
        return cb(new Error(`No slice in message!`))
      }
    } catch (err) {
      log(err)
      return cb(err)
    }

    const peerId = peer.info.id.toB58String()
    const slices = this._forwardedSlicesCache.get(peerId) || createCache()
    if (!slices.has(slice.id)) {
      slices.set(slice.id, true)
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
      this.emit(`slice`, new Slice(msg.data))
    } catch (err) {
      log(err)
    }
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>} slices - the slices to stop tracking
   */
  async untrack (slices) {
    slices.forEach(async (slice) => {
      await this._unsubscribe(slice)
      this.slice.delete(slice)
    })
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    this.slices = new Set([...this.slices, ...slices])

    if (!this._isStarted) return

    this.slices.forEach(async (slice) => {
      if (await this.isTracking(slice)) return
      this._subscribe(slice)
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
    (await this._multicast.ls()).indexOf(this._makeSliceTopic(slice)) > -1)
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publish (slice) {
    if (!this.isTracking(slice)) {
      this.trackSlice([slice])
    }
    this._multicast.publish(this._makeSliceTopic(slice), slice.serialize())
  }

  async start () {
    this._isStarted = true
    // track once libp2p is started
    this.track(this.slices)
  }

  async stop () {
    this.untrack(this.slices)
    this._isStarted = false
  }
}

module.exports = KitsunetPubSub
