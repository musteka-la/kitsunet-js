'use strict'

const { TelemetryClient, network } = require('kitsunet-telemetry')
const Libp2pStats = require('./libp2p')
const KitsunetStats = require('./kitsunet-stats')

const { connectViaPost, connectViaWs } = network

module.exports = (container, options) => {
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

  container.registerFactory('kitsunet-stats', (kitsunetRpc, node) => {
    return new KitsunetStats({ kitsunetRpc, node })
  }, ['kitsunet-rpc', 'node'])

  return container
}
