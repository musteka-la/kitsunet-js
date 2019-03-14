'use strict'

const SliceId = require('./slice-id')
const normalizeKeys = require('normalize-keys')

const bourne = require('bourne')

class Slice extends SliceId {
  constructor (data) {
    super()

    let raw
    if (Buffer.isBuffer(data)) {
      raw = data.toString()
    } else if (typeof data === 'string') {
      raw = data
    } else {
      throw new Error('slice data must be Buffer or JSON')
    }

    this.parsed = normalizeKeys(bourne.parse(raw), ['meta'])
    this._nodes = { ...this.stem, ...this.head, ...this.trieNodes }
  }

  get head () {
    return this.parsed.head
  }

  get stem () {
    return this.parsed.stem
  }

  get trieNodes () {
    return this.parsed.trieNodes
  }

  get nodes () {
    return this._nodes
  }

  serialize () {
    return Buffer.from(JSON.stringify(this.parsed))
  }
}

module.exports = Slice
