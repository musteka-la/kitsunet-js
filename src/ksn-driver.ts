'use strict'

import EE from 'events'
import debug from 'debug'

import { KsnNodeType } from './constants'
import { Discovery } from './slice/discovery/base'
import { register } from 'opium-decorators'
import { Libp2pPromisified, NodeManager, IPeerDescriptor } from './net'
import { Slice } from './slice';

const log = debug('kitsunet:kitsunet-driver')

@register()
export class KsnDriver<T extends IPeerDescriptor<any>> extends EE {
  nodeType: KsnNodeType
  peers: Map<string, T>
  _headers: Set<any>
  idB58: any
  _stats: any

  constructor (public node: Libp2pPromisified,
               public isBridge: boolean,
               public discovery: Discovery,
               public nodeManager: NodeManager<T>,
               // blockchain,
               public blockTracker: any) {
    super()

    this.node = node
    this.isBridge = Boolean(isBridge)
    // this.blockChain = promisify(blockchain)
    this.discovery = discovery
    this.blockTracker = blockTracker
    this.nodeType = this.isBridge ? KsnNodeType.BRIDGE : KsnNodeType.NODE

    // peers
    this.peers = new Map()

    // TODO: this is a workaround, headers
    // should come from the blockchain
    this._headers = new Set()

    // TODO: this needs to be reworked as a proper light sync
    // Currently the ethereumjs-blockchain doesn't support
    // checkpointed syncs, which is essential for any light client,
    // hence we just store the headers elsewhere
    this.blockTracker.on('latest', async (header) => {
      this._headers.add(header)
    })
  }

  get peerInfo () {
    return this.node.peerInfo
  }

  /**
   * Get the latest block
   */
  async getLatestBlock () {
    return this.blockTracker.getLatestBlock()
  }

  /**
   * Get a block by number
   * @param {String|Number} block - the number of the block to retrieve
   */
  async getBlockByNumber (block) {
    return this.blockTracker.getBlockByNumber(block)
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
    // return this.discovery.findPeers(slice)
  }

  /**
   * Discover and connect to peers tracking this slice
   *
   * @param {Array<SliceId>} slices - the slices to find the peers for
   */
  async findAndConnect (slices) {
    // const peers = await this.findPeers(slices)
    // if (peers && peers.length) {
    //   const _peers = await Promise.all(peers.map((peer) => {
    //     if (peer.id.toB58String() === this.idB58) {
    //       log('cant dial to self, skipping')
    //       return
    //     }
    //     return this.ksnDialer.dial(peer)
    //   }))
    //   return _peers.filter(Boolean)
    // }
  }

  /**
   * Resolve slices from remotes
   *
   * @param {Array<slices>} slices - slices to resolve from peers
   * @param {Array<RpcPeer>} peers - peers to query
   */
  async _rpcResolve (slices, peers): Promise<any[] | undefined> {
    const resolve = async (peer): Promise<any[] | undefined> => {
      // first check if the peer has already reported
      // tracking the slice
      const _peers = await slices.map((slice) => {
        if (peer.sliceIds.has(`${slice.path}-${slice.depth}`) ||
          peer.nodeType === KsnNodeType.BRIDGE ||
          peer.nodeType === KsnNodeType.NODE) {
          return peer
        }
      }).filter(Boolean)

      if (_peers && _peers.length) {
        return Promise.race(_peers.map(p => p.getSlices(slices)))
      }
      return
    }

    for (const p of peers) {
      let resolved = await resolve(p)
      if (resolved && resolved.length) return resolved
      await p.getSliceIds() // refresh the ids
      resolved = await resolve(p)
      if (resolved && resolved.length) return resolved
    }
  }

  /**
   * Find the requested slices, by trying different
   * underlying mechanisms
   *
   * 1) RPC - ask each peer for the slice, if that fails
   * 2) Discovery - ask different discovery mechanisms to
   * find peers tracking the requested slices
   * 3) RPC - repeat 1st step with the new peers
   *
   * @param {Array<SliceId>} slices
   */
  async resolveSlices (slices) {
    // const resolved = await this._rpcResolve(slices, this.peers.values())
    // if (resolved && resolved.length) {
    //   return resolved
    // }

    // const peers = await this.findAndConnect(slices)
    // if (peers && peers.length) {
    //   return this._rpcResolve(slices, peers)
    // }
    return {} as Slice
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
    this.nodeManager.on('kitsunet:peer:connected', (peer: T) => {
      this.peers.set(peer.id, peer)
    })

    this.nodeManager.on('kitsunet:peer:disconnected', (peer: T) => {
      this.peers.delete(peer.id)
    })

    await this.nodeManager.start()
  }

  /**
   * Stop the driver
   */
  async stop () {
    await this.nodeManager.start()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}
