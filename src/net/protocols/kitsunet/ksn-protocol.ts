'use strict'

import EE from 'events'
import pull from 'pull-stream'
import pbb from 'pull-protocol-buffers'
import { KsnProto } from './handlers/ksn-proto'
import nextTick from 'async/nextTick'
import { IProtocol, INetworkProvider, IEncoder } from '../../interfaces'
import debug from 'debug'

const { Status } = KitsunetProto
const log = debug('kitsunet:kitsunet-proto')

const _VERSION = '1.0.0'

export class KsnProtocol extends EE implements IProtocol {
  get id (): string {
    return 'ksn'
  }

  get codec (): string {
    return `/kitsunet/client/${_VERSION}`
  }

  networkProvider?: INetworkProvider
  encoder?: IEncoder

  constructor (provider?: INetworkProvider, encoder?: IEncoder) {
    super()
    this.networkProvider = provider
    this.encoder = encoder
  }

  async handle<T> (readable: AsyncIterable<T & Buffer>): Promise<void> {
    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    for await (const msg of readable) {
      for await (const decoded of this.encoder.decode(msg)) {
        await this._processMessage(decoded)
      }
    }
  }

  async* send<T extends Buffer, U> (msg: T, protocol: IProtocol): AsyncIterator<U> {
    if (!this.networkProvider) {
      throw new Error('networkProvider not set!')
    }

    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    for await (const chunk of this.encoder.encode(msg)) {
      yield this.networkProvider.send(chunk, protocol)
    }
  }

  /**
   * Send a request to the remote peer
   *
   * @param {PeerInfo} peerInfo - the peer to send the request to
   * @param {Object} msg - the message to send to the remote peer
   */
  async sendRequest (msg) {
    this.networkProvider.send(msg)

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
  async _processMessage (conn) {
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

        let peer = this.peers.get(idB58)
        if (!peer) {
          peer = new KsnProto(peerInfo, this)
          this.peers.set(idB58, peer)
          if (await peer.identify()) {
            nextTick(() => this.emit('kitsunet:peer-connected', peer))
          } else {
            this.peers.delete(idB58)
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
}
