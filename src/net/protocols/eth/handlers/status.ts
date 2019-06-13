'use strict'

import BN from 'bn.js'
import { EthHandler } from '../eth-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { Status as StatusMsg } from '../interfaces'
import { ETH, buffer2int, int2buffer } from 'ethereumjs-devp2p'

export class Status<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('Status', ETH.MESSAGE_CODES.STATUS, networkProvider, peer)
  }

  async handle<T> (status: T[] & [Buffer, Buffer, Buffer, Buffer, Buffer, Buffer]): Promise<any> {
    return this.networkProvider.setStatus({
      protocolVersion: buffer2int(status[0]),
      networkId: buffer2int(status[1]),
      td: new BN(status[2]),
      bestHash: status[3],
      genesisHash: status[4].toString('hex'),
      number: new BN(status[5])
    })
  }

  async request<T> (status: T & StatusMsg): Promise<any> {
    return this.send([
      int2buffer(status.protocolVersion),
      int2buffer(status.networkId),
      status.td.toArrayLike(Buffer),
      status.bestHash,
      Buffer.from(status.genesisHash.substr(2), 'hex')
      // status.number ? status.number.toArrayLike(Buffer) : undefined
    ])
  }
}
