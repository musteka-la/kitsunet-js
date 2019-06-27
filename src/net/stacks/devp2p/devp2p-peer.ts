'use strict'

import { PeerInfo, Peer } from 'ethereumjs-devp2p'
import { NetworkPeer } from '../../network-peer'
import { ExtractFromDevp2pPeer } from '../../helper-types'

function isPeer (p: any): p is Peer {
  return p instanceof Peer
}

export class Devp2pPeer extends NetworkPeer<Peer, Devp2pPeer> {
  node?: ExtractFromDevp2pPeer
  peer: Peer
  addrs: Set<string> = new Set() // use multiaddr for internal representation
  peerInfo: PeerInfo

  private _id: string = ''
  get id (): string {
    return this._id
  }

  constructor (peer: Peer | PeerInfo, node?: ExtractFromDevp2pPeer) {
    super()

    this.node = node
    if (!isPeer(peer)) {
      this.peerInfo = peer
      this.peer = {} as Peer // no peer for self
    } else {
      this.peer = peer
      this.peerInfo = {
        id: peer.getId()!,
        tcpPort: peer._socket.remotePort,
        address: peer._socket.remoteAddress
      }
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
    if (this.node) return this.node.disconnectPeer(this, reason)
  }

  async ban<R extends any> (reason?: R, maxAge?: number): Promise<void> {
    if (this.node) return this.node.banPeer(this, maxAge, reason)
  }
}
