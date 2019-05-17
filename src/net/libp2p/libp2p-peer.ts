'use strict'

import PeerInfo from 'peer-info'
import { register } from 'opium-decorators'
import { NetworkPeer } from '../peer'

@register()
export class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
  peer: PeerInfo
  get id (): string {
    return this.peer.id.toB58String()
  }

  get addrs (): Set<string> {
    return this.peer.multiaddrs.toArray().map((a) => a.toString())
  }

  constructor (peer: PeerInfo) {
    super()
    this.peer = peer
  }
}
