'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import * as utils from 'ethereumjs-util'
import { EthHandler } from '../eth-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol, MSG_CODES } from '../eth-protocol'

export type BlockHeadersRequest = [Buffer | BN | number, number, number, boolean]
export class GetBlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', MSG_CODES.GET_BLOCK_HEADERS, protocol, peer)
  }

  async handle<U extends any[]> (...msg: U): Promise<any> {
    return this.protocol.handlers[MSG_CODES.BLOCK_HEADERS].send(...msg)
  }

  async send<U extends any[]> (...msg: U & BlockHeadersRequest): Promise<any> {
    const [blockId, max, skip, reverse] = msg
    const block = BN.isBN(blockId) ? blockId.toArrayLike(Buffer) : blockId
    return this._send([ block, max, skip || 0, reverse || 0 ])
  }
}

export type BlockRequest = [number | Buffer | BN, number | Buffer, number | Buffer, boolean | Buffer]
export class BlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', MSG_CODES.BLOCK_HEADERS, protocol, peer)
  }

  async handle<U extends any[]> (...msg: U): Promise<any> {
    this.emit('message', msg.map(raw => new Block.Header(raw)))
  }

  async send<U extends any[]> (...msg: U & BlockRequest): Promise<any> {
    const [block, max, skip, reverse] = msg
    const headers: Block.Header[] = await this
      .protocol
      .ethChain
      .getHeaders(
        Buffer.isBuffer(block) && block.length === 32 ? block : new BN(block),
        Buffer.isBuffer(max) ? utils.bufferToInt(max) : max,
        Buffer.isBuffer(skip) ? utils.bufferToInt(skip) : skip,
        Buffer.isBuffer(skip) ? Boolean(utils.bufferToInt(skip)) : Boolean(reverse)) as Block.Header[]
    return this._send(headers.map((h: any) => h.raw))
  }
}
