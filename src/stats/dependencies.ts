'use strict'

import { TelemetryClient, network } from 'kitsunet-telemetry'
import Libp2pStats from './libp2p'
import KitsunetStats from './kitsunet-stats'

const { connectViaPost, connectViaWs } = network

export function (container, options) => {
  container.registerFactory('libp2p-stats', (node) => {
    return new Libp2pStats({ node })
  }, ['node'])

  container.registerFactory('telemetry-post-connection', () => {
    return connectViaPost({ devMode: options.NODE_ENV === 'dev' })
  })

  container.registerFactory('telemetry-ws-connection', () => {
    return connectViaWs({ devMode: options.NODE_ENV === 'dev' })
  })

  container.registerFactory('telemetry', (node, connection) => {
    const clientId = node.peerInfo.id.toB58String()
    return new TelemetryClient({ node, clientId, connection })
  }, ['node', 'telemetry-ws-connection'])

  container.registerFactory('kitsunet-stats', (ksnRpc, node) => {
    return new KitsunetStats({ ksnRpc, node })
  }, ['kitsunet-rpc', 'node'])

  return container
}
