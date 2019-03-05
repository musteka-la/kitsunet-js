'use strict'

const EE = require('safe-event-emitter')

const { TYPES } = require('../constants')

class Peer extends EE {
  constructor (id) {
    super()
    this._id = id // peer id
    this._nodeType = TYPES.NORMAL
    this._bestBlock = null
    this._blackList = []
    this._slices = []
  }

  get id () {
    return this._id
  }

  set id (id) {
    this._id = id
  }

  set nodeType (type) {
    this._nodeType = type
  }

  get nodeType () {
    return this._nodeType
  }

  set bestBlock (bestBlock) {
    this._bestBlock = bestBlock
  }

  get bestBlock () {
    return this._bestBlock
  }

  set slices (subscriptions) {
    this._slices = subscriptions
  }

  get slices () {
    return this._slices
  }

  set blackListed (blackList) {
    this._blackList = blackList
  }

  get blackListed () {
    return this._blackList
  }
}

module.exports = Peer