'use strict'

import PeerInfo from 'peer-info'
import { inject } from 'opium-decorator-resolvers'
import { NetworkPeer } from '../peer'

export class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
  peer: PeerInfo
  get id (): string {
    return this.peer.id.toB58String()
  }

  get addrs (): Set<string> {
    return this.peer.multiaddrs.map((a) => a.toString())
  }

  constructor (peer: PeerInfo) {
    super()
    this.peer = peer
  }
}
