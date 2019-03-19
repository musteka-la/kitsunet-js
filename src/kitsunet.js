'use strict'

const EE = require('safe-event-emitter')

class Kitsunet extends EE {
  constructor (sliceManager, driver) {
    super()
    this.sliceManager = sliceManager
    this.driver = driver
  }

  /**
  * Get a slice
  *
  * @param {SliceId} slice - the slice to return
  * @return {Slice}
  */
  async getSlice (slice) {
    this._sliceManager.getSlice(slice)
  }

  /**
   * Get the latest slice
   *
   * @return {Slice}
   */
  async getLatestSlice () {
    return this._sliceManager.getLatestSlice()
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block - the block number to get the slice for
   */
  async getSliceForBlock (block) {
    this._sliceManager.getSliceForBlock(block)
  }

  /**
 * Get the slice for a block hash
 *
 * @param {Number} blockHash - the block hash to get the slice for
 */
  async getSliceForBlockHash (blockHash) {
    this._sliceManager.getSliceForBlockHash(blockHash)
  }

  async start () {
    await this._sliceManager.start()
    await this._driver.start()
  }

  async stop () {
    await this._sliceManager.stop()
    await this._driver.stop()
  }
}

module.exports = Kitsunet
