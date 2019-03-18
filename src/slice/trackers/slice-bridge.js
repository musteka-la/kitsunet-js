'use strict'

const BaseTracker = require('./base')
const { fetcher } = require('../slice-fetcher')
const { Slice } = require('../slice')

const nextTick = require('async/nextTick')
const log = require('debug')('kitsunet:kitsunet-bridge-tracker')

class KitsunetBridge extends BaseTracker {
  constructor ({ bridgeUrl, slices, blockTracker }) {
    super()
    this.slices = new Set(slices)
    this.bridgeUrl = bridgeUrl
    this._blockTracker = blockTracker

    this.fetcher = fetcher(this.bridgeUrl)
    this._blockHandler = this._blockHandler.bind(this)
  }

  /**
  * Handle blocks via the `latest` event
  *
  * @param {Block} block - an rpc (JSON) block
  */
  _blockHandler (block) {
    nextTick(() => {
      this.slices.forEach(async (slice) => {
        const { path, depth, isStorage } = slice
        const fetchedSlice = await this.fetchSlice({
          path,
          depth,
          root: block.stateRoot,
          isStorage
        })
        this.emit('slice', new Slice(fetchedSlice))
      })
    })
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrack (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    slices.forEach((slice) => this.slices.delete(slice))
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    this.slices = new Set(this.slices, slices)
  }

  /**
   * Fetch a slice from the Ethereum RPC
   *
   * @param {SliceId} sliceId - the slice id to fetch
   */
  async _fetchSlice (sliceId) {
    const { path, depth, root, isStorage } = sliceId
    return this.fetcher({ path, depth, root, isStorage })
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} sliceId - the slice id
   * @returns {Boolean}
   */
  async isTracking (sliceId) {
    return this.slices.has(sliceId)
  }

  async start () {
    this._blockTracker.on('block', this._blockHandler)
  }

  async stop () {
    this._blockTracker.removeListener('block', this._blockHandler)
  }
}

module.exports = KitsunetBridge
