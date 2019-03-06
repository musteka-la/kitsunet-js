'use strict'

// const KitsunetStatsTracker = require('kitsunet-telemetry')

const { Peer } = require('./peer')
const { TYPES } = require('./constants')

const log = require('debug')('kitsunet:kitsunet-driver')

class KitsunetDriver extends Peer {
  constructor ({
    node,
    kitsunetNode,
    isBridge,
    blockTracker,
    sliceTracker,
    chain, // blockchain
    slices
  }) {
    super()
    this.node = node
    this.isBridge = Boolean(isBridge)
    this.multicast = node.multicast

    this._slices = new Set(slices)
    this._chain = chain

    this._kitsunetNode = kitsunetNode

    this._remotePeers = new Map()
    this._blockTracker = blockTracker

    this._sliceTracker = sliceTracker

    this.nodeType = this.isBridge ? TYPES.BRIDGE : TYPES.NORMAL

    this._setUp()
  }

  _setUp () {
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {String} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Array<SliceId>|SliceId} slices - a slice or an array of slices to track
   */
  async trackSlices (slices) {
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Array<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrackSlices (slices) {
  }

  /**
   * Get the slice by its id
   *
   * @param {SliceId} id - the id of the slice
   * @return {Slice}
   */
  async getSliceById (slice) {
  }

  /**
   * Get the latest slice
   *
   * @return {Slice}
   */
  async getLatestSlice () {
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block - the block number to get the slice for
   */
  async getSliceForBlock (block) {
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

  /**
   * Start the client
   */
  async start () {
    await this.node.start()
    await this._blockTracker.start()
    await this._pubSubSliceTracker.start()
    await this._sliceTracker.start()

    // await this._stats.start()

    this._registerSlices()
  }

  /**
   * Stop the client
   */
  async stop () {
    await this.node.stop()
    await this._blockTracker.stop()
    await this._sliceTracker.stop()

    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}

module.exports = KitsunetDriver
