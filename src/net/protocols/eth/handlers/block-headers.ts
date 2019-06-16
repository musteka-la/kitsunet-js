'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import { EthHandler } from '../eth-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol, MSG_CODES } from '../eth-protocol'

export class GetBlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', MSG_CODES.GET_BLOCK_HEADERS, protocol, peer)
  }

  async handle<U extends [any, ...any[]]> (...msg: U): Promise<any> {
    return this.protocol.handlers[MSG_CODES.BLOCK_HEADERS].request(...msg)
  }

  async request<U extends [any, ...any[]]> (...msg: U): Promise<any> {
    const [blockId, max, skip, reverse] = msg
    const block = BN.isBN(blockId) ? blockId.toArrayLike(Buffer) : blockId
    return this.send([ block, max, skip || 0, reverse || 0 ])
  }
}

export class BlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', MSG_CODES.BLOCK_HEADERS, protocol, peer)
  }

  async handle<U extends [any, ...any[]]> (...msg: U): Promise<any> {
    this.emit('message', msg.map(raw => new Block.Header(raw)))
  }

  async request<U extends [any, ...any[]]> (...msg: U & [number | Buffer | BN, number, number, number]): Promise<any> {
    const [block, max, skip, reverse] = msg
    const headers: Block.Header[] = await this
      .protocol
      .ethChain
      .getHeaders(block, max, skip, Boolean(reverse)) as Block.Header[]
    return this.send(headers.map((h: any) => h.raw))
  }
}
