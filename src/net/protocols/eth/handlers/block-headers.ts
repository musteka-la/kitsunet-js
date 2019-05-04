'use strict'

import { BaseHandler } from '../base-handler'
import BN from 'bn.js'
import Block from 'ethereumjs-block'
import util from 'ethereumjs-util'

export class BlockHeaders<P> extends BaseHandler<P> {
  async handle<T> (msg?: T[] & [Buffer, Buffer, Buffer, Buffer]): Promise<any> {
    if (msg) {
      const [block, max, skip, reverse] = msg
      return {
        block: block.length === 32 ? block : new BN(block),
        max: util.bufferToInt(max),
        skip: util.bufferToInt(skip),
        reverse: util.bufferToInt(reverse)
      }
    }
  }

  async request<T> (msg?: T[] & [Block | number, number, number, boolean]): Promise<any> {
    const [block, max, skip, reverse] = msg
    return [BN.isBN(block) ? block.toArrayLike(Buffer) : block, max, skip, reverse]
  }
}
