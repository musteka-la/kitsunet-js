'use strict'

import { EventEmitter as EE } from 'events'
import { IBlockchain } from './interfaces'
import { promisify, PromisifyAll } from 'promisify-this'
import { register } from 'opium-decorators'
import { LevelUp } from 'levelup'
import BN from 'bn.js'
import Block from 'ethereumjs-block'
import Blockchain from 'ethereumjs-blockchain'
import level from 'level'
import Common from 'ethereumjs-common'
import Debug from 'debug'

const debug = Debug(`kitsunet:blockchain:eth-chain`)

type Header = typeof Block.Header

@register()
export class EthChain extends EE implements IBlockchain {
  private blockchain: PromisifyAll<Blockchain>
  public common: Common

  @register(Blockchain)
  static blockChain (@register('chain-db')
                     db: LevelUp,
                     common: Common): PromisifyAll<Blockchain> {
    return promisify<Blockchain>(new Blockchain({ db, common, validate: false }))
  }

  @register(Common)
  static common (@register('options')
                 options: any): Common {
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
    try {
      const block: Block | undefined = await this.getLatestBlock()
      if (block) return await this.blockchain.getTd(block.header.hash, block.header.number) as unknown as BN
    } catch (e) {
      debug(e)
    }
    return new BN(0)
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getHeadersTD (): Promise<BN> {
    try {
      const header: any = await this.getLatestHeader()
      return await this.blockchain.getTd(header.hash, header.number) as unknown as BN
    } catch (e) {
      debug(e)
    }
    return new BN(0)
  }

  /**
   * Get the current blocks height
   */
  async getBlocksHeight (): Promise<BN> {
    try {
      return new BN((await this.blockchain.getLatestBlock() as Block).header.number)
    } catch (e) {
      debug(e)
    }

    return new BN(0)
  }

  /**
   * Get the current header height
   */
  async getHeadersHeight (): Promise<BN> {
    try {
      return new BN((await this.blockchain.getLatestHeader() as any).number)
    } catch (e) {
      debug(e)
    }

    return new BN(0)
  }

  /**
   * Get latest header
   *
   * @returns {Array<Header>}
   */
  async getLatestHeader<T> (): Promise<T | undefined> {
    try {
      return await this.blockchain.getLatestHeader() as unknown as T
    } catch (e) {
      debug(e)
    }

    return
  }

  /**
   * Get latest block
   *
   * @returns {Array<Block>}
   */
  async getLatestBlock<T> (): Promise<T | undefined> {
    try {
      return await this.blockchain.getLatestBlock() as Promise<T>
    } catch (e) {
      debug(e)
    }

    return
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Block>} - an array of blocks
   */
  async getBlocks<T> (blockId: Buffer | number,
                      maxBlocks: number = 25,
                      skip: number = 0,
                      reverse: boolean = false): Promise<T[] | undefined> {
    try {
      return await this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse) as Promise<T[]>
    } catch (e) {
      debug(e)
    }

    return
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Header>} - an array of blocks
   */
  async getHeaders<T> (blockId: Buffer | number,
                       maxBlocks: number = 25,
                       skip: number = 0,
                       reverse: boolean = false): Promise<T[] | undefined> {
    try {
      const blocks = await this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse)
      return (blocks as unknown as Block[]).map(b => b.header)
    } catch (e) {
      debug(e)
    }

    return
  }

  /**
   * Put blocks to the blockchain
   *
   * @param {Block} block
   */
  async putBlocks<T = Block> (block: T[]): Promise<void> {
    await this.blockchain.putBlocks(block)
  }

  /**
   * Put headers to the blockchain
   *
   * @param {Header} header
   */
  async putHeaders<T = Header> (header: T[]): Promise<void> {
    await this.blockchain.putHeaders(header)
  }

  async getBestBlock<T> (): Promise<T> {
    // TODO: calculate best block
    return new Block() as unknown as T
  }

  getNetworkId (): number {
    return this.common.networkId()
  }

  genesis (): any {
    return this.common.genesis()
  }

  async putCheckpoint (block: Block): Promise<void> {
    await this.blockchain.putCheckpoint(block)
  }
}
