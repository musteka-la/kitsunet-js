'use strict'

import { KitsunetHandler } from '../kitsunet-handler'

import { MsgType, ResponseStatus } from '../interfaces'
import { IPeerDescriptor } from '../../../interfaces'
import { KsnProtocol } from '../ksn-protocol'

export class Ping<P extends IPeerDescriptor<any>> extends KitsunetHandler<P> {
  constructor (networkProvider: KsnProtocol<P>,
               peer: P) {
    super('ping', MsgType[MsgType.PING], networkProvider, peer)
  }

  async handle (): Promise<any> {
    return {
      type: MsgType.PING,
      status: ResponseStatus.OK
    }
  }

  async request (): Promise<any> {
    return this.send({ type: MsgType.PING })
  }
}
