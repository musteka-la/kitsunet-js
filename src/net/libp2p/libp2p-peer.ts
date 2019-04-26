'use strict'

import { Peer, IProtocol } from '../interfaces'
import PeerInfo from 'peer-info'

export class Libp2pPeer extends Peer<PeerInfo> {
  get id (): string {
    return this.peer.id.toB58String()
  }

  get addrs (): Set<string> {
    return this.peer.multiaddrs.map((a) => a.toString())
  }
}
