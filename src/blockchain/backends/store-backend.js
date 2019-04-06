'use strict'

const EE = require('events')

class StoreBackend extends EE {
  constructor ({ db }) {
    super()
    this.db = db
  }

  /**
   * Get latest block
   *
   * @returns {Array<Block>}
   */
  async getLatestBlock () {
    this.db.get()
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Block>} - an array of blocks
   */
  async getBlocks (from, max) {
    this.db.get()
  }

  /**
   * Put a block to the blockchain
   *
   * @param {Block} block
   */
  async pubBlock (block) {
    this.db.put()
  }
}

module.exports = StoreBackend
