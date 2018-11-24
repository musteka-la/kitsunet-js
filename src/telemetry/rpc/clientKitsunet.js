'use strict'

const base = require('./base')

const { sec, min } = require('../../utils/time')
const randomFromRange = require('../../utils/randomFromRange')

const isNode = require('detect-node')

async function restartWithDelay (timeoutDuration) {
  console.log(`MetaMask Mesh Testing - restarting in ${timeoutDuration / 1000} sec...`)
  setTimeout(() => restart(), timeoutDuration)
}

async function restart () {
  if (!isNode) {
    window.location.reload()
  }
}

module.exports = function () {
  return Object.assign({}, {
    refresh: async () => {
      return restart()
    },
    refreshShortDelay: () => {
      return restartWithDelay(randomFromRange(5 * sec, 10 * sec))
    },
    refreshLongDelay: async () => {
      return restartWithDelay(randomFromRange(2 * min, 10 * min))
    }
  }, base())
}
