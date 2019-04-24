'use strict'

import * as promisify from 'promisify-this'

import * as WS from 'libp2p-websockets'
import * as TCP from 'libp2p-tcp'
import * as MDNS from 'libp2p-mdns'
import * as Bootstrap from 'libp2p-bootstrap'
import * as _PeerInfo from 'peer-info'
import * as _PeerId from 'peer-id'
import { Node } from '../'

const PeerInfo = promisify(_PeerInfo, false)
const PeerId = promisify(_PeerId, false)

async function createNode ({ identity, addrs, bootstrap }) {
  let id = {}
  const privKey = identity && identity.privKey ? identity.privKey : null
  if (!privKey) {
    id = await PeerId.create()
  } else {
    id = await PeerId.createFromJSON(identity)
  }

  const peerInfo = await PeerInfo.create(id)
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

module.exports = createNode
