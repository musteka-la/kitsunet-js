'use strict'

const BaseRpc = require('./base')
const nextTick = require('async/nextTick')

class PeerRpc extends BaseRpc {
  constructor (local, remote) {
    super()
    this._local = local
    this._remote = remote
    this._rpc = null
  }

  hello (hello) {
    if (hello) {
      this._remote.id = hello.id
      this._remote.nodeType = hello.nodeType
      this._remote.bestBlock = hello.bestBlock
      this._remote.blackList = hello.blackList
      this._remote.subscriptions = hello.subscriptions
      nextTick(() => this.emit('hello', hello))
    } else {
      this._rpc.hello({
        id: this._local.id,
        nodeType: this._local.nodeType,
        bestBlock: this._local.bestBlock,
        blackList: this._local.blackList,
        subscriptions: this._local.subscriptions
      })
    }
  }

  setId (id) {
    this._remote.id = id
    nextTick(() => this.emit('id', id))
  }

  getId () {
    return this._local.id
  }

  setNodeType (type) {
    this._remote.nodeType = type
    nextTick(() => this.emit('type', type))
  }

  getNodeType () {
    return this._local.nodeType
  }

  setBestBlock (bestBlock) {
    this._remote.bestBlock = bestBlock
    nextTick(() => this.emit('bestBlock', bestBlock))
  }

  getBestBlock () {
    return this._local.bestBlock
  }

  setSubscriptions (subscriptions) {
    this._remote.subscriptions = subscriptions
    nextTick(() => this.emit('subscriptions', subscriptions))
  }

  getSubscriptions () {
    return this._local.subscriptions
  }

  setBlackListed (blackList) {
    this._remote.blackList = blackList
    nextTick(() => this.emit('blackList', blackList))
  }

  getBlackListed () {
    return this._local.blackList
  }
}

module.exports = PeerRpc
