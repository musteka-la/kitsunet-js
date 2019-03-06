'use strict'

const EE = require('safe-event-emitter')
const { fetcher } = require('../slice-fetcher')

const normalizeKeys = require('normalize-keys')

const log = require('debug')('kitsunet:kitsunet-bridge-tracker')

class KitsunetBridge extends EE {
  constructor (bridgeUrl, slices) {
    super()
    this.slices = new Set(slices)
    this.bridgeUrl = bridgeUrl

    this.fetcher = fetcher(this.bridgeUrl)

    /**
     * Handle blocks via the `latest` event
     * 
     * TODO: this is probably better handled with an explicit method
     * such as publish/push/etc... Events are really the wrong thing!!
     */
    const blockHandler = async (block) => {
      this.slices.forEach(async (slice) => {
        const { path, depth, isStorage } = slice
        const fetchedSlice = await this.fetchSlice({
          path,
          depth,
          root: block.stateRoot,
          isStorage
        })
        this.emit('slice', normalizeKeys(fetchedSlice))
      })
    }

    this._blockHandler = blockHandler.bind(this)
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
   */
  async untrackSlices (slices) {
    slices = Set.isSet(slices) ? slices : [slices]
    slices.forEach((slice) => this.slices.delete(slice))
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async trackSlices (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    this.slices = new Set(this.slices, slices)
  }

  /**
   * Fetch a slice from the Ethereum RPC
   *
   * @param {SliceId} param - the slice id to fetch
   */
  async _fetchSlice (slice) {
    const { path, depth, root, isStorage } = slice
    return this.fetcher({ path, depth, root, isStorage })
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    return this.slices.has(slice)
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publishSlice (slice) {
    // noop
  }

  async start () {
    this.on('latest', this._blockHandler)
  }

  async stop () {
    this.removeListener('latest', this._blockHandler)
  }
}

module.exports = KitsunetBridge
