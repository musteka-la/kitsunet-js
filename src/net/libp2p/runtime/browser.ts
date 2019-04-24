'use strict'

import promisify = require('promisify-this')

import * as WS from 'libp2p-websockets'
import * as WStar from 'libp2p-webrtc-star'
import * as Bootstrap from 'libp2p-bootstrap'
import * as _PeerInfo from 'peer-info'
import * as _PeerId from 'peer-id'
import { Node } from '../'

const PeerInfo = promisify(_PeerInfo, false)
const PeerId = promisify(_PeerId, false)

export async function createNode ({ identity, addrs, bootstrap }) {
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
