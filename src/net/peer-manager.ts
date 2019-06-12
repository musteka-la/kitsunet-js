'use strict'

import { EventEmitter as EE } from 'events'
import { NodeManager } from './node-manager'
import { ICapability } from './interfaces'
import { Peer } from './helper-types'
import { register } from 'opium-decorators'

@register('peer-manager')
export class PeerManager extends EE {
  peers: Map<string, Peer> = new Map()
  constructor (@register('node-manager')
               public nodeManager: NodeManager<Peer>) {
    super()
    this.nodeManager.on('kitsunet:peer:connected', (peer: Peer) => {
      this.peers.set(peer.id, peer)
    })

    this.nodeManager.on('kitsunet:peer:disconected', (peer: Peer) => {
      this.peers.delete(peer.id)
    })
  }

  getById (id: string): Peer | undefined {
    const peer: Peer | undefined = this.peers.get(id)
    if (peer) peer.used = true
    return peer
  }

  getByCapability (cap: ICapability): Peer[] {
    return [...this.peers.values()].filter((p) => !p.used &&
      p.protocols.has(cap.id) &&
      cap.versions.length > 0 && p.protocols.get(cap.id)!
        .versions.some(v => cap.versions.indexOf(v) > -1) &&
        (p.used = true))
  }

  getRandomByCapability (cap: ICapability): Peer | undefined {
    const peers = this.getByCapability(cap)
    const i = Math.floor(Math.random() * peers.length)
    return peers[i]
  }

  getUnusedPeers (): Peer[] {
    return [...this.peers.values()].filter((p) => !p.used)
  }

  getRandomPeer (): Peer | undefined {
    const peers = this.getUnusedPeers()
    const i = Math.floor(Math.random() * peers.length)
    return peers[i]
  }

  releasePeers (peers: Peer[]) {
    peers.forEach(p => p.used = false)
  }
}
