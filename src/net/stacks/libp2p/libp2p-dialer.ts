'use strict'

import EE from 'events'
import assert from 'assert'
import debug from 'debug'
import PeerInfo from 'peer-info'
import Libp2p from 'libp2p'
import { register } from 'opium-decorators'

const log = debug('kitsunet:net:libp2p:libp2p-dialer')

const MAX_PEERS = 25
const MAX_PEERS_DISCOVERED = 250
const INTERVAL = 60 * 1000 // every minute

/**
 * A dialer module that handles ambient
 * node discovery and such.
 *
 * FIXME: This is here also to mitigate various
 * issues with concurrent dialing in libp2p
 */
@register()
export class Libp2pDialer extends EE {
  intervalTimer: NodeJS.Timeout | null
  connected: Map<string, PeerInfo>
  discovered: Map<string, PeerInfo>
  dialing: Map<string, boolean>
  banned: Map<string, boolean> = new Map()

  interval: number = INTERVAL
  maxPeers: number = MAX_PEERS
  constructor (public node: Libp2p,
               @register('options')
               options: any) {
    super()

    assert(node, 'node is required')
    this.intervalTimer = null
    this.connected = new Map()
    this.discovered = new Map()
    this.dialing = new Map()
    this.interval = options.interval || this.interval
    this.maxPeers = options.maxPeers || this.maxPeers

    // store discovered peers to dial them later
    node.on('peer:discovery', (peerInfo: PeerInfo) => {
      const id = peerInfo.id.toB58String()
      if (this.discovered.size > MAX_PEERS_DISCOVERED || this.banned.has(id)) return
      this.discovered.set(id, peerInfo)
      log(`peer discovered ${id}`)
    })
  }

  async start () {
    await this.tryConnect()
    this.intervalTimer = setInterval(this.tryConnect.bind(this), this.interval)
  }

  async stop () {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer)
    }
  }

  get b58Id () {
    return this.b58Id
  }

  banPeer (peerInfo: PeerInfo, maxAge: number = 60 * 1000) {
    const id = peerInfo.id.toB58String()
    this.banned.set(id, true)
    this.connected.delete(id)
    this.discovered.delete(id)
    setTimeout(() => {
      this.banned.delete(peerInfo.id.toB58String())
    }, maxAge)
  }

  async tryConnect (): Promise<void> {
    if (this.connected.size <= this.maxPeers) {
      if (this.discovered.size > 0) {
        const [id, peer] = this.discovered.entries().next().value
        this.discovered.delete(id)
        return this.dial(peer)
      }
    }
  }

  async dial (peerInfo: PeerInfo, protocol?: string): Promise<any> {
    const id = peerInfo.id.toB58String()
    if (this.dialing.has(id)) {
      log(`dial already in progress for ${id}`)
      return
    }

    if (this.banned.has(id)) {
      log(`peer ${id} banned, skipping dial`)
      return
    }

    let conn = null
    try {
      this.dialing.set(id, true)
      conn = await this.node.dialProtocol(peerInfo, protocol)
      this.connected.set(id, peerInfo)
      this.emit('peer:dialed', peerInfo)
    } catch (err) {
      log(err)
    } finally {
      this.dialing.delete(id)
    }

    return conn
  }

  async hangup (peer: PeerInfo) {
    return this.node.hangUp(this.node, peer)
  }
}
