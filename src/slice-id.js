'use strict'

class SliceId {
  constructor ({ path, depth, root, isStorage }) {
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
