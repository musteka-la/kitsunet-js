'use strict'

const EE = require('safe-event-emitter')

const { TYPES } = require('../constants')

class Peer extends EE {
  constructor (id) {
    super()
    this._id = id // peer id
    this._nodeType = TYPES.NORMAL
    this._latestBlock = null
    this._blackList = []
    this._slices = new Set()
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

  set latestBlock (bestBlock) {
    this._latestBlock = bestBlock
  }

  get latestBlock () {
    return this._latestBlock
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
