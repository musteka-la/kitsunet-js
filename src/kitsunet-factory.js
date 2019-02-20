'use strict'

const Kitsunet = require('./kitsunet')
const createEthProvider = require('./eth-provider')
const ethUtil = require('ethereumjs-util')

const createNode = require('./kitsunet-node/libp2p')

module.exports = async function ({ options, identity, addrs }) {
  const node = await createNode({
    identity,
    addrs,
    bootstrap: options.libp2pBootstrap || []
  })

  const providerTools = createEthProvider({
    node,
    rpcUrl: options.rpcUrl,
    depth: options.sliceDepth,
    rpcEnableTracker: Boolean(options.rpcEnableTracker)
  })

  const { blockTracker, sliceTracker } = providerTools

  let paths = options.slicePath || []
  let ethAddrs = options.ethAddrs || []
  if (ethAddrs.length) {
    paths = paths.concat(ethAddrs.map((a) => {
      if (ethUtil.isValidAddress(a)) {
        return ethUtil.keccak256(ethUtil.stripHexPrefix(a)).toString('hex').slice(0, 4)
      }
    }))
  }

  let slices = paths.map((p) => {
    return {
      path: String(p),
      depth: Number(options.sliceDepth)
    }
  })
  if (options.sliceFile && options.sliceFile.length > 0) {
    const sclicesFile = require(options.sliceFile)
    slices = slices.concat(sclicesFile.slices.map((p) => {
      return {
        path: String(p),
        depth: Number(options.sliceDepth)
      }
    }))
  }

  const kitsunet = new Kitsunet({
    node,
    blockTracker,
    sliceTracker,
    bridgeRpc: options.rpcUrl,
    isBridge: options.sliceBridge,
    slices
  })

  return { providerTools, kitsunet, node }
}
