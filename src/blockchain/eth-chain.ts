'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import Blockchain from 'ethereumjs-blockchain'
import { EventEmitter as EE } from 'events'
import { IBlockchain } from './interfaces'
import { promisify, PromisifyAll } from 'promisify-this'
import { register } from 'opium-decorators'
import { LevelUp } from 'levelup'
import level from 'level'
import Common from 'ethereumjs-common'

type Header = typeof Block.Header

@register()
export class EthChain extends EE implements IBlockchain {
  private blockchain: PromisifyAll<Blockchain>
  public common: Common

  @register(Blockchain)
  static blockChain (@register('chain-db')
                     db: LevelUp,
                     common: Common): PromisifyAll<Blockchain> {
    return promisify(new Blockchain({ db, common, validate: false }))
  }

  @register(Common)
  static common (@register('options') options: any): Common {
    return new Common(options.ethNetwork)
  }

  @register('chain-db')
  static getChainDb (@register('options')
                     options: any): LevelUp {
    return level(options.ethChainDb) as LevelUp
  }

  /**
   * Create a blockchain
   *
   * @param {Object} options
   * @param {Blockchain} Options.blockchain
   * @param {BaseSync} Options.sync
   */
  constructor (blockchain: Blockchain, common: Common) {
    super()
    this.blockchain = blockchain as unknown as PromisifyAll<Blockchain>
    this.common = common
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
                          maxBlocks: number = 25,
                          skip: number = 0,
                          reverse: boolean = false): Promise <Block[]> {
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
                            maxBlocks: number = 25,
                            skip: number = 0,
                            reverse: boolean = false): Promise<Header[] > {
    const blocks = await this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse)
    return (blocks as unknown as Block[]).map(b => b.header)
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
  async putHeaders<T> (header: T[]): Promise<void> {
    await this.blockchain.putHeaders(header)
  }

  async getBestBlock<Block> (): Promise<Block> {
    // TODO: calculate best block
    return this.common.genesis().block
  }

  getNetworkId (): number {
    throw new Error('Method not implemented.')
  }

  genesis (): any {
    return this.common.genesis()
  }

  async putCheckpoint (block: Block): Promise<void> {
    await this.blockchain.putCheckpoint(block)
  }
}
