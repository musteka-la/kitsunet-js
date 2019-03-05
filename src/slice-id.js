'use strict'

class SliceId {
  constructor () {
    this.path = ''
    this.depth = 0
    this.root = ''
    this.isStorage = false
  }

  get id () {
    return `${this.path}-${this.depth}-${this.root}`
  }
}

module.exports = SliceId
