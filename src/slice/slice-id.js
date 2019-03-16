'use strict'

class SliceId {
  constructor (path = 0x0, depth = 10, root = 0x0, isStorage = false) {
    if (typeof path === 'string' && path.includes('-')) {
      [path, depth, root] = path.split('-')
    }

    this.path = path
    this.depth = depth
    this.root = root
    this.isStorage = isStorage
  }

  get id () {
    return `${this.path}-${this.depth}-${this.root}`
  }
}

module.exports = SliceId
