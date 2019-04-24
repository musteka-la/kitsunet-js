'use strict'

import EE from 'events'
import { Status } from '../proto'
import debug from 'debug'

export class BaseHandler extends EE {
  constructor (name, id, rpcEngine, peerInfo) {
    super()
    this.name = name
    this.id = id
    this.rpcEngine = rpcEngine
    this.peerInfo = peerInfo
    this.log = debug(`kitsunet:kitsunet-proto:base-handler-${this.name}`)
  }

  async handle (msg) {
    throw new Error('not implemented!')
  }

  async sendRequest (msg) {
    this.log('sending request', msg)
    const res = await this.rpcEngine.sendRequest(this.peerInfo, msg)

    if (res && res.status !== Status.OK) {
      const err = res.error ? new Error(this.error) : new Error('unknown error!')
      this.log(err)

      throw err
    }

    this.log('got response', res)
    return res
  }

  errResponse (type) {
    const err = `unknown message type ${type}`
    this.log(err)
    return { status: Status.ERROR, error: err }
  }
}
