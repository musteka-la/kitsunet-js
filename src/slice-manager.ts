'use strict'

import assert from 'assert'
import { SliceId } from './slice/slice-id'
import { BaseTracker, KitsunetPubSub } from './slice/trackers'
import { retry } from 'async'
import { register } from 'opium-decorator-resolvers'
import { SliceStore } from './stores/slice-store'
import { KsnDriver } from './ksn-driver'
import debug from 'debug'

const log = debug('kitsches:kitsunet-slice-manager')

@register()
export class SliceManager extends BaseTracker {

  blockTracker: KitsunetBridge
  bridgeTracker: KitsunetBridge
  pubsubTracker: KitsunetPubSub
  slicesStore: SliceStore
  ksnDriver: KsnDriver
  isBridge: boolean

  constructor (bridgeTracker: KitsunetBridge,
              pubsubTracker: KitsunetPubSub,
              slicesStore: SliceStore,
              blockTracker: any,
              ksnDriver: KsnDriver) {
    super({})

    assert(blockTracker, 'blockTracker should be supplied')
    assert(slicesStore, 'slicesStore should be supplied')
    assert(ksnDriver, 'driver should be supplied')
    ksnDriver.isBridge && assert(bridgeTracker, 'bridgeTracker should be supplied in bridge mode')

    this.blockTracker = blockTracker
    this.bridgeTracker = bridgeTracker
    this.pubsubTracker = pubsubTracker
    this.slicesStore = slicesStore
    this.ksnDriver = ksnDriver
    this.isBridge = Boolean(ksnDriver.isBridge)

    this._setUp()
  }

  _setUp () {
    if (this.isBridge) {
      this.bridgeTracker.on('slice', (slice: any) => {
        this.pubsubTracker.publish(slice)
      })
    }

    this.pubsubTracker.on('slice', (slice: any) => {
      this.slicesStore.put(slice)
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
      this.bridgeTracker.untrack(slices)
    }

    this.pubsubTracker.untrack(slices)
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async track (slices: any[]) {
    if (this.isBridge) {
      this.bridgeTracker.track(slices)
    }
    this.pubsubTracker.track(slices)

    // if we're tracking a slice, make it discoverable
    this.ksnDriver.announce(slices)
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice: any) {
    let tracking = this.isBridge ? await this.bridgeTracker.isTracking(slice) : true
    if (tracking) return this.pubsubTracker.isTracking(slice)
    return false
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publish (slice: any) {
    // bridge doesn't implement publishSlice
    this.pubsubTracker.publish(slice)
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
  async getSlice (sliceId: any) {
    try {
      const slice = await this.slicesStore.getById(sliceId)
      return slice // won't catch if just returned
    } catch (e) {
      log(e)
      if (this.isBridge) {
        this.track([sliceId])
        return this.bridgeTracker.getSlice(sliceId)
      }

      return (await this._resolveSlice(sliceId))[0]
    }
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
      log(e)
    }
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} number
   * @param {SliceId} slice
   */
  async getSliceForBlock (number: any, slice: { path: any; depth: any; }) {
    let _slice = new SliceId(slice.path, slice.depth)
    const block = await this.ksnDriver.getBlockByNumber(number)
    if (block) {
      _slice.root = block.header.stateRoot.toString('hex')
      return this.getSlice(_slice)
    }
  }

  async _resolveSlice (slice: any) {
    // track the slice if not tracking already
    if (!await this.isTracking(slice)) {
      // track slice, we might already be subscribed to it
      this.track([slice])
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

    await this.blockTracker.start()
    await this.pubsubTracker.start()
  }

  async stop () {
    if (this.isBridge) {
      await this.bridgeTracker.stop()
    }

    await this.blockTracker.stop()
    await this.pubsubTracker.stop()
  }
}