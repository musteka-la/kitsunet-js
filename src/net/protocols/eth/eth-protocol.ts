'use strict'

import * as Handlers from './handlers'
import { BaseProtocol } from '../../base-protocol'
import { IEthProtocol, BlockBody, Status } from './interfaces'
import { IPeerDescriptor, INetwork, IEncoder } from '../../interfaces'
import { IBlockchain } from '../../../blockchain'
import { EthHandler } from './eth-handler'
import Block from 'ethereumjs-block'
import { ETH } from 'ethereumjs-devp2p'

export class EthProtocol<P> extends BaseProtocol<P> implements IEthProtocol {
  protocolVersion: number
  handlers: { [key: number]: EthHandler<P> }

  get status (): Status {
    return {} as any // TODO: return valid status
  }

  /**
   * Construct an Ethereum protocol
   *
   * @param blockChain - the blockchain to use for this peer
   * @param peer - the peer descriptor for this peer
   * @param networkProvider - the network provider
   * @param encoder - an encoder to use with the peer
   */
  constructor (public blockChain: IBlockchain,
               peer: IPeerDescriptor<P>,
               networkProvider: INetwork<P>,
               encoder: IEncoder) {
    super(peer, networkProvider, encoder)
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
    return ['62', '63']
  }

  async *receive<Buffer, U> (readable: AsyncIterable<Buffer>): AsyncIterable<U | U[]> {
    for await (const msg of super.receive<Buffer, U[]>(readable)) {
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

  async *getBlockHeaders (block: number,
                          max: number,
                          skip?: number,
                          reverse?: boolean): AsyncIterable<Block[]> {
    return this.handlers[ETH.MESSAGE_CODES.GET_BLOCK_HEADERS].request([block, max, skip, reverse])
  }

  async *getBlockBodies (hashes: string[] | Buffer[]): AsyncIterable<BlockBody[]> {
    throw new Error('Method not implemented.')
  }

  sendNewHashes (hashes: string[] | Buffer[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  handshake (): Promise<Status> {
    return this.handlers[ETH.MESSAGE_CODES.STATUS].request(this.status)
  }
}
