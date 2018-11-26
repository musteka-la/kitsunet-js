const websocket = require('websocket-stream')
const createHttpClientStream = require('http-poll-stream/src/client')

module.exports = {
  connectViaPost,
  connectViaWs
}

function connectViaPost (opts = {}) {
  const { adminCode, url } = opts
  const connectionId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  const uri = adminCode ? `${url}/${adminCode}/stream/${connectionId}` : `${url}/stream/${connectionId}`
  const clientStream = createHttpClientStream({ uri })
  return clientStream
}

function connectViaWs (opts = {}) {
  const { adminCode, url } = opts
  const ws = websocket(adminCode ? `${url}/${adminCode}` : `${url}`)
  return ws
}
