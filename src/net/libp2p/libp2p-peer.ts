'use strict'

import { IPeerDescriptor } from '../interfaces'
import PeerInfo from 'peer-info'
import { register } from 'opium-decorator-resolvers'

@register()
export class Libp2pPeer implements IPeerDescriptor<PeerInfo> {
  peer: PeerInfo
  get id (): string {
    return this.peer.id.toB58String()
  }

  get addrs (): Set<string> {
    return this.peer.multiaddrs.map((a) => a.toString())
  }

  constructor (peer: PeerInfo) {
    this.peer = peer
  }
}
