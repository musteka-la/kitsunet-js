'use strict'

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
    dataStore, // the data store
    chain, // blockchain
    trie
  }) {
    super()
    this.node = node
    this.isBridge = Boolean(isBridge)
    this.multicast = node.multicast

    this._slices = new Set()

    this._trie = trie
    this._chain = chain

    this._dataStore = dataStore

    this._kitsunetNode = kitsunetNode

    this._remotePeers = new Map()
    this._blockTracker = blockTracker

    this._sliceTracker = sliceTracker
    this.nodeType = this.isBridge ? TYPES.BRIDGE : TYPES.NORMAL

    this._setUp()
  }

  _setUp () {
    // subscribe to block updates
    // TODO: this should just be a block stream
    this._blockTracker.on('latest', (header) => {
      this.peer.latestBlock = header

      this.chain.putHeader(header)
      this._sliceTracker.emit('header', header)
    })

    const sliceHandler = this._storeSlice.bind(this)
    this._sliceTracker.on('slice', sliceHandler)
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {String} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    return this._sliceTracker.isTracking(slice)
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Array<SliceId>|SliceId} slices - a slice or an array of slices to track
   */
  async trackSlices (slices) {
    this._sliceTracker.trackSlices(slices)
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Array<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrackSlices (slices) {
    this._sliceTracker.untrackSlices(slices)
  }

  /**
   * Get a slice
   *
   * @param {SliceId} slice - the slice to return
   * @return {Slice}
   */
  async getSlice (slice) {
    // TODO: this should fallback to to some persistent storage if not found
    return this._sliceCache.get(slice.id)
  }

  /**
   * Get the latest slice for prefix
   *
   * @return {Slice}
   */
  async getLatestSlice () {
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block - the block number to get the slice for
   * @param {Slice} slice - the slice to get (root is ignored)
   */
  async getSliceForBlock (block, slice) {
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
