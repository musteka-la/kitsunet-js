'use strict'

import PeerInfo from 'peer-info'
import PeerId from 'peer-id'
import Libp2p from 'libp2p'
import Mplex from 'pull-mplex'
import SPDY from 'libp2p-spdy'
import SECIO from 'libp2p-secio'
import DHT from 'libp2p-kad-dht'

import { Libp2pConfig } from './config'
import { promisify, PromisifyAll } from 'promisify-this'
import { register } from 'opium-decorators'

import defaultsDeep from '@nodeutils/defaults-deep'
import createMulticastConditional from 'libp2p-multicast-conditional/src/api'

const PPeerInfo: any = promisify(PeerInfo, false)
const PPeerId: any = promisify(PeerId, false)

export type Libp2pPromisified = PromisifyAll<
  Pick<
    Libp2p,
    'start' | 'stop' | 'dial' | 'dialProtocol' | 'multicast'
  >
> & Libp2p  

export class Libp2pOptions {
  identity?: { privKey?: string }
  addrs?: string[]
  bootstrap?: string[]
}

@register()
export class LibP2PFactory {
  @register()
  static getLibp2pOptions (@register('options') options: any): Libp2pOptions {
    const opts = new Libp2pOptions()
    opts.addrs = options.libp2pAddrs
    opts.bootstrap = options.libp2pBootstrap
    opts.identity = options.identity
    return opts
  }

  /**
   * Create libp2p node
   *
   * @param identity {{privKey: string}} - an object with a private key entry
   * @param addrs {string[]} - an array of multiaddrs
   * @param bootstrap {string[]} - an array of bootstrap multiaddr strings
   */
  @register(Libp2p)
  static async createLibP2PNode (peerInfo: PeerInfo,
                                 options: Libp2pOptions): Promise <Libp2pPromisified> {
    const defaults = {
      peerInfo,
      modules: {
        streamMuxer: [
          Mplex,
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

    const config = await Libp2pConfig.getConfig(peerInfo, options.addrs, options.bootstrap)
    const node: Libp2pPromisified = new Libp2p(defaultsDeep(defaults, config)) as Libp2pPromisified

    node.start = promisify(node.start.bind(node))
    node.stop = promisify(node.stop.bind(node))
    node.dial = promisify(node.dial.bind(node))
    node.dialProtocol = promisify(node.dialProtocol.bind(node))
    node.multicast = promisify(createMulticastConditional(node))

    node._multicast.start = promisify(node._multicast.start.bind(node._multicast))
    node._multicast.stop = promisify(node._multicast.stop.bind(node._multicast))
    return node
  }

  /**
   * Create a PeerInfo
   *
   * @param identity {{privKey: string}} - an object with a private key entry
   * @param addrs {string[]} - an array of multiaddrs
   */
  @register(PeerInfo)
  static async createPeerInfo (options: Libp2pOptions): Promise<PeerInfo> {
    let id: PeerId
    const privKey = options.identity && options.identity.privKey ? options.identity.privKey : null
    if (!privKey) {
      id = await PPeerId.create()
    } else {
      id = await PPeerId.createFromJSON(options.identity)
    }

    const peerInfo: PeerInfo = await PPeerInfo.create(id)
    const addrs = options.addrs || []
    addrs.forEach((a) => peerInfo.multiaddrs.add(a))
    return peerInfo
  }
}
