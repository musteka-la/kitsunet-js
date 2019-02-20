const EthQuery = require('eth-query')
const KitsunetBlockTracker = require('kitsunet-block-tracker')
const SliceTracker = require('kitsunet-slice-tracker')
const BlockTracker = require('eth-block-tracker')

const JsonRpcEngine = require('json-rpc-engine')
const createFetchMiddleware = require('eth-json-rpc-middleware/fetch')
const createVmMiddleware = require('eth-json-rpc-middleware/vm')
const createBlockRefRewriteMiddleware = require('eth-json-rpc-middleware/block-ref-rewrite')
const createBlockCacheMiddleware = require('eth-json-rpc-middleware/block-cache')
const asMiddleware = require('json-rpc-engine/src/asMiddleware')
const createSliceMiddleware = require('eth-json-rpc-kitsunet-slice')

const scaffold = require('eth-json-rpc-middleware/scaffold')

module.exports = createEthSliceProvider

function createRpcProviders ({ rpcUrl, rpcEnableTracker }) {
  if (!rpcUrl) { return {} }

  // create higher level
  const engine = new JsonRpcEngine()
  const provider = providerFromEngine(engine)

  // create data source
  const { dataEngine } = createDataEngine({ rpcUrl })
  const dataProvider = providerFromEngine(dataEngine)
  const rpcEthQuery = new EthQuery(provider)

  engine.push(asMiddleware(dataEngine))

  const blockTracker = rpcEnableTracker
    ? new BlockTracker({ provider: dataProvider, pollingInterval: 8e3 })
    : undefined

  return { blockTracker, rpcEthQuery }
}

function createEthSliceProvider ({ rpcUrl, node, depth, rpcEnableTracker }) {
  // create higher level
  const engine = new JsonRpcEngine()
  const provider = providerFromEngine(engine)

  const { blockTracker, rpcEthQuery } = createRpcProviders({ rpcUrl, provider, rpcEnableTracker })

  // if a blockTracker is provided it will fetch and
  // publish blocks on the kitsunet network
  const kitsunetBlockTracker = new KitsunetBlockTracker({
    blockTracker,
    node,
    ethQuery: rpcEthQuery
  })

  const sliceTracker = new SliceTracker({ node, blockTracker: kitsunetBlockTracker })

  // add handlers
  const ethQuery = new EthQuery(provider)
  engine.push(createBlockCacheMiddleware({ blockTracker: kitsunetBlockTracker, provider }))
  engine.push(createBlockRefRewriteMiddleware({ blockTracker: kitsunetBlockTracker }))
  engine.push(createBlockMiddleware({ blockTracker: kitsunetBlockTracker }))
  engine.push(createSliceMiddleware({ ethQuery, sliceTracker, depth }))
  engine.push(createVmMiddleware({ provider }))

  return {
    engine,
    provider,
    blockTracker: kitsunetBlockTracker,
    sliceTracker
  }
}

function createBlockMiddleware ({ blockTracker }) {
  return scaffold({
    eth_getBlockByNumber: async (req, res, next, end) => {
      const [blockRef] = req.params
      if (blockRef === 'latest') {
        res.result = await blockTracker.getLatestBlock()
      } else {
        res.result = await blockTracker.getBlockByNumber(blockRef, false)
      }

      end()
    }
  })
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
