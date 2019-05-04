'use strict'

import { Slice, SliceId } from '../slice'
import { Key, Datastore } from 'interface-datastore'
import promisify, { PromisifyAll } from 'promisify-this'
import { register } from 'opium-decorator-resolvers'

const SLICE_PREFIX = '/slices'

@register()
export class SliceStore {
  _store: PromisifyAll<Datastore>

  /**
   * The store where to retrieve data from
   *
   * @param {Store} store - underlying store where slice data is stored
   */
  constructor (store: Datastore) {
    this._store = promisify(store)
  }

  async getSlices (): Promise<Slice[] | undefined> {
    const key = `${SLICE_PREFIX}`
    const slices = await this._store.query({ prefix: key })
    if (slices) {
      return slices.map((s) => new Slice(s))
    }
    return
  }

  static _mkKey (...entries: string[]): string {
    entries.unshift(`/${SLICE_PREFIX}`)
    return entries.join('/')
  }

  /**
   * Lookup all slices with a path
   *
   * @param {SliceId} sliceId - the slices to look for
   */
  async getByPath (sliceId: SliceId): Promise<Slice[] | undefined> {
    const key = SliceStore._mkKey(sliceId.path)
    const slices = await this._store.query({ prefix: key })
    if (slices) {
      return slices.map((s) => new Slice(s))
    }
    return
  }

  /**
   * Lookup a slice by its id
   *
   * @param {SliceId} sliceId - the slice to lookup
   */
  async getById (sliceId: SliceId): Promise<Slice | undefined> {
    const key: string = SliceStore._mkKey(sliceId.path, String(sliceId.depth), sliceId.root)
    const raw = await this._store.get(new Key(key))
    if (raw) {
      return new Slice(raw)
    }
  }

  /**
   * Store a slice in the underlying store
   *
   * @param {Slice} slice - the slice to store
   */
  async put (slice) {
    const key = SliceStore._mkKey(slice.path, slice.depth, slice.root)
    this._store.put(new Key(key), slice.serialize())
  }
}
