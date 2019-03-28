'use strict'

const utils = require('ethereumjs-util')
const debug = require('debug')
const log = debug('kitsunet:kitsunet-rpc-fetcher')

module.exports = ({ path, depth, root, isStorage }) => {
  const payload = {
    jsonrpc: '2.0',
    method: 'eth_getSlice',
    params: [
      String(path),
      Number(depth),
      utils.addHexPrefix(root),
      Boolean(isStorage)
    ],
    id: 1
  }
  log(payload)
  return payload
}
