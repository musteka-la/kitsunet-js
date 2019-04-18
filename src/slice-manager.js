'use strict'

const assert = require('assert')
const SliceId = require('./slice/slice-id')

const { BaseTracker } = require('./slice/trackers')

const debug = require('debug')
const log = debug('kitsunet:kitsunet-slice-manager')

const retry = require('async/retry')

class SliceManager extends BaseTracker {
  constructor ({ bridgeTracker, pubsubTracker, slicesStore, blockTracker, kitsunetDriver }) {
    super({})

    assert(blockTracker, 'blockTracker should be supplied')
    assert(slicesStore, 'slicesStore should be supplied')
    assert(kitsunetDriver, 'driver should be supplied')
    kitsunetDriver.isBridge && assert(bridgeTracker, 'bridgeTracker should be supplied in bridge mode')

    this.blockTracker = blockTracker

    this._bridgeTracker = bridgeTracker
    this._pubsubTracker = pubsubTracker
    this._slicesStore = slicesStore
    this._kitsunetDriver = kitsunetDriver
    this.isBridge = Boolean(kitsunetDriver.isBridge)

    this._setUp()
  }

  _setUp () {
    if (this.isBridge) {
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
    if (this.isBridge) {
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
    if (this.isBridge) {
      this._bridgeTracker.track(slices)
    }
    this._pubsubTracker.track(slices)

    // if we're tracking a slice, make it discoverable
    this._kitsunetDriver.announce(slices)
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    let tracking = this.isBridge ? await this._bridgeTracker.isTracking(slice) : true
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
   * Get all slice ids currently being tracker
   * @returns {Array<SliceId>}
   */
  getSliceIds () {
    // dedup
    return [...new Set([
      ...this._pubsubTracker.slices,
      ...this._bridgeTracker.slices
    ])]
  }

  /**
   * Get a slice
   *
   * @param {SliceId} sliceId - the slice to return
   * @return {Slice}
  */
  async getSlice (sliceId) {
    try {
      const slice = await this._slicesStore.getById(sliceId)
      return slice // won't catch if just returned
    } catch (e) {
      log(e)
      if (this.isBridge) {
        this.track([sliceId])
        return this._bridgeTracker.getSlice(sliceId)
      }

      return (await this._resolveSlice(sliceId))[0]
    }
  }

  /**
   * Get all slices
   *
   * @returns {Array<Slice>} - an array of slice objects
   */
  async getSlices () {
    try {
      return this._slicesStore.getSlices()
    } catch (e) {
      log(e)
    }
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} number
   * @param {SliceId} slice
   */
  async getSliceForBlock (number, slice) {
    let _slice = new SliceId(slice.path, slice.depth)
    const block = await this._kitsunetDriver.getBlockByNumber(number)
    if (block) {
      _slice.root = block.header.stateRoot.toString('hex')
      return this.getSlice(_slice)
    }
  }

  async _resolveSlice (slice) {
    // track the slice if not tracking already
    if (!await this.isTracking(slice)) {
      // track slice, we might already be subscribed to it
      this.track([slice])
    }

    // if in bridge mode, just get it from the bridge
    if (this.isBridge) {
      return this._bridgeTracker.getSlice(slice)
    }

    let times = 0
    return new Promise((resolve, reject) => {
      retry({
        times: 10,
        interval: 3000
      },
      async () => {
        const _slice = await this._kitsunetDriver.resolveSlices([slice])
        if (_slice) return _slice
        throw new Error(`no slice retrieved, retrying ${++times}!`)
      },
      (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  }

  async start () {
    if (this.isBridge) {
      await this._bridgeTracker.start()
    }

    await this.blockTracker.start()
    await this._pubsubTracker.start()
  }

  async stop () {
    if (this.isBridge) {
      await this._bridgeTracker.stop()
    }

    await this.blockTracker.stop()
    await this._pubsubTracker.stop()
  }
}

module.exports = SliceManager
