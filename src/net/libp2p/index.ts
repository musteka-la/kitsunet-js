'use strict'

import promisify from 'promisify-this'
import WS from 'libp2p-websockets'
import TCP from 'libp2p-tcp'
import Bootstrap from 'libp2p-bootstrap'
import MDNS from 'libp2p-mdns'
import PeerInfo from 'peer-info'
import PeerId from 'peer-id'
import { Node } from './libp2p-node'

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

  const node = new Node(peerInfo, {
    modules: {
      transport: [
        WS,
        TCP
      ],
      peerDiscovery: [
        MDNS,
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
