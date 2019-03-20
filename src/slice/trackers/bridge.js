'use strict'

const BaseTracker = require('./base')
const fetcher = require('./slice-fetcher')
const { Slice } = require('../')
const utils = require('ethereumjs-util')

const nextTick = require('async/nextTick')
const log = require('debug')('kitsunet:kitsunet-bridge-tracker')

class KitsunetBridge extends BaseTracker {
  constructor ({ rpcUrl, slices, blockTracker }) {
    super({ slices })
    this.rpcUrl = rpcUrl
    this._blockTracker = blockTracker

    this.fetcher = fetcher(this.rpcUrl)
    this._blockHandler = this._blockHandler.bind(this)
  }

  /**
  * Handle blocks via the `latest` event
  *
  * @param {Block} header - an rpc (JSON) block
  */
  _blockHandler (header) {
    nextTick(() => {
      this.slices.forEach(async (slice) => {
        const { path, depth, isStorage } = slice
        const fetchedSlice = await this.fetcher({
          path: path,
          depth,
          root: utils.bufferToHex(header.stateRoot),
          isStorage
        })
        this.emit('slice', new Slice(fetchedSlice))
      })
    })
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>} slices - the slices to stop tracking
   */
  async untrack (slices) {
    slices.forEach((slice) => this.slices.delete(slice))
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    this.slices = new Set([...this.slices, ...slices])
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
    await this._blockTracker.start()
    this._blockTracker.on('latest', this._blockHandler)
  }

  async stop () {
    await this._blockTracker.stop()
    this._blockTracker.removeListener('latest', this._blockHandler)
  }
}

module.exports = KitsunetBridge
