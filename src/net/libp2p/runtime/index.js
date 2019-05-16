'use strict'

const promisify = require('promisify-this')

const WS = require('libp2p-websockets')
const TCP = require('libp2p-tcp')
const MDNS = require('libp2p-mdns')
const Bootstrap = require('libp2p-bootstrap')
const WStar = require('libp2p-webrtc-star')
const wrtc = require('wrtc')

const PeerInfo = promisify(require('peer-info'), false)
const PeerId = promisify(require('peer-id'), false)
const Node = require('../')

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
  const wstar = new WStar({ wrtc })
  const node = new Node(peerInfo, {
    modules: {
      transport: [
        wstar,
        WS,
        TCP
      ],
      peerDiscovery: [
        wstar.discovery,
        MDNS,
        Bootstrap
      ]
    },
    config: {
      dht: {
        enabled: true,
        randomWalk: {
          enabled: false
        }
      },
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
