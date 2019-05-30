'use strict'

import { IEncoder } from '../../interfaces'
import { encode, Input } from 'rlp'

export class RlpMsgEncoder implements IEncoder {
  async *encode<T, U> (msg: T[] | T): AsyncIterable<U> {
    yield [(msg as T[]).shift(), encode(msg as any)] as any
  }

  async *decode<T, U> (msg: T): AsyncIterable<U> {
    // rlpx already decodes it, so we skip on receive
    yield msg as any
  }
}
