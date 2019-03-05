'use strict'

const promisify = require('pify')

const WS = require('libp2p-websockets')
const TCP = require('libp2p-tcp')
const MDNS = require('libp2p-mdns')
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
          interval: 5000
        }
      }
    }
  })
  node.peerId = peerIdStr

  return node
}

module.exports = createNode
