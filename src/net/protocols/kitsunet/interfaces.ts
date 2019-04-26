'use strict'

import { Protocol } from '../../interfaces'
import Block from 'ethereumjs-block'
import { NodeTypes } from '../../../constants'
import { Slice } from '../../../slice'

type BlockHeader = typeof Block.Header

export interface IdentifyMsg {
  version: string
  userAgent: string
  sliceIds: Set<string>
  latestBlock: Block
  nodeType: NodeTypes
}

export interface KsnProto extends Protocol {
  /**
   * initiate the identify flow
   */
  identify (): Promise<IdentifyMsg>

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
  getSlicesById (slices): Promise<Set<Slice>>

  /**
   * Get all headers
   */
  headers (): Promise<BlockHeader>

  /**
   * Get Node type - bridge, edge, node
   */
  nodeType (): Promise<NodeTypes>

  /**
   * Ping peer
   */
  ping (): Promise<boolean>
}
