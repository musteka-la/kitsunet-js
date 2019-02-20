'use strict'

const pify = require('pify')
const EE = require('safe-event-emitter')
// const KitsunetStatsTracker = require('kitsunet-telemetry')

const KitsunetNode = require('./kitsunet-node')
const KitsunetBridge = require('./kitsunet-bridge')
const sliceFetcher = require('./slice-fetcher')
const TYPES = require('./constants').TYPES

const log = require('debug')('kitsunet:kitsunet-client')

class Kitsunet extends EE {
  constructor ({ node, isBridge, bridgeRpc, blockTracker, sliceTracker, slices }) {
    super()
    this._node = node
    this._kitsunetNode = new KitsunetNode({ node, interval: 10000 })
    this._kitsunetBridge = new KitsunetBridge({ bridgeUrl: bridgeRpc })
    this._remotePeers = new Map()

    this._isBridge = Boolean(isBridge)
    this._blockTracker = blockTracker
    this._sliceTracker = sliceTracker

    this.multicast = pify(this._node.multicast)
    this._node.start = pify(node.start.bind(node))
    this._node.stop = pify(node.stop.bind(node))

    this.latestBlock = null
    this.bestBlock = null
    this.subscriptions = []
    this.blackListed = []
    this.noteType = TYPES.NORMAL

    this._blockTracker.on('latest', (block) => {
      // TODO: figure out whats the best block
      this.latestBlock = this.bestBlock = block
    })

    this._slices = new Set(slices)

    this._kitsunetNode.on('kitsunet:peer', async (peer) => {
      peer.rpc.hello({
        id: this._kitsunetNode.id,
        noteType: this.noteType,
        bestBlock: this.bestBlock,
        subscriptions: this._slices,
        latestBlock: this.latestBlock,
        blackListed: this.blackListed
      })
      this._remotePeers.set(peer.id, peer)
    })

    this._sliceTracker.on('track', (slice) => setImmediate(() => {
      log(`got slice to track ${slice}`)
      const [path, depth, root] = slice.split('-')
      if (root && this._bridgeRpcUrl) {
        this._fetchSlice({ path, depth, root })
      }

      this._trackSlice({ path, depth })
    }))

    this._sliceTracker.on('track-storage', (slice) => {
      log(`got storage slice to track ${slice}`)
      const [path, depth, root] = slice.split('-')
      if (root && this._bridgeRpcUrl) {
        this._fetchSlice({ path, depth, root, isStorage: true })
      }

      this._trackSlice({ path, depth, isStorage: true })
    })

    // this._stats = new KitsunetStatsTracker({
    //   node: this._node
    // })
  }

  get peerInfo () {
    return this._node.peerInfo
  }

  get kitsunetNode () {
    return this._kitsunetNode
  }

  async _fetchSlice ({ path, depth, root, isStorage }) {
    const slice = this.KitsunetBridge.fetchSlice({ path, depth, root, isStorage })
    this._sliceTracker.publish(slice)
  }

  _trackSlice ({ path, depth, isStorage }) {
    if (this._isBridge) {
      if (this._sliceStreams.has(`${path}-${depth}`)) {
        return // already registered
      }

      // TODO: the rpc endpoint should support batching of slices
      const fetcher = sliceFetcher.sliceTracker({
        uri: this._bridgeRpcUrl,
        blockTracker: this._blockTracker,
        slice: { path, depth, isStorage }
      }, (err, slice) => {
        if (err) {
          return log(err)
        }

        this._sliceTracker.publish(slice)
      })

      this._sliceStreams.set(`${path}-${depth}`, fetcher)
    }

    // subscribe to slices
    this._sliceTracker.subscribe({ path, depth, isStorage: !!isStorage })
  }

  _registerSlices () {
    this._slices.forEach(async ({ path, depth, isStorage }) => {
      this._trackSlice({ path, depth, isStorage })
    })
  }

  whatchSlices (slices) {
    slices.forEach((s) => this._slices.add(s))
    this._registerSlices()
  }

  async start () {
    await this._node.start()
    await this._blockTracker.start()
    await this._sliceTracker.start()
    // await this._stats.start()

    this._registerSlices()
  }

  async stop () {
    await this._node.stop()
    await this._blockTracker.stop()
    await this._sliceTracker.stop()
    // await this._stats.stop()
  }

  getState () {
    if (!this._stats) return {}
    return this._stats.getState()
  }
}

module.exports = Kitsunet
