'use strict'

import { IEncoder } from '../../interfaces'
import proto from './proto'

const { Kitsunet } = proto
export class KsnEncoder implements IEncoder {
  async *encode<T, U> (msg: T): AsyncIterable<U> {
    yield Kitsunet.encode(msg)
  }

  async *decode<T, U> (msg: T): AsyncIterable<U> {
    yield Kitsunet.decode(msg)
  }
}
