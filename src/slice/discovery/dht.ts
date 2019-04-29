'use strict'

import { Discovery } from './base'
import promisify from 'promisify-this'
import multihashingAsync from 'multihashing-async'
import CID from 'cids'
import Libp2p from 'libp2p'

const empty = Buffer.from([0])

const multihashing = promisify(multihashingAsync)
const TIMEOUT = 1000 * 60 // one minute

export class DhtDiscovery extends Discovery {
  contentRouting: any

  /**
   * Discover nodes for slices using the kademlia DHT
   *
   * @param {Libp2p} node - the libp2p kademlia dht instance
   */
  constructor (node: Libp2p) {
    super()
    this.contentRouting = promisify(node.contentRouting)
  }

  async _makeKeyId (sliceId) {
    const key: Buffer = (await multihashing(sliceId.serialize(), 'sha2-256')) || empty
    return new CID(key)
  }

  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
   * @returns {Array<PeerInfo>} peers - an array of peers tracking the slice
   */
  async findPeers (sliceId) {
    const providers = await Promise.all(sliceId.map(async (s) => {
      return this.contentRouting.findProviders(await this._makeKeyId(s), TIMEOUT)
    }))

    return providers.filter(Boolean)
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
