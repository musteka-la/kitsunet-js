'use strict'

import Debug, { Debugger } from 'debug'
import { Node } from '../../node'
import { Devp2pPeer } from './devp2p-peer'
import { register } from 'opium-decorators'

const debug = Debug('kitsunet:net:devp2p:node')

import {
  Peer,
  DPT,
  RLPx,
  PeerInfo,
  LES,
  ETH
} from 'ethereumjs-devp2p'

import {
  NetworkType,
  IProtocol,
  IProtocolDescriptor,
  ICapability
} from '../../interfaces'

import { EthChain, IBlockchain } from '../../../blockchain'
import Common from 'ethereumjs-common'

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
  'Hash verification failed',
  'should have valid tag:'
].join('|'))

/**
 * Devp2p node
 *
 * @fires RlpxNode#kitsunet:peer:connected - fires on new connected peer
 * @fires RlpxNode#kitsunet:peer:disconnected - fires when a peer disconnects
 */
@register()
export class Devp2pNode extends Node<Devp2pPeer> {
  started: boolean = false
  peer?: Devp2pPeer

  logger: Debugger = debug

  // the protocols that this node supports
  caps: ICapability[] = [
    {
      id: 'eth',
      versions: ['62', '63']
    }
  ]

  get type (): NetworkType {
    return NetworkType.DEVP2P
  }

  constructor (public dpt: DPT,
               public rlpx: RLPx,
               @register(EthChain)
               public chain: IBlockchain,
               @register('devp2p-peer-info')
               public peerInfo: PeerInfo,
               public common: Common,
               @register('protocol-registry')
               private protocolRegistry: IProtocolDescriptor<Devp2pPeer>[]) {
    super()
  }

  /**
   * Start Devp2p/RLPx server. Returns a promise that
   * resolves once server has been started.
   * @return {Promise}
   */
  async start (): Promise <void> {
    if (this.started) {
      return
    }

    const { udpPort, address } = this.peerInfo
    this.dpt.bind(udpPort, address)
    await this.init()
    // this.common.bootstrapNodes().map(async (node: any) => {
    //   const bootnode: PeerInfo = {
    //     id: node.id,
    //     address: node.ip,
    //     udpPort: node.port,
    //     tcpPort: node.port
    //   }
    //   await this.dpt.bootstrap(bootnode)
    //   return
    // })
    this.started = true
  }

  /**
   * Stop Devp2p/RLPx server. Returns a promise that
   * resolves once server has been stopped.
   *
   * @return {Promise}
   */
  async stop (): Promise<any> {
    if (!this.started) {
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
      this.emit('error', error)
    } else {
      throw error
    }
  }

  /**
   * Get the rlpx protocol for this proto
   *
   * @param {IProtocol} proto - the protocol to resolve
   */
  private getRlpxProto (proto: IProtocol<Devp2pPeer>): ETH | LES | undefined {
    return proto.peer.peer.getProtocols()
      .find((p) => p
        .constructor
        .name
        .toLowerCase() === proto.id)
  }

  /**
   *
   * @param rlpxPeer
   * @param reason
   */
  private disconect (rlpxPeer, reason) {
    if (rlpxPeer.getId()) {
      const id = rlpxPeer.getId().toString('hex')
      const devp2pPeer = this.peers.get(id)
      if (devp2pPeer) {
        this.peers.delete(id)
        this.logger(`Peer disconnected (${rlpxPeer.getDisconnectPrefix(reason)}): ${id}`)
        this.emit('kitsunet:peer:disconnected', devp2pPeer)
      }
    }
  }

  /**
   * Initializes RLPx instance for peer management
   * @private
   */
  private async init () {
    this.rlpx.on('peer:added', async (rlpxPeer: Peer) => {
      const devp2pPeer: Devp2pPeer = new Devp2pPeer(rlpxPeer)
      const protos = this.registerProtos(this.protocolRegistry, devp2pPeer)
      for (const proto of protos) {
        const rlpxProto = this.getRlpxProto(proto)
        if (rlpxProto) {
          rlpxProto.on('message', async (code: any, payload: any) => {
            const source: AsyncIterable<any> = {
              [Symbol.asyncIterator]: async function* () {
                yield [code, ...payload]
              }
            }

            // read from remote
            for await (const msg of proto.receive(source)) {
              return msg
            }
          })
        }

        await proto.handshake()
      }

      this.peers.set(devp2pPeer.id, devp2pPeer)
      this.emit('kitsunet:peer:connected', devp2pPeer)
    })

    this.rlpx.on('peer:removed', (rlpxPeer, reason) => {
      this.disconect(rlpxPeer, reason)
    })

    this.rlpx.on('peer:error', (rlpxPeer, error) => {
      this.disconect(rlpxPeer, error)
      this.error(error, rlpxPeer)
    })

    this.rlpx.on('error', e => this.error(e))
    this.rlpx.on('listening', () => {
      const enode = {
        transport: 'devp2p',
        url: `enode://${this.rlpx._id.toString('hex')}@[::]:${this.peerInfo.tcpPort}`
      }
      this.emit('listening', enode)
      console.log(`devp2p listening on ${enode.url}`)
    })

    const { tcpPort, address } = this.peerInfo
    if (tcpPort) {
      this.rlpx.listen(tcpPort, address)
    }
  }

  send<T, U = T> (msg: T[],
                  protocol?: IProtocol<Devp2pPeer>,
                  peer?: Devp2pPeer): Promise<void | U | U[]> {
    if (!peer || !protocol) {
      throw new Error('both peer and protocol are required!')
    }

    const rlpxProto = this.getRlpxProto(protocol)
    if (rlpxProto) {
      return rlpxProto._send(msg.shift(), msg.shift())
    }

    throw new Error('no such protocol!')
  }
}
