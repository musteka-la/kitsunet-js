'use strict'

const EE = require('events')
const pull = require('pull-stream')
const pbb = require('pull-protocol-buffers')
const RpcPeer = require('./ksn-peer')
const nextTick = require('async/nextTick')
const { SliceId } = require('../../slice')
const KitsunetProto = require('./proto').Kitsunet
const { Status } = KitsunetProto

const debug = require('debug')
const log = debug('kitsunet:kitsunet-proto')

const _VERSION = '1.0.0'
const codec = `/kitsunet/client/${_VERSION}`

class KsnRpc extends EE {
  get VERSION () {
    return _VERSION
  }

  get USER_AGENT () {
    return 'ksn-js'
  }

  /**
   * Construct the KSN libp2p protocol handler
   *
   * @param {opts} Object
   * @param {Node} node
   * @param {sliceManager} sliceManager
   * @param {KitsunetDriver} kitsunetDriver
   * @param {KitsunetDialer} kitsunetDialer
   */
  constructor ({ node, sliceManager, kitsunetDriver, kitsunetDialer }) {
    super()
    this._node = node
    this._peers = new Map()
    this.sliceManager = sliceManager
    this.kitsunetDriver = kitsunetDriver
    this.kitsunetDialer = kitsunetDialer

    this._handler = this._handler.bind(this)
    this.dialPeer = this.dialPeer.bind(this)

    this._node.on('peer:disconnect', (peerInfo) => {
      const idB58 = peerInfo.id.toB58String()
      this._peers.delete(idB58)
      this.emit('kitsunet:peer-disconnected', peerInfo)
    })
  }

  get nodeType () {
    return this.kitsunetDriver.nodeType
  }

  async getLatestBlock () {
    return this.kitsunetDriver.getLatestBlock()
  }

  getSliceIds () {
    const ids = this.sliceManager.getSliceIds()
    if (ids) {
      return ids.map((s) => Buffer.from(`${s.path}-${s.depth}`))
    }

    return []
  }

  async getSliceById (slice) {
    return this.sliceManager.getSliceById(slice)
  }

  async getSlices (slices) {
    return Promise.all(slices.map((s) => {
      return (this.sliceManager.getSlice(new SliceId(s)))
    })).then((slices) => slices.map((s) => s.serialize()))
  }

  async getHeaders () {
    return this.kitsunetDriver.getHeaders()
  }

  /**
   * Handle incoming requests
   *
   * @param {String} _ - protocol string (discarded)
   * @param {Connection} conn - libp2p connection stream
   */
  async _handler (_, conn) {
    const peer = await this._processConn(conn)
    this._handleRpc(peer, conn)
  }

  /**
   * Dial and identify a remote peer
   *
   * @param {PeerInfo} peerInfo - the peer info to dial
   */
  async dialPeer (peerInfo) {
    const idB58 = peerInfo.id.toB58String()
    if (this._peers.has(idB58)) {
      return this._peers.get(idB58)
    }

    const conn = await this._dial(peerInfo)
    return this._processConn(conn)
  }

  /**
   * Dial a peer on the kitsunet protocol
   *
   * @param {PeerInfo} peerInfo
   */
  async _dial (peerInfo) {
    return this._node.dialProtocol(peerInfo, codec)
  }

  /**
   * Send a request to the remote peer
   *
   * @param {PeerInfo} peerInfo - the peer to send the request to
   * @param {Object} msg - the message to send to the remote peer
   */
  async sendRequest (peerInfo, msg) {
    // NOTE: this doesn't create a connection every time.
    // libp2p muxes and re-uses sockets,
    // so the connection only gets establish once and
    // what's used here is a muxed stream over the socket
    const conn = await this._dial(peerInfo)

    return new Promise((resolve, reject) => {
      pull(
        pull.values([msg]),
        pbb.encode(KitsunetProto),
        conn,
        pbb.decode(KitsunetProto),
        pull.collect((err, data) => {
          if (err) {
            log(err)
            return reject(err)
          }

          if (data && data.length) {
            return resolve(data[0])
          }

          resolve()
        })
      )
    })
  }

  /**
   * Create a new KitsunetPeer (RPC handler) or return an existing one
   *
   * @param {Connection} conn
   */
  async _processConn (conn) {
    return new Promise((resolve, reject) => {
      conn.getPeerInfo(async (err, peerInfo) => {
        if (err) {
          const errMsg = 'Failed to identify incoming conn'
          log(errMsg, err)
          pull(pull.empty(), conn)
          return reject(errMsg)
        }

        const idB58 = peerInfo.id.toB58String()
        if (!peerInfo) {
          throw new Error(`could not resolve peer for ${idB58}, connection ignored`)
        }

        let peer = this._peers.get(idB58)
        if (!peer) {
          peer = new RpcPeer(peerInfo, this)
          this._peers.set(idB58, peer)
          if (await peer.identify()) {
            nextTick(() => this.emit('kitsunet:peer-connected', peer))
          } else {
            this._peers.delete(idB58)
            const errMsg = new Error(`could not perform kitsunet identify for peer ${idB58}`)
            log(errMsg)
            return reject(errMsg)
          }
        }
        return resolve(peer)
      })
    })
  }

  /**
   * Dispatch the rpc message to the correct peer
   *
   * @param {KitsunetPeer} peer
   * @param {Connection} conn
   */
  async _handleRpc (peer, conn) {
    pull(
      conn,
      pbb.decode(KitsunetProto),
      pull.asyncMap(async (msg, cb) => {
        try {
          if (msg) {
            return cb(null, await peer._handleRpc(msg))
          } else {
            throw new Error('unknown message or no data in message')
          }
        } catch (err) {
          log(err)
          cb(null, {
            Msg: {
              status: Status.ERROR,
              error: typeof err.message !== 'undefined' ? err.message : 's'
            }
          })
        }
      }),
      pbb.encode(KitsunetProto),
      conn
    )
  }

  /**
   * Register protocol handlers and events
   *
   * Register a handler that for every dialed peer will
   * try to identify it as a kitsunet peer
   */
  async start () {
    this._node.handle(codec, this._handler)
    this.kitsunetDialer.on('kitsunet:peer-dialed', async (peerInfo) => {
      this.dialPeer(peerInfo)
    })
  }

  /**
   * Unregister handlers
   */
  async stop () {
    this._node.unhandle(codec)
  }
}

module.exports = KsnRpc
