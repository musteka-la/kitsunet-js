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

class KsnEthQuery extends EthQuery {
  constructor (provider) {
    super(provider)

    this.getSLice = generateFnFor('eth_getSlice').bind(this)
  }
}

module.exports = KsnEthQuery
