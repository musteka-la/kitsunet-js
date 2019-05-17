'use strict'

import HttpProvider from 'ethjs-provider-http'
import EthQuery from 'eth-query'
import { register } from 'opium-decorators'

/**
 * Extends EthQuery with getSlice call
 */
@register()
export class KsnEthQuery extends EthQuery {
  getSlice: (path: string, depth: number, root: string, isStorage: boolean) => any

  constructor (@register(HttpProvider) provider: HttpProvider) {
    super(provider)
    this.getSlice = this.generateFnFor('eth_getSlice').bind(this)
  }

  protected generateFnFor (methodName: string) {
    return (...args: any[]) => {
      let cb = args.pop()
      this.sendAsync({ method: methodName, params: args }, cb)
    }
  }
}
