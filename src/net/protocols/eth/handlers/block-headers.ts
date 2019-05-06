'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import * as utils from 'ethereumjs-util'
import { BaseHandler } from '../base-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol } from '../eth-protocol'
import { ProtocolCodes } from '../interfaces'

export class GetBlockHeaders<P> extends BaseHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', ProtocolCodes.GetBlockHeaders, networkProvider, peer)
  }

  async handle<T> (headers: T[] & [Buffer, Buffer, Buffer, Buffer]): Promise<any> {
    const [block, max, skip, reverse] = headers
    return {
      block: block.length === 32 ? block : new BN(block),
      max: utils.bufferToInt(max),
      skip: utils.bufferToInt(skip),
      reverse: utils.bufferToInt(reverse)
    }
  }

  async request<T> (blockHeaders: T[] & [Buffer | BN, number, number, number]): Promise<any> {
    const [block, max, skip, reverse] = blockHeaders
    return this.send([BN.isBN(block) ? block.toArrayLike(Buffer) : Buffer.from(block), Buffer.from([max]), Buffer.from([skip]), Buffer.from([reverse])])
  }
}

export class BlockHeaders<P> extends BaseHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', ProtocolCodes.BlockHeaders, networkProvider, peer)
  }

  async handle<BlockHeader> (headers: BlockHeader[]): Promise<any> {
    return headers.map(raw => new Block.Header(raw))
  }

  async request<T> (headers: T[]): Promise<any> {
    return this.send(headers.map((h: any) => h.raw))
  }
}
