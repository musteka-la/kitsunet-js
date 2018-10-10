'use strict'

const EventEmitter = require('events')

const { sec } = require('../utils/time')

const log = require('debug')('kitsunet:telemetry:client')

const DEFAULT_SUBMIT_INTERVAL = 15 * sec

const clientState = {
  // kitsunet peers
  peers: {},
  // libp2p stats
  stats: {},
  multicast: [],
  block: {},
  blockTrackerEnabled: false
}

class TelemetryClient extends EventEmitter {
  constructor ({ stats, telemetryRpc, submitInterval, node }) {
    super()
    this.stats = stats
    this.telemetryRpc = telemetryRpc
    this.submitInterval = submitInterval || DEFAULT_SUBMIT_INTERVAL
    this.started = false
    this.node = node
  }

  start () {
    this.stats.start()
    this.started = true
    this.telemetryRpc.setPeerId(this.node.peerId)
    this.submitClientStateOnInterval()
  }

  stop () {
    this.stats.stop()
    this.started = false
    this.telemetryRpc.disconnectPeer(this.node.peerId)
  }

  async submitClientStateOnInterval () {
    if (!this.started) return

    setTimeout(async () => {
      try {
        await this.submitNetworkState()
      } catch (err) {
        log(err)
      }
      this.submitClientStateOnInterval()
    }, this.submitInterval)
  }

  async submitNetworkState () {
    clientState.stats = this.stats.stats
    return this.telemetryRpc.submitNetworkState(clientState)
  }

  async addPeer (peerInfo) {
    const b58Id = peerInfo.id.toB58String()
    clientState.peers[b58Id] = { status: 'connected' }
    this.stats.addPeer(b58Id)
  }

  async removePeer (peerInfo) {
    const b58Id = peerInfo.id.toB58String()
    delete clientState.peers[b58Id]
    this.stats.removePeer(b58Id)
    this.telemetryRpc.disconnect(b58Id)
  }
}

module.exports = TelemetryClient
