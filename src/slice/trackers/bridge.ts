'use strict'

const BaseTracker = require('./base')
const { Slice } = require('../')
const promisify = require('promisify-this')
const ethUtils = require('ethereumjs-util')

const blockFromRpc = require('ethereumjs-block/from-rpc')

const nextTick = require('async/nextTick')
const debug = require('debug')
const log = debug('kitsunet:kitsunet-bridge-tracker')

class KitsunetBridge extends BaseTracker {
  constructor ({ rpcUrl, slices, blockTracker, rpcBlockTracker, ethQuery }) {
    super({ slices })
    this.rpcUrl = rpcUrl
    this._blockTracker = blockTracker
    this._rpcBlockTracker = rpcBlockTracker
    this._ethQuery = promisify(ethQuery)
    this._blockHandler = this._blockHandler.bind(this)
  }

  async _handleSlice (slice) {
    slice = new Slice(slice)
    this.emit('slice', slice)
    return slice
  }

  /**
  * Handle blocks via the `latest` event
  *
  * @param {Block} number - an rpc (JSON) block
  */
  _blockHandler (number) {
    nextTick(async () => {
      const block = await this._ethQuery.getBlockByNumber(number, false)
      this._blockTracker.publish(blockFromRpc(block))
      this.slices.forEach(async (slice) => {
        slice.root = block.stateRoot
        this._handleSlice(await this._fetchSlice(slice))
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
    log('fetching slice %s, %d, %s, %d', path, depth, root, isStorage)
    return this._ethQuery.getSlice(String(path), depth, ethUtils.addHexPrefix(root), isStorage)
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

  /**
   * Get the requested slice
   *
   * @param {SliceId} slice
  */
  async getSlice (slice) {
    const _slice = await this._fetchSlice(slice)
    return this._handleSlice(_slice)
  }

  async start () {
    await this._blockTracker.start()
    this._rpcBlockTracker.on('latest', this._blockHandler)
  }

  async stop () {
    await this._blockTracker.stop()
    this._rpcBlockTracker.removeListener('latest', this._blockHandler)
  }
}

module.exports = KitsunetBridge
