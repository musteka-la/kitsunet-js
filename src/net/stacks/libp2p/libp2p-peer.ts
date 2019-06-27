'use strict'

import PeerInfo from 'peer-info'
import { NetworkPeer } from '../../network-peer'
import { ExtractFromLibp2pPeer } from '../../helper-types'

export class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
  node?: ExtractFromLibp2pPeer
  peer: PeerInfo
  get id (): string {
    return this.peer.id.toB58String()
  }

  get addrs (): Set<string> {
    return this.peer.multiaddrs.toArray().map((a) => a.toString())
  }

  constructor (peer: PeerInfo, node?: ExtractFromLibp2pPeer) {
    super()
    this.peer = peer
    this.node = node
  }

  async disconnect<R extends any> (reason?: R): Promise<void> {
    if (this.node) return this.node.disconnectPeer(this, reason)
  }

  async ban<R extends any> (reason?: R, maxAge?: number): Promise<void> {
    if (this.node) return this.node.banPeer(this, maxAge, reason)
  }
}
