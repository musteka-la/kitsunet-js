'use strict'

import { EventEmitter as EE } from 'events'
import BN from 'bn.js'
import Blockchain from 'ethereumjs-blockchain'
import { IBlockchain } from './interfaces'
import promisify, { PromisifyAll } from 'promisify-this'
import Block from 'ethereumjs-block'
import { register } from 'opium-decorator-resolvers'

type Header = typeof Block.Header

@register()
export class Chain extends EE implements IBlockchain {
  private blockchain: PromisifyAll<Blockchain>

  /**
   * Create a blockchain
   *
   * @param {Object} options
   * @param {Blockchain} Options.blockchain
   * @param {BaseSync} Options.sync
   */
  constructor (blockchain: Blockchain) {
    super()
    this.blockchain = promisify(blockchain)
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getBlocksTD (): Promise<BN> {
    const block: Block = await this.getLatestBlock()
    return this.blockchain.getTd(block.header.hash, block.header.number) as unknown as BN
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getHeadersTD (): Promise<BN> {
    const header: any = await this.getLatestHeader()
    return this.blockchain.getTd(header.hash, header.number) as unknown as BN
  }

  /**
   * Get the current blocks height
   */
  async getBlocksHeight (): Promise<BN> {
    return new BN((await this.blockchain.getLatestBlock() as Block).header.number)
  }

  /**
   * Get the current header height
   */
  async getHeadersHeight (): Promise<BN> {
    return new BN((await this.blockchain.getLatestHeader() as any).number)
  }

  /**
   * Get latest header
   *
   * @returns {Array<Header>}
   */
  async getLatestHeader<Header> (): Promise<Header> {
    return this.blockchain.getLatestHeader() as Promise<Header>
  }

  /**
   * Get latest block
   *
   * @returns {Array<Block>}
   */
  async getLatestBlock<Block> (): Promise<Block> {
    return this.blockchain.getLatestBlock() as Promise<Block>
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Block>} - an array of blocks
   */
  async getBlocks<Block> (blockId: Buffer | number,
                          maxBlocks: number,
                          skip: number,
                          reverse: boolean): Promise <Block[]> {
    return this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse) as Promise<Block[]>
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Header>} - an array of blocks
   */
  async getHeaders<Header> (blockId: Buffer | number,
                            maxBlocks: number,
                            skip: number,
                            reverse: boolean): Promise<Header[] > {
    throw new Error('not implemented!')
  }

  /**
   * Put blocks to the blockchain
   *
   * @param {Block} block
   */
  async putBlocks<Block> (block: Block[]): Promise<any> {
    return this.blockchain.putBlocks(block)
  }

  /**
   * Put headers to the blockchain
   *
   * @param {Header} header
   */
  async putHeader<T> (header: T[]): Promise<any> {
    return this.blockchain.putHeaders(header)
  }
}
