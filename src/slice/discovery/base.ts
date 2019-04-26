'use strict'

export abstract class Discovery {
  /**
   * Discover peers tracking this slice
   *
   * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
   * @param {Object}  options - an options object with the following properties
   *                  - maxPeers - the maximum amount of peers to connect to
   * @returns {Array<Peer>} peers - an array of peers tracking the slice
   */
  abstract findPeers (sliceId, options: {maxPeers: number})

  /**
   * Announces slice to the network using whatever mechanisms are available, e.g DHT, RPC, etc...
   *
   * @param {Array<SliceId>} slices - the slices to announce to the network
   */
  abstract announce (slices)
}
