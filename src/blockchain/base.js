'use strict'

const EE = require('events')

class BaseChain extends EE {
  /**
   * Get latest block
   *
   * @returns {Array<Block>}
   */
  async getLatestBlock () {
    throw new Error('not implemented!')
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Block>} - an array of blocks
   */
  async getBlocks (from, max) {
    throw new Error('not implemented!')
  }

  /**
   * Put a block to the blockchain
   *
   * @param {Block} block
   */
  async pubBlocks (block) {
    throw new Error('not implemented!')
  }
}

module.exports = BaseChain
