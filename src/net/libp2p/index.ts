'use strict'

import Multiplex from 'pull-mplex'
import SPDY from 'libp2p-spdy'
import SECIO from 'libp2p-secio'
import Libp2p from 'libp2p'
import DHT from 'libp2p-kad-dht'
import defaultsDeep from '@nodeutils/defaults-deep'
import promisify from 'promisify-this'
import createMulticast = require('libp2p-multicast-conditional/src/api')
import { parallel } from 'async'
// import { Discovery } from 'libp2p-rendezvous'
import PeerInfo from 'peer-info'

// const RNDVZ_DISCOVERY_INTERVAL = 60 * 1000

export class Node extends Libp2p {
  rndvzDiscovery: any
  multicast: any
  peerId: string = ''

  constructor (peerInfo: PeerInfo, _options: any) {
    super(defaultsDeep(_options, {
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
    }))

    // const rendezvous = _options.rendezvous
    // delete _options.rendezvous

    // if (rendezvous) {
    //   const rndvzDiscovery = new Discovery({
    //     interval: rendezvous.interval || RNDVZ_DISCOVERY_INTERVAL
    //   })

    //   rndvzDiscovery.init(this)
    //   this.rndvzDiscovery = rndvzDiscovery
    //   this.rndvzDiscovery.on('peer', (peerInfo) => this.emit('peer:discovery', peerInfo))
    // }

    this.multicast = promisify(createMulticast(this))
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
    return this.peerInfo.id.toB58String()
  }

  start (callback) {
    super.start((err) => {
      if (err) {
        return callback(err)
      }

      parallel([
        (cb) => this.multicast.start(cb),
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
        (cb) => this.multicast.stop(cb),
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
