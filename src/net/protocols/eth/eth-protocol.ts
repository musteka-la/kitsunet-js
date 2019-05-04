'use strict'

import { BaseProtocol } from '../base-protocol'
import { IEthProtocol, BlockBody } from './interfaces'
import Block from 'ethereumjs-block'
import { IPeerDescriptor, INetwork, IEncoder } from '../../interfaces'
import { IBlockchain } from '../../../blockchain'
import { register } from 'opium-decorator-resolvers'

@register()
export class EthProtocol<P> extends BaseProtocol<P> implements IEthProtocol {
  constructor (public blockChain: IBlockchain,
               peer: IPeerDescriptor<P>,
               networkProvider: INetwork<P>,
               encoder: IEncoder) {
    super(peer, networkProvider, encoder)
  }

  get id (): string {
    return 'eth'
  }

  get codec (): string {
    return `/kitsunet/eth/${this.versions.join('-')}`
  }

  get versions (): string[] {
    return ['62', '63']
  }

  async getBlockHeaders (block: number, max: number, skip?: number | undefined, reverse?: boolean | undefined): Promise<Block[]> {
    throw new Error('Method not implemented.')
  }

  async getBlockBodies (hashes: string[]): Promise<BlockBody[]> {
    throw new Error('Method not implemented.')
  }

  async *newHashes (): AsyncIterable<string[]> {
    throw new Error('Method not implemented.')
  }
}
