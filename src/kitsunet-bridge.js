'use strict'

const EE = require('safe-event-emitter')
const { fetcher } = require('./slice-fetcher')

const log = require('debug')('kitsunet:kitsunet-bridge')

class KitsunetBridge extends EE {
  constructor ({ bridgeUrl, blockTracker, sliceTracker, node, slices }) {
    super()
    this.node = node
    this.slices = slices
    this.bridgeUrl = bridgeUrl
    this.blockTracker = blockTracker
    this.sliceTracker = sliceTracker

    this._sliceStreams = new Map()
    this.fetcher = fetcher(this.bridgeUrl)

    this._blockHandler = async (block) => {
      this.slices.forEach(async (slice) => {
        const { path, depth, isStorage } = slice
        const fetchedSlice = await this.fetchSlice({
          path,
          depth,
          root: block.stateRoot,
          isStorage
        })
        this.sliceTracker.publish(fetchedSlice)
      })
    }
  }

  untrackSlices (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    slices.forEach((slice) => this.slices.delete(slice))
  }

  trackSlices (slices) {
    slices = Array.isArray(slices) ? slices : [slices]
    slices.forEach((slice) => this.slices.add(slice))
  }

  async fetchSlice ({ path, depth, root, isStorage }) {
    return this.fetcher({ path, depth, root, isStorage })
  }

  start () {
    this.blockTracker.on('latest', this._blockHandler)
  }

  stop () {
    this.blockTracker.removeListener('latest', this._blockHandler)
  }
}

module.exports = KitsunetBridge
