'use strict'

import { EventEmitter as EE } from 'events'
import BN from 'bn.js'

export const MAX_BLOCKS_DOWNLOAD: number = 128

/**
 * Base class that all Sync classes implement
 *
 * @fires blocks - an event with the latest fetched blocks
 * @fires headers - an event with the latest fetched headers
 */
export abstract class Downloader extends EE {
  /**
   * Get blocks from remote
   *
   * @param {Number} from - get blocks from block number/hash
   * @param {Number} max - max number of blocks to download
   * @returns {Array<Block>}
   */
  abstract async getBlocks (from: BN | number, max: BN | number): Promise<Array<any>>

  /**
   * Get headers from remote
   *
   * @param {Number} from - get headers from block number/hash
   * @param {Number} max - max number of headers to download
   * @returns {Promise<Array<Header>>}
   */
  abstract async getHeaders (from: BN | number, max: BN | number): Promise<Array<any>>
}
