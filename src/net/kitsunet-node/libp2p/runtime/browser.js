'use strict'

const promisify = require('promisify-this')

const WS = require('libp2p-websockets')
const WStar = require('libp2p-webrtc-star')
const Bootstrap = require('libp2p-bootstrap')

const PeerInfo = promisify(require('peer-info'))
const PeerId = promisify(require('peer-id'))
const Node = require('../node')

async function createNode (identity, addrs, bootstrap) {
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
          interval: 1000
        }
      }
    }
  })
  node.peerId = peerIdStr

  return node
}

module.exports = createNode
