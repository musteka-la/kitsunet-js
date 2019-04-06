'use strict'

const cbor = require('borc')

class SliceId {
  constructor (path = '0x0000', depth = 10, root = null, isStorage = false) {
    [this.path, this.depth, this.root, this.isStorage] = SliceId.parse(path, depth, root, isStorage)
  }

  static parse (path, depth, root, isStorage) {
    if (Buffer.isBuffer(path)) {
      ({ path, depth, root, isStorage } = cbor.decode(path))
    } else if (typeof path === 'string' && path.includes('-')) {
      [path, depth, root] = path.split('-')
    }

    return [path, Number(depth), root, Boolean(isStorage)]
  }

  get id () {
    return `${this.path}-${this.depth}${this.root ? '-' + this.root : ''}`
  }

  serialize () {
    return cbor.encode({
      sliceId: this.id,
      path: this.path,
      depth: this.depth,
      root: this.root,
      isStorage: Boolean(this.isStorage)
    })
  }
}

module.exports = SliceId
