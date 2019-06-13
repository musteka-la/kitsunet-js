'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import { EthHandler } from '../eth-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol, MSG_CODES } from '../eth-protocol'
import { int2buffer } from 'ethereumjs-devp2p'

export class GetBlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', MSG_CODES.GET_BLOCK_HEADERS, protocol, peer)
  }

  async handle<T, U> (msg: T[]): Promise<U> {
    return this.protocol.handlers[MSG_CODES.BLOCK_HEADERS].request(msg)
  }

  async request<T> (blockHeaders: T[] & [BN | Buffer | number, number, number, number]): Promise<any> {
    const [blockId, max, skip, reverse] = blockHeaders
    const block = BN.isBN(blockId) ?
                  blockId.toArrayLike(Buffer) :
                    Buffer.isBuffer(blockId) ?
                      blockId :
                      int2buffer(blockId)

    return this.send([ block, max, skip || 0, reverse || 0 ])
  }
}

export class BlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', MSG_CODES.BLOCK_HEADERS, protocol, peer)
  }

  async handle<T, U> (headers: T[]): Promise<any> {
    this.emit('message', headers.map(raw => new Block.Header(raw)))
  }

  async request<T, U> (msg: T[] & [Buffer, number, number, number]): Promise<U | U[]> {
    const [block, max, skip, reverse] = msg
    const headers: Block.Header[] = await this
    .protocol
    .ethChain
    .getHeaders(block, max, skip, Boolean(reverse)) as Block.Header[]
    return this.send(headers.map((h: any) => h.raw))
  }
}
