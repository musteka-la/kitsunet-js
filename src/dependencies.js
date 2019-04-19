'use strict'

const Kitsunet = require('./kitsunet')
const SliceManager = require('./slice-manager')
const KsnDriver = require('./ksn-driver')
const { createNode, KsnDialer, KsnRpc } = require('./net')
const { DhtDiscovery } = require('./slice/discovery')
// const { default: Blockchain, Header } = require('ethereumjs-blockchain')
// const Level = require('level')

const { dependencies: trackerDeps } = require('./slice/trackers')
const { dependencies: storeDependencies } = require('./stores')
const { dependencies: telemetryDependencies } = require('./stats')

module.exports = async (container, options) => {
  container = trackerDeps(container, options)
  container = storeDependencies(container)
  container = telemetryDependencies(container, options)

  container.registerInstance('options', options)

  // register node
  container.registerFactory('node', async () => createNode({
    identity: options.identity,
    addrs: options.libp2pAddrs,
    bootstrap: options.libp2pBootstrap || []
  }))

  // register dht discovery
  container.registerFactory('kitsunet-discovery',
    (node) => new DhtDiscovery(node),
    ['node'])

  // register kitsunet dialer
  container.registerFactory('kitsunet-dialer',
    (node) => new KsnDialer({ node, interval: options.dialInterval }),
    ['node'])

  // register kitsunet rpc
  container.registerFactory('kitsunet-rpc',
    (node, sliceManager, ksnDialer, KsnDriver) => new KsnRpc({
      node,
      sliceManager,
      ksnDialer,
      KsnDriver
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

  // register KsnDriver options
  container.registerFactory('kitsunet-driver',
    (node, ksnDialer, options, discovery, blockTracker, telemetry, stats) => {
      return new KsnDriver({
        node,
        ksnDialer,
        isBridge: options.bridge,
        discovery,
        // blockchain, // TODO: needs a checkpointed blockchain (in the works)
        blockTracker,
        telemetry,
        stats
      })
    }, [
      'node',
      'kitsunet-dialer',
      'options',
      'kitsunet-discovery',
      // 'blockchain',
      'block-tracker',
      'telemetry',
      'libp2p-stats'
    ])

  // register SliceManager options
  container.registerFactory('slice-manager',
    (bridgeTracker, pubsubTracker, slicesStore, blockTracker, ksnDriver) => {
      return new SliceManager({
        bridgeTracker,
        pubsubTracker,
        slicesStore,
        blockTracker,
        ksnDriver
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
    (sliceManager, ksnDriver, ksnRpc, telemetry, libp2pStats, kitsunetStats) => {
      ksnDriver.ksnRpc = ksnRpc // circular dep
      telemetry.setStateHandler(() => {
        return {
          libp2p: libp2pStats.getState(),
          kitsunet: kitsunetStats.getState()
        }
      })
      return new Kitsunet(sliceManager, ksnDriver, telemetry, libp2pStats, kitsunetStats)
    },
    [
      'slice-manager',
      'kitsunet-driver',
      'kitsunet-rpc',
      'telemetry',
      'libp2p-stats',
      'kitsunet-stats'
    ])

  return container
}
