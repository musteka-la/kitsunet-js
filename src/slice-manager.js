'use strict'

const SliceId = require('./slice/slice-id')

class SliceManager {
  constructor ({ bridgeTracker, pubsubTracker, sliceStore, blockTracker, driver }) {
    this._bridgeTracker = bridgeTracker
    this._pubsubTracker = pubsubTracker

    this._blockTracker = blockTracker
    this._sliceStore = sliceStore
    this._driver = driver

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
      this._sliceStore.storeSlice(slice)
      this.emit('slice', slice)
    })
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrack (slices) {
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
  async track (slices) {
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
  async publish (slice) {
    // bridge doesn't implement publishSlice
    this._pubsubTracker.publishSlice(slice)
  }

  /**
   * Get a slice
   *
   * @param {SliceId} sliceId - the slice to return
   * @return {Slice}
  */
  async getSlice (sliceId) {
    const slice = await this._sliceStore.getSliceById(sliceId)
    if (slice) return slice
  }

  /**
   * Get the latest slice for prefix
   *
   * @param {String} prefix
   * @param {Number} depth
   */
  async getLatestSlice (prefix, depth) {
    const block = await this._blockTracker.getLatestBlock()
    return this._sliceStore.getSliceById(new SliceId(prefix, depth, block.stateRoot))
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block
   * @param {String} prefix
   * @param {Number} depth
   */
  async getSliceForBlock (block, prefix, depth) {
    return this._sliceStore.getSliceById(new SliceId({ prefix, depth, root: block.stateRoot }))
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
