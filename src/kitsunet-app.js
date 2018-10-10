'use strict'

const pify = require('pify')
const createSliceStream = require('./slice-tracker')
const createEthProvider = require('./eth-provider')
const BlockTracker = require('kitsunet-block-tracker')
const KitsunetPeer = require('./kitsunet-peer')
const createTelemetry = require('./telemetry')

const log = require('debug')('kitsunet:client')
module.exports = async function run ({ options, node }) {
  await pify(node.start.bind(node))()

  const ethProvider = createEthProvider({
    rpcUrl: options.rpcUrl,
    interval: options.rpcPollInterval
  })

  const blockTracker = new BlockTracker({ node, ethProvider })
  blockTracker.enable(options.rpcEnableTracker)

  const kitsunetPeer = new KitsunetPeer({ node, interval: 10000 })
  const { telemetry } = await createTelemetry({ node, kitsunetPeer, devMode: true })
  telemetry.start()

  if (options.sliceBridge) {
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
      sliceStream.on('data', (slice) => {
        node.multicast.publish(`kitsunet:slice:${path}-${options.sliceDepth}`, slice, -1, () => {
          // console.dir(slice.toString())
        })
      })
    })
  }

  options.slicePath.forEach(async (path) => {
    node.multicast.subscribe(`kitsunet:slice:${path}-${options.sliceDepth}`, (msg) => {
      // console.dir(msg.data.toString())
    }, () => {})
  })

  console.log(`kitsunet client running`)
}
