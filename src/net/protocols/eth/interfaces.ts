'use strict'

import Block from 'ethereumjs-block'
import Tx from 'ethereumjs-tx'
import BN from 'bn.js'
import { ETH_MESSAGE_CODES } from 'ethereumjs-devp2p'

// Placeholder interface, should be exposed by ethereumjs
export interface BlockBody {
  hash: string        // block hash
  transactions: Tx[]  // transactions
  uncles: Block[]     // uncles
}

export interface BaseMessage {
  code?: ETH_MESSAGE_CODES
}

export interface Status extends BaseMessage {
  protocolVersion: number
  networkId: number
  td: BN
  bestHash: Buffer
  genesisHash: Buffer
  number: BN
}

export interface BlockHeadersMsg extends BaseMessage {
  block: Buffer | BN
  max: number
  skip: number
  reverse: boolean
}

export interface IEthProtocol {
  status: Status
  handshake (): Promise<Status>
  sendNewHashes (hashes: string[] | Buffer[]): Promise<void>
  getBlockHeaders (block: number, max: number, skip?: number, reverse?: boolean): AsyncIterable<Block[]>
  getBlockBodies (hashes: string[] | Buffer[]): AsyncIterable<BlockBody[]>
}
