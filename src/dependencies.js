'use strict'

const Kitsunet = require('./kitsunet')
const SliceManager = require('./slice-manager')
const KitsunetDriver = require('./kitsunet-driver')
const { createNode, KitsunetNode } = require('./net/kitsunet-node')
const { DhtDiscovery } = require('./slice/discovery')
const { BridgetTracker, PubsubTracker } = require('./slice/trackers')
const { Blockchain } = require('ethereumjs-blockchain')
const { Level } = require('level')

module.exports = (container, options) => {
  container.registerInstance('options', options)
  container.registerInstance('is-bridge', Boolean(options.bridge))

  // register chain db
  container.registerFactory('chain-db', (options) => new Level(options.chainDbPath), ['options'])

  // register node options
  container.registerFactory('blockchain-options', (db) => { return { db } }, ['chain-db'])

  // register Blockchain
  // TODO: do propper blockchain setup (hardforks, etc...)
  container.registerInstance('blockchain', Blockchain, ['blockchain-options'])

  // register dht discovery
  container.registerType('dht-discovery', DhtDiscovery, ['node'])

  // register node options
  container.registerFactory('node-options', (options) => {
    return {
      identity: options.identity,
      addrs: options.libp2pAddrs,
      bootstrap: options.libp2pBootstrap || []
    }
  }, ['options'])

  // register node
  container.registerFactory('node', createNode, ['node-options'])

  // register kitsunet node
  container.registerInstance('kitsunet-node-options', { node: null }, ['node'])

  // register kitsunet node
  container.registerType('kitsunet-node', KitsunetNode, ['kitsunet-node-options'])

  // register KitsunetDriver options
  container.registerFactory('kitsunet-driver-options',
    (node, kitsunetNode, isBridge, sliceManager, discovery, blockchain) => {
      return {
        node,
        kitsunetNode,
        isBridge,
        sliceManager,
        discovery,
        blockchain
      }
    }, [
      'node',
      'kitsunet-node',
      'is-bridge',
      'slice-manager',
      'kitsunet-discovery',
      'blockchain'
    ])

  container.registerType('kitsunet-driver', KitsunetDriver, ['kitsunet-driver-options'])

  // register SliceManager options
  container.registerFactory('slice-manager-options',
    (bridgeTracker, pubsubTracker, kitsunetStore, blockTracker, driver) => {
      return {
        bridgeTracker,
        pubsubTracker,
        kitsunetStore,
        blockTracker,
        driver
      }
    }, [
      'bridge-tracker',
      'pubsub-tracker',
      'kitsunet-store',
      'block-tracker',
      'kitsunet-driver'
    ])

  // register SliceManager
  container.registerType('slice-manager', SliceManager, ['slice-manager-options'])

  // register kitsunet
  container.registerType('kitsunet', Kitsunet, ['slice-manager', 'kitsunet-driver'])

  return container
}
