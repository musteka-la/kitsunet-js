'use strict'

import PeerInfo from 'peer-info'
import { register } from 'opium-decorators'
import { NetworkPeer } from '../../network-peer'
import { Node } from '../../node'

@register()
export class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
  node: Node<Libp2pPeer>
  peer: PeerInfo
  get id (): string {
    return this.peer.id.toB58String()
  }

  get addrs (): Set<string> {
    return this.peer.multiaddrs.toArray().map((a) => a.toString())
  }

  constructor (peer: PeerInfo, node: Node<Libp2pPeer>) {
    super()
    this.peer = peer
    this.node = node
  }

  async disconnect<R extends any> (reason?: R): Promise<void> {
    return this.node.disconnectPeer(this, reason)
  }

  async ban<R extends any> (reason?: R, maxAge?: number): Promise<void> {
    return this.node.banPeer(this, maxAge, reason)
  }
}
