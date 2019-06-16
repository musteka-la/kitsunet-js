'use strict'

import EE from 'events'
import debug from 'debug'
import { KsnProtocol } from './ksn-protocol'
import { IPeerDescriptor, IHandler } from '../../interfaces'
import { KsnResponse, ResponseStatus } from './interfaces'
import { reject } from 'async'

export abstract class KitsunetHandler<P extends IPeerDescriptor<any>> extends EE implements IHandler<P> {
  log: debug.Debugger
  constructor (public name: string,
               public id: string,
               public protocol: KsnProtocol<P>,
               public peer: P) {
    super()
    this.log = debug(`kitsunet:kitsunet-proto:base-handler-${this.name}`)
  }

  /**
   * Handle an incoming message
   *
   * @param msg - the message to be sent
   */
  abstract handle<U extends any[]> (...msg: U): Promise<any>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  abstract async request<U extends any[]> (...msg: U): Promise<any>

  protected async send<U extends any[]> (...msg: U): Promise<KsnResponse> {
    this.log('sending request', msg)
    const res: KsnResponse = await this.protocol.send(msg) as KsnResponse
    if (res && res.status !== ResponseStatus.OK) {
      console.dir(res)
      const err = res.error ? new Error(res.error) : new Error('unknown error!')
      this.log(err)
      throw err
    }

    this.log('got response', res)
    return res
  }

  errResponse (err: Error) {
    this.log(err)
    return { status: ResponseStatus.ERROR, error: err }
  }
}
