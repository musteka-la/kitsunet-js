'use strict'

import EE from 'events'
import debug from 'debug'
import { EthProtocol } from './eth-protocol'
import { IPeerDescriptor } from '../../interfaces'
import { IHandler } from '../interfaces'

export abstract class BaseHandler<P> extends EE implements IHandler<P> {
  log: debug.Debugger
  constructor (public name: string,
               public id: string,
               public networkProvider: EthProtocol<P>,
               public peer: IPeerDescriptor<P>) {
    super()
    this.log = debug(`kitsunet:eth-proto:base-handler-${this.name}`)
  }

  /**
   * Handle an incoming message
   *
   * @param msg - the message to be sent
   */
  abstract async handle<T, U> (msg?: T | T[]): Promise<U | U[]>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  abstract async request<T, U> (msg?: T | T[]): Promise<U | U[]>
}
