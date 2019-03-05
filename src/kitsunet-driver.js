'use strict'

// const KitsunetStatsTracker = require('kitsunet-telemetry')

const KitsunetNode = require('./kitsunet-node')
const KitsunetBridge = require('./slice-trackers/kitsunet-bridge')

const { Peer, RemotePeer } = require('./peer')
const { createRpc } = require('./rpc')

const { TYPES } = require('./constants')

const log = require('debug')('kitsunet:kitsunet-client')

class KitsunetDriver extends Peer {
  constructor (node, isBridge, bridgeRpc, blockTracker, sliceTracker, slices) {
    super()
    this.node = node
    this.isBridge = Boolean(isBridge)
    this.multicast = node.multicast
    this._slices = new Set(slices)

    this._kitsunetNode = new KitsunetNode({ node, interval: 10000 })
    if (this.isBridge) {
      this._kitsunetBridge = new KitsunetBridge(bridgeRpc, this._slices)
    }

    this._remotePeers = new Map()
    this._blockTracker = blockTracker
    this._sliceTracker = sliceTracker

    this.nodeType = this.isBridge ? TYPES.BRIDGE : TYPES.NORMAL

    // subscribe to block updates
    this._blockTracker.on('latest', (block) => {
      // TODO: implement logic to figure out whats the best block
      this.peer.latestBlock = this.peer.bestBlock = block
    })

    // handle incoming peers
    this._kitsunetNode.on('kitsunet:peer', async ({ id, conn }) => {
      const remote = new RemotePeer(id)
      const rpc = createRpc(this, remote, conn)

      remote.rpc = rpc
      this._remotePeers.set(id, remote)
      rpc.hello() // send the hello message
    })

    // subscribe to initial slice set
    this._slices.forEach(async (slice) => {
      const sliceTopic = `${slice.path}-${slice.depth}`
      try {
        await this.multicast.subscribe(sliceTopic)
      } catch (e) {
        log(`Error subscribing to slice topic ${sliceTopic}`, e)
      }
    })
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
   * Announces slice to the network using whatever mechanisms are available, e.g - DHT, RPC, etc...
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
    await this._sliceTracker.start()

    if (this.isBridge) {
      await this._kitsunetBridge.start()
    }
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

    if (this.isBridge) {
      await this._kitsunetBridge.stop()
    }

    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}

module.exports = KitsunetDriver
