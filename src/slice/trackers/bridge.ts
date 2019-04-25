'use strict'

import { BaseTracker } from './base'
import { Slice, SliceId } from '../'
import promisify from 'promisify-this'
import * as ethUtils from 'ethereumjs-util'
import { nextTick } from 'async'
import blockFromRpc = require('ethereumjs-block/from-rpc')
import debug from 'debug'

const log = debug('kitsunet:kitsunet-bridge-tracker')

export class KitsunetBridge extends BaseTracker {
  rpcUrl: any
  blockTracker: any
  rpcBlockTracker: any
  ethQuery: any

  constructor ({ rpcUrl, slices, blockTracker, rpcBlockTracker, ethQuery }) {
    super(slices)
    this.rpcUrl = rpcUrl
    this.blockTracker = blockTracker
    this.rpcBlockTracker = rpcBlockTracker
    this.ethQuery = promisify(ethQuery)
    this._blockHandler = this._blockHandler.bind(this)
  }

  async publish (slice: Slice): Promise<void> {
    this.emit('slice', slice)
  }

  /**
   * Handle blocks via the `latest` event
   *
   * @param {string|number} blockId - an rpc (JSON) block
   */
  _blockHandler (blockId: string | number) {
    nextTick(async () => {
      const block = await this.ethQuery.getBlockByNumber(blockId, false)
      this.blockTracker.publish(blockFromRpc(block))
      this.slices.forEach(async (slice) => {
        slice.root = block.stateRoot
        const fetched = new Slice(await this._fetchSlice(slice))
        return this.publish(fetched)
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
    return this.ethQuery.getSlice(String(path), depth, ethUtils.addHexPrefix(root), isStorage)
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
  async getSlice (slice: SliceId): Promise<Slice> {
    return new Slice(await this._fetchSlice(slice))
  }

  async start () {
    await this.blockTracker.start()
    this.rpcBlockTracker.on('latest', this._blockHandler)
  }

  async stop () {
    await this.blockTracker.stop()
    this.rpcBlockTracker.removeListener('latest', this._blockHandler)
  }
}
