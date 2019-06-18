'use strict'

import EE from 'events'
import {
  IProtocol,
  INetwork,
  IEncoder,
  IPeerDescriptor
} from './interfaces'
import { Node } from './node'

import Debug from 'debug'
import { PeerTypes } from './helper-types'
const debug = Debug('kitsunet:net:base-protocol')

const passthroughEncoder: IEncoder = {
  encode: async function* <T, U>(msg) { yield msg },
  decode: async function* <T, U>(msg) { yield msg }
}

export abstract class BaseProtocol<P extends IPeerDescriptor<PeerTypes>> extends EE implements IProtocol<P> {
  abstract get id (): string
  abstract get versions (): string[]

  peer: P
  networkProvider: INetwork<P>
  encoder?: IEncoder
  constructor (peer: P,
               networkProvider: Node<P>,
               encoder: IEncoder = passthroughEncoder) {
    super()
    this.peer = peer
    this.networkProvider = networkProvider
    this.encoder = encoder
  }

  async *receive<T, U> (readable: AsyncIterable<T>): AsyncIterable<U | U[] | null> {
    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    try {
      debug(`reading incoming stream from ${this.peer.id}`)
      for await (const msg of readable) {
        debug('read message ', msg)
        for await (const decoded of this.encoder.decode<T>(msg)) {
          yield decoded as unknown as (U | U[])
        }
      }
    } catch (e) {
      debug('an error occurred reading stream ', e)
    }
  }

  async send<T, U> (msg: T, protocol?: IProtocol<P>): Promise<U | U[] | void | null> {
    if (!this.networkProvider) {
      throw new Error('networkProvider not set!')
    }

    if (!this.encoder) {
      throw new Error('encoder not set!')
    }

    try {
      for await (const chunk of this.encoder.encode(msg)) {
      // protocol might choose to reply
      // we might return something from send
        const res = await this.networkProvider.send(chunk, protocol, this.peer)

        if (res && (res as any).length > 0) {
          for await (const recvd of this.encoder.decode(res)) {
            return recvd as unknown as U
          }
        }

        return res as unknown as U
      }
    } catch (e) {
      debug('an error occurred sending stream ', e)
    }
  }

  abstract handshake (): Promise<void>
}
