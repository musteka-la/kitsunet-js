'use strict'

import BN from 'bn.js'
import { EthHandler } from '../eth-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { ETH } from 'ethereumjs-devp2p'

export class NewBlockHashes<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('NewBlockHashes', ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, protocol, peer)
  }

  async handle<U extends any[]> (...msg: U): Promise<any> {
    // emit on the provider
    const announced = msg.map(hn => [hn[0], new BN(hn[1])])
    this.protocol.emit('message', announced)
  }

  async send<U extends any[]> (...hashes: U & [[Buffer, BN][]]): Promise<any> {
    return this._send(hashes.map(hn => {
      return [hn[0], hn[1].toArrayLike(Buffer)]
    }))
  }
}
