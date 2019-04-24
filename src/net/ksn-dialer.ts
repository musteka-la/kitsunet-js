'use strict'

import assert from 'assert'
import EE from 'events'

import { nextTick } from 'async'

import debug from 'debug'
const log = debug('kitsunet:node')

const MAX_PEERS = 25
const MAX_PEERS_DISCOVERED = 250
const INTERVAL = 60 * 1000 // every minute

/**
 * A dialer module that handles ambient
 * node discovery and such
 */
export class KsnDialer extends EE {
  constructor ({ node, maxPeers, interval }) {
    super()

    assert(node, 'node is required')

    this.maxPeers = maxPeers || MAX_PEERS
    this.interval = interval || INTERVAL
    this.intervalTimer = null

    this.node = node
    this.connected = new Map()
    this.discovered = new Map()
    this.dialing = new Map()

    // store discovered peers to dial them later
    node.on('peer:discovery', (peerInfo) => {
      if (this.discovered.size > MAX_PEERS_DISCOVERED) return
      this.discovered.set(peerInfo.id.toB58String(), peerInfo)
      nextTick(() => this.emit('kitsunet:discovery', peerInfo))
      log(`peer discovered ${peerInfo.id.toB58String()}`)
    })
  }

  async start () {
    const starter = new Promise((resolve) => {
      this.node.on('start', () => {
        this.tryConnect()
        this.intervalTimer = setInterval(this.tryConnect.bind(this), this.interval)
        resolve()
      })
    })
    await this.node.start()
    return starter
  }

  async stop () {
    const stopper = new Promise((resolve) => {
      this.node.on('start', () => {
        clearInterval(this.intervalTimer)
        resolve()
      })
    })
    await this.node.stop()
    return stopper
  }

  get b58Id () {
    return this.b58Id
  }

  async tryConnect () {
    if (this.connected.size <= this.maxPeers) {
      if (this.discovered.size > 0) {
        const [id, peer] = this.discovered.entries().next().value
        this.discovered.delete(id)
        return this.dial(peer)
      }
    }
  }

  async dial (peerInfo) {
    const id = peerInfo.id.toB58String()
    if (this.dialing.has(id)) {
      log(`dial already in progress for ${id}`)
      return
    }

    if (!this.connected.has(id)) {
      try {
        this.dialing.set(id, true)
        await this.node.dialProtocol(peerInfo)
        nextTick(() => this.emit('kitsunet:peer-dialed', peerInfo))
      } catch (err) {
        log(err)
      } finally {
        this.dialing.delete(id)
      }
    }
  }

  async hangup (peer) {
    return this.node.hangUp(this.node, peer)
  }
}
