'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import * as utils from 'ethereumjs-util'
import { EthHandler } from '../eth-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol } from '../eth-protocol'
import { ETH_MESSAGE_CODES } from 'ethereumjs-devp2p'

type BlockHeader = Block.Header

export class GetBlockHeaders<P> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', ETH_MESSAGE_CODES.GET_BLOCK_HEADERS, networkProvider, peer)
  }

  async handle<T, BlockHeadersMsg> (headers: T[] & [Buffer, Buffer, Buffer, Buffer]): Promise<BlockHeadersMsg> {
    const [block, max, skip, reverse] = headers
    return {
      block: block.length === 32 ? block : new BN(block),
      max: utils.bufferToInt(max),
      skip: utils.bufferToInt(skip),
      reverse: utils.bufferToInt(reverse)
    } as unknown as BlockHeadersMsg
  }

  async request<T> (blockHeaders: T[] & [Buffer | BN, number, number, number]): Promise<any> {
    const [block, max, skip, reverse] = blockHeaders
    return this.send([
      BN.isBN(block) ? block.toArrayLike(Buffer) : Buffer.from(block),
      Buffer.from([max]),
      Buffer.from([skip]),
      Buffer.from([reverse])
    ])
  }
}

export class BlockHeaders<P> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', ETH_MESSAGE_CODES.BLOCK_HEADERS, networkProvider, peer)
  }

  async handle<T, U> (headers: T[]): Promise <Block.Header[]> {
    return headers.map(raw => new Block.Header(raw))
  }

  async request<T, U> (headers: T[]): Promise < U[] > {
    return this.send(headers.map((h: any) => h.raw))
  }
}
