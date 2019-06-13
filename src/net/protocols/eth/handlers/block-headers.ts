'use strict'

import BN from 'bn.js'
import { Block } from 'ethereumjs-blockchain'
import { EthHandler } from '../eth-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol } from '../eth-protocol'
import { ETH } from 'ethereumjs-devp2p'
import { int2buffer } from './utils'

export class GetBlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', ETH.MESSAGE_CODES.GET_BLOCK_HEADERS, networkProvider, peer)
  }

  async handle<T, U> (msg: T[] & [Buffer, number, number, number]): Promise<U> {
    const [block, max, skip, reverse] = msg
    const headers: Block.Header[] | undefined = await this
    .networkProvider
    .ethChain
    .getHeaders(block, max, skip, Boolean(reverse)) as unknown as Block.Header[]
    return headers.map(h => h.raw) as unknown as U
  }

  async request<T> (blockHeaders: T[] & [BN | Buffer | number, number, number, number]): Promise<any> {
    const [block, max, skip, reverse] = blockHeaders
    return this.send([
      BN.isBN(block) ?
        block.toArrayLike(Buffer) :
        Buffer.isBuffer(block) ?
          block : int2buffer(block),
      max,
      skip || 0,
      reverse || 0
    ])
  }
}

export class BlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', ETH.MESSAGE_CODES.BLOCK_HEADERS, networkProvider, peer)
  }

  async handle<T> (headers: T[]): Promise<any> {
    this.emit('message', headers.map(raw => new Block.Header(raw)))
  }

  async request<T> (headers: T[]): Promise<any> {
    return this.send(headers.map((h: any) => h.raw))
  }
}

export class GetBlockBodies<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockBodies', ETH.MESSAGE_CODES.GET_BLOCK_BODIES, networkProvider, peer)
  }

  async handle (msg: Buffer[]): Promise<any> {
    const hashes: Buffer[] = msg
    return hashes.map(h => this.networkProvider.ethChain.getBlocks(h, 1))
  }

  request (msg: Buffer[]): Promise<any> {
    return this.send(msg)
  }
}

export class BlockBodies <P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockBodies', ETH.MESSAGE_CODES.BLOCK_BODIES, networkProvider, peer)
  }

  async handle (msg: any): Promise<any> {
    this.emit('message', msg)
    return
  }

  request (msg: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
