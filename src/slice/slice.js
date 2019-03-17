'use strict'

const SliceId = require('./slice-id')
const normalizeKeys = require('normalize-keys')

const bourne = require('bourne')

class Slice extends SliceId {
  constructor (data) {
    let parsed
    if (Buffer.isBuffer(data)) {
      parsed = bourne.parse(data.toString())
    } else if (typeof data === 'string') {
      parsed = bourne.parse(data)
    } else if (typeof data === 'object') {
      parsed = data
    } else {
      throw new Error('slice data must be Buffer, JSON or a parsed Slice Object')
    }

    parsed = normalizeKeys(parsed, ['metadata'])
    const [path, depth, root] = parsed.sliceId.split('-')

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
    return Buffer.from(JSON.stringify(this._parsed))
  }
}

module.exports = Slice
