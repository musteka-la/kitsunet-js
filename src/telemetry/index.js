'use strict'

const TelemetryClient = require('./client')
const Stats = require('./stats')

const rpc = require('./rpc/rpc')
const clientKitsunet = require('./rpc/clientKitsunet')
const telemetryRpcMethods = require('./rpc/telemetry')
const { connectViaPost } = require('./network/telemetry')

module.exports = async function ({ devMode, kitsunetPeer, node }) {
  const telemetryConn = connectViaPost({ devMode })

  const kitsunetRpc = rpc.createRpcServer(clientKitsunet(), telemetryConn)
  const telemetryRpc = rpc.createRpcClient(telemetryRpcMethods(), kitsunetRpc)

  const stats = new Stats({ node })
  const telemetry = new TelemetryClient({ stats, node, telemetryRpc, kitsunetPeer })

  return { telemetry }
}
