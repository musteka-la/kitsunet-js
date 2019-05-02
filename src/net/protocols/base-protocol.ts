'use strict'

import EE from 'events'
import { IProtocol, INetwork, IEncoder, IPeerDescriptor } from '../interfaces'
import { register } from 'opium-decorator-resolvers'

@register()
export abstract class BaseProtocol<P> extends EE implements IProtocol<P> {
  abstract get id (): string
  abstract get codec (): string

  peer: IPeerDescriptor<P>
  networkProvider: INetwork<P>
  encoder?: IEncoder
  constructor (peer: IPeerDescriptor<P>,
               networkProvider: INetwork<P>,
               encoder: IEncoder) {
    super()
    this.peer = peer
    this.networkProvider = networkProvider
    this.encoder = encoder
  }

  async *receive<T, U> (readable: AsyncIterable<T>): AsyncIterable<U> {
    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    for await (const msg of readable) {
      for await (const parsed of this.encoder.decode(msg)) {
        yield parsed as U
      }
    }
  }

  async send<T, U> (msg: T,
                    protocol?: IProtocol<P>): Promise<U> {
    if (!this.networkProvider) {
      throw new Error('networkProvider not set!')
    }

    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    let response: string = ''
    for await (const chunk of this.encoder.encode(msg)) {
      for await (const recvd of this.encoder.decode(
        await this.networkProvider.send(chunk, protocol, this.peer.peer || undefined)
        || Buffer.from([0]))) {
        response += recvd
      }
    }

    return response as unknown as U
  }
}
