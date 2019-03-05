'use strict'

const EE = require('safe-event-emitter')

class KitsunetClient extends EE {
  constructor (driver) {
    super()
    this.driver = driver
  }

  /**
 * Get the slice by its id
 *
 * @param {SliceId} id - the id of the slice
 * @return {Slice}
 */
  async getSliceById (slice) {
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
 * @param {Number} block - the block hash to get the slice for
 */
  async getSliceForBlockHash (blockHash) {
  }
}

module.exports = KitsunetClient
