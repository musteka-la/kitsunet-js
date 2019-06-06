'use strict'

import { PeerInfo, Peer } from 'ethereumjs-devp2p'
import { NetworkPeer } from '../../peer'
import { register } from 'opium-decorators'

@register()
export class Devp2pPeer extends NetworkPeer<Peer, Devp2pPeer> {
  used: boolean = false
  peer: Peer
  addrs: Set<string> = new Set() // use multiaddr for internal representation

  private _id: string = ''
  get id (): string {
    return this._id
  }

  peerInfo: PeerInfo
  constructor (peer: Peer) {
    super()
    this.peer = peer
    this.peerInfo = {
      id: peer.getId()!,
      tcpPort: peer._socket.remotePort,
      address: peer._socket.remoteAddress
    }

    if (this.peerInfo && this.peerInfo.id) {
      this._id = this.peerInfo.id.toString('hex')
    }

    if (this.peerInfo.tcpPort) {
      this.addrs.add(`/ip4/${this.peerInfo.address}/tcp/${this.peerInfo.tcpPort}`)
    }

    if (this.peerInfo.udpPort) {
      this.addrs.add(`/ip4/${this.peerInfo.address}/udp/${this.peerInfo.tcpPort}`)
    }
  }
}
