'use strict'

import { IEncoder } from '../../interfaces'
import proto from './proto'
import Debug from 'debug'

const debug = Debug('kitsunet:kitsunet-encoder')

const { Kitsunet } = proto
export class KsnEncoder implements IEncoder {
  async *encode<T, U> (msg: T): AsyncIterable<U> {
    try {
      yield Kitsunet.encode(msg)
    } catch (e) {
      debug('an error occurred encoding msg', e)
    }
  }

  async *decode<T, U> (msg: T): AsyncIterable<U> {
    try {
      yield Kitsunet.decode(msg)
    } catch (e) {
      debug('an error occurred decoding msg', e)
    }
  }
}
