'use strict'

const assert = require('assert')
const EE = require('safe-event-emitter')

const nextTick = require('async/nextTick')

const log = require('debug')('kitsunet:node')

const proto = '/kitsunet/1.0.0'

const MAX_PEERS = 25
const MAX_PEERS_DISCOVERED = 250
const INTERVAL = 60 * 1000 // every minute

class KitsunetNode extends EE {
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

    node.handle(proto, (_, conn) => {
      conn.getPeerInfo((err, peerInfo) => {
        if (err) return log(err)
        const id = peerInfo.id.toB58String()
        nextTick(() => this.connected.set(id, peerInfo))
        this.emit('kitsunet:peer', { id, conn })
      })
    })

    node.on('peer:connect', (peerInfo) => {
      this.connected.set(peerInfo.id.toB58String(), peerInfo)
      nextTick(() => this.emit('kitsunet:connect', peerInfo))
      log(`peer connected ${peerInfo.id.toB58String()}`)
    })

    node.on('peer:disconnect', (peerInfo) => {
      this.connected.delete(peerInfo.id.toB58String())
      nextTick(() => this.emit('kitsunet:disconnect', peerInfo))
      log(`peer disconnected ${peerInfo.id.toB58String()}`)
    })

    node.on('peer:discovery', (peerInfo) => {
      if (this.discovered.size > MAX_PEERS_DISCOVERED) return
      this.discovered.set(peerInfo.id.toB58String(), peerInfo)
      nextTick(() => this.emit('kitsunet:discovery', peerInfo))
      log(`peer discovered ${peerInfo.id.toB58String()}`)
    })
  }

  async start () {
    this.tryConnect()
    this.intervalTimer = setInterval(this.tryConnect.bind(this), this.interval)
  }

  async stop () {
    clearInterval(this.intervalTimer)
  }

  get id () {
    return this.node.id.toB58String()
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

  async dial (peer) {
    const id = peer.id.toB58String()
    if (this.dialing.has(id)) {
      log(`dial already in progress for ${id}`)
      return
    }

    if (!this.connected.has(id)) {
      try {
        this.dialing.set(id, true)
        const conn = await this.node.dialProtocol(this.node, peer, proto)
        this.emit('kitsunet:peer', { id, conn })
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

module.exports = KitsunetNode
