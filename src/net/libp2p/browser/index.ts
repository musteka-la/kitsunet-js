'use strict'

import WS from 'libp2p-websockets'
import WStar from 'libp2p-webrtc-star'
import Bootstrap from 'libp2p-bootstrap'
import PeerInfo from 'peer-info'
import { Libp2pNode } from '../libp2p-node'

export async function createNode (
  identity?: { privKey?: string },
  addrs?: string[],
  bootstrap?: string[]): Promise<Libp2pNode> {

  const peerInfo: PeerInfo = await Libp2pNode.createPeerInfo(identity, addrs)
  const wstar = new WStar()
  const node = new Libp2pNode(peerInfo, {
    modules: {
      transport: [
        WS,
        wstar
      ],
      peerDiscovery: [
        wstar.discovery,
        Bootstrap
      ]
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          list: bootstrap,
          interval: 10000
        }
      }
    }
  })
  return node
}
