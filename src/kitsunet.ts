'use strict'

import EE from 'events'
import nextTick from 'async/nextTick'
import { SliceId } from './slice'
import { register } from 'opium-decorators'
import { SliceManager } from './slice-manager'
import { KsnDriver } from './ksn-driver'
import { DEFAULT_DEPTH } from './constants'
import { NetworkPeer } from './net/network-peer'
import Block from 'ethereumjs-block'
import { Node } from './net'

@register()
export class Kitsunet<T extends NetworkPeer<any, any>> extends EE {
  sliceManager: SliceManager<T>
  ksnDriver: KsnDriver<T>
  depth: number

  @register('slice-depth')
  static getDefaultDepth (@register('options') options: any): number {
    return options.depth || DEFAULT_DEPTH
  }

  constructor (sliceManager: SliceManager<T>,
               ksnDriver: KsnDriver<T>,
               @register('slice-depth')
               depth: number = DEFAULT_DEPTH) {
    super()

    this.sliceManager = sliceManager
    this.ksnDriver = ksnDriver
    this.depth = depth

    this.sliceManager.blockTracker.on('latest', (block) =>
      this.emit('latest', block))

    this.sliceManager.blockTracker.on('sync', ({ block, oldBlock }) =>
      this.emit('sync', { block, oldBlock }))

    this.sliceManager.on('slice', (slice) =>
      this.emit('slice', slice))
  }

  get addrs (): string[] {
    return this.ksnDriver.clientPeers.reduce((addrs: any, addr) => {
      addrs.push(addr)
      return addr
    }, [])
  }

  get networkNodes (): Node<T>[] {
    return this.ksnDriver.nodeManager.nodes
  }

  get peers () {
    return this.ksnDriver.peers
  }

  /**
   * Get a slice
   *
   * @param {SliceId|String} slice - the slice to return
   * TODO: remove this - need to modify Geth to handle storage slices just any any other slice
   * @param {Boolean} storage - weather the slice is a storage slice
   * @return {Slice}
   */
  async getSlice (slice, storage) {
    if (typeof slice === 'string') {
      const [path, depth, root] = slice.split('-')
      slice = new SliceId(path, Number(depth), root, storage)
    }

    return this.sliceManager.getSlice(slice)
  }

  /**
   * Get the slice for a block
   *
   * @param {String|Number} block - the block tag to get the slice for
   * @param {SliceId|String} slice - the slice id to retrieve
   */
  async getSliceForBlock (block, slice) {
    if (typeof slice === 'string') {
      slice = new SliceId(slice)
    }

    return this.sliceManager.getSliceForBlock(block, slice)
  }

  /**
   * Get the latest block
   */
  async getLatestBlock () {
    return this.ksnDriver.getLatestBlock()
  }

  /**
   * Get a block by number
   *
   * @param {String|Number} block - the block number, if string is passed assumed to be in hex
   */
  async getBlockByNumber (block: number): Promise<Block | undefined> {
    return this.ksnDriver.getBlockByNumber(block)
  }

  async start () {
    await this.ksnDriver.start()
    await this.sliceManager.start()

    nextTick(() => this.emit('kitsunet:start'))
  }

  async stop () {
    await this.sliceManager.stop()
    await this.ksnDriver.stop()

    nextTick(() => this.emit('kitsunet:stop'))
  }
}
