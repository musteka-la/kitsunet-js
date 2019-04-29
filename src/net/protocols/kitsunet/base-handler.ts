'use strict'

import EE from 'events'
import debug from 'debug'
import { IPeerDescriptor } from '../../interfaces'
import { KsnProtocol } from './ksn-protocol'
import { KsnResponse, Status } from './interfaces'

export abstract class BaseHandler<P> extends EE {
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
  abstract response<T> (msg: any): Promise<T>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  abstract request<T> (msg?: T): Promise<T>

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
