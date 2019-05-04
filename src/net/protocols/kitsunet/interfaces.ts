'use strict'

import Block from 'ethereumjs-block'
import { NodeType } from '../../../constants'
import { Slice } from '../../../slice'

export { NodeType }
export type BlockHeader = typeof Block.Header

export enum MsgType {
  UNKNOWN_MSG   = 0,
  IDENTIFY      = 1,
  SLICES        = 2,
  SLICE_ID      = 3,
  HEADERS       = 4,
  LATEST_BLOCK  = 5,
  NODE_TYPE     = 6,
  PING          = 7
}

export enum Status {
  UNKNOWN_ERROR = 0,
  OK            = 1,
  ERROR         = 2
}

export interface KsnMsg {
  type: MsgType   // the message type
  payload: Data   // the data of the request/response
}

export interface KsnResponse extends KsnMsg {
  status?: Status   // only used for responses - OK for success ERROR for errors
  error?: string    // only used for responses - if status == ERROR, this might contain an error string
}

export type Message = KsnMsg | KsnResponse

export interface Identify {
  version: string       // e.g. kitsunet-js/0.0.1
  userAgent: string     // e.g. kitsunet-js/0.0.1
  nodeType: NodeType    // the node type - bridge, edge, normal
  latestBlock: number   // block number
  sliceIds: string[]     // a list of slice name 0xXXXX-XX that this peer tracks, can be incomplete
}

export interface Data {
  identify: Identify
  slices: any[]
  headers: BlockHeader[]
  type: NodeType
  sliceIds: string[]
  latestBlock: Block
}

export interface IKsnProtocol {
  /**
   * initiate the identify flow
   */
  identify (): Promise<Identify>

  /**
   * Get all slice ids for the peer
   */
  getSliceIds (): Promise<Set<string>>

  /**
   * Get slices for the provided ids or all the
   * slices the peer is holding
   *
   * @param {Array<SliceId>} slices - optional
   */
  getSlicesById (slices: string[]): Promise<Slice[]>

  /**
   * Get all headers
   */
  headers (): Promise<BlockHeader[]>

  /**
   * Get Node type - bridge, edge, node
   */
  nodeType (): Promise<NodeType>

  /**
   * Ping peer
   */
  ping (): Promise<boolean>
}
