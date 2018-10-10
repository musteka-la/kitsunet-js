'use strict'

const toStream = require('pull-stream-to-stream')
const endOfStream = require('end-of-stream')

const TelemetryClient = require('./client')
const Stats = require('./stats')

const { sec, min } = require('../utils/time')
const rpc = require('./rpc/rpc')
const baseRpc = require('./rpc/base')
const telemetryRpcMethods = require('./rpc/telemetry')
const { connectViaPost } = require('./network/telemetry')

const pingWithTimeout = require('./network/pingWithTimeout')

const log = require('debug')('kitsunet:telemetry:factory')

const peerPingInterval = 1 * min
const peerPingTimeout = 40 * sec

function setupRpc ({ telemetryConn }) {
  const kitsunetRpc = rpc.createRpcServer(baseRpc(), telemetryConn)
  const telemetryRpc = rpc.createRpcClient(telemetryRpcMethods(), kitsunetRpc)
  return telemetryRpc
}

async function pingPeer ({ rpc, kitsunetPeer, peerInfo }) {
  try {
    await pingWithTimeout(rpc, peerPingTimeout)
    log(`successfully pinged ${peerInfo.id.toB58String()}`)
  } catch (err) {
    log(`got error pinging ${peerInfo.id.toB58String()}, hanging up`, err)
    return kitsunetPeer.hangup(peerInfo)
  }

  setTimeout(() => {
    pingPeer({ rpc, kitsunetPeer, peerInfo })
  }, peerPingInterval)
}

module.exports = async function ({ devMode, kitsunetPeer, node }) {
  const telemetryConn = connectViaPost({ devMode })
  const telemetryRpc = setupRpc({ telemetryConn })

  const stats = new Stats({ node })
  const telemetry = new TelemetryClient({ stats, node, telemetryRpc })

  kitsunetPeer.on('kitsunet:connect', (peerInfo) => {
    telemetry.addPeer(peerInfo)
    log(`peer connected ${peerInfo.id.toB58String()}`)
  })

  kitsunetPeer.on('kitsunet:disconnect', (peerInfo) => {
    telemetry.removePeer(peerInfo)
  })

  kitsunetPeer.on('kitsunet:connection', (conn) => {
    conn.getPeerInfo((err, peerInfo) => {
      if (err) {
        return log(err)
      }

      const stream = toStream(conn)
      endOfStream(stream, (err) => {
        log(`peer rpcConnection disconnect ${peerInfo.id.toB58String()}`, err.message)
        kitsunetPeer.hangup(peerInfo)
      })

      const kitsunetPeerRpc = rpc.createRpcServer(baseRpc(), stream)
      pingPeer({ rpc: rpc.createRpcClient(baseRpc(), kitsunetPeerRpc), kitsunetPeer, peerInfo })
    })
  })

  return { telemetry }
}
