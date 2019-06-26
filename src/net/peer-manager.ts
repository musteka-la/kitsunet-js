'use strict'

import { EventEmitter as EE } from 'events'
import { NodeManager } from './node-manager'
import { ICapability } from './interfaces'
import { Peer } from './helper-types'
import { register } from 'opium-decorators'
import LRUCache from 'lru-cache'
import { MAX_PEERS } from '../constants'

interface PeerHolder {
  peer: Peer
  used?: boolean
  banned?: boolean
}

@register('peer-manager')
export class PeerManager extends EE {
  peers: LRUCache<string, PeerHolder> = new LRUCache({ max: MAX_PEERS, maxAge: 1000 * 30 })
  constructor (@register('node-manager')
               public nodeManager: NodeManager<Peer>) {
    super()
    this.nodeManager.on('kitsunet:peer:connected', (peer: Peer) => {
      this.peers.set(peer.id, { peer })
    })

    this.nodeManager.on('kitsunet:peer:disconnected', (peer: Peer) => {
      this.peers.del(peer.id)
    })
  }

  getById (id: string): Peer | undefined {
    const peer: PeerHolder | undefined = this.peers.get(id)
    if (peer) return peer.peer
  }

  getByCapability (cap: ICapability): Peer[] {
    return [...this.peers.values()].filter((p) => {
      return (!p.used && !p.banned) &&
      p.peer.protocols.has(cap.id) &&
      cap.versions.length > 0 &&
      p.peer.protocols
        .get(cap.id)!
        .versions
        .some(v => cap.versions.indexOf(v) > -1)
    }).map(p => p.peer)
  }

  getRandomByCapability (cap: ICapability): Peer | undefined {
    const peers = this.getByCapability(cap)
    const i = Math.floor(Math.random() * peers.length)
    return peers[i]
  }

  getUnusedPeers (): Peer[] {
    return [...this.peers.values()]
      .filter((p) => !p.used)
      .map(p => p.peer)
  }

  getRandomPeer (): Peer | undefined {
    const peers = this.getUnusedPeers()
    const i = Math.floor(Math.random() * peers.length)
    return peers[i]
  }

  releasePeers (peers: Peer[]) {
    peers.forEach(p => {
      p && (this.peers.has(p.id) &&
      (this.peers.get(p.id)!.used = false))
    })
  }

  reserve (peers: Peer[]) {
    peers.forEach(p => {
      p && (this.peers.has(p.id) &&
      (this.peers.get(p.id)!.used = true))
    })
  }

  ban (peers: Peer[]) {
    peers.forEach(p => {
      p && (this.peers.has(p.id) &&
      (this.peers.get(p.id)!.banned = true))
    })
  }

  unBan (peers: Peer[]) {
    peers.forEach(p => {
      p && (this.peers.has(p.id) &&
      (this.peers.get(p.id)!.banned = false))
    })
  }

  isUsed (peer: Peer) {
    if (!this.peers.has(peer.id)) {
      throw new Error(`Peer with id ${peer.id} not found`)
    }

    return this.peers.get(peer.id)!.used
  }

  isBanned (peer: Peer) {
    if (!this.peers.has(peer.id)) {
      throw new Error(`Peer with id ${peer.id} not found`)
    }

    return this.peers.get(peer.id)!.banned
  }
}
