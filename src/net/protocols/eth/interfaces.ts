'use strict'

import Block from 'ethereumjs-block'
import Tx from 'ethereumjs-tx'

// Placeholder interface, should be exposed by ethereumjs
export interface BlockBody {
  hash: string        // block hash
  transactions: Tx[]  // transactions
  uncles: Block[]     // uncles
}

export interface IEthProtocol {
  newHashes (): AsyncIterable<string[]>
  getBlockHeaders (block: number, max: number, skip?: number, reverse?: boolean): Promise<Block[]>
  getBlockBodies (hashes: string[]): Promise<BlockBody[]>
}
