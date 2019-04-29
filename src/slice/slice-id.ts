'use strict'

import * as cbor from 'borc'

export class SliceId {
  path: string
  depth: number
  root: string
  isStorage: boolean

  constructor (path: string = '0x0000', depth = 10, root?: string, isStorage: boolean = false) {
    [
      this.path,
      this.depth,
      this.root,
      this.isStorage
    ] = SliceId.parse(path, depth, root, isStorage)
  }

  static parse (path: string, depth: number | string, root?: string, isStorage: boolean = false): any {
    if (Buffer.isBuffer(path)) {
      ({ path, depth, root, isStorage } = cbor.decode(path))
    } else if (path.includes('-')) {
      [path, depth, root] = path.split('-')
    }

    return [path, Number(depth), root, Boolean(isStorage)]
  }

  get id (): string {
    return `${this.path}-${this.depth}${this.root ? '-' + this.root : ''}`
  }

  serialize () {
    return cbor.encode({
      sliceId: this.id,
      path: this.path,
      depth: this.depth,
      root: this.root,
      isStorage: Boolean(this.isStorage)
    })
  }
}
