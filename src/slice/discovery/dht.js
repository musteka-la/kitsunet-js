'use strict'

const Discovery = require('./base')
const promisify = require('promisify-this')
const multihashing = promisify(require('multihashing'))

const TIMEOUT = 1000 * 60 // one minute

class DhtDiscovery extends Discovery {
  /**
   * Discover nodes for slices using the kademlia DHT
   *
   * @param {Libp2p} node - the libp2p kademlia dht instance
   */
  constructor (node) {
    super()
    this._dht = node.dht
  }

  async _makeKeyId (sliceId) {
    return multihashing.digest(sliceId.serialize(), 'sha2-256')
  }

  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
   * @returns {Array<PeerInfo>} peers - an array of peers tracking the slice
   */
  async findPeers (sliceId) {
    return this._dht.findProviders(await this._makeKeyId(sliceId), TIMEOUT)
  }

  /**
   * Announces slice to the network using whatever mechanisms are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  async announce (slices) {
    slices.forEach(async (sliceId) => this._dht.provide(await this._makeKeyId(sliceId)))
  }
}

module.exports = DhtDiscovery
