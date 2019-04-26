'use strict'

import { register } from 'opium-decorator-resolvers'
import Multiplex from 'pull-mplex'
import SPDY from 'libp2p-spdy'
import SECIO from 'libp2p-secio'
import Libp2p from 'libp2p'
import DHT from 'libp2p-kad-dht'
import defaultsDeep from '@nodeutils/defaults-deep'
import promisify from 'promisify-this'
import MulticastConditional from 'libp2p-multicast-conditional'
import Multiaddr from 'multiaddr'
import PeerId from 'peer-id'
import PeerInfo from 'peer-info'
import { Node, Protocol, NodeType, Sender, Peer } from '../interfaces'
import toIterator from 'pull-stream-to-async-iterator'
import createMulticast = require('libp2p-multicast-conditional/src/api')
import pull from 'pull-stream'

const promisifiedPeerInfo = promisify(PeerInfo, false)
const promisifiedPeerId = promisify(PeerId, false)

@register()
export class Libp2pNode extends Libp2p implements Node<PeerInfo>, Sender, Peer<PeerInfo> {
  get peer (): Peer<PeerInfo> {
    return this
  }

  get info (): PeerInfo {
    return this.peerInfo
  }

  get sId (): string {
    return this.peerInfo.id.toB58String()
  }

  get addrs (): Set<string> {
    return new Set(this.peerInfo.multiaddr.map((a) => a.toString()))
  }

  get type (): NodeType {
    return NodeType.LIBP2P
  }

  multicast: MulticastConditional
  constructor (peerInfo: PeerInfo,
               @register('libp2p-options') _options: any) {
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

    this.stop = promisify(this.stop.bind(this))
    this.start = promisify(this.start.bind(this))
    this.dial = promisify(this.dial.bind(this))
    this.hangUp = promisify(this.hangUp.bind(this))
    this.dialProtocol = promisify(this.dialProtocol.bind(this))
    this.multicast = promisify(createMulticast(this))
  }

  async mount (protocol: Protocol): Promise<boolean> {
    return new Promise((resolve) => {
      protocol.setNetworkProvider(this)
      this.handle(protocol.id, (_, conn: any) => {
        protocol.handle(toIterator(conn))
      })
      resolve(true)
    })
  }

  async unmount (protocol: Protocol): Promise<boolean> {
    this.unhandle(protocol.id)
    return true
  }

  async send<T extends Buffer, U> (msg: T, protocol: Protocol): Promise<U> {
    const conn = await this.dial(protocol.id, msg)
    return new Promise((resolve, reject) => {
      pull(
        pull.values(msg),
        conn,
        pull.collect((err: Error, values: U) => {
          if (err) return reject(err)
          resolve(values)
        }))
    })
  }

  async start () {
    super.start(async (err: Error) => {
      if (err) {
        throw err
      }

      await this.multicast.start()
      this.peerInfo.multiaddrs.forEach((ma: Multiaddr) => {
        console.log('Swarm listening on', ma.toString())
      })
    })
  }

  async stop () {
    super.stop(async (err) => {
      if (err) throw err
      await this.multicast.stop()
    })
  }

  /**
   *
   * @param identity {{privKey: string}} - an object with a private key entry
   * @param addrs {string[]} - an array of multiaddrs
   */
  static async createPeerInfo (identity?: { privKey?: string }, addrs?: string[]): Promise<PeerInfo> {
    let id: PeerId
    const privKey = identity && identity.privKey ? identity.privKey : null
    if (!privKey) {
      id = await promisifiedPeerId.create()
    } else {
      id = await promisifiedPeerId.createFromJSON(identity)
    }

    const peerInfo: PeerInfo = await promisifiedPeerInfo.create(id)
    addrs = addrs || []
    addrs.forEach((a) => peerInfo.multiaddrs.add(a))
    return peerInfo
  }
}
