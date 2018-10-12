'use strict'

const fetcher = require('./fetcher')

const log = require('debug')('kitsunet:eth-slice-tracker')

module.exports = function ({ uri, tracker, slice }, handler) {
  tracker.on('latest', async (block) => {
    log(`getting slice ${slice.path}-${slice.depth}`)
    try {
      const res = await fetcher({ uri, slice: { root: block.stateRoot, ...slice } })
      return handler(null, res)
    } catch (err) {
      return handler(err)
    }
  })
}
