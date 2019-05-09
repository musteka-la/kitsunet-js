'use strict'

import { Node } from '../node'
import { Devp2pPeer } from './devp2p-peer'
import { randomBytes } from 'crypto'
import { register } from 'opium-decorator-resolvers'
import { NetworkPeer } from '../peer'

import {
  Peer,
  DPT,
  RLPx,
  PeerInfo,
  ProtocolDescriptor
} from 'ethereumjs-devp2p'

import {
  NetworkType,
  IProtocolConstructor,
  IProtocol,
  INetwork,
  IProtocolDescriptor,
  ICapability,
  IPeerDescriptor
} from '../interfaces'
import proto = require('../protocols/kitsunet/proto')

export interface RLPxNodeOptions {
  key: Buffer
  port: number
  bootnodes: string[]
  clientFilter: string[]
}

export const defaultOptions: RLPxNodeOptions = {
  port: 30303,
  key: randomBytes(32),
  clientFilter: ['go1.5', 'go1.6', 'go1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain'],
  bootnodes: []
}

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

  constructor (@register() public dpt: DPT,
               @register() public rlpx: RLPx,
               @register() public peerInfo: PeerInfo,
               @register() private protocolRegistry: IProtocolDescriptor<Devp2pPeer>[]) {
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

      const peerProtos: string[] = rlpxPeer
      .getProtocols()
      .map(p => p.constructor.name.toLowerCase())

      this.protocolRegistry.forEach((protoDescriptor: IProtocolDescriptor<Devp2pPeer>) => {
        // TODO: we might have to use a map of id to proto name here or something similar
        if (peerProtos.includes(proto.id)) {
          const Protocol: IProtocolConstructor<Devp2pPeer> = protoDescriptor.constructor
          const proto = new Protocol(devp2pPeer, this as INetwork<Devp2pPeer>)
          devp2pPeer.protocols.set(proto.id, proto)
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

  send<T, U = T> (msg: T,
                  protocol?: IProtocol<Devp2pPeer> | undefined,
                  peer?: Devp2pPeer | undefined): Promise<void | U | U[]> {
    throw new Error('Method not implemented.')
  }
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U | U[]> {
    throw new Error('Method not implemented.')
  }
  mount (protocol: IProtocol<Devp2pPeer>): void {
    throw new Error('Method not implemented.')
  }
  unmount (protocol: IProtocol<Devp2pPeer>): void {
    throw new Error('Method not implemented.')
  }
}
