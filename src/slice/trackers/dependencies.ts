import { KitsunetBridge } from './bridge'
import { KitsunetPubSub } from './pubsub'
import { KsnEthQuery } from '../../ksn-eth-query'

import KitsunetBlockTracker = require('kitsunet-block-tracker')
import HttpProvider = require('ethjs-provider-http')
import PollingBlockTracker = require('eth-block-tracker')
import EthQuery = require('eth-query')

import { register } from 'opium-decorator-resolvers'

export class TrackerFactory {
  @register()
  createEthHttpProvider (@register('options') options: any): HttpProvider {
    return options.bridge ? new HttpProvider(options.rpcUrl) : null
  }

  @register()
  createPollingBlockProvider (
    @register('options')
    options: any,
    provider: HttpProvider): PollingBlockTracker {
    return options.bridge ? new PollingBlockTracker({ provider }) : null
  }

  @register()
  createEthQuery (@register('options') options: any, provider: HttpProvider): EthQuery {
    return options.bridge ? new KsnEthQuery(provider) : null
  }

  @register()
  createKitsunetBlockTracker (
    node: Node,
    blockTracker: PollingBlockTracker,
    ethQuery: EthQuery): KitsunetBlockTracker {
    return new KitsunetBlockTracker({ node, blockTracker, ethQuery })
  }
}

module.exports = (container, options) => {
  container.registerFactory('eth-http-provider',
    () => options.bridge ? new HttpProvider(options.rpcUrl) : null)

  container.registerFactory('polling-block-provider',
    (provider) => options.bridge ? new PollingBlockTracker({ provider }) : null,
    ['eth-http-provider'])

  container.registerFactory('eth-query',
    (provider) => options.bridge ? new KsnEthQuery(provider) : null,
    ['eth-http-provider'])

  container.registerFactory('block-tracker',
    (node, blockTracker, ethQuery) => new KitsunetBlockTracker({ node, blockTracker, ethQuery }),
    ['node', 'polling-block-provider', 'eth-query'])

  container.registerFactory('bridge-tracker',
    (options, blockTracker, rpcBlockTracker, ethQuery) => new KitsunetBridge({
      rpcUrl: options.rpcUrl,
      blockTracker,
      rpcBlockTracker,
      ethQuery
    }),
    ['options', 'block-tracker', 'polling-block-provider', 'eth-query'])

  container.registerFactory('pubsub-tracker',
    (node) => new KitsunetPubSub({ node, depth: options.sliceDepth }),
    ['node'])

  return container
}
