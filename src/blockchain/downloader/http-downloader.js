'use strict'

const Downloader = require('./downloader')

class HttpDownloader extends Downloader {
  constructor ({ ethQuery, start, max }) {
    super({ start, max })
    this.ethQuery = ethQuery
  }

  /**
  * Get blocks from remote
  *
  * @param {Number} from - get blocks from block number/hash
  * @param {Number} max - max number of blocks to download
  * @returns {Array<Block>}
  */
  async getBlocks (from, max) {
    const blocks = await Promise.all(Array.from({ length: max },
      (_, i) => from + i).map((block) => this.ethQuery.getBlockByNumber(block)))
    this.emit('blocks', blocks)
  }

  /**
  * Get headers from remote
  *
  * @param {Number} from - get headers from block number/hash
  * @param {Number} max - max number of headers to download
  * @returns {Array<Header>}
  */
  async getHeaders (from, max) {
    const headers = await Promise.all(Array.from({ length: max },
      (_, i) => from + i).map((block) => this.ethQuery.getHeaderByNumber(block)))
    this.emit('headers', headers)
  }
}

module.exports = HttpDownloader
