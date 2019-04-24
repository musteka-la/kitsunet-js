'use strict'

import * as Multiplex from 'pull-mplex'
import * as SPDY from 'libp2p-spdy'
import * as SECIO from 'libp2p-secio'
import * as Libp2p from 'libp2p'
import * as DHT from 'libp2p-kad-dht'
import * as defaultsDeep from '@nodeutils/defaults-deep'
import * as promisify from 'promisify-this'
import * createMulticast from 'libp2p-multicast-conditional/src/api'
import parallel from 'async'
import * as Discovery from 'libp2p-rendezvous'

const RNDVZ_DISCOVERY_INTERVAL = 60 * 1000

export class Node extends Libp2p {
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
        ],
        dht: DHT
      },
      config: {
        relay: {
          enabled: false
        },
        dht: {
          kBucketSize: 20,
          enabled: true
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
    this.multicast = promisify(this.multicast)
    this.start = promisify(this.start.bind(this))
    this.stop = promisify(this.stop.bind(this))
    this.dial = promisify(this.dial.bind(this))
    this.dialProtocol = promisify(this.dialProtocol.bind(this))
    this.hangUp = promisify(this.hangUp.bind(this))
  }

  get id () {
    return this.peerInfo.id
  }

  get b58Id () {
    return this.node.id.toB58String()
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
