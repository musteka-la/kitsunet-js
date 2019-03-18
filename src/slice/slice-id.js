'use strict'

const cbor = require('borc')

class SliceId {
  constructor (path = '0x0000', depth = 10, root = null, isStorage = false) {
    if (Buffer.isBuffer(path)) {
      [ path, depth, root, isStorage ] = cbor.decode(path)
    } else if (typeof path === 'string' && path.includes('-')) {
      [path, depth, root] = path.split('-')
    }

    this.path = path
    this.depth = Number(depth)
    this.root = root
    this.isStorage = isStorage
  }

  get id () {
    return `${this.path}-${this.depth}-${this.root}`
  }

  serialize () {
    return cbor.encode({
      path: this.path,
      depth: this.depth,
      root: this.root,
      isStorage: this.isStorage
    })
  }
}

module.exports = SliceId
