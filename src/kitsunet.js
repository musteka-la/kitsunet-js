'use strict'

const EE = require('safe-event-emitter')

class Kitsunet extends EE {
  constructor (sliceManager, kitsunetDriver) {
    super()
    this.sliceManager = sliceManager
    this.kitsunetDriver = kitsunetDriver
  }

  /**
  * Get a slice
  *
  * @param {SliceId} slice - the slice to return
  * @return {Slice}
  */
  async getSlice (slice) {
    this.sliceManager.getSlice(slice)
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
   * @param {Number} block - the block number to get the slice for
   */
  async getSliceForBlock (block) {
    this.sliceManager.getSliceForBlock(block)
  }

  /**
 * Get the slice for a block hash
 *
 * @param {Number} blockHash - the block hash to get the slice for
 */
  async getSliceForBlockHash (blockHash) {
    this.sliceManager.getSliceForBlockHash(blockHash)
  }

  async start () {
    // driver should be started first,
    // it loads up libp2p node and other
    // essentials
    await this.kitsunetDriver.start()
    await this.sliceManager.start()
  }

  async stop () {
    await this.sliceManager.stop()
    await this.kitsunetDriver.stop()
  }
}

module.exports = Kitsunet
