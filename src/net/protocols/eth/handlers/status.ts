'use strict'

'use strict'

import BN from 'bn.js'
import { EthHandler } from '../eth-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { Status as StatusMsg } from '../interfaces'
import { ETH } from 'ethereumjs-devp2p'

export class Status<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('Status', ETH.MESSAGE_CODES.STATUS, networkProvider, peer)
  }

  async handle<T> (status: T[] & [number, number, Buffer, Buffer, Buffer, number]): Promise<any> {
    this.networkProvider.status = {
      protocolVersion: status[0],
      networkId: status[1],
      td: new BN(status[2]),
      bestHash: status[3],
      genesisHash: status[4],
      number: new BN(status[5])
    }
  }

  async request<T> (status: T & StatusMsg): Promise<T[]> {
    return this.send([
      status.protocolVersion,
      status.networkId,
      status.td.toArrayLike(Buffer),
      status.bestHash,
      status.genesisHash,
      status.number ? status.number.toArrayLike(Buffer) : undefined
    ])
  }
}
