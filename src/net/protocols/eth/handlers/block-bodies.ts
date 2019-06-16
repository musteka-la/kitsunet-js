'use strict'

import Block from 'ethereumjs-block'
import { ETH } from 'ethereumjs-devp2p'
import { IPeerDescriptor } from '../../../interfaces'
import { EthHandler } from '../eth-handler'
import { EthProtocol } from '../eth-protocol'

export class GetBlockBodies<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('GetBlockBodies', ETH.MESSAGE_CODES.GET_BLOCK_BODIES, protocol, peer)
  }

  async handle<U extends [any, ...any[]]> (...msg: U): Promise<any> {
    return this.protocol.handlers[ETH.MESSAGE_CODES.BLOCK_BODIES].request(...msg)
  }

  request<U extends any[]> (...msg: U): Promise<any> {
    return this.send(msg)
  }
}

export class BlockBodies <P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('BlockBodies', ETH.MESSAGE_CODES.BLOCK_BODIES, protocol, peer)
  }

  async handle<U extends any[]> (...msg: U): Promise<any> {
    this.emit('message', msg)
  }

  async request<U extends any[]> (...msg: U): Promise<any> {
    let blocks: Block[] | undefined = (await Promise
      .all(msg.map(async (hash) => {
        const b = await this
          .protocol
          .ethChain
          .getBlocks(hash, 1)
        return b
      }))).filter((b) => b && b.length) as unknown as Block[]
    if (blocks) return blocks.map(block => block.raw.slice(1))
  }
}
