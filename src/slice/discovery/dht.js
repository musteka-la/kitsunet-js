'use strict'

const Discovery = require('./base')
const promisify = require('promisify-this')
const multihashing = promisify(require('multihashing-async'))
const CID = require('cids')

const TIMEOUT = 1000 * 60 // one minute

class DhtDiscovery extends Discovery {
  /**
   * Discover nodes for slices using the kademlia DHT
   *
   * @param {Libp2p} node - the libp2p kademlia dht instance
   */
  constructor (node) {
    super()
    this.contentRouting = promisify(node.contentRouting)
  }

  async _makeKeyId (sliceId) {
    const key = await multihashing(sliceId.serialize(), 'sha2-256')
    return new CID(key)
  }

  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
   * @returns {Array<PeerInfo>} peers - an array of peers tracking the slice
   */
  async findPeers (sliceId) {
    let provs = await Promise.all(sliceId.map(async (s) => {
      return this.contentRouting.findProviders(await this._makeKeyId(s), TIMEOUT)
    }))

    provs = provs.flat()
    provs = provs.filter(Boolean)
    provs = provs.flat()

    return provs
  }

  /**
   * Announces slice to the network using whatever
   * mechanisms are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  async announce (slices) {
    slices.forEach(async (sliceId) => {
      return this.contentRouting.provide(await this._makeKeyId(sliceId))
    })
  }
}

module.exports = DhtDiscovery
