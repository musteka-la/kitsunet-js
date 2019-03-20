'use strict'

const utils = require('ethereumjs-util')

module.exports = ({ path, depth, root, isStorage }) => {
  return {
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
}
