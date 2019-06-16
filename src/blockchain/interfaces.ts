'use strict'
import BN from 'bn.js'
import Block from 'ethereumjs-block'

export interface IBlockchain {
  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  getBlocksTD (): Promise<BN>

  /**
   * Get the total difficulty of the chain
   *
   * @returns {Number}
   */
  getHeadersTD (): Promise<BN>

  /**
   * Get the current blocks height
   */
  getBlocksHeight (): Promise<BN>

  /**
   * Get the current header height
   */
  getHeadersHeight (): Promise<BN>

  /**
   * Get latest header
   *
   * @returns {Header[]}
   */
  getLatestHeader<T> (): Promise<T | undefined>

  /**
   * Get latest block
   *
   * @returns {Block[]}
   */
  getLatestBlock<T> (): Promise<T | undefined>

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {T[]} - an array of blocks
   */
  getBlocks<T> (blockId: Buffer | number,
                maxBlocks?: number,
                skip?: number,
                reverse?: boolean): Promise<T[] | undefined>

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {T} - an array of blocks
   */
  getHeaders<T> (blockId: Buffer | number,
                 maxBlocks?: number,
                 skip?: number,
                 reverse?: boolean): Promise<T[] | undefined>

  /**
   * Get the chains best block
   */
  getBestBlock<T> (): Promise<T | undefined>

  /**
   * Put blocks to the blockchain
   *
   * @param {T} block
   */
  putBlocks<T> (block: T[]): Promise<void>

  /**
   * Put headers to the blockchain
   *
   * @param {T} header
   */
  putHeaders<T> (header: T[]): Promise<void>

  /**
   * Get the network id
   */
  getNetworkId (): number

  /**
   * Get the chain genesis
   */
  genesis (): any

  /**
   * Set a checkpoint block. This allows to sync
   * starting from that block as opposed to syncing
   * the full header/block chain.
   *
   * @param block - the block to use as checkpoint
   */
  putCheckpoint (block: Block): Promise<void>

  /**
   * Perfom initialization
   */
  start (): Promise<void>

  /**
   * Perform cleanup
   */
  stop (): Promise<void>
}
