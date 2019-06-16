'use strict'

import EE from 'events'
import debug from 'debug'
import { IHandler, IPeerDescriptor } from '../../interfaces'
import { EthProtocol } from './eth-protocol'

export abstract class EthHandler<P extends IPeerDescriptor<any>> extends EE implements IHandler<P> {
  log: debug.Debugger
  constructor (public name: string,
               public id: number,
               public protocol: EthProtocol<P>,
               public peer: IPeerDescriptor<P>) {
    super()
    this.log = debug(`kitsunet:eth-proto:base-handler-${this.name}`)
  }

  /**
   * Handle an incoming message
   *
   * @param msg - the message to be sent
   */
  abstract async handle<U extends [any, ...any[]]> (...msg: U): Promise<any>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  abstract async request<U extends [any, ...any[]]> (...msg: U): Promise<any>

  protected async send<U extends any[]> (...msg: U): Promise<any> {
    msg.unshift(this.id)
    return this.protocol.send(msg)
  }
}
