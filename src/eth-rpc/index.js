'use strict'

const createHttpClientStream = require('http-poll-stream/src/client')
const payload = require('./payload')

const log = require('debug')('kitsunet:eth-bridge-rpc')

module.exports = async function ({ uri, tracker, slice }) {
  const clientStream = createHttpClientStream({
    uri,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  clientStream.on('error', log)

  tracker.onBlock((header) => {
    clientStream.write(Buffer.from(payload({
      stateRoot: header.stateRoot,
      ...slice
    })))
  })

  return clientStream
}
