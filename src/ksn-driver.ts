'use strict'

import EE from 'events'
import Debug from 'debug'

import { KsnNodeType } from './constants'
import { Discovery } from './slice/discovery/base'
import { register } from 'opium-decorators'
import { Slice } from './slice'
import KistunetBlockTracker from 'kitsunet-block-tracker'
import Block from 'ethereumjs-block'

import {
  NodeManager,
  Libp2pPeer,
  NetworkPeer
} from './net'

import { EthChain, IBlockchain } from './blockchain'
import { DownloadManager } from './downloader'

const debug = Debug('kitsunet:kitsunet-driver')

// TODO: Plugin blockchain and header sync
@register()
export class KsnDriver<T extends NetworkPeer<any, any>> extends EE {
  nodeType: KsnNodeType
  peers: Map<string, T>
  _stats: any

  constructor (@register('options')
               public isBridge: any,
               public discovery: Discovery,
               @register('node-manager')
               public nodeManager: NodeManager<T>,
               @register('download-manager')
               public downloadManager: DownloadManager,
               public blockTracker: KistunetBlockTracker,
               @register(EthChain)
               public chain: IBlockchain,
               @register('libp2p-peer')
               public libp2pPeer: Libp2pPeer) {
    super()

    this.isBridge = Boolean(isBridge.bridge)
    this.discovery = discovery
    this.blockTracker = blockTracker
    this.nodeType = this.isBridge ? KsnNodeType.BRIDGE : KsnNodeType.NODE

    // peers
    this.peers = new Map()
  }

  get clientPeers (): T[] {
    return [this.libp2pPeer] as unknown as T[]
  }

  /**
   * Get the latest block
   */
  async getLatestBlock (): Promise<Block | undefined> {
    return this.chain.getLatestBlock()
  }

  /**
   * Get a block by number
   * @param {String|Number} blockId - the number/tag of the block to retrieve
   */
  async getBlockByNumber (blockId: number): Promise<Block | undefined> {
    const block: Block[] | undefined = await this.chain.getBlocks(blockId, 1)
    if (block && block.length > 0) {
      return block[0]
    }
  }

  getHeaders (blockId: Buffer | number,
              maxBlocks: number = 25,
              skip: number = 0,
              reverse: boolean = false) {
    return this.chain.getHeaders(blockId, maxBlocks, skip, reverse)
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
  async findSlicePeers (slices) {
    const peers = await this.findPeers(slices)
    if (peers && peers.length) {
      const _peers = await Promise.all(peers.map((peer) => {
        if (peer.id.toB58String() === this.libp2pPeer.id) {
          debug('cant dial to self, skipping')
        }
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
  async _rpcResolve (slices: Slice[], peers: NetworkPeer<any, any>[]): Promise<any[] | undefined> {
    const resolve = async (peer): Promise<any[] | undefined> => {
      // first check if the peer has already reported
      // tracking the slice
      const _peers = slices.map((slice) => {
        if (peer.sliceIds.has(`${slice.path}-${slice.depth}`) ||
          peer.nodeType === KsnNodeType.BRIDGE ||
          peer.nodeType === KsnNodeType.NODE) {
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
      await p.protocols['ksn'].getSliceIds() // refresh the ids
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
    const resolved = await this._rpcResolve(slices, [...this.peers.values()])
    if (resolved && resolved.length) {
      return resolved
    }

    const peers = await this.findSlicePeers(slices)
    if (peers && peers.length) {
      return this._rpcResolve(slices, peers as NetworkPeer<any, any>[])
    }
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
      this.emit('kitsunet:peer:connected', peer)
    })

    this.nodeManager.on('kitsunet:peer:disconnected', (peer: T) => {
      this.peers.delete(peer.id)
      this.emit('kitsunet:peer:disconnected', peer)
    })

    await this.nodeManager.start()
    await this.blockTracker.start()
    await this.downloadManager.start()
    await this.chain.start()
  }

  /**
   * Stop the driver
   */
  async stop () {
    await this.downloadManager.stop()
    await this.nodeManager.stop()
    await this.blockTracker.stop()
    await this.chain.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}
