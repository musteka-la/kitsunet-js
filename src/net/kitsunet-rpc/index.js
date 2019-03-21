'use strict'

const EE = require('safe-event-emitter')
const pull = require('pull-stream')
const pbb = require('pull-protocol-buffers')
const promisify = require('promisify-this')
const Peer = require('./peer')
const nextTick = require('async/nextTick')
const KitsunetProto = require('./proto')

const { Status, MsgType } = KitsunetProto

const log = require('debug')('kitsunet:kitsunet-proto')

const _VERSION = '1.0.0'
const codec = `/kitsunet/proto/${_VERSION}`

class KitsunetRpc extends EE {
  static get VERSION () {
    return _VERSION
  }

  static get USER_AGENT () {
    return 'ksn-js'
  }

  constructor ({ node, sliceManager, kitsunetDriver }) {
    super()
    this._node = node
    this._peers = new Map()
    this.sliceManager = sliceManager
    this.kitsunetDriver = kitsunetDriver

    this._handler = this._handler.bind(this)
  }

  get nodeType () {
    return this.kitsunetDriver.nodeType
  }

  get latestBlock () {
    return this.sliceManager.latestBlock
  }

  get sliceIds () {
    return this.sliceManager.sliceIds
  }

  get slices () {
    return this.sliceManager.slices
  }

  get headers () {
    return this.kitsunetDriver.headers
  }

  async _handler (_, conn) {
    try {
      const peerInfo = promisify(await conn.getPeerInfo())
      this._processConn(peerInfo, conn)
    } catch (err) {
      log('Failed to identify incoming conn', err)
      return pull(pull.empty(), conn)
    }
  }

  async sendRequest (peer, msg) {
    const conn = await this.node.dialProtocol(peer.peerInfo, codec)
    pull(
      pull.values([msg]),
      pbb.encode(KitsunetRpc),
      conn,
      pull.decode(KitsunetRpc),
      pull.collect((err, data) => {
        if (err) {
          log(err)
          throw err
        }

        if (data && data.length) {
          return data[0]
        }
      })
    )
  }

  async _processConn (peerInfo, conn) {
    const idB58 = peerInfo.id.toB58String()

    pull(
      conn,
      pbb.decode(KitsunetProto),
      pull.asyncMap(async (msg, cb) => {
        const { type } = msg.Msg

        try {
          let peer = this._peers.get(idB58)
          if (type === MsgType.HELLO) {
            peer = peer || new Peer(peerInfo, this)
            this._peers.set(idB58, peer)
            const res = await peer._handleRpc(msg.Msg)
            nextTick(() => this.emit('kitsunet:peer', peer))
            return cb(null, res)
          } else if (type > MsgType.HELLO && type <= MsgType.NODE_TYPE) {
            if (!peer) {
              throw new Error(`unknown peer ${idB58}`)
            }

            peer._handleRpc(msg.Msg)
          } else {
            const errMsg = 'unknown message or no data in message!'
            throw new Error(errMsg)
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
      conn,
      pull.onEnd((err) => {
        if (err) {
          log(err)
        }

        nextTick(() => this.emit('kitsunet:disconnect', peerInfo))
        this._peers.delete(idB58)
      })
    )
  }

  async start () {
    this._node.handle(codec, this._handler)
  }

  async stop () {
    this._node.unhandle(codec)
  }
}

module.exports = KitsunetRpc
