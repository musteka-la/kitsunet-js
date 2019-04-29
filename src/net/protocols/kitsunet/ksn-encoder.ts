'use strict'

import { IEncoder } from '../../interfaces'
import proto from './proto'

const kitsunet = proto.kitsunet
export class KsnEncoder implements IEncoder {
  async *encode<T, U> (msg: T): AsyncIterable<U> {
    return kitsunet.encode(msg)
  }

  async *decode<T, U> (msg: T): AsyncIterable<U> {
    return kitsunet.decode(msg)
  }
}
