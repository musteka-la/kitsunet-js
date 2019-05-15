'use strict'

import EE from 'events'
import { SliceId } from './slice'
import nextTick from 'async/nextTick'
import { register } from 'opium-decorators'
import { SliceManager } from './slice-manager'
import { Libp2pStats } from './stats/libp2p'
import { KitsunetStatsTracker } from './stats/kitsunet-stats'
import { KsnDriver } from './ksn-driver'
import { Telemetry } from 'kitsunet-telemetry'

const DEFUALT_DEPTH: number = 10

@register()
export class Kitsunet<T> extends EE {
  sliceManager: SliceManager
  ksnDriver: KsnDriver<T>
  kitsunetStats: KitsunetStatsTracker
  libp2pStats: Libp2pStats
  telemetry: Telemetry
  depth: number

  constructor (sliceManager: SliceManager,
               ksnDriver: KsnDriver<T>,
               telemetry: Telemetry,
               libp2pStats: Libp2pStats,
               kitsunetStats: KitsunetStatsTracker,
               depth: number = DEFUALT_DEPTH) {
    super()
    this.sliceManager = sliceManager
    this.ksnDriver = ksnDriver
    this.kitsunetStats = kitsunetStats
    this.libp2pStats = libp2pStats
    this.telemetry = telemetry

    this.depth = depth

    this.sliceManager.blockTracker.on('latest', (block) =>
      this.emit('latest', block))

    this.sliceManager.blockTracker.on('sync', ({ block, oldBlock }) =>
      this.emit('sync', { block, oldBlock }))

    this.sliceManager.on('slice', (slice) => this.emit('slice', slice))
  }

  get node () {
    return this.ksnDriver.node
  }

  get peerInfo () {
    return this.ksnDriver.peerInfo
  }

  get peers () {
    return this.ksnDriver.peers
  }

  /**
  * Get a slice
  *
  * @param {SliceId|String} slice - the slice to return
  * TODO: remove this - need to modify Geth to handle storage slices just any any other slice
  * @param {Boolean} storage - weather the slice is a storage slice
  * @return {Slice}
  */
  async getSlice (slice, storage) {
    if (typeof slice === 'string') {
      const [path, depth, root] = slice.split('-')
      slice = new SliceId(path, Number(depth), root, storage)
    }

    return this.sliceManager.getSlice(slice)
  }

  /**
   * Get the slice for a block
   *
   * @param {String|Number} block - the block tag to get the slice for
   * @param {SliceId|String} slice - the slice id to retrieve
   */
  async getSliceForBlock (block, slice) {
    if (typeof slice === 'string') {
      slice = new SliceId(slice)
    }

    return this.sliceManager.getSliceForBlock(block, slice)
  }

  /**
   * Get the latest block
   */
  async getLatestBlock () {
    return this.ksnDriver.getLatestBlock()
  }

  /**
   * Get a block by number
   *
   * @param {String|Number} block - the block number, if string is passed assumed to be in hex
   */
  async getBlockByNumber (block) {
    return this.ksnDriver.getBlockByNumber(block)
  }

  async start () {
    await this.ksnDriver.start()
    await this.sliceManager.start()

    await this.libp2pStats.start()
    await this.kitsunetStats.start()
    await this.telemetry.start()

    nextTick(() => this.emit('kitsunet:start'))
  }

  async stop () {
    await this.sliceManager.stop()
    await this.ksnDriver.stop()

    await this.libp2pStats.stop()
    await this.kitsunetStats.stop()
    await this.telemetry.stop()

    nextTick(() => this.emit('kitsunet:stop'))
  }
}
