'use strict'

import { Node } from '../node'
import { Devp2pPeer } from './devp2p-peer'
import { register } from 'opium-decorators'

import {
  Peer,
  DPT,
  RLPx,
  PeerInfo
} from 'ethereumjs-devp2p'

import {
  NetworkType,
  IProtocolConstructor,
  IProtocol,
  INetwork,
  IProtocolDescriptor,
  ICapability
} from '../interfaces'
import proto = require('../protocols/kitsunet/proto')

const ignoredErrors = new RegExp([
  'EPIPE',
  'ECONNRESET',
  'ETIMEDOUT',
  'NetworkId mismatch',
  'Timeout error: ping',
  'Genesis block mismatch',
  'Handshake timed out',
  'Invalid address buffer',
  'Invalid MAC',
  'Invalid timestamp buffer',
  'Hash verification failed'
].join('|'))

@register()
export class RlpxNode extends Node<Devp2pPeer> {
  peer?: Devp2pPeer

  // the protocols that this node supports
  caps: ICapability[] = [
    {
      id: 'eth',
      versions: ['62', '63']
    }
  ]

  port: any
  key: any
  clientFilter: any
  bootnodes: any
  started: any
  refreshInterval: any
  maxPeers: any
  logger: any

  get type (): NetworkType {
    return NetworkType.DEVP2P
  }

  constructor (public dpt: DPT,
               public rlpx: RLPx,
               public peerInfo: PeerInfo,
               private protocolRegistry: IProtocolDescriptor<Devp2pPeer>[]) {
    super()
  }

  /**
   * Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.
   * @return {Promise}
   */
  async start (): Promise <void> {
    if (this.started) {
      return
    }

    const { udpPort, address } = this.peerInfo
    this.dpt.bind(udpPort, address)
    this.bootnodes.map(async (node) => {
      const bootnode: PeerInfo = {
        address: node.ip,
        udpPort: node.port,
        tcpPort: node.port
      }
      await this.dpt.bootstrap(bootnode)
      return
    })
    this.dpt.on('error', this.error)

    await this.init()
    this.started = true
  }

  /**
   * Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this .started) {
      return
    }
    this.rlpx.destroy()
    this.dpt.destroy()
    this.started = false
  }

  /**
   * Handles errors from server and peers
   * @private
   * @param  {Error} error
   * @param  {Peer} peer
   * @emits  error
   */
  error (error: Error, peer?: Peer) {
    if (ignoredErrors.test(error.message)) {
      return
    }
    if (peer) {
      peer.emit('error', error)
    } else {
      throw error
    }
  }

  /**
   * Initializes RLPx instance for peer management
   * @private
   */
  private async init () {
    this.rlpx.on('peer:added', async (rlpxPeer: Peer) => {

      const devp2pPeer: Devp2pPeer = new Devp2pPeer(rlpxPeer)
      if (rlpxPeer.getId()! === this.peerInfo.id) {
        this.peer = devp2pPeer
      }

      this.protocolRegistry.forEach((protoDescriptor: IProtocolDescriptor<Devp2pPeer>) => {
        // TODO: we might have to use a map of
        // id to proto name here or something similar
        const devp2pProto = rlpxPeer
          .getProtocols()
          .find(p => p.constructor.name.toLowerCase() === proto.id)

        if (devp2pProto) {
          const Protocol: IProtocolConstructor<Devp2pPeer> = protoDescriptor.constructor
          const proto = new Protocol(devp2pPeer, this as INetwork<Devp2pPeer>)
          devp2pPeer.protocols.set(proto.id, proto)

          devp2pProto.protocol.on('message', (code, payload) => {
            proto.receive({
              [Symbol.asyncIterator]: async function* () {
                yield [code, ...payload]
              }
            })
          })
        }
      })

      this.peers.set(devp2pPeer.id, devp2pPeer)
    })

    this.rlpx.on('peer:removed', (rlpxPeer, reason) => {
      const id = rlpxPeer.getId().toString('hex')
      const peer = this.peers.get(id)
      if (peer) {
        this.peers.delete(rlpxPeer.getId().toString('hex'))
        this.logger.debug(`Peer disconnected (${rlpxPeer.getDisconnectPrefix(reason)}): ${peer}`)
      }
    })

    this.rlpx.on('peer:error', (rlpxPeer, error) => {
      const peerId = rlpxPeer && rlpxPeer.getId()
      if (!peerId) {
        return this.error(error)
      }
      const id = peerId.toString('hex')
      const peer = this.peers.get(id)
      if (peer) {
        this.error(error, peer.peer)
      }
    })

    this.rlpx.on('error', e => this.error(e))
    this.rlpx.on('listening', () => {
      this.emit('listening', {
        transport: 'devp2p',
        url: `enode://${this.rlpx._id.toString('hex')}@[::]:${this.port}`
      })
    })

    const { tcpPort, address } = this.peerInfo
    if (this.port) {
      this.rlpx.listen(tcpPort, address)
    }
  }

  send<T, U = T> (msg: T[],
                  protocol?: IProtocol<Devp2pPeer>,
                  peer?: Devp2pPeer): Promise<void | U | U[]> {
    if (!peer || !protocol) {
      throw new Error('both peer and protocol are required!')
    }

    const proto = peer.peer.getProtocols()
      .find((p) => p
      .protocol
      .constructor
      .name.
      toLowerCase() === protocol.id)

    if (proto) {
      return proto.protocol._send(msg.shift(), msg)
    }

    throw new Error('no such protocol!')
  }
}
