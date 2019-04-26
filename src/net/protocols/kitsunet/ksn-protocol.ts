'use strict'

import EE from 'events'
import { IProtocol, INetworkProvider, IEncoder, Peer } from '../../interfaces'
import debug from 'debug'
import kitsunet from './proto'

const log = debug('kitsunet:kitsunet-proto')
const _VERSION = '1.0.0'

export class KsnProtocol<P> extends EE {
  get id (): string {
    return 'ksn'
  }

  get codec (): string {
    return `/kitsunet/client/${_VERSION}`
  }

  networkProvider?: INetworkProvider<P>
  encoder?: IEncoder
  peer: Peer<P>

  constructor (peer: Peer<P>,
               provider?: INetworkProvider<P>,
               encoder?: IEncoder) {
    super()
    this.peer = peer
    this.networkProvider = provider
    this.encoder = encoder
  }

  async handle<T> (readable: AsyncIterable<T & Buffer>): Promise<void> {
    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    for await (const msg of readable) {
      for await (const decoded of this.encoder.decode(msg)) {
        // process incoming message
      }
    }
  }

  async send<T extends Buffer, U> (msg: T,
                                   protocol: IProtocol<P>): Promise<U> {
    if (!this.networkProvider) {
      throw new Error('networkProvider not set!')
    }

    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    let response: string = ''
    for await (const chunk of this.encoder.encode(msg)) {
      for await (const recvd of this.encoder.
        decode<Buffer, string>(await this.networkProvider
          .send<Buffer, Buffer>(chunk, protocol))) {
        response += recvd
      }
    }

    return response as unknown as U
  }

  stream<T extends AsyncIterable<T & Buffer>, U> (readable: T,
                                                  protocol: IProtocol<P>): AsyncIterator<U> {
    throw new Error('Method not implemented.')
  }

  /**
   * Encode a buffer
   *
   * @param msg - a buffer to encode
   */
  async* encode<T, U extends Buffer> (msg: T): AsyncIterable<U> {
    return Promise.resolve(kitsunet.encode(msg))
  }

  /**
   * A buffer to decode
   *
   * @param msg - decode a buffer
   */
  async* decode<T extends Buffer, U> (msg: T): AsyncIterable<U> {
    return Promise.resolve(kitsunet.decode(msg))
  }
}
