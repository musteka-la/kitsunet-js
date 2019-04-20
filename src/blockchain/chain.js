'use strict'

const EE = require('events')
const BN = require('bn.js')

class Chain extends EE {
  /**
   * Create a blockchain
   *
   * @param {Object} options
   * @param {Blockchain} Options.blockchain
   * @param {BaseSync} Options.sync
   */
  constructor ({ blockchain }) {
    super()
    this.blockchain = blockchain
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getBlocksTD () {
    const block = this.getLatestBlock()
    return this.blockchain.getTD(block.header.hash, block.header.number)
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getHeadersTD () {
    const header = this.getLatestHeader()
    return this.blockchain.getTD(header.hash, header.number)
  }

  /**
   * Get the current blocks height
   */
  async getBlocksHeight () {
    return new BN((await this.blockchain.getLatestBlock()).number)
  }

  /**
   * Get the current header height
   */
  async getHeadersHeight () {
    return new BN((await this.blockchain.getLatestHeader()).number)
  }

  /**
   * Get latest header
   *
   * @returns {Array<Header>}
   */
  async getLatestHeader () {
    return this.blockchain.getLatestHeader()
  }

  /**
   * Get latest block
   *
   * @returns {Array<Block>}
   */
  async getLatestBlock () {
    return this.blockchain.getLatestBlock()
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Block>} - an array of blocks
   */
  async getBlocks (from, max) {
    return this.blockchain.getBlocks(from, max)
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Header>} - an array of blocks
   */
  async getHeaders (from, max) {
    return this.blockchain.getHeaders(from, max)
  }

  /**
   * Put blocks to the blockchain
   *
   * @param {Block} block
   */
  async pubBlocks (block) {
    this.blockchain.pubBlocks(block)
  }

  /**
   * Put headers to the blockchain
   *
   * @param {Header} header
   */
  async pubHeader (header) {
    this.blockchain.pubHeaders(header)
  }
}

module.exports = Chain
