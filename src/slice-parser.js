'use strict'

const keccak256 = require('ethereumjs-util').keccak256
const rlp = require('rlp')

exports.getStorageFromSlice = function getStorageFromSlice ({ slice, key }) {
  const node = exports.findNode({ slice, key })
  return rlp.decode(node).toString('hex')
}

// FIXME: this uses a flawed underlying slice structure that should be re-thought
exports.findNode = function findNode (key, slice, prefix = 4) {
  const rest = key.slice(prefix).split('')

  // TODO: we should calculate the head
  const head = rlp.decode(`0x${slice.head[Object.keys(slice.head)[0]]}`)
  const sliceNodes = slice.nodes

  let node
  if (Object.keys(sliceNodes).length) {
    const index = parseInt(rest.shift(), 16)
    const headNode = head[index]
    node = rlp.decode(`0x${sliceNodes[headNode.toString('hex')]}`)
  } else {
    node = head
  }

  do {
    if (node.length === 2) {
      const first = node[0].toString('hex')
      const last = node[1]
      switch (parseInt(first[0], 16)) {
        case 0:
        case 1:
          continue
        case 2:
        case 3:
          return [last, rest]
        default:
          throw new Error('unknown hex prefix on trie node')
      }
    }

    const index = parseInt(rest.shift(), 16)
    if (!node[index]) {
      throw new Error(`${index} doesn't exist in slice`)
    }

    const nodeRlp = `0x${sliceNodes[node[index].toString('hex')]}`
    node = rlp.decode(nodeRlp)
  } while (rest.length)
}

exports.lookupCodeInSlice = function lookupCodeInSlice ({ slice, address }) {
  return slice.leaves[keccak256(address).toString('hex')].evmCode
}

exports.addrToPath = function addrToPath (address) {
  const addrHash = keccak256(address)
  return addrHash.toString('hex').slice(0, 4)
}

exports.getKeyPath = function getKeyPath (key) {
  return key.toString('hex').slice(0, 4)
}
