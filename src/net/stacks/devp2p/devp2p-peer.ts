'use strict'

import { PeerInfo, Peer } from 'ethereumjs-devp2p'
import { NetworkPeer } from '../../network-peer'
import { Node } from '../../node'
import { register } from 'opium-decorators'

@register()
export class Devp2pPeer extends NetworkPeer<Peer, Devp2pPeer> {
  node: Node<Devp2pPeer>
  peer: Peer
  addrs: Set<string> = new Set() // use multiaddr for internal representation

  private _id: string = ''
  get id (): string {
    return this._id
  }

  peerInfo: PeerInfo
  constructor (peer: Peer, node: Node<Devp2pPeer>) {
    super()

    this.node = node
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

  async disconnect<R> (reason?: R): Promise<void> {
    return this.node.disconnectPeer(this, reason)
  }

  async ban<R extends any> (reason?: R): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
