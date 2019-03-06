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
    }

    this.parsed = normalizeKeys(bourne.parse(raw), ['meta'])
  }

  get nodes () {
    return { ...this.stem, ...this.head, ...this.trieNodes }
  }
}

module.exports = Slice
