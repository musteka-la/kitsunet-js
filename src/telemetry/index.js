'use strict'

const TelemetryClient = require('./client')
const Stats = require('./stats')

const rpc = require('./rpc/rpc')
const baseRpc = require('./rpc/base')
const telemetryRpcMethods = require('./rpc/telemetry')
const { connectViaPost } = require('./network/telemetry')

function setupRpc ({ telemetryConn }) {
  const kitsunetRpc = rpc.createRpcServer(baseRpc(), telemetryConn)
  const telemetryRpc = rpc.createRpcClient(telemetryRpcMethods(), kitsunetRpc)
  return telemetryRpc
}

module.exports = async function ({ devMode, kitsunetPeer, node }) {
  const telemetryConn = connectViaPost({ devMode })
  const telemetryRpc = setupRpc({ telemetryConn })

  const stats = new Stats({ node })
  const telemetry = new TelemetryClient({ stats, node, telemetryRpc, kitsunetPeer })

  return { telemetry }
}
