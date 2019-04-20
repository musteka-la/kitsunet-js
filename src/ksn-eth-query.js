'use strict'

const EthQuery = require('eth-query')

function generateFnFor (methodName) {
  return function () {
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args
    }, cb)
  }
}

/**
 * Extends EthQuery with getSlice call
 */
class KsnEthQuery extends EthQuery {
  constructor (provider) {
    super(provider)

    this.getSlice = generateFnFor('eth_getSlice').bind(this)
  }
}

module.exports = KsnEthQuery
