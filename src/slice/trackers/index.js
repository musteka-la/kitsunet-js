'use strict'

const BridgeTracker = require('./slice-bridge')
const PubSubTracker = require('./slice-pubsub')
const dependencies = require('./dependencies')

module.exports = {
  BridgeTracker,
  PubSubTracker,
  dependencies
}
