'use strict'

const HttpProvider = require('ethjs-provider-http')
const PollingBlockTracker = require('eth-block-tracker')
const EthQuery = require('eth-query')

module.exports = createIpfsEthProvider

function createIpfsEthProvider ({ rpcUrl, interval }) {
  const provider = new HttpProvider(rpcUrl)
  const blockTracker = new PollingBlockTracker({ provider, pollingInterval: interval })
  const ethQuery = new EthQuery(provider)
  return { blockTracker, ethQuery }
}
