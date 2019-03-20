'use strict'

const Kitsunet = require('./kitsunet')
const SliceManager = require('./slice-manager')
const KitsunetDriver = require('./kitsunet-driver')
const { createNode, KitsunetNode } = require('./net/kitsunet-node')
const { DhtDiscovery } = require('./slice/discovery')
const Blockchain = require('ethereumjs-blockchain')
const Level = require('level')

const { dependencies: trackerDeps } = require('./slice/trackers')
const { dependencies: storeDependencies } = require('./stores')

module.exports = async (container, options) => {
  container = trackerDeps(container, options)
  container = storeDependencies(container, options)

  container.registerInstance('options', options)

  // register node
  container.registerFactory('node', async (options) => createNode({
    identity: options.identity,
    addrs: options.libp2pAddrs,
    bootstrap: options.libp2pBootstrap || []
  }), ['options'])

  // register dht discovery
  container.registerFactory('kitsunet-discovery', (node) => new DhtDiscovery(node), ['node'])

  // register kitsunet node
  container.registerFactory('kitsunet-node', (node) => new KitsunetNode({ node }), ['node'])

  // register chain db
  container.registerFactory('chain-db', (options) => {
    return Level(options.chainDb)
  }, ['options'])

  // register Blockchain
  // TODO: do propper blockchain setup (hardforks, etc...)
  container.registerFactory('blockchain', (db) => new Blockchain({ db }), ['chain-db'])

  // register KitsunetDriver options
  container.registerFactory('kitsunet-driver',
    (node, kitsunetNode, options, discovery, blockchain) => {
      return new KitsunetDriver({
        node,
        kitsunetNode,
        isBridge: options.bridge,
        discovery,
        blockchain
      })
    }, [
      'node',
      'kitsunet-node',
      'options',
      'kitsunet-discovery',
      'blockchain'
    ])

  // register SliceManager options
  container.registerFactory('slice-manager',
    (bridgeTracker, pubsubTracker, kitsunetStore, blockTracker, kitsunetDriver) => {
      return new SliceManager({
        bridgeTracker,
        pubsubTracker,
        kitsunetStore,
        blockTracker,
        kitsunetDriver
      })
    }, [
      'bridge-tracker',
      'pubsub-tracker',
      'kitsunet-store',
      'block-tracker',
      'kitsunet-driver'
    ])

  // register kitsunet
  container.registerFactory('kitsunet',
    (sliceManager, kitsunetDriver) => new Kitsunet(sliceManager, kitsunetDriver),
    ['slice-manager', 'kitsunet-driver'])

  return container
}