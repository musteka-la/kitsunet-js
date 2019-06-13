'use strict'

import Libp2p from 'libp2p'
import Cache from 'lru-cache'
import { BaseTracker } from './base'
import { Slice, SliceId } from '../'
import { register } from 'opium-decorators'

import debug from 'debug'
const log = debug('kitsunet:kitsunet-pubsub-tracker')

const DEFAULT_TOPIC_NAMESPACE: string = `/kitsunet/slice`
const DEFAULT_SLICE_TIMEOUT: number = 300 * 1000
const DEFAULT_DEPTH: number = 10

type SliceCache = Cache<string, any>

const createCache = (options = { max: 100, maxAge: DEFAULT_SLICE_TIMEOUT }): SliceCache => {
  return new Cache(options)
}

@register()
export class KitsunetPubSub extends BaseTracker {
  multicast: any
  node: any
  namespace: string = DEFAULT_TOPIC_NAMESPACE
  depth: number = DEFAULT_DEPTH
  forwardedSlicesCache: SliceCache
  isStarted: boolean = false

  @register('default-namespace')
  static defaultNamespace (): string {
    return DEFAULT_TOPIC_NAMESPACE
  }

  @register('default-timeout')
  static defaultSliceTimeout (): number {
    return DEFAULT_SLICE_TIMEOUT
  }

  constructor (node: Libp2p,
               @register('default-namespace')
               namespace?: string,
               @register('default-timeout')
               depth?: number,
               @register('default-slices')
               slices?: Set<Slice>) {
    super(slices)
    this.multicast = node.multicast
    this.node = node
    this.namespace = namespace || DEFAULT_TOPIC_NAMESPACE
    this.depth = depth || DEFAULT_DEPTH
    this.forwardedSlicesCache = createCache()

    this.slicesHook = this.slicesHook.bind(this)
    this.handleSlice = this.handleSlice.bind(this)
  }

  /**
   * Helper to subscribe to a slice
   *
   * @param {Slice} slice - slice to subscribe to
   */
  private subscribe (slice) {
    this.multicast.addFrwdHooks(this.makeSliceTopic(slice), [this.slicesHook])
    this.multicast.subscribe(this.makeSliceTopic(slice), this.handleSlice)
  }

  /**
   * Helper to unsubscribe from a slice
   *
   * @param {Slice} slice - slice to unsubscribe from
   */
  private unsubscribe (slice) {
    this.multicast.removeFrwdHooks(this.makeSliceTopic(slice), [this.slicesHook])
    this.multicast.unsubscribe(this.makeSliceTopic(slice), this.handleSlice)
  }

  /**
   * Helper to make a slice topic
   *
   * @param {Slice|SliceId} slice - a Slice object
   * @returns {String} - a slice topic
   */
  private makeSliceTopic (slice) {
    const { path, depth } = slice
    return `${this.namespace}/${path}-${depth || this.depth}`
  }

  /**
   * This is a hook that will be triggered on each pubsub message.
   *
   * This check if the slice has been already forwarded. This is
   * to check for duplicates at the application level, regardless of the msg id.
   *
   * @param {PeerInfo} peer - the peer sending the message
   * @param {Msg} msg - the pubsub message
   * @param {Function} cb - callback
   * @returns {Function}
   */
  private slicesHook (peer, msg, cb) {
    let slice: Slice
    try {
      slice = new Slice(msg.data)
      if (!slice) {
        return cb(new Error(`No slice in message!`))
      }
    } catch (err) {
      log(err)
      return cb(err)
    }

    const peerId = peer.info.id.toB58String()
    const slices = this.forwardedSlicesCache.get(peerId) || createCache()
    if (!slices.has(slice.id)) {
      slices.set(slice.id, true)
      this.forwardedSlicesCache.set(peerId, slices)
      return cb(null, msg)
    }

    const skipMsg = `already forwarded to peer ${peerId}, skipping slice ${slice.id}`
    log(skipMsg)
    return cb(skipMsg)
  }

  /**
   * Handle incoming pubsub messages.
   *
   * @param {Msg} msg - the pubsub message
   */
  private handleSlice (msg) {
    try {
      this.emit(`slice`, new Slice(msg.data))
    } catch (err) {
      log(err)
    }
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>} slices - the slices to stop tracking
   */
  async untrack (slices: Set<Slice>) {
    slices.forEach(async (slice) => {
      this.unsubscribe(slice)
      this.slices.delete(slice)
    })
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    this.slices = new Set([...this.slices, ...slices])

    if (!this.isStarted) return

    this.slices.forEach(async (slice) => {
      if (await this.isTracking(slice)) return
      this.subscribe(slice)
      this.slices.add(slice)
    })
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    return (this.slices.has(slice) &&
      (await this.multicast.ls()).indexOf(this.makeSliceTopic(slice)) > -1)
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publish (slice) {
    if (!this.isTracking(slice)) {
      await this.track([slice])
    }
    this.multicast.publish(this.makeSliceTopic(slice), slice.serialize())
  }

  getSlice (slice: SliceId): Promise<Slice> {
    throw new Error('Method not implemented.')
  }

  async start () {
    this.isStarted = true
    // track once libp2p is started
    await this.track(this.slices)
  }

  async stop () {
    await this.untrack(this.slices)
    this.isStarted = false
  }
}
