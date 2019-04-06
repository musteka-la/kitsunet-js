'use strict'

const StoreBackend = require('./store-backend')
const promisify = require('promisify-this')

class EthRpcBackend extends StoreBackend {
  constructor ({ db, ethQuery }) {
    super({ db })
    this.ethQuery = promisify(ethQuery)
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - number of blocks to return
   * @returns {Array<Block>} - an array of blocks
   */
  async getBlocks (from, max) {
    let blocks = await super.getBlocks(from, max)
    if (blocks && blocks.length) return blocks
    // generate array range
    blocks = await Promise.all(Array.from({ length: max }, (_, i) => from + i)
      .map((block) => this.ethQuery.getBlockByNumber(block)))
    await Promise.all(blocks.map((block) => this.pubBlock(block)))
    return blocks
  }
}

module.exports = EthRpcBackend
