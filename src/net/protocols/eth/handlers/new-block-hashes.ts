'use strict'

import BN from 'bn.js'
import { BaseHandler } from '../base-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { ProtocolCodes } from '../interfaces'

export class NewBlockHashes<P> extends BaseHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('NewBlockHashes', ProtocolCodes.NewBlockHashes, networkProvider, peer)
  }

  async handle<T> (hashes: T[]): Promise<any> {
    // emit it on the provider
    this.networkProvider.emit('block-hashes', hashes.map(hn => [hn[0], new BN(hn[1])]))
  }

  async request<T> (hashes: T[]): Promise<any> {
    return this.send(hashes.map(hn => [hn[0], hn[1].toArrayLike(Buffer)]))
  }
}
