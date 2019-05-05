'use strict'

import * as Handlers from './handlers'
import { BaseProtocol } from '../base-protocol'
import { IEthProtocol, BlockBody, Status, ProtocolCodes } from './interfaces'
import { IPeerDescriptor, INetwork, IEncoder } from '../../interfaces'
import { IBlockchain } from '../../../blockchain'
import { BaseHandler } from './base-handler'
import Block from 'ethereumjs-block'

export class EthProtocol<P> extends BaseProtocol<P> implements IEthProtocol {
  protocolVersion: number
  handlers: { [key: number]: BaseHandler<P> }

  get status (): Status {
    return {} as any // TODO: return valid status
  }

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

  get codec (): string {
    return `/kitsunet/eth/${this.protocolVersion}`
  }

  get versions (): string[] {
    return ['62', '63']
  }

  async *receive<Buffer, U> (readable: AsyncIterable<Buffer>): AsyncIterable<U> {
    for await (const msg of super.receive<Buffer, U[]>(readable)) {
      const code: ProtocolCodes = msg.shift() as unknown as number
      // tslint:disable-next-line: strict-type-predicates
      if (typeof code !== 'undefined') {
        yield this.handlers[code].handle(msg)
      }
    }
  }

  async send<Message, Buffer> (msg: Message): Promise<Buffer> {
    return super.send(msg, this)
  }

  async *getBlockHeaders (block: number,
                          max: number,
                          skip?: number,
                          reverse?: boolean): AsyncIterable<Block[]> {
    return this.handlers[ProtocolCodes.GetBlockHeaders].request([block, max, skip, reverse])
  }

  async *getBlockBodies (hashes: string[] | Buffer[]): AsyncIterable<BlockBody[]> {
    throw new Error('Method not implemented.')
  }

  sendNewHashes (hashes: string[] | Buffer[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  handshake (): Promise<Status> {
    return this.handlers[ProtocolCodes.Status].request(this.status)
  }
}
