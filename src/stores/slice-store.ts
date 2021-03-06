'use strict'

import './dependencies'
import { Slice, SliceId } from '../slice'
import { Key, Datastore } from 'interface-datastore'
import { register } from 'opium-decorators'

const SLICE_PREFIX = '/slices'

@register()
export class SliceStore {
  // query doesn't take a callback, so we need to
  // extract it from the set of promisifiable members
  _store: Datastore

  /**
   * The store where to retrieve data from
   *
   * @param {Store} store - underlying store where slice data is stored
   */
  constructor (@register('data-store') store: Datastore) {
    this._store = store
  }

  async getSlices (): Promise<Slice[] | undefined> {
    const key = `${SLICE_PREFIX}`
    const slices = [...this._store.query({ prefix: key })]
    if (slices.length > 0) {
      return slices.map((s) => new Slice(s))
    }
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
    const slices = [...this._store.query({ prefix: key })]
    if (slices.length > 0) {
      return slices.map((s) => new Slice(s))
    }
  }

  /**
   * Lookup a slice by its id
   *
   * @param {SliceId} sliceId - the slice to lookup
   */
  async getById (sliceId: SliceId): Promise<Slice | undefined> {
    const key: string = SliceStore._mkKey(sliceId.path, String(sliceId.depth), sliceId.root)
    const raw: Buffer = await this._store.get(new Key(key))
    if (raw) {
      return new Slice(raw)
    }
  }

  /**
   * Store a slice in the underlying store
   *
   * @param {Slice} slice - the slice to store
   */
  async put (slice: Slice) {
    const key = SliceStore._mkKey(slice.path, String(slice.depth), slice.root)
    return this._store.put(new Key(key), slice.serialize())
  }
}
