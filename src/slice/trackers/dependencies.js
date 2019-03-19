'use strict'

const BridgetTracker = require('./slice-bridge')
const PubsubTracker = require('./slice-pubsub')

const KitsunetBlockTracker = require('kitsunet-block-tracker')
const HttpProvider = require('ethjs-provider-http')
const PollingBlockTracker = require('eth-block-tracker')
const EthQuery = require('eth-query')

module.exports = (container) => {
  container.registerFactory('eth-http-provider',
    (options) => new HttpProvider(options.rpcUrl),
    ['options'])

  container.registerFactory('polling-block-provider',
    (provider) => new PollingBlockTracker({ provider }),
    ['eth-http-provider'])

  container.registerType('eth-query', EthQuery, ['eth-http-provider'])

  container.registerFactory('block-tracker',
    (node, blockTracker, ethQuery) => new KitsunetBlockTracker({ node, blockTracker, ethQuery }),
    ['node', 'polling-block-provider', 'eth-query'])

  container.registerFactory('bridge-tracker',
    (options, blockTracker) => new BridgetTracker({ rpcUrl: options.rpcUrl, blockTracker }),
    ['options', 'block-tracker'])

  container.registerFactory('pubsub-tracker',
    (node, options) => new PubsubTracker({ node, depth: options.sliceDepth }),
    ['node', 'options'])

  return container
}
