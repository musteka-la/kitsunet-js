'use strict'

import assert from 'assert'
import BlockTracker from 'kitsunet-block-tracker'
import { SliceId, Slice } from './slice'
import { retry } from 'async'
import { register } from 'opium-decorators'
import { SliceStore } from './stores/slice-store'
import { KsnDriver } from './ksn-driver'
import Block from 'ethereumjs-block'

import {
  BaseTracker,
  KitsunetPubSub,
  KitsunetBridge
} from './slice/trackers'

import Debug from 'debug'
import { NetworkPeer } from './net/network-peer'
const debug = Debug('kitsches:kitsunet-slice-manager')

@register()
export class SliceManager<T extends NetworkPeer<any, any>> extends BaseTracker {
  blockTracker: BlockTracker
  bridgeTracker: KitsunetBridge
  pubsubTracker: KitsunetPubSub
  slicesStore: SliceStore
  ksnDriver: KsnDriver<T>
  isBridge: boolean

  constructor (pubsubTracker: KitsunetPubSub,
               @register('options') options,
               bridgeTracker: KitsunetBridge,
               slicesStore: SliceStore,
               blockTracker: BlockTracker,
               ksnDriver: KsnDriver<T>) {
    super()

    assert(blockTracker, 'blockTracker should be supplied')
    assert(slicesStore, 'slicesStore should be supplied')
    assert(ksnDriver, 'driver should be supplied')
    options.bridge && assert(bridgeTracker, 'bridgeTracker should be supplied in bridge mode')

    this.blockTracker = blockTracker
    this.bridgeTracker = bridgeTracker
    this.pubsubTracker = pubsubTracker
    this.slicesStore = slicesStore
    this.ksnDriver = ksnDriver
    this.isBridge = Boolean(options.bridge)

    this._setUp()
  }

  _setUp () {
    if (this.isBridge) {
      this.bridgeTracker.on('slice', (slice: any) => {
        return this.pubsubTracker.publish(slice)
      })
    }

    this.pubsubTracker.on('slice', async (slice: any) => {
      await this.slicesStore.put(slice)
      this.emit('slice', slice)
    })
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrack (slices: any) {
    if (this.isBridge) {
      await this.bridgeTracker.untrack(slices)
    }

    return this.pubsubTracker.untrack(slices)
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async track (slices: Set<SliceId>) {
    if (this.isBridge) {
      await this.bridgeTracker.track(slices)
    }
    await this.pubsubTracker.track(slices)

    // if we're tracking a slice, make it discoverable
    return this.ksnDriver.announce(slices)
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice: SliceId) {
    let tracking = this.isBridge ? await this.bridgeTracker.isTracking(slice) : true
    if (tracking) return this.pubsubTracker.isTracking(slice)
    return false
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publish (slice: Slice) {
    // bridge doesn't implement publishSlice
    return this.pubsubTracker.publish(slice)
  }

  /**
   * Get all slice ids currently being tracker
   * @returns {Array<SliceId>}
   */
  getSliceIds () {
    // dedup
    return [...new Set([
      ...this.pubsubTracker.slices,
      ...this.bridgeTracker.slices
    ])]
  }

  /**
   * Get a slice
   *
   * @param {SliceId} sliceId - the slice to return
   * @return {Slice}
   */
  async getSlice (sliceId: SliceId): Promise<Slice> {
    let slice
    try {
      slice = await this.slicesStore.getById(sliceId)
      if (slice) return slice
    } catch (e) {
      debug(e)
      if (this.isBridge) {
        await this.track(new Set([sliceId]))
        return this.bridgeTracker.getSlice(sliceId)
      }
    }

    return this._resolveSlice(sliceId)
  }

  /**
   * Get all slices
   *
   * @returns {Array<Slice>} - an array of slice objects
   */
  async getSlices () {
    try {
      return this.slicesStore.getSlices()
    } catch (e) {
      debug(e)
    }
  }

  /**
   * Get the slice for a block
   *
   * @param {number|string} tag
   * @param {SliceId} slice
   */
  async getSliceForBlock (tag: number | string, slice: { path: any; depth: any; }) {
    let _slice = new SliceId(slice.path, slice.depth)
    const block: Block | undefined = await this.ksnDriver.getBlockByNumber(tag as number)
    if (block) {
      _slice.root = block.header.stateRoot.toString('hex')
      return this.getSlice(_slice)
    }
  }

  async _resolveSlice (slice: SliceId): Promise<Slice> {
    // track the slice if not tracking already
    if (!await this.isTracking(slice)) {
      // track slice, we might already be subscribed to it
      await this.track(new Set([slice]))
    }

    // if in bridge mode, just get it from the bridge
    if (this.isBridge) {
      return this.bridgeTracker.getSlice(slice)
    }

    let times = 0
    return new Promise((resolve, reject) => {
      retry({
        times: 10,
        interval: 3000
      },
      async () => {
        const _slice = await this.ksnDriver.resolveSlices([slice])
        if (_slice) return _slice
        throw new Error(`no slice retrieved, retrying ${++times}!`)
      },
      (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  }

  async start () {
    if (this.isBridge) {
      await this.bridgeTracker.start()
    }

    await this.pubsubTracker.start()
  }

  async stop () {
    if (this.isBridge) {
      await this.bridgeTracker.stop()
    }

    await this.pubsubTracker.stop()
  }
}
