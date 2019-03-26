'use strict'

const EE = require('events')
const { NodeTypes } = require('./constants')
const promisify = require('promisify-this')
const { Header } = require('ethereumjs-blockchain')

const log = require('debug')('kitsunet:kitsunet-driver')

class KitsunetDriver extends EE {
  constructor ({
    node,
    kitsunetDialer,
    kitsunetRpc,
    isBridge,
    discovery,
    blockchain,
    blockTracker
  }) {
    super()

    this.node = node
    this.isBridge = Boolean(isBridge)
    this.blockChain = promisify(blockchain)
    this.kitsunetDialer = kitsunetDialer
    this.kitsunetRpc = kitsunetRpc
    this.discovery = discovery
    this.blockTracker = blockTracker
    this.nodeType = this.isBridge ? NodeTypes.BRIDGE : NodeTypes.NODE

    // TODO: this is a workaround, headers
    // should come from the blockchain
    this._headers = new Set()

    this._init()
  }

  get peerInfo () {
    return this.node.peerInfo
  }

  async _init () {
    // TODO: this needs to be reworked as a proper light sync
    // Currently the ethereumjs-blockchain doesn't support
    // checkpointed syncs, which is essential for any light client,
    // hence we just store the headers elsewhere
    this.blockTracker.on('latest', async (header) => {
      this._headers.add(header)
    })
  }

  async getLatestBlock () {
    return this.blockTracker.getLatestBlock()
  }

  getHeaders () {
    return [...this._headers]
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
    Promise.all(peers.map((peer) => this.kitsunetDialer.dial(peer)))
  }

  /**
   * Announces slice to the network using whatever mechanisms
   * are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  async announce (slices) {
    return this.discovery.announce(slices)
  }

  /**
   * Start the driver
   */
  async start () {
    await this.kitsunetRpc.start()
    await this.kitsunetDialer.start()

    // await this._stats.start()
  }

  /**
   * Stop the driver
   */
  async stop () {
    await this.kitsunetRpc.stop()
    await this.kitsunetDialer.stop()

    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}

module.exports = KitsunetDriver
