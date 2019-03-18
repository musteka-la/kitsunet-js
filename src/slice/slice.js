'use strict'

const SliceId = require('./slice-id')
const normalizeKeys = require('normalize-keys')

const bourne = require('bourne')

const cbor = require('borc')

class Slice extends SliceId {
  static parse (data) {
    let parsed
    if (Buffer.isBuffer(data)) {
      parsed = cbor.decode(data)
      parsed = { ...parsed, ...cbor.decode(parsed.__sliceId__) }
      delete parsed.__sliceId__
    } else if (typeof data === 'string') {
      parsed = normalizeKeys(bourne.parse(data), ['metadata'])
    } else if (typeof data === 'object') {
      parsed = normalizeKeys(data, ['metadata'])
    } else {
      throw new Error('slice data must be Buffer, JSON or a parsed Slice Object')
    }

    return parsed
  }

  constructor (data) {
    const parsed = Slice.parse(data)
    const [path, depth, root] = parsed.sliceId.split('-')

    // call super after parsing the slice
    super(path, depth, root)

    this._parsed = parsed
    this._nodes = { ...this.head, ...this.sliceNodes, ...this.stem }
  }

  get head () {
    return this._parsed.trieNodes.head
  }

  get stem () {
    return this._parsed.trieNodes.stem
  }

  get sliceNodes () {
    return this._parsed.trieNodes.sliceNodes
  }

  get nodes () {
    return this._nodes
  }

  serialize () {
    return cbor.encode({
      __sliceId__: super.serialize(),
      trieNodes: {
        head: this.head,
        stem: this.stem,
        sliceNodes: this.sliceNodes
      }
    })
  }
}

module.exports = Slice
