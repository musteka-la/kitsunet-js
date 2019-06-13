'use strict'

import EE from 'events'
import debug from 'debug'
import { IHandler, IPeerDescriptor } from '../../interfaces'
import { EthProtocol } from './eth-protocol'

export abstract class EthHandler<P extends IPeerDescriptor<any>> extends EE implements IHandler<P> {
  log: debug.Debugger
  constructor (public name: string,
               public id: number,
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
  abstract async handle<T, U = T> (msg: T[]): Promise<void>
  abstract async handle<T, U = T> (msg: T): Promise<U>
  abstract async handle<T, U = T> (msg: T[]): Promise<U[]>
  abstract async handle<T, U = T> (msg: T | T[]): Promise<U[] | U | void>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  abstract async request<T, U = T> (msg: T | T[]): Promise<U>
  abstract async request<T, U = T> (msg: T | T[]): Promise<U[]>
  abstract async request<T, U = T> (msg: T | T[]): Promise<U | U[]>
  abstract async request<T> (msg: T | T[]): Promise<void>

  protected async send<T> (msg: any[]): Promise<T>
  protected async send<T> (msg: any[]): Promise<T[]>
  protected async send<T> (msg: any[]): Promise<void>
  protected async send<T> (msg: any[]): Promise<T | T[] | void> {
    msg.unshift(this.id)
    return this.networkProvider.send(msg)
  }
}
