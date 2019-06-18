'use strict'

import { KsnProtocol } from '../ksn-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { KitsunetHandler } from '../kitsunet-handler'

import {
  MsgType,
  ResponseStatus
} from '../interfaces'
import BN from 'bn.js'
import Block from 'ethereumjs-block'

export class Identify<P extends IPeerDescriptor<any>> extends KitsunetHandler<P> {
  constructor (networkProvider: KsnProtocol<P>, peer: P) {
    super('identify', MsgType.IDENTIFY, networkProvider, peer)
  }

  async handle (): Promise<any> {
    try {
      const block: Block = await this.protocol.ethChain.getBestBlock()
      const td: Buffer = (await await this.protocol.ethChain.getBlocksTD()).toArrayLike(Buffer)
      return {
        type: MsgType.IDENTIFY,
        status: ResponseStatus.OK,
        payload: {
          identify: {
            versions: this.protocol.versions,
            userAgent: this.protocol.userAgent,
            nodeType: this.protocol.type,
            networkId: this.protocol.ethChain.common.networkId(),
            td,
            bestHash: block.header.hash(),
            genesisHash: Buffer.from(this.protocol.ethChain.genesis().hash.substring(2), 'hex'),
            number: new BN(block.header.number).toArrayLike(Buffer)
          }
        }
      }
    } catch (e) {
      this.log(e)
      return this.errResponse(e)
    }
  }

  async send (): Promise<any> {
    const res = await this._send({ type: MsgType.IDENTIFY })
    if (res) return res.payload.identify
  }
}
