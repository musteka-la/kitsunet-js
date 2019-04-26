'use strict'

import EE from 'events'
import debug from 'debug'
import { KsnProtocol } from '../ksn-protocol'
import PeerInfo = require('peer-info')

export abstract class BaseHandler extends EE {
  id: string
  peerInfo: any
  name: string
  rpcEngine: KsnProtocol
  log: debug.Debugger

  constructor (name: string, id: string, rpcEngine: KsnProtocol, peerInfo: PeerInfo) {
    super()
    this.name = name
    this.id = id
    this.rpcEngine = rpcEngine
    this.peerInfo = peerInfo
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

  protected async sendRequest (msg) {
    this.log('sending request', msg)
    const res: any = await this.rpcEngine.sendRequest(this.peerInfo, msg)

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
