'use strict'

import { PeerInfo, Peer as RLPxPeer } from 'ethereumjs-devp2p'
import { IPeerDescriptor } from '../interfaces'
import { register } from 'opium-decorator-resolvers'

@register()
export class Devp2pPeer implements IPeerDescriptor<RLPxPeer> {
  peer: RLPxPeer
  addrs: Set<string> = new Set() // use multiaddr for internal representation

  tcpPort?: number
  udpPort?: number
  addr?: string

  private _id?: string = ''
  get id (): string {
    return this._id!
  }

  constructor (peer: RLPxPeer, addrs: Set<PeerInfo>) {
    this.peer = peer
    if (peer && peer.getId()) {
      this._id = (peer.getId() || Buffer.from([0])).toString('hex')
    }

    addrs.forEach((p: PeerInfo) => {
      if (p.tcpPort) {
        this.tcpPort = p.tcpPort
        this.addrs.add(`/ip4/${p.address}/tcp/${p.tcpPort}`)
      }

      if (p.udpPort) {
        this.udpPort = p.udpPort
        this.addrs.add(`/ip4/${p.address}/udp/${p.tcpPort}`)
      }

      this.addr = p.address
    })
  }
}
