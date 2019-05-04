'use strict'

import { Peer as RLPxPeer } from 'ethereumjs-devp2p'
import { IPeerDescriptor } from '../interfaces'
import { register } from 'opium-decorator-resolvers'

@register()
export class Devp2pPeer implements IPeerDescriptor<RLPxPeer> {
  peer: RLPxPeer
  addrs: Set<string>

  get id (): string {
    return this.peer.getId().toString('hex')
  }

  constructor (peer: RLPxPeer, addrs: Set<string>) {
    this.peer = peer
    this.addrs = addrs
  }
}
