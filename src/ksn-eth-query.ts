'use strict'

import EthQuery = require('eth-query')

/**
 * Extends EthQuery with getSlice call
 */
export class KsnEthQuery extends EthQuery {
  getSlice: (path: string, depth: number, root: string, isStorage: boolean) => any

  constructor (provider: any) {
    super(provider)
    this.getSlice = this.generateFnFor('eth_getSlice').bind(this)
  }

  protected generateFnFor (methodName: string) {
    return (...args: any[]) => {
      let cb = args.pop()
      this.sendAsync({
        method: methodName,
        params: args
      }, cb)
    }
  }
}
