'use strict'

const Peer = require('./peer')

class RemotePeer extends Peer {
  constructor (id, rpc) {
    super(id)
    this._ttl = 0
    this._rpc = rpc
  }

  set rpc (rpc) {
    this._rpc = rpc
  }

  get rpc () {
    return this._rpc
  }

  get ttl () {
    return this._ttl
  }

  _heartBeat () {
    // TODO: implement heartbeat
  }
}

module.exports = RemotePeer
