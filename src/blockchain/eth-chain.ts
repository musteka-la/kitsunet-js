'use strict'

import BN from 'bn.js'
import Debug from 'debug'
import { Block, Blockchain } from 'ethereumjs-blockchain'
import Common from 'ethereumjs-common'
import * as genesisStates from 'ethereumjs-common/dist/genesisStates'
import { EventEmitter as EE } from 'events'
import level from 'level'
import { LevelUp } from 'levelup'
import { register } from 'opium-decorators'
import { promisify, PromisifyAll } from 'promisify-this'
import { IBlockchain } from './interfaces'

const debug = Debug(`kitsunet:blockchain:eth-chain`)

type Header = Block.Header

@register()
export class EthChain extends EE implements IBlockchain {
  private blockchain: PromisifyAll<Blockchain>
  public common: Common
  public db: LevelUp

  @register(Blockchain)
  static blockChain (common: Common,
                     @register('chain-db')
                     db: LevelUp): PromisifyAll<Blockchain> {
    return promisify<Blockchain>(new Blockchain({ db, validate: false, common }))
  }

  @register(Common)
  static common (@register('options') options: any): Common {
    return new Common(options.ethNetwork)
  }

  @register('chain-db')
  static async getChainDb (@register('options') options: any): Promise<LevelUp> {
    return level(options.ethChainDb) as LevelUp
  }

  /**
   * Create a blockchain
   *
   * @param {Object} options
   * @param {Blockchain} Options.blockchain
   * @param {BaseSync} Options.sync
   */
  constructor (blockchain: Blockchain,
               common: Common,
               @register('chain-db')
               db: LevelUp) {
    super()
    this.blockchain = blockchain as unknown as PromisifyAll<Blockchain>
    this.common = common
    this.db = db
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getBlocksTD (): Promise<BN> {
    try {
      const block: Block | undefined = await this.getLatestBlock()
      if (block) return await this.blockchain.getTd(block.header.hash(), new BN(block.header.number)) as BN
    } catch (e) {
      debug(e)
    }
    return new BN(this.common.genesis().difficulty)
  }

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  async getHeadersTD (): Promise<BN> {
    try {
      const header: Block.Header | undefined = await this.getLatestHeader()
      if (header) return await this.blockchain.getTd(header.hash(), header.number) as BN
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
      const block: Block = await this.blockchain.getLatestBlock() as Block
      if (block) return new BN(block.header.number)
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
      const header: Block.Header = await this.blockchain.getLatestHeader() as Block.Header
      if (header) return new BN(header.number)
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
      return await this.blockchain.getLatestHeader() as T
    } catch (e) {
      debug(e)
    }
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
  }

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {Array<Header>} - an array of blocks
   */
  async getHeaders<T> (blockId: Buffer | BN | number,
                       maxBlocks: number = 25,
                       skip: number = 0,
                       reverse: boolean = false): Promise<T[] | undefined> {
    try {
      const blocks = await this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse)
      return (blocks as unknown as Block[]).map(b => b.header)
    } catch (e) {
      debug(e)
    }
  }

  /**
   * Put blocks to the blockchain
   *
   * @param {Block} block
   */
  async putBlocks<T> (block: T[]): Promise<void> {
    await this.blockchain.putBlocks(block)
  }

  /**
   * Put headers to the blockchain
   *
   * @param {Header} header
   */
  async putHeaders<T> (header: T[]): Promise<void> {
    await this.blockchain.putHeaders(header)
  }

  async getBestBlock<T> (): Promise<T> {
    const block: Block | undefined = await this.getLatestBlock()
    if (block) return block as unknown as T
    return new Block(genesisStates.genesisStateById(this.common.networkId())) as unknown as T
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

  async start (): Promise<void> {
    if (this.db.isClosed()) {
      return this.db.open()
    }
  }

  async stop (): Promise<void> {
    if (!this.db.isClosed()) {
      return this.db.close()
    }
  }
}
