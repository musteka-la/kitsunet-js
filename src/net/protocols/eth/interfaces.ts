'use strict'

import Block from 'ethereumjs-block'
import Tx from 'ethereumjs-tx'
import BN from 'bn.js'
import { ETH } from 'ethereumjs-devp2p'

// Placeholder interface, should be exposed by ethereumjs
export interface BlockBody {
  hash: string        // block hash
  transactions: Tx[]  // transactions
  uncles: Block[]     // uncles
}

export interface BaseMessage {
  code?: ETH.MESSAGE_CODES
}

export interface Status extends BaseMessage {
  protocolVersion: number
  networkId: number
  td: BN
  bestHash: Buffer
  genesisHash: string
  number?: BN
}

export interface BlockHeadersMsg extends BaseMessage {
  block: Buffer | BN
  max: number
  skip: number
  reverse: boolean
}

export interface IEthProtocol {
  getStatus (): Promise<Status>
  setStatus (status: Status): Promise<void>
  sendNewHashes (hashes: string[] | Buffer[]): Promise<void>
  getHeaders (block: number, max: number, skip?: number, reverse?: boolean): AsyncIterable<Block.Header[]>
  getBlockBodies (hashes: string[] | Buffer[]): AsyncIterable<BlockBody[]>
}
