import { KsnEthQuery } from '../../ksn-eth-query'

import KitsunetBlockTracker = require('kitsunet-block-tracker')
import HttpProvider = require('ethjs-provider-http')
import PollingBlockTracker = require('eth-block-tracker')
import EthQuery = require('eth-query')

import { inject } from 'opium-decorator-resolvers'

export class TrackerFactory {
  @inject()
  createEthHttpProvider (@inject('options') options: any): HttpProvider {
    return options.bridge ? new HttpProvider(options.rpcUrl) : null
  }

  @inject()
  createPollingBlockProvider (
    @inject('options')
    options: any,
    provider: HttpProvider): PollingBlockTracker {
    return options.bridge ? new PollingBlockTracker({ provider }) : null
  }

  @inject()
  createEthQuery (@inject('options') options: any, provider: HttpProvider): EthQuery {
    return options.bridge ? new KsnEthQuery(provider) : null
  }

  @inject()
  createKitsunetBlockTracker (
    node: Node,
    blockTracker: PollingBlockTracker,
    ethQuery: EthQuery): KitsunetBlockTracker {
    return new KitsunetBlockTracker({ node, blockTracker, ethQuery })
  }
}
