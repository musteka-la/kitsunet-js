'use strict'

import { IEncoder, NetworkType } from '../../interfaces'
import { encode, decode } from 'rlp'
import * as utils from 'ethereumjs-util'

export class RlpEncoder implements IEncoder {
  type: NetworkType
  constructor (type: NetworkType) {
    this.type = type
  }

  async *encode<T, U> (msg: T[] | T): AsyncIterable<U> {
    if (this.type === NetworkType.LIBP2P) {
      yield encode(msg as any) as any
    }

    yield [(msg as T[]).shift(), encode(msg as any)] as any
  }

  async *decode<T, U> (msg: T[] | T): AsyncIterable<U> {
    if (this.type === NetworkType.LIBP2P) {
      const decoded: any[] = decode(msg as any[]) as any[]
      yield [utils.bufferToInt(decoded.shift()), ...decoded] as any
    }

    // rlpx already decodes it, so we skip on receive
    yield msg as any
  }
}
