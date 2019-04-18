'use strict'

const EE = require('events')

const MAX_BLOCKS_DOWNLOAD = 128

/**
 * Base class that all Sync classes implement
 *
 * @fires blocks - an event with the latest fetched blocks
 * @fires headers - an event with the latest fetched headers
 */
class Downloader extends EE {
  /**
   * @param {Object} Options - options object
   * @param {Number} Options.start - where to start fetching from
   */
  constructor ({ start, max }) {
    super()
    this.start = start
    this.max = max || MAX_BLOCKS_DOWNLOAD
  }

  /**
   * Get blocks from remote
   *
   * @param {Number} from - get blocks from block number/hash
   * @param {Number} max - max number of blocks to download
   * @returns {Array<Block>}
   */
  async getBlocks (from, max) {
    throw new Error('not implemented!')
  }

  /**
  * Get headers from remote
  *
  * @param {Number} from - get headers from block number/hash
  * @param {Number} max - max number of headers to download
  * @returns {Array<Header>}
  */
  async getHeaders (from, max) {
    throw new Error('not implemented!')
  }

  /**
   * Create a stream that will deliver blocks
   *
   * @param {Number} from - get headers from block number/hash
   * @param {Number} max - max number of headers to download
   */
  async getBlocksStream (from, max) {
    throw new Error('not implemented!')
  }

  /**
  * Create a stream that will deliver blocks
  *
  * @param {Number} from - get headers from block number/hash
  * @param {Number} max - max number of headers to download
  */
  async getHeadersStream (from, max) {
    throw new Error('not implemented!')
  }

  /**
   * Start sync
   */
  start () {
    throw new Error('not implemented!')
  }

  /**
   * Stop sync
   */
  stop () {
    throw new Error('not implemented!')
  }
}

module.exports = Downloader
