'use strict'

import EE from 'events'
import { NodeTypes } from './constants'
import { KsnDialer, KsnRpc } from './net'
import { Discovery } from './slice/discovery/base'
import { register } from 'opium-decorator-resolvers'
import debug from 'debug'

const log = debug('kitsunet:kitsunet-driver')

@register()
export class KsnDriver extends EE {
  node: any
  isBridge: boolean
  ksnDialer: any
  ksnRpc: any
  discovery: any
  blockTracker: any
  nodeType: NodeTypes
  peers: Map<any, any>
  _headers: Set<any>
  idB58: any
  _stats: any

  constructor (
    node: Node,
    ksnDialer: KsnDialer,
    ksnRpc: KsnRpc,
    isBridge: boolean,
    discovery: Discovery,
    // blockchain,
    blockTracker: BlockTracker
  ) {
    super()

    this.node = node
    this.isBridge = Boolean(isBridge)
    // this.blockChain = promisify(blockchain)
    this.ksnDialer = ksnDialer
    this.ksnRpc = ksnRpc
    this.discovery = discovery
    this.blockTracker = blockTracker
    this.nodeType = this.isBridge ? NodeTypes.BRIDGE : NodeTypes.NODE

    // peers
    this.peers = new Map()

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
    return this.discovery.findPeers(slice)
  }

  /**
   * Discover and connect to peers tracking this slice
   *
   * @param {Array<SliceId>} slices - the slices to find the peers for
   */
  async findAndConnect (slices) {
    const peers = await this.findPeers(slices)
    if (peers && peers.length) {
      const _peers = await Promise.all(peers.map((peer) => {
        if (peer.id.toB58String() === this.idB58) {
          log('cant dial to self, skipping')
          return
        }
        return this.ksnDialer.dial(peer)
      }))
      return _peers.filter(Boolean)
    }
  }

  /**
   * Resolve slices from remotes
   *
   * @param {Array<slices>} slices - slices to resolve from peers
   * @param {Array<RpcPeer>} peers - peers to query
   */
  async _rpcResolve (slices, peers) {
    const resolve = async (peer) => {
      // first check if the peer has already reported
      // tracking the slice
      const _peers = await slices.map((slice) => {
        if (peer.sliceIds.has(`${slice.path}-${slice.depth}`) ||
          peer.nodeType === NodeTypes.BRIDGE ||
          peer.nodeType === NodeTypes.EXIT) {
          return peer
        }
      }).filter(Boolean)

      if (_peers && _peers.length) {
        return Promise.race(_peers.map(p => p.getSlices(slices)))
      }
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
    const resolved = await this._rpcResolve(slices, this.peers.values())
    if (resolved && resolved.length) {
      return resolved
    }

    const peers = await this.findAndConnect(slices)
    if (peers && peers.length) {
      return this._rpcResolve(slices, peers)
    }
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
    await this.ksnRpc.start()
    await this.ksnDialer.start()

    this.ksnRpc.on('kitsunet:peer-connected', (peer) => {
      this.peers.set(peer.idB58, peer)
    })

    this.ksnRpc.on('kitsunet:peer-disconnected', (peerInfo) => {
      const idB58 = peerInfo.id.toB58String()
      this.peers.delete(idB58)
    })
  }

  /**
   * Stop the driver
   */
  async stop () {
    await this.ksnRpc.stop()
    await this.ksnDialer.stop()

    this.ksnRpc.removeEventListener('kitsunet:peer-connected')
    this.ksnRpc.removeEventListener('kitsunet:peer-disconnected')

    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}
