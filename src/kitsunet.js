'use strict'

const pify = require('pify')
const createSliceStream = require('./eth-rpc')
const createEthProvider = require('./eth-provider')
const BlockTracker = require('kitsunet-block-tracker')

const log = require('debug')('kitsunet:client')
module.exports = async function run ({ options, node }) {
  await pify(node.start.bind(node))()
  console.log(`kitsunet libp2p started`)

  const ethProvider = createEthProvider({
    rpcUrl: options.rpcUrl,
    interval: options.rpcPollInterval
  })

  const blockTracker = new BlockTracker({ node, ethProvider })
  blockTracker.enable(options.rpcEnableTracker)

  options.slicePath.forEach(async (path) => {
    const sliceStream = await createSliceStream({
      uri: options.rpcUrl,
      tracker: blockTracker,
      slice: {
        path,
        depth: options.sliceDepth
      }
    })

    log(`subscribed to slice ${path}`)
    sliceStream.on('data', (data) => {
      console.dir(data.toString())
    })
  })
}
