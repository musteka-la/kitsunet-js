'use strict'

const assert = require('assert')
const SliceId = require('./slice/slice-id')

const { BaseTracker } = require('./slice/trackers')

class SliceManager extends BaseTracker {
  constructor ({ bridgeTracker, pubsubTracker, slicesStore, blockTracker, kitsunetDriver }) {
    super({})

    assert(blockTracker, 'blockTracker should be supplied')
    assert(slicesStore, 'slicesStore should be supplied')
    assert(kitsunetDriver, 'driver should be supplied')
    kitsunetDriver.isBridge && assert(bridgeTracker, 'bridgeTracker should be supplied in bridge mode')

    this._bridgeTracker = bridgeTracker
    this._pubsubTracker = pubsubTracker
    this._blockTracker = blockTracker
    this._slicesStore = slicesStore
    this._kitsunetDriver = kitsunetDriver
    this._isBridge = kitsunetDriver.isBridge

    this._setUp()
  }

  _setUp () {
    if (this._isBridge) {
      this._bridgeTracker.on('slice', (slice) => {
        this._pubsubTracker.publish(slice)
      })
    }

    this._pubsubTracker.on('slice', (slice) => {
      this._slicesStore.put(slice)
      this.emit('slice', slice)
    })
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrack (slices) {
    if (this._isBridge) {
      this._bridgeTracker.untrack(slices)
    }

    this._pubsubTracker.untrack(slices)
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    if (this._isBridge) {
      this._bridgeTracker.track(slices)
    }
    this._pubsubTracker.track(slices)
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
    this._pubsubTracker.publish(slice)
  }

  /**
   * Get a slice
   *
   * @param {SliceId} sliceId - the slice to return
   * @return {Slice}
  */
  async getSlice (sliceId) {
    const slice = await this._slicesStore.getById(sliceId)
    if (slice) return slice
  }

  /**
   * Get all slices
   */
  async getSlices () {
    return this.kitsunetStore.getSlices()
  }

  getSliceIds () {
    // dedup
    return [...new Set([
      ...this._pubsubTracker.slices,
      ...this._bridgeTracker.slices
    ])]
  }

  /**
   * Get the latest slice for prefix
   *
   * @param {String} prefix
   * @param {Number} depth
   */
  async getLatestSlice (prefix, depth) {
    const block = await this._blockTracker.getLatestBlock()
    return this._slicesStore.getById(new SliceId(prefix, depth, block.stateRoot))
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block
   * @param {String} prefix
   * @param {Number} depth
   */
  async getSliceForBlock (block, prefix, depth) {
    return this._slicesStore.getById(new SliceId({ prefix, depth, root: block.stateRoot }))
  }

  async start () {
    if (this._isBridge) {
      await this._bridgeTracker.start()
    }

    await this._pubsubTracker.start()
  }

  async stop () {
    if (this._isBridge) {
      await this._bridgeTracker.stop()
    }

    await this._pubsubTracker.stop()
  }
}

module.exports = SliceManager
