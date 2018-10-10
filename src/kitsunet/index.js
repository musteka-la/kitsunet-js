'use strict'

const assert = require('assert')
const EventEmitter = require('events')
const pify = require('pify')

const log = require('debug')('kitsunet:node')

const proto = '/kitsunet/test/0.0.1'

const MAX_PEERS = 25
const INTERVAL = 60 * 1000 // every minute

class KitsunetNode extends EventEmitter {
  constructor ({ node, maxPeers, interval }) {
    super()

    assert(node, 'node is required')

    this.maxPeers = maxPeers || MAX_PEERS
    this.interval = interval || INTERVAL

    this.node = node
    this.connected = new Map()
    this.discovered = new Map()

    node.handle(proto, (_, conn) => {
      conn.getPeerInfo((err, peerInfo) => {
        if (err) return console.error(err)
        this.connected.set(peerInfo.id.toB58String(), peerInfo)
      })
    })

    node.on('peer:connect', (peerInfo) => {
      this.connected.set(peerInfo.id.toB58String(), peerInfo)
      this.emit('kitsunet:connect', peerInfo)
      log(`peer connected ${peerInfo.id.toB58String()}`)
    })

    node.on('peer:disconnect', (peerInfo) => {
      this.connected.delete(peerInfo.id.toB58String())
      this.emit('kitsunet:disconnect', peerInfo)
      log(`peer disconnected ${peerInfo.id.toB58String()}`)
    })

    node.on('peer:discovery', (peerInfo) => {
      this.discovered.set(peerInfo.id.toB58String(), peerInfo)
      this.emit('kitsunet:discovery', peerInfo)
      log(`peer discovered ${peerInfo.id.toB58String()}`)
    })

    setInterval(() => {
      if (this.connected.size < this.maxPeers) {
        if (this.discovered.size > 0) {
          const [id, peer] = this.discovered.entries().next().value
          this.discovered.delete(id)
          this.dial(peer)
        }
      }
    }, this.interval)
  }

  async dial (peer) {
    if (!this.connected.has(peer.id.toB58String())) {
      const conn = await pify(this.node.dialProtocol).call(this.node, peer, proto)
      this.emit('kitsunet:connection', conn)
    }
  }

  async hangup (peer) {
    this.node.hangupPeer(peer)
  }
}

module.exports = KitsunetNode
