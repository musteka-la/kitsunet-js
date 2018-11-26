'use strict'

const SafeEventEmitter = require('safe-event-emitter')
const pify = require('pify')

const KitsunetPeer = require('./kitsunet-peer')
const createTelemetry = require('./telemetry')
const sliceFetcher = require('./slice-fetcher')

const log = require('debug')('kitsunet:kitsunet-client')

class Kitsunet extends SafeEventEmitter {
  constructor ({ node, isBridge, bridgeRpc, blockTracker, sliceTracker, slices, telemetryUrl }) {
    super()
    this._node = node
    this._kitsunetPeer = new KitsunetPeer({ node, interval: 10000 })
    this._isBridge = isBridge
    this._bridgeRpc = bridgeRpc
    this._blockTracker = blockTracker
    this._sliceTracker = sliceTracker
    this._telemetryUrl = telemetryUrl

    this.multicast = pify(this._node.multicast)
    this._node.start = pify(node.start.bind(node))
    this._node.stop = pify(node.stop.bind(node))

    this._sliceStreams = new Map()
    this._slices = new Set(slices)

    if (this._isBridge) {
      this._sliceTracker.on('track', (slice) => {
        log(`got slice to track ${slice}`)
        const [path, depth, root] = slice.split('-')
        if (root) {
          this._fetchSlice({ path, depth, root })
        }

        this._trackSlice({ path, depth })
      })

      this._sliceTracker.on('track-storage', (slice) => {
        log(`got storage slice to track ${slice}`)
        const [path, depth, root] = slice.split('-')
        if (root) {
          this._fetchSlice({ path, depth, root, isStorage: true })
        }

        this._trackSlice({ path, depth, isStorage: true })
      })
    }
  }

  get peerInfo () {
    return this._node.peerInfo
  }

  get kitsunetPeer () {
    return this._kitsunetPeer
  }

  async _fetchSlice ({path, depth, root, isStorage}) {
    try {
      const slice = await sliceFetcher.fetcher({
        uri: this._bridgeRpc,
        slice: { path, depth, root, isStorage }
      })

      this._sliceTracker.publish(slice)
    } catch (err) {
      log(err)
      throw err
    }
  }

  _trackSlice ({ path, depth, isStorage }) {
    if (this._isBridge) {
      if (this._sliceStreams.has(`${path}-${depth}`)) {
        return // already registered
      }

      // TODO: the rpc endpoint should support batching of slices
      const fetcher = sliceFetcher.sliceTracker({
        uri: this._bridgeRpc,
        tracker: this._blockTracker,
        slice: { path, depth, isStorage }
      }, (err, slice) => {
        if (err) {
          return log(err)
        }

        this._sliceTracker.publish(slice)
      })

      this._sliceStreams.set(`${path}-${depth}`, fetcher)
    } else {
      // subscribe to slices
      this._sliceTracker.subscribe({ path, depth, isStorage: !!isStorage })
    }
  }

  _registeSlices () {
    this._slices.forEach(async ({ path, depth, isStorage }) => {
      this._trackSlice({ path, depth, isStorage })
    })
  }

  whatchSlices (slices) {
    slices.forEach((s) => this._slices.add(s))
    this._registeSlices()
  }

  async start () {
    if (!this._telemetry) {
      const { telemetry } = await createTelemetry({
        node: this._node,
        kitsunetPeer: this._kitsunetPeer,
        url: this._telemetryUrl
      })
      this._telemetry = telemetry
    }

    await this._node.start()
    await this._blockTracker.start()
    await this._sliceTracker.start()
    await this._telemetry.start()

    this._registeSlices()
  }

  async stop () {
    if (this._telemetry) {
      await this._telemetry.stop()
    }

    await this._node.stop()
    await this._blockTracker.stop()
    await this._sliceTracker.stop()
  }
}

module.exports = Kitsunet
