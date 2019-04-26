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
