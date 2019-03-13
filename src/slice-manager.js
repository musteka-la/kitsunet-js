'use strict'

const each = require('async/each')
const ethUtils = require('ethereumjs-util')

const log = require('debug')('kitsunet:kitsunet-manager')

class SliceManager {
  constructor ({ bridgeTracker, pubsubTracker, trie }) {
    this._bridgeTracker = bridgeTracker
    this._pubsubTracker = pubsubTracker

    this._trie = trie
    this._sliceCache = new Map()

    this._setUp()
  }

  _setUp () {
    this.on('header', (header) => {
      if (this.isBridge) {
        this._bridgeSliceTracker.emit('header', header)
        this._bridgeSliceTracker.on('slice', (slice) => {
          this._pubSubSliceTracker.publishSlice(slice)
        })
      }
    })

    this._pubSubSliceTracker.on('slice', (slice) => {
      this.emit('slice', slice)
    })
  }

  /**
   * Store a received slice
   *
   * @param {Slice} slice - the slice to store
   */
  async _storeSlice (slice) {
    return new Promise((resolve, reject) => {
      each(Object.keys(slice.nodes), (_key, cb) => {
        const [key, value] = [ethUtils.addHexPrefix(_key), Buffer.from(slice.nodes[_key], 'hex')]
        this.trie.put(key, value, (err) => {
          if (err) return cb(err)
          cb()
        })
      }, (e) => {
        if (e) {
          log('error adding slice %s to storage', slice.id)
          return reject(e)
        }
        this.slices.push(slice.id)
        this._sliceCache.set(slice.id, slice)
        return resolve(true)
      })
    })
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrackSlices (slices) {
    if (this._bridgeTracker) {
      this._bridgeTracker.untrackSlices(slices)
    }

    this._pubsubTracker.untrackSlices(slices)
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async trackSlices (slices) {
    if (this._bridgeTracker) {
      this._bridgeTracker.trackSlices(slices)
    }
    this._pubsubTracker.trackSlices(slices)
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    let tracking = await this._bridgeTracker ? this._bridgeTracker.isTracking(slice) : true
    if (tracking) return this._pubsubTracker.isTracking(slice)
    return false
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publishSlice (slice) {
    // bridge doesn't implement publishSlice
    this._pubsubTracker.publishSlice(slice)
  }

  /**
   * Get a slice
   *
   * @param {SliceId} slice - the slice to return
   * @return {Slice}
  */
  async getSlice (slice) {
    // TODO: this should fallback to to some persistent storage if not found
    return this._sliceCache.get(slice.id)
  }

  /**
   * Get the latest slice for prefix
   *
   * @return {Slice}
   */
  async getLatestSlice () {
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block - the block number to get the slice for
   * @param {Slice} slice - the slice to get (root is ignored)
   */
  async getSliceForBlock (block, slice) {
  }

  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} slice - the slices to find the peers for
   * @param {Object}  - an options object with the following properties
   *                  - maxPeers - the maximum amount of peers to connect to
   * @returns {Array<Peer>} peers - an array of peers tracking the slice
   */
  async findSlicePeers (slice, options = { maxPeers: 3 }) {
  }

  /**
   * Discover and connect to peers tracking this slice
   *
   * @param {Array<SliceId>} slices - the slices to find the peers for
   * @param {Slice} - an options object with the following properties
   *                    - maxPeers - the maximum amount of peers to connect to
   */
  async findAndConnect (slices, options = { maxPeers: 3 }) {
  }

  /**
   * Announces slice to the network using whatever mechanisms are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  async announceSlices (slices) {
  }

  async start () {
    if (this._bridgeTracker) {
      await this._bridgeTracker.start()
    }

    await this._pubsubTracker.start()
  }

  async stop () {
    if (this._bridgeTracker) {
      await this._bridgeTracker.stop()
    }

    await this._pubsubTracker.stop()
  }
}

module.exports = SliceManager
