'use strict'

const EE = require('events')

const { SliceId } = require('./slice')

const DEFUALT_DEPTH = 10

class Kitsunet extends EE {
  constructor (sliceManager, kitsunetDriver, depth) {
    super()
    this.sliceManager = sliceManager
    this.kitsunetDriver = kitsunetDriver
    this.depth = depth || DEFUALT_DEPTH
  }

  get node () {
    return this.kitsunetDriver.node
  }

  get peerInfo () {
    return this.kitsunetDriver.peerInfo
  }

  get blockTracker () {
    return this.sliceManager.blockTracker
  }

  get peers () {
    return this.kitsunetDriver.peers
  }

  /**
  * Get a slice
  *
  * @param {SliceId|String} slice - the slice to return
  * @return {Slice}
  */
  async getSlice (slice) {
    if (typeof slice === 'string') {
      slice = new SliceId(slice)
    }

    return this.sliceManager.getSlice(slice)
  }

  /**
   * Get the latest slice
   *
   * @return {Slice}
   */
  async getLatestSlice () {
    return this.sliceManager.getLatestSlice()
  }

  /**
   * Get the slice for a block
   *
   * @param {String|Number} blockRef - the block tag to get the slice for
   * @param {SliceId|String} slice - the slice id to retrieve
   */
  async getSliceForBlock (blockRef, slice) {
    if (typeof slice === 'string') {
      slice = new SliceId(slice)
    }

    return this.sliceManager.getSliceForBlock(blockRef, slice)
  }

  async start () {
    await this.kitsunetDriver.start()
    await this.sliceManager.start()
  }

  async stop () {
    await this.sliceManager.stop()
    await this.kitsunetDriver.stop()
  }
}

module.exports = Kitsunet
