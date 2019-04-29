'use strict'

import { Peer as RLPxPeer } from 'ethereumjs-devp2p'
import { NetworkPeer } from '../interfaces'
import { register } from 'opium-decorator-resolvers'

@register()
export class Devp2pPeer extends NetworkPeer<RLPxPeer> {
  get id (): string {
    return this.peer.getId().toString('hex')
  }

  get addrs (): Set<string> {
    return new Set() // no way to get addrs from rlpx peer?
  }
}
