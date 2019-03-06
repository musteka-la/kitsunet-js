'use strict'

class SliceManager {
  constructor ({ bridgeTracker, pubsubTracker, blockTracker }) {
    this._bridgeTracker = bridgeTracker
    this._pubsubTracker = pubsubTracker
    this._blockTracker = blockTracker

    this._setUp()
  }

  _setUp () {
    // subscribe to block updates
    this._blockTracker.on('latest', (header) => {
      this.peer.latestBlock = this.peer.bestBlock = header

      this.chain.putHeader(header)

      if (this.isBridge) {
        this._bridgeSliceTracker.emit('latest', header)
        this._bridgeSliceTracker.on('slice', (slice) => {
          this._pubSubSliceTracker.publishSlice(slice)
        })
      }
    })

    this._pubSubSliceTracker.on('slice', (slice) => {
      // TODO: store slices somewhere
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
