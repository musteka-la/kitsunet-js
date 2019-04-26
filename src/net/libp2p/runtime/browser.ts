'use strict'

import promisify from 'promisify-this'
import WS from 'libp2p-websockets'
import WStar from 'libp2p-webrtc-star'
import Bootstrap from 'libp2p-bootstrap'
import PeerInfo from 'peer-info'
import PeerId from 'peer-id'
import { Node } from '../'

const promisifiedPeerInfo = promisify(PeerInfo, false)
const promisifiedPeerId = promisify(PeerId, false)

export async function createNode ({ identity, addrs, bootstrap }) {
  let id: PeerId
  const privKey = identity && identity.privKey ? identity.privKey : null
  if (!privKey) {
    id = await promisifiedPeerId.create()
  } else {
    id = await promisifiedPeerId.createFromJSON(identity)
  }

  const peerInfo: PeerInfo = await promisifiedPeerInfo.create(id)
  const peerIdStr = peerInfo.id.toB58String()

  addrs = addrs || []
  addrs.forEach((a) => peerInfo.multiaddrs.add(a))

  const wstar = new WStar()
  const node = new Node(peerInfo, {
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
  node.peerId = peerIdStr

  return node
}
