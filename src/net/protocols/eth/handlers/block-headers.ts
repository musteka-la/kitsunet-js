'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'
import util from 'ethereumjs-util'
import { BaseHandler } from '../base-handler'
import { IPeerDescriptor } from '../../../interfaces'
import { EthProtocol } from '../eth-protocol'
import { ProtocolCodes } from '../interfaces'

export class GetBlockHeaders<P> extends BaseHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockHeaders', ProtocolCodes.GetBlockHeaders, networkProvider, peer)
  }

  async handle<T> (msg?: T[] & [Buffer, Buffer, Buffer, Buffer]): Promise<any> {
    if (msg) {
      const [block, max, skip, reverse] = msg
      return {
        block: block.length === 32 ? block : new BN(block),
        max: util.bufferToInt(max),
        skip: util.bufferToInt(skip),
        reverse: util.bufferToInt(reverse)
      }
    }
  }

  // async request<T> (msg?: T[] & [Block | number, number, number, boolean]): Promise<any> {
  async request<T> (msg?: T[] & any): Promise<any> {
    const [block, max, skip, reverse] = msg
    return this.send([BN.isBN(block) ? block.toArrayLike(Buffer) : block, max, skip, reverse])
  }
}

export class BlockHeaders<P> extends BaseHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockHeaders', ProtocolCodes.BlockHeaders, networkProvider, peer)
  }

  async handle<BlockHeader> (msg?: BlockHeader[]): Promise<any> {
    if (msg) {
      return msg.map(raw => new Block.Header(raw))
    }
  }

  async request<T> (msg?: T[]): Promise<any> {
    if (msg) {
      return this.send(msg.map((h: any) => h.raw))
    }
  }
}
