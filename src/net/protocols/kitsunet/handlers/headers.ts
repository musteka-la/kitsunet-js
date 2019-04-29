'use strict'

import { BaseHandler } from '../base-handler'
import { KsnProtocol } from '../ksn-protocol'
import { IPeerDescriptor } from '../../../interfaces'

const { MsgType, Status } = Kitsunet

export class Header<P> extends BaseHandler<P> {
  constructor (networkProvider: KsnProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('headers', MsgType.HEADERS, networkProvider, peer)
  }

  async response (): Promise<any> {
    return {
      type: MsgType.HEADERS,
      status: Status.OK,
      payload: {
        slices: await this.rpcEngine.getHeaders()
      }
    }
  }

  async request () {
    const res = await this.sendRequest({
      type: MsgType.HEADERS
    })
    return res.payload.headers
  }
}
