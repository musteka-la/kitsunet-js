'use strict'

const toStream = require('pull-stream-to-stream')
const PeerRpc = require('./peer')

const createRpc = require('json-rpc-async')

module.exports = function (local, remote, conn) {
  const rpcPeer = new PeerRpc(local, remote)
  const rpc = createRpc({ stream: toStream(conn), methods: rpcPeer })
  rpcPeer._rpc = rpc
  return rpc
}
