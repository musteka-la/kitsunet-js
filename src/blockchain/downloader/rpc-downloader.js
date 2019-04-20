'use strict'

const Downloader = require('./downloader')

const parallelLimit = require('async/parallelLimit')
const nextTick = require('async/nextTick')

function _mkRangeArray (from, max) {
  return Array.from({ length: max }, (_, i) => from + i)
}

const DEFAULT_CONCURRENCY = 3

class RpcDownloader extends Downloader {
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
    return new Promise((resolve, reject) => {
      parallelLimit(_mkRangeArray(from, max || this.maxBlocks)
        .map((number) => () => this.ethQuery.getBlockByNumber(number)),
      DEFAULT_CONCURRENCY,
      (err, blocks) => {
        if (err) return reject(err)
        nextTick(() => this.emit('blocks', blocks))
        resolve(blocks)
      })
    })
  }

  /**
  * Get headers from remote
  *
  * @param {Number} from - get headers from block number/hash
  * @param {Number} max - max number of headers to download
  * @returns {Array<Header>}
  */
  async getHeaders (from, max) {
    return new Promise((resolve, reject) => {
      parallelLimit(_mkRangeArray(from, max || this.maxBlocks)
        .map((number) => () => this.ethQuery.getBlockByNumber(number)),
      DEFAULT_CONCURRENCY,
      (err, headers) => {
        if (err) return reject(err)
        nextTick(() => this.emit('headers', headers))
        resolve(headers)
      })
    })
  }
}

module.exports = RpcDownloader
