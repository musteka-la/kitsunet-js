'use strict'

const Discovery = require('./base')

class DhtDiscovery extends Discovery {
  /**
   * Discover nodes for slices using the kademlia DHT
   *
   * @param {KademliaDHT} dht - the libp2p kademlia dht instance
   */
  constructor (dht) {
    super()
    this._dht = dht
  }

  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
   * @param {Object}  - an options object with the following properties
   *                  - maxPeers - the maximum amount of peers to connect to
   * @returns {Array<Peer>} peers - an array of peers tracking the slice
   */
  async findSlicePeers (sliceId, options = { maxPeers: 3 }) {
    throw new Error('not implemented!')
  }

  /**
   * Announces slice to the network using whatever mechanisms are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  async announceSlices (slices) {
    throw new Error('not implemented!')
  }
}

module.exports = DhtDiscovery
