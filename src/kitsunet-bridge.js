'use strict'

const EE = require('safe-event-emitter')
const { fetcher } = require('./slice-fetcher')

const log = require('debug')('kitsunet:kitsunet-bridge')

class KitsunetBridge extends EE {
  constructor ({ bridgeUrl, blockTracker, node }) {
    super()
    this.node = node
    this.slices = []
    this.bridgeUrl = bridgeUrl
    this.blockTracker = blockTracker
    this._sliceStreams = new Map()
    this.fetcher = fetcher(this.bridgeUrl)
  }

  async getLatestSlice (path, depth, isStorage) {
  }

  async getSliceForBlock (path, depth, block, isStorage) {
  }

  async getSliceById (sliceId, isStorage) {
  }

  start () {}

  stop () {}
}

module.exports = KitsunetBridge
