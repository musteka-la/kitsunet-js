'use strict'

import { KsnProtocol } from '../ksn-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { KitsunetHandler } from '../kitsunet-handler'
import Block from 'ethereumjs-block'

import { MsgType, ResponseStatus } from '../interfaces'
import { BN } from 'ethereumjs-util'

export class Identify<P extends IPeerDescriptor<any>> extends KitsunetHandler<P> {
  constructor (networkProvider: KsnProtocol<P>,
               peer: P) {
    super('identify', MsgType[MsgType.IDENTIFY], networkProvider, peer)
  }

  async handle (): Promise<any> {
    try {
      // const block: Block = await this.networkProvider.ethChain.getLatestBlock()
      return {
        type: MsgType.IDENTIFY,
        status: ResponseStatus.OK,
        payload: {
          identify: {
            versions: this.networkProvider.versions,
            userAgent: this.networkProvider.userAgent,
            nodeType: this.networkProvider.type,
            // latestBlock: block ? block.header.number : new BN(0).toArrayLike(Buffer)
            latestBlock: (new BN(0)).toArrayLike(Buffer)
            // sliceIds: this.networkProvider.getSliceIds()
          }
        }
      }
    } catch (e) {
      this.log(e)
      return this.errResponse(e)
    }
  }

  async request (): Promise<any> {
    const res = await this.send({ type: MsgType.IDENTIFY })
    return res.payload.identify
  }
}
