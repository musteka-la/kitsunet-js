'use strict'

const debug = require('debug')
const log = debug('kitsunet:telemetry:ping')

const sec = 1000
const min = 1000 * 60

const PEER_PING_INTERVAL = min
const PEER_PING_TIMEOUT = 40 * sec

const timeout = (t) => new Promise((resolve) => setTimeout(resolve, t))

async function pingWithTimeout (peer, pingTimeout) {
  // mark client as not responded yet
  let heardPing = false

  return Promise.race([
    // await ping response
    (async () => {
      const start = Date.now()
      await peer.ping()
      heardPing = true
      const end = Date.now()
      const rtt = end - start
      log('timeout check - got ping')
      return rtt
    })(),
    // disconnect peer on timeout
    (async () => {
      await timeout(pingTimeout)
      if (heardPing) return
      log('timeout check - failed')
      throw new Error('ping timed out')
    })()
  ])
}

async function pingPeer (peer, status) {
  const b58Id = peer.idB58
  const time = await pingWithTimeout(peer, PEER_PING_TIMEOUT)
  status = status || { status: '', ping: '' }
  status.ping = time
  status.status = 'connected'
  log(`successfully pinged ${b58Id}`)

  setTimeout(() => {
    pingPeer(peer)
  }, PEER_PING_INTERVAL)
}

module.exports = { pingPeer, pingWithTimeout }
