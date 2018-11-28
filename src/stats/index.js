'use strict'

const assert = require('assert')
const SafeEventEmitter = require('safe-event-emitter')
const toStream = require('pull-stream-to-stream')
const endOfStream = require('end-of-stream')

const rpc = require('./rpc/rpc')
const baseRpc = require('./rpc/base')

const { sec, min } = require('../utils/time')

const log = require('debug')('kitsunet:telemetry:client')

const DEFAULT_SUBMIT_INTERVAL = 15 * sec

const clientState = {
  // kitsunet peers
  peers: {}, // {}
  // libp2p stats
  multicast: [],
  block: {},
  blockTrackerEnabled: false
}

const pingWithTimeout = require('./network/pingWithTimeout')

const peerPingInterval = 1 * min
const peerPingTimeout = 40 * sec

async function pingPeer ({ rpc, kitsunetPeer, peerInfo }) {
  const b58Id = peerInfo.id.toB58String()
  try {
    const time = await pingWithTimeout(rpc, peerPingTimeout)
    let status = clientState.peers[b58Id]
    status = status || { status: '', ping: '' }
    status.ping = time
    status.status = 'connected'
    log(`successfully pinged ${b58Id}`)
  } catch (err) {
    log(`got error pinging ${b58Id}, hanging up`, err)
    return kitsunetPeer.hangup(peerInfo)
  }

  setTimeout(() => {
    pingPeer({ rpc, kitsunetPeer, peerInfo })
  }, peerPingInterval)
}

class KitsunetStatsTracker extends SafeEventEmitter {
  constructor ({ kitsunetPeer, node }) {
    super()

    assert(node, 'node required')
    assert(node, 'kitsunetPeer required')

    this.started = false
    this.node = node

    kitsunetPeer.on('kitsunet:disconnect', (peerInfo) => {
      this.removePeer(peerInfo)
    })

    kitsunetPeer.on('kitsunet:connection', (conn) => {
      this.addPeer(peerInfo)
      log(`kitsunet peer connected ${peerInfo.id.toB58String()}`)

      conn.getPeerInfo((err, peerInfo) => {
        if (err) {
          return log(err)
        }

        const stream = toStream(conn)
        endOfStream(stream, (err) => {
          log(`peer rpcConnection disconnect ${peerInfo.id.toB58String()}`, err.message)
          kitsunetPeer.hangup(peerInfo)
        })

        const rpcServer = rpc.createRpcServer(baseRpc(), stream)
        const rpcClient = rpc.createRpcClient(baseRpc(), rpcServer)
        pingPeer({ rpc: rpcClient, kitsunetPeer, peerInfo })
      })
    })
  }

  start () {
    this.started = true
  }

  stop () {
    this.started = false
  }

  getState () {
    return clientState
  }

  async addPeer (peerInfo) {
    const b58Id = peerInfo.id.toB58String()
    clientState.peers[b58Id] = { status: 'connected' }
  }

  async removePeer (peerInfo) {
    const b58Id = peerInfo.id.toB58String()
    delete clientState.peers[b58Id]
  }
}

module.exports = KitsunetStatsTracker
