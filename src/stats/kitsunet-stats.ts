
'use strict'

import { pingPeer } from './ping'

import Libp2p from 'libp2p'
import assert from 'assert'
import { register } from 'opium-decorators'

import debug from 'debug'
const log = debug('kitsunet:telemetry:client')

const clientState = {
  // kitsunet peers
  peers: {}, // {}
  // libp2p stats
  multicast: [],
  block: {},
  blockTrackerEnabled: false
}

@register()
export class KitsunetStatsTracker {
  started: boolean
  node: Libp2p
  ksnRpc: any

  constructor ({ ksnRpc, node }) {
    assert(node, 'node required')
    assert(ksnRpc, 'ksnRpc required')

    this.started = false
    this.node = node

    this.ksnRpc = ksnRpc
  }

  start () {
    this.ksnRpc.on('kitsunet:peer-disconnected', (peerInfo) => {
      return this.removePeer(peerInfo)
    })

    this.ksnRpc.on('kitsunet:peer-connected', async (peer) => {
      await this.addPeer(peer)
      log(`kitsunet peer connected ${peer.idB58}`)
      return pingPeer(peer, clientState.peers[peer.idB58])
    })

    this.started = true
  }

  stop () {
    this.ksnRpc.removeEventHandler('kitsunet:peer-disconnected')
    this.ksnRpc.removeEventHandler('kitsunet:peer-connected')
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
