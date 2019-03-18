'use strict'

const assert = require('assert')

const FakeTree = require('fake-merkle-patricia-tree')

const parser = require('../slice-parser')
const { DEFAULT_DEPTH, DEFAULT_PREFIX_LENGTH } = require('../constants')

const SliceId = require('../slice/slice-id')

const ZERO_ROOT = '0000000000000000000000000000000000000000000000000000000000000000'

// A fake PATRICIA Trie to be used with slices and VM's StateManager
class SlicedTrie extends FakeTree {
  constructor ({ root, depth, prefixLen, sliceManager }) {
    super()

    assert(sliceManager, 'SliceManager is required!')

    this.root = root || ZERO_ROOT
    this._depth = depth || DEFAULT_DEPTH
    this._prefixLen = prefixLen || DEFAULT_PREFIX_LENGTH
    this._sliceManager = sliceManager
  }

  get (key, cb) {
    const path = key.slice(0, this._prefixLen)
    const sliceId = new SliceId(path, this._depth, this.root)

    this._sliceManager.getSlice(sliceId)
      .then((slice) => {
        if (slice) {
          const [node, rest] = parser.findNode(key, slice, this._prefixLen)
          if (!node && rest > 0) {
            return this.findNode(key, slice, rest.length)
          }
          return cb(null, node)
        }

        return cb()
      })
  }
}

module.exports = SlicedTrie
