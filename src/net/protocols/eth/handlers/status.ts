'use strict'

'use strict'

import BN from 'bn.js'
import { BaseHandler } from '../base-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { Status as StatusMsg, ProtocolCodes } from '../interfaces'

export class Status<P> extends BaseHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('Status', ProtocolCodes.Status, networkProvider, peer)
  }

  async handle<T> (msg?: T[] & [number, number, Buffer, Buffer, Buffer, number]): Promise<any> {
    if (msg) {
      return {
        protocolVersion: msg[0],
        networkId: msg[1],
        td: new BN(msg[2]),
        bestHash: new BN(msg[3]),
        genesisHash: new BN(msg[4]),
        number: msg[5]
      }
    }
  }

  async request<T> (msg?: T & StatusMsg): Promise<any> {
    if (msg) {
      return this.send([
        msg.protocolVersion,
        msg.networkId,
        msg.td.toArrayLike(Buffer),
        msg.bestHash.toArrayLike(Buffer),
        msg.genesisHash.toArrayLike(Buffer),
        msg.number
      ])
    }
  }
}
