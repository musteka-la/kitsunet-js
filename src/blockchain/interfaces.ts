'use strict'
import BN from 'bn.js'

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
  getLatestHeader<T> (): Promise <T>

  /**
   * Get latest block
   *
   * @returns {Block[]}
   */
  getLatestBlock<T> (): Promise <T>

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {T[]} - an array of blocks
   */
  getBlocks<T> (blockId: Buffer | number, maxBlocks: number, skip: number, reverse: boolean): Promise <T[]>

  /**
   * Get an array of blocks
   *
   * @param {Number|String} from - block number or hash
   * @param {Number} max - how many blocks to return
   * @returns {T} - an array of blocks
   */
  getHeaders<T> (blockId: Buffer | number, maxBlocks: number, skip: number, reverse: boolean): Promise <T[]>

  /**
   * Put blocks to the blockchain
   *
   * @param {T} block
   */
  putBlocks<T> (block: T[]): Promise<any>

  /**
   * Put headers to the blockchain
   *
   * @param {T} header
   */
  putHeader<T> (header: T[]): Promise<any>
}
