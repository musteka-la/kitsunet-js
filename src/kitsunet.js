'use strict'

const EE = require('safe-event-emitter')

class Kitsunet extends EE {
  constructor (sliceManager) {
    super()
    this._sliceManager = sliceManager
  }

  /**
  * Get a slice
  *
  * @param {SliceId} slice - the slice to return
  * @return {Slice}
  */
  async getSlice (slice) {
  }

  /**
   * Get the latest slice
   *
   * @return {Slice}
   */
  async getLatestSlice () {
  }

  /**
   * Get the slice for a block
   *
   * @param {Number} block - the block number to get the slice for
   */
  async getSliceForBlock (block) {
  }

  /**
 * Get the slice for a block hash
 *
 * @param {Number} blockHash - the block hash to get the slice for
 */
  async getSliceForBlockHash (blockHash) {
  }
}

module.exports = Kitsunet
