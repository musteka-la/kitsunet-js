'use strict'

module.exports = (slice) => {
  return `
  {
    "jsonrpc": "2.0",
    "method": "debug_getSliceKeys",
    "params": [
      "${slice.path}",
      ${slice.depth},
      "${slice.stateRoot}"
    ],
    "id": 1
  }`
}
