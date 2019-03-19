'use strict'

const { Peer } = require('./peer')
const { TYPES } = require('./constants')

const log = require('debug')('kitsunet:kitsunet-driver')

class KitsunetDriver extends Peer {
  constructor ({
    node,
    kitsunetNode,
    isBridge,
    sliceManager,
    discovery,
    blockchain,
    trie
  }) {
    super()
    this.node = node
    this.isBridge = Boolean(isBridge)
    this.multicast = node.multicast
    this._slices = new Set()
    this._trie = trie
    this._chain = blockchain
    this._kitsunetNode = kitsunetNode
    this._sliceManager = sliceManager
    this._discovery = discovery
    this.nodeType = this.isBridge ? TYPES.BRIDGE : TYPES.NORMAL
  }

  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} slice - the slices to find the peers for
   * @returns {Array<Peer>} peers - an array of peers tracking the slice
   */
  async findPeers (slice) {
    this.discovery.findPeers(slice)
  }

  /**
   * Discover and connect to peers tracking this slice
   *
   * @param {Array<SliceId>} slices - the slices to find the peers for
   */
  async findAndConnect (slices) {
    const peers = this.findPeers(slices)
    peers.forEach((peer) => this.kitsunetNode.dial(peer))
  }

  /**
   * Announces slice to the network using whatever mechanisms
   * are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  async announce (slices) {
    return this._discovery.announce(slices)
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
