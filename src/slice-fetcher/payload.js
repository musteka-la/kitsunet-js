'use strict'

module.exports = ({ path, depth, root, isStorage }) => {
  if (root && root.slice(0, 2) !== '0x') {
    root = `0x${root}`
  }

  return {
    jsonrpc: '2.0',
    method: 'debug_getSlice',
    params: [
      String(path),
      Number(depth),
      String(root),
      Boolean(isStorage)
    ],
    id: 1
  }
}
