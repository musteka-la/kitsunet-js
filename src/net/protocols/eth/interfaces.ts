'use strict'

import Block from 'ethereumjs-block'
import Tx from 'ethereumjs-tx'
import BN from 'bn.js'

export enum ProtocolCodes {
  Status = 0x00,
  NewBlockHashes = 0x01,
  Transactions = 0x002,
  GetBlockHeaders = 0x003,
  BlockHeaders = 0x004,
  GetBlockBodies = 0x005,
  BlockBodies = 0x006,
  NewBlock = 0x007,
  GetNodeData = 0x008,
  NodeData = 0x0e,
  GetReceipts = 0x0f,
  Receipts = 0x10
}

// Placeholder interface, should be exposed by ethereumjs
export interface BlockBody {
  hash: string        // block hash
  transactions: Tx[]  // transactions
  uncles: Block[]     // uncles
}

export interface BaseMessage {
  code?: ProtocolCodes
}

export interface Status extends BaseMessage {
  protocolVersion: number
  networkId: number
  td: BN
  bestHash: BN
  genesisHash: BN
  number: number
}

export interface BlockHeadersMsg extends BaseMessage {
  block: Block
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
