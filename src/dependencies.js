'use strict'

const Kitsunet = require('./kitsunet')
const SliceManager = require('./slice-manager')
const KitsunetDriver = require('./kitsunet-driver')
const { createNode, KitsunetDialer, KitsunetRpc } = require('./net')
const { DhtDiscovery } = require('./slice/discovery')
// const { default: Blockchain, Header } = require('ethereumjs-blockchain')
// const Level = require('level')

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
  container.registerFactory('kitsunet-discovery',
    (node) => new DhtDiscovery(node),
    ['node'])

  // register kitsunet dialer
  container.registerFactory('kitsunet-dialer',
    (node) => new KitsunetDialer({ node }),
    ['node'])

  // register kitsunet rpc
  container.registerFactory('kitsunet-rpc',
    (node, sliceManager, kitsunetDialer, kitsunetDriver) => new KitsunetRpc({
      node,
      sliceManager,
      kitsunetDialer,
      kitsunetDriver
    }),
    [
      'node',
      'slice-manager',
      'kitsunet-dialer',
      'kitsunet-driver'
    ])

  // // register chain db
  // container.registerFactory('chain-db', (options) => {
  //   return Level(options.chainDb)
  // }, ['options'])

  // // register Blockchain
  // // TODO: do propper blockchain setup (hardforks, etc...)
  // container.registerFactory('blockchain',
  //   (db) => {
  //     return new Blockchain({ db, validate: false })
  //   },
  //   ['chain-db'])

  // register KitsunetDriver options
  container.registerFactory('kitsunet-driver',
    (node, kitsunetDialer, options, discovery, blockTracker) => {
      return new KitsunetDriver({
        node,
        kitsunetDialer,
        isBridge: options.bridge,
        discovery,
        // blockchain, // TODO: needs a checkpointed blockchain (in the works)
        blockTracker
      })
    }, [
      'node',
      'kitsunet-dialer',
      'options',
      'kitsunet-discovery',
      // 'blockchain',
      'block-tracker'
    ])

  // register SliceManager options
  container.registerFactory('slice-manager',
    (bridgeTracker, pubsubTracker, slicesStore, blockTracker, kitsunetDriver) => {
      return new SliceManager({
        bridgeTracker,
        pubsubTracker,
        slicesStore,
        blockTracker,
        kitsunetDriver
      })
    }, [
      'bridge-tracker',
      'pubsub-tracker',
      'slices-store',
      'block-tracker',
      'kitsunet-driver'
    ])

  // register kitsunet
  container.registerFactory('kitsunet',
    (sliceManager, kitsunetDriver, kitsunetRpc) => {
      kitsunetDriver.kitsunetRpc = kitsunetRpc // circular dep
      return new Kitsunet(sliceManager, kitsunetDriver)
    },
    [
      'slice-manager',
      'kitsunet-driver',
      'kitsunet-rpc'
    ])

  return container
}
