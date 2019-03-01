'use strict'

const Multiplex = require('libp2p-mplex')
const SPDY = require('libp2p-spdy')
const SECIO = require('libp2p-secio')
const Libp2p = require('libp2p')
const DHT = require('libp2p-kad-dht')
const defaultsDeep = require('@nodeutils/defaults-deep')

const createMulticast = require('libp2p-multicast-conditional/src/api')

const parallel = require('async/parallel')

const { Discovery } = require('libp2p-rendezvous')

const RNDVZ_DISCOVERY_INTERVAL = 60 * 1000

class Node extends Libp2p {
  constructor (peerInfo, _options) {
    const rendezvous = _options.rendezvous
    delete _options.rendezvous
    const defaults = {
      peerInfo,
      modules: {
        streamMuxer: [
          Multiplex,
          SPDY
        ],
        connEncryption: [
          SECIO
        ]
        // dht: DHT
      },
      config: {
        relay: {
          enabled: true
        },
        // dht: {},
        EXPERIMENTAL: {
          // dht: true
        }
      }
    }

    super(defaultsDeep(_options, defaults))
    if (rendezvous) {
      const rndvzDiscovery = new Discovery({
        interval: rendezvous.interval || RNDVZ_DISCOVERY_INTERVAL
      })

      rndvzDiscovery.init(this)
      this.rndvzDiscovery = rndvzDiscovery
      this.rndvzDiscovery.on('peer', (peerInfo) => this.emit('peer:discovery', peerInfo))
    }

    this.multicast = createMulticast(this)
  }

  get id () {
    return this.peerInfo.id.toB58String()
  }

  start (callback) {
    super.start((err) => {
      if (err) {
        return callback(err)
      }

      parallel([
        (cb) => this._multicast.start(cb),
        (cb) => {
          if (this.rndvzDiscovery) {
            return this.rndvzDiscovery.start(cb)
          }
          cb()
        }
      ], (err) => {
        if (err) {
          return callback(err)
        }

        this.peerInfo.multiaddrs.forEach((ma) => {
          console.log('Swarm listening on', ma.toString())
        })

        callback()
      })
    })
  }

  stop (callback) {
    super.stop((err) => {
      if (err) {
        return callback(err)
      }

      parallel([
        (cb) => this._multicast.stop(cb),
        (cb) => {
          if (this.rndvzDiscovery) {
            return this.rndvzDiscovery.stop(cb)
          }
          cb()
        }
      ], callback)
    })
  }
}

module.exports = Node
