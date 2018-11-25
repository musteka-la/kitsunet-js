const Eth = require('ethjs')
const EthQuery = require('eth-query')
const KitsunetTracker = require('kitsunet-block-tracker')
const SliceTracker = require('kitsunet-slice-tracker')
const BlockTracker = require('eth-block-tracker')

const JsonRpcEngine = require('json-rpc-engine')
const asMiddleware = require('json-rpc-engine/src/asMiddleware')
const createFetchMiddleware = require('eth-json-rpc-middleware/fetch')
const createVmMiddleware = require('./create-vm-middleware')
const createSliceMiddleware = require('eth-json-rpc-kitsunet-slice')

module.exports = createEthSliceProvider

function createRpcProviders ({rpcUrl, provider, rpcEnableTracker}) {
  if (!rpcUrl) { return {} }

  // create data source
  const { dataEngine } = createDataEngine({ rpcUrl })
  const dataProvider = providerFromEngine(dataEngine)
  const ethQuery = new EthQuery(provider)

  let blockTracker
  if (rpcEnableTracker) {
    blockTracker = new BlockTracker({ provider: dataProvider, pollingInterval: 8e3 })
  }

  return { dataEngine, dataProvider, blockTracker, ethQuery }
}

function createEthSliceProvider ({ rpcUrl, node, depth, rpcEnableTracker }) {
  // create higher level
  const engine = new JsonRpcEngine()
  const provider = providerFromEngine(engine)

  const {
    blockTracker,
    dataEngine,
    dataProvider,
    ethQuery
  } = createRpcProviders({ rpcUrl, provider, rpcEnableTracker })

  const kitsunetTracker = new KitsunetTracker({
    blockTracker,
    node,
    ethQuery
  })

  engine.push(createVmMiddleware({ provider }))

  const sliceTracker = new SliceTracker({ node, blockTracker: kitsunetTracker })
  const eth = new Eth(provider)

  // add handlers
  engine.push(createSliceMiddleware({ eth, sliceTracker, depth }))

  if (dataEngine) {
    engine.push(asMiddleware(dataEngine))
  }

  return {
    engine,
    provider,
    dataEngine,
    dataProvider,
    blockTracker: kitsunetTracker,
    sliceTracker,
    eth
  }
}

function createDataEngine ({ rpcUrl }) {
  const dataEngine = new JsonRpcEngine()
  const dataSource = createFetchMiddleware({ rpcUrl })
  dataEngine.push(dataSource)
  return { dataEngine, dataSource }
}

function providerFromEngine (engine) {
  const provider = { sendAsync: engine.handle.bind(engine) }
  return provider
}
