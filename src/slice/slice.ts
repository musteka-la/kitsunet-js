'use strict'

import { SliceId } from './slice-id'
import normalizeKeys from 'normalize-keys'
import bourne from 'bourne'
import { decode, encode } from 'borc'

export class Slice extends SliceId {
  parsed: any
  nodes: any

  constructor (data: Buffer | string | Object) {
    const parsed = Slice.parse(data)
    const [path, depth, root] = parsed.sliceId.split('-')

    // call super after parsing the slice
    super(path, depth, root)

    this.parsed = parsed
    this.nodes = { ...this.head, ...this.sliceNodes, ...this.stem }
  }

  static parse (data: any) {
    let parsed
    if (Buffer.isBuffer(data)) {
      parsed = decode(data)
      parsed = { ...parsed, ...decode(parsed.__sliceId__) }
      delete parsed.__sliceId__
    } else if (typeof data === 'string') {
      parsed = normalizeKeys(bourne.parse(data), ['metadata'])
    } else if (typeof data.metadata !== 'undefined') {
      parsed = normalizeKeys(data, ['metadata'])
    } else {
      throw new Error('slice data must be Buffer, JSON or a parsed Slice Object')
    }

    return parsed
  }

  get head () {
    return this.parsed.trieNodes.head
  }

  get stem () {
    return this.parsed.trieNodes.stem
  }

  get sliceNodes () {
    return this.parsed.trieNodes.sliceNodes
  }

  get leaves () {
    return this.parsed.leaves
  }

  serialize () {
    return encode({
      __sliceId__: super.serialize(),
      trieNodes: {
        head: this.head,
        stem: this.stem,
        sliceNodes: this.sliceNodes
      },
      leaves: this.leaves
    })
  }
}
