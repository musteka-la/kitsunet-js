'use strict'

const assert = require('assert')
const SafeEventEmitter = require('safe-event-emitter')
const pify = require('pify')

const log = require('debug')('kitsunet:node')

const proto = '/kitsunet/test/0.0.1' // TODO: change to `/kitsunet/1.0.0`

const MAX_PEERS = 25
const MAX_PEERS_DISCOVERED = 250
const INTERVAL = 60 * 1000 // every minute

class KitsunetPeer extends SafeEventEmitter {
  constructor ({ node, maxPeers, interval }) {
    super()

    assert(node, 'node is required')

    this.maxPeers = maxPeers || MAX_PEERS
    this.interval = interval || INTERVAL

    this.node = node
    this.connected = new Map()
    this.discovered = new Map()
    this.dialing = new Map()

    node.handle(proto, (_, conn) => {
      conn.getPeerInfo((err, peerInfo) => {
        if (err) return log(err)
        setImmediate(() => this.connected.set(peerInfo.id.toB58String(), peerInfo))
        this.emit('kitsunet:connection', conn)
      })
    })

    node.on('peer:connect', (peerInfo) => {
      this.connected.set(peerInfo.id.toB58String(), peerInfo)
      setImmediate(() => this.emit('kitsunet:connect', peerInfo))
      log(`peer connected ${peerInfo.id.toB58String()}`)
    })

    node.on('peer:disconnect', (peerInfo) => {
      this.connected.delete(peerInfo.id.toB58String())
      setImmediate(() => this.emit('kitsunet:disconnect', peerInfo))
      log(`peer disconnected ${peerInfo.id.toB58String()}`)
    })

    node.on('peer:discovery', (peerInfo) => {
      if (this.discovered.size > MAX_PEERS_DISCOVERED) return
      this.discovered.set(peerInfo.id.toB58String(), peerInfo)
      setImmediate(() => this.emit('kitsunet:discovery', peerInfo))
      log(`peer discovered ${peerInfo.id.toB58String()}`)
    })

    this.tryConnect()
    setInterval(this.tryConnect.bind(this), this.interval)
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
    const b58Id = peer.id.toB58String()
    if (this.dialing.has(b58Id)) {
      log(`dial already in progress for ${b58Id}`)
      return
    }

    if (!this.connected.has(b58Id)) {
      try {
        this.dialing.set(b58Id, true)
        const conn = await pify(this.node.dialProtocol).call(this.node, peer, proto)
        this.emit('kitsunet:connection', conn)
      } catch (err) {
        log(err)
      } finally {
        this.dialing.delete(b58Id)
      }
    }
  }

  async hangup (peer) {
    return pify(this.node.hangUp).call(this.node, peer)
  }
}

module.exports = KitsunetPeer
