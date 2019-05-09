'use strict'

import { Node } from '../node'
import { Devp2pPeer } from './devp2p-peer'

import { randomBytes } from 'crypto'
import { Peer as RlpxPeer, DPT, RLPx, PeerInfo } from 'ethereumjs-devp2p'
import { NetworkType, IProtocolConstructor, IProtocol, IPeerDescriptor } from '../interfaces'
import { register } from 'opium-decorator-resolvers'
import { NetworkPeer } from '../peer'
import mafmt from 'mafmt'

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
               @register() public peer: NetworkPeer<Devp2pPeer>,
               @register() private protocolRegistry: IProtocolConstructor<Devp2pPeer>[]) {
    super()
  }

  async send<T, U> (msg: T,
                    protocol?: IProtocol<Devp2pPeer>): Promise<U | U[] | void> {
    throw new Error('Method not implemented.')
  }

  async *receive<T, U> (readable: AsyncIterable<T>): AsyncIterable<U | U[]> {
    throw new Error('Method not implemented.')
  }

  mount (protocol: IProtocol<Devp2pPeer>): void {
    throw new Error('Method not implemented.')
  }

  unmount (protocol: IProtocol<Devp2pPeer>): void {
    throw new Error('Method not implemented.')
  }

  /**
   * Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.
   * @return {Promise}
   */
  async start (): Promise <void> {
    if (this .started) {
      return
    }

    const { udpPort, addr } = this.peer.peer.peer
    this.dpt.bind(udpPort, addr)
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

    await this.initRlpx()
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
  error (error: Error, peer: RlpxPeer) {
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
  async initRlpx () {
    this.rlpx.on('peer:added', async (rlpxPeer) => {
      if (this.peer.id === rlpxPeer.getId().toString('hex')) {
        this.peer.peer.peer.peer = rlpxPeer
        this.started = true
      }

      const peer = new RlpxPeer({
        id: rlpxPeer.getId().toString('hex'),
        host: rlpxPeer._socket.remoteAddress,
        port: rlpxPeer._socket.remotePort,
        protocols: Array.from(this.protocols),
        inbound: !!rlpxPeer._socket.server
      })

      try {
        await peer.accept(rlpxPeer, this)
        this.peers.set(peer.id, peer)
        this.logger.debug(`Peer connected: ${peer}`)
        this.emit('connected', peer)
      } catch (error) {
        this.error(error)
      }
    })

    this.rlpx.on('peer:removed', (rlpxPeer, reason) => {
      const id = rlpxPeer.getId().toString('hex')
      const peer = this.peers.get(id)
      if (peer) {
        this.peers.delete(peer.id)
        this.logger.debug(`Peer disconnected (${rlpxPeer.getDisconnectPrefix(reason)}): ${peer}`)
        this.emit('disconnected', peer)
      }
    })

    this.rlpx.on('peer:error', (rlpxPeer, error) => {
      const peerId = rlpxPeer && rlpxPeer.getId()
      if (!peerId) {
        return this.error(error)
      }
      const id = peerId.toString('hex')
      const peer = this.peers.get(id)
      this.error(error, peer)
    })

    this.rlpx.on('error', e => this.error(e))

    this.rlpx.on('listening', () => {
      this.emit('listening', {
        transport: this.name,
        url: `enode://${this.rlpx._id.toString('hex')}@[::]:${this.port}`
      })
    })

    const { tcpPort, addr } = this.peer.peer.peer
    if (this.port) {
      this.rlpx.listen(tcpPort, addr)
    }
  }
}
