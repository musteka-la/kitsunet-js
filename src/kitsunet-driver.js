'use strict'

const EE = require('safe-event-emitter')
const { NodeTypes } = require('./constants')

const log = require('debug')('kitsunet:kitsunet-driver')

class KitsunetDriver extends EE {
  constructor ({
    node,
    kitsunetDialer,
    kitsunetRpc,
    isBridge,
    discovery,
    blockchain
  }) {
    super()
    this.node = node
    this.isBridge = Boolean(isBridge)
    this.blockChain = blockchain
    this.kitsunetDialer = kitsunetDialer
    this.kitsunetRpc = kitsunetRpc
    this.discovery = discovery
    this.nodeType = this.isBridge ? NodeTypes.BRIDGE : NodeTypes.NODE
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
    return this.discovery.announce(slices)
  }

  /**
   * Start the driver
   */
  async start () {
    await this.kitsunetRpc.start()
    await this.kitsunetDialer.start()

    this.kitsunetDialer.on('kitsunet:discovery', (peerInfo) => {
      this.kitsunetRpc.dial(peerInfo)
    })

    // await this._stats.start()
  }

  /**
   * Stop the driver
   */
  async stop () {
    await this.kitsunetDialer.stop()
    await this.kitsunetRpc.stop()

    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}

module.exports = KitsunetDriver
