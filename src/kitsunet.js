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

    this.sliceManager.blockTracker.on('latest', (block) => this.emit('latest', block))
    this.sliceManager.blockTracker.on('sync', ({ block, oldBlock }) => this.emit('sync', { block, oldBlock }))
  }

  get node () {
    return this.kitsunetDriver.node
  }

  get peerInfo () {
    return this.kitsunetDriver.peerInfo
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
    return this.kitsunetDriver.getLatestBlock()
  }

  /**
   * Get a block by number
   *
   * @param {String|Number} block - the block number, if string is passed assumed to be in hex
   */
  async getBlockByNumber (block) {
    return this.kitsunetDriver.getBlockByNumber(block)
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
