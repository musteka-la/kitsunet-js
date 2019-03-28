'use strict'

const BridgetTracker = require('./bridge')
const PubsubTracker = require('./pubsub')

const KitsunetBlockTracker = require('kitsunet-block-tracker')
const HttpProvider = require('ethjs-provider-http')
const PollingBlockTracker = require('eth-block-tracker')
const EthQuery = require('eth-query')

module.exports = (container, options) => {
  container.registerFactory('eth-http-provider',
    () => options.bridge ? new HttpProvider(options.rpcUrl) : null)

  container.registerFactory('polling-block-provider',
    (provider) => options.bridge ? new PollingBlockTracker({ provider }) : null,
    ['eth-http-provider'])

  container.registerFactory('eth-query',
    (provider) => options.bridge ? new EthQuery(provider) : null,
    ['eth-http-provider'])

  container.registerFactory('block-tracker',
    (node, blockTracker, ethQuery) => {
      return new KitsunetBlockTracker({ node, blockTracker, ethQuery })
    },
    ['node', 'polling-block-provider', 'eth-query'])

  container.registerFactory('bridge-tracker',
    (options, blockTracker, rpcBlockTracker, ethQuery) => new BridgetTracker({
      rpcUrl: options.rpcUrl,
      blockTracker,
      rpcBlockTracker,
      ethQuery
    }),
    ['options', 'block-tracker', 'polling-block-provider', 'eth-query'])

  container.registerFactory('pubsub-tracker',
    (node, options) => new PubsubTracker({ node, depth: options.sliceDepth }),
    ['node', 'options'])

  return container
}
