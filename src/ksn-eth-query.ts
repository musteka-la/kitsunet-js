'use strict'

const EthQuery = require('eth-query')

function generateFnFor (methodName: string) {
  return function () {
    const self = this
    let args = [].slice.call(arguments)
    let cb = args.pop()
    this.sendAsync({
      method: methodName,
      params: args
    }, cb)
  }
}

/**
 * Extends EthQuery with getSlice call
 */
export class KsnEthQuery extends EthQuery {
  constructor (provider: any) {
    super(provider)

    this.getSlice = generateFnFor('eth_getSlice').bind(this)
  }
}
