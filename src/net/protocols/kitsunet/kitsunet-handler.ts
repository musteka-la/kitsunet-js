'use strict'

import EE from 'events'
import debug from 'debug'
import { KsnProtocol } from './ksn-protocol'
import { IPeerDescriptor } from '../../interfaces'
import { KsnResponse, KsnMsg, Status } from './interfaces'
import { IHandler } from '../interfaces'

export abstract class KitsunetHandler<P> extends EE implements IHandler<P> {
  log: debug.Debugger
  constructor (public name: string,
               public id: string,
               public networkProvider: KsnProtocol<P>,
               public peer: IPeerDescriptor<P>) {
    super()
    this.log = debug(`kitsunet:kitsunet-proto:base-handler-${this.name}`)
  }

  /**
   * Handle an incoming message
   *
   * @param msg - the message to be sent
   */
  abstract async handle<T, U> (msg?: T): Promise<U | U[]>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  abstract async request<T, U> (msg?: T): Promise<U | U[]>

  protected async send<T> (msg: T): Promise<KsnResponse> {
    this.log('sending request', msg)
    const res: KsnResponse = await this.networkProvider.send(msg)

    if (res && res.status !== Status.OK) {
      const err = res.error ? new Error(res.error) : new Error('unknown error!')
      this.log(err)
      throw err
    }

    this.log('got response', res)
    return res
  }

  errResponse (err: Error) {
    this.log(err)
    return { status: Status.ERROR, error: err }
  }
}
