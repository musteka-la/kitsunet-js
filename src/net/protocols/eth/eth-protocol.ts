'use strict'

import * as Handlers from './handlers'
import Block from 'ethereumjs-block'
import { BaseProtocol } from '../../base-protocol'
import { IEthProtocol, BlockBody, Status } from './interfaces'
import { IPeerDescriptor, INetwork, IEncoder } from '../../interfaces'
import { EthChain } from '../../../blockchain'
import { EthHandler } from './eth-handler'
import { ETH } from 'ethereumjs-devp2p'
import Debug from 'debug'
import { RlpMsgEncoder } from './rlp-encoder'
import BN from 'bn.js'

const debug = Debug(`kitsunet:eth-proto`)

export class Deferred<T> {
  promise: Promise<T>
  resolve: (...args: any[]) => any = Function
  reject: (...args: any[]) => any = Function
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export class EthProtocol<P extends IPeerDescriptor<any>> extends BaseProtocol<P> implements IEthProtocol {
  protocolVersion: number
  handlers: { [key: number]: EthHandler<P> }
  private _status: Deferred<Status> = new Deferred<Status>()

  async getStatus (): Promise<Status> {
    return this._status.promise
  }

  async setStatus (status: Status): Promise<void> {
    this._status.resolve(status)
  }

  /**
   * Construct an Ethereum protocol
   *
   * @param blockChain - the blockchain to use for this peer
   * @param peer - the peer descriptor for this peer
   * @param networkProvider - the network provider
   * @param encoder - an encoder to use with the peer
   */
  constructor (peer: P,
               networkProvider: INetwork<P>,
               public ethChain: EthChain,
               encoder: IEncoder) {
    super(peer, networkProvider, new RlpMsgEncoder())
    this.protocolVersion = Math.max.apply(Math, this.versions.map(v => Number(v)))

    this.handlers = {}
    Object.keys(Handlers).forEach((handler) => {
      const h = Reflect.construct(Handlers[handler], [this, this.peer])
      this.handlers[h.id] = h
    })
  }

  get id (): string {
    return 'eth'
  }

  get versions (): string[] {
    return [
      ETH.eth62.version.toString(),
      ETH.eth63.version.toString()
    ]
  }

  async *receive<Buffer, U> (readable: AsyncIterable<Buffer[]>): AsyncIterable<U | U[]> {
    for await (const msg of super.receive<Buffer[], U[]>(readable)) {
      const code: ETH.MESSAGE_CODES = msg.shift() as unknown as ETH.MESSAGE_CODES
      // tslint:disable-next-line: strict-type-predicates
      if (typeof code !== 'undefined') {
        yield this.handlers[code].handle(msg) as any // TODO: investigate type failure
      }
    }
  }

  async send<Message, Buffer> (msg: Message): Promise<Buffer | Buffer[] | void> {
    return super.send(msg, this)
  }

  async *getBlockHeaders (block: number | Buffer | BN,
                          max: number,
                          skip?: number,
                          reverse?: boolean): AsyncIterable<Block[]> {
    await this.handlers[ETH.MESSAGE_CODES.GET_BLOCK_HEADERS].request([block, max, skip, reverse])
    yield new Promise<Block[]>((resolve) => {
      this.handlers[ETH.MESSAGE_CODES.BLOCK_HEADERS].on('message', (headers) => {
        resolve(headers)
      })
    })
  }

  async *getBlockBodies (hashes: string[] | Buffer[]): AsyncIterable<BlockBody[]> {
    throw new Error('Method not implemented.')
  }

  sendNewHashes (hashes: string[] | Buffer[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async handshake (): Promise<void> {
    return this.handlers[ETH.MESSAGE_CODES.STATUS].request({
      networkId: this.ethChain.common.networkId(),
      td: await this.ethChain.getBlocksTD(),
      genesisHash: this.ethChain.common.genesis().hash,
      bestHash: (await this.ethChain.getBestBlock() as any).hash(),
      protocolVersion: this.protocolVersion
    })
  }
}
