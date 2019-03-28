
'use strict'

const { pingPeer } = require('./ping')

const assert = require('assert')
const log = require('debug')('kitsunet:telemetry:client')

const clientState = {
  // kitsunet peers
  peers: {}, // {}
  // libp2p stats
  multicast: [],
  block: {},
  blockTrackerEnabled: false
}

class KitsunetStatsTracker {
  constructor ({ kitsunetRpc, node }) {
    assert(node, 'node required')
    assert(kitsunetRpc, 'kitsunetRpc required')

    this.started = false
    this.node = node

    this.kitsunetRpc = kitsunetRpc
  }

  start () {
    this.kitsunetRpc.on('kitsunet:peer-disconnected', (peerInfo) => {
      this.removePeer(peerInfo)
    })

    this.kitsunetRpc.on('kitsunet:peer-connected', (peer) => {
      this.addPeer(peer)
      log(`kitsunet peer connected ${peer.idB58}`)
      pingPeer(peer, clientState.peers[peer.idB58])
    })

    this.started = true
  }

  stop () {
    this.kitsunetRpc.removeEventHandler('kitsunet:peer-disconnected')
    this.kitsunetRpc.removeEventHandler('kitsunet:peer-connected')
    this.started = false
  }

  getState () {
    return clientState
  }

  async addPeer (peer) {
    clientState.peers[peer.idB58] = { status: 'connected' }
  }

  async removePeer (peerInfo) {
    const b58Id = peerInfo.id.toB58String()
    delete clientState.peers[b58Id]
  }
}

module.exports = KitsunetStatsTracker
