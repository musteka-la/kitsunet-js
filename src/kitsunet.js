'use strict'

// const KitsunetStatsTracker = require('kitsunet-telemetry')

const KitsunetNode = require('./kitsunet-node')
const KitsunetBridge = require('./kitsunet-bridge')

const { Peer, RemotePeer } = require('./peer')
const { createRpc } = require('./rpc')

const { TYPES } = require('./constants')

const log = require('debug')('kitsunet:kitsunet-client')

class Kitsunet extends Peer {
  constructor ({ node, isBridge, bridgeRpc, blockTracker, sliceTracker, slices }) {
    super()
    this._node = node
    this._slices = new Set(slices)

    this._kitsunetNode = new KitsunetNode({ node, interval: 10000 })
    this._kitsunetBridge = new KitsunetBridge({
      bridgeUrl: bridgeRpc,
      sliceTracker,
      node,
      slices: this._slices
    })

    this._remotePeers = new Map()
    this._isBridge = Boolean(isBridge)
    this._blockTracker = blockTracker
    this._sliceTracker = sliceTracker

    this.nodeType = this._isBridge ? TYPES.BRIDGE : TYPES.NORMAL

    this._blockTracker.on('latest', (block) => {
      // TODO: implement logic to figure out whats the best block
      this.peer.latestBlock = this.peer.bestBlock = block
    })

    this._kitsunetNode.on('kitsunet:peer', async ({ id, conn }) => {
      const remote = new RemotePeer(id)
      const rpc = createRpc(this, remote, conn)

      remote.rpc = rpc
      this._remotePeers.set(id, remote)
      rpc.hello() // send the hello message
    })
  }

  async start () {
    await this._node.start()
    await this._blockTracker.start()
    await this._sliceTracker.start()

    if (this.isBridge) {
      await this._kitsunetBridge.start()
    }
    // await this._stats.start()

    this._registerSlices()
  }

  async stop () {
    await this._node.stop()
    await this._blockTracker.stop()
    await this._sliceTracker.stop()

    if (this.isBridge) {
      await this._kitsunetBridge.stop()
    }

    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}

module.exports = Kitsunet
