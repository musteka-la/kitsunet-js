'use strict'

const { Opium } = require('opium-ioc')
const dependencies = require('./dependencies')
const ethUtils = require('ethereumjs-util')

const { SliceId } = require('./slice')

const log = require('debug')('kitsunet:kitsunet-factory')

module.exports = async (options) => {
  const container = new Opium('kitsunet')
  const deps = await dependencies(container, options)

  const kitsunetDep = deps.getDep('kitsunet')
  const kitsunet = await kitsunetDep.inject()

  let paths = options.slicePath || []
  let ethAddrs = options.ethAddrs || []
  if (ethAddrs.length) {
    paths = paths.concat(ethAddrs.map((a) => {
      if (ethUtils.isValidAddress(a)) {
        return ethUtils.keccak256(ethUtils.stripHexPrefix(a)).toString('hex').slice(0, 4)
      }
    }))
  }

  let slices = new Set(paths.map((p) => {
    return new SliceId(p, options.sliceDepth)
  }))

  if (options.sliceFile && options.sliceFile.length > 0) {
    const sclicesFile = require(options.sliceFile)
    slices = slices.concat(sclicesFile.slices.map((p) => {
      return new SliceId(p, options.sliceDepth)
    }))
  }

  kitsunet.on('kitsunet:start', () => {
    log('kitsunet started')
    kitsunet.sliceManager.track(slices)
  })
  return kitsunet
}
