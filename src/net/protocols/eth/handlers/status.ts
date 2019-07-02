'use strict'

import BN from 'bn.js'
import { EthHandler } from '../eth-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { ETH, buffer2int } from 'ethereumjs-devp2p'

export class Status<P extends IPeerDescriptor<any>> extends EthHandler<P> {
  constructor (protocol: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('Status', ETH.MESSAGE_CODES.STATUS, protocol, peer)
  }

  async handle<U extends any[]> (...msg: U & [Buffer, Buffer, Buffer, Buffer, Buffer, Buffer]): Promise<any> {
    const [protocolVersion, networkId, td, bestHash, genesisHash, _number] = msg
    const status = {
      protocolVersion: buffer2int(protocolVersion),
      networkId: buffer2int(networkId),
      td: new BN(td),
      bestHash: bestHash,
      genesisHash: genesisHash.toString('hex'),
      number: new BN(_number || 0)
    }
    await this.protocol.setStatus(status)
    this.emit('message', status)
  }

  async send<U extends any[]> (...msg: U & [number, number, BN, Buffer, string]): Promise<any> {
    const [protocolVersion, networkId, td, bestHash, genesisHash] = msg
    return this._send([
      protocolVersion,
      networkId,
      td.toArrayLike(Buffer),
      bestHash,
      Buffer.from(genesisHash.substr(2), 'hex')
    ])
  }
}
