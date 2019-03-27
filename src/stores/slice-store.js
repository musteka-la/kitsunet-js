'use strict'

const { Slice } = require('../slice')
const { Key } = require('interface-datastore')
const promisify = require('promisify-this')

const SLICE_PREFIX = '/slices'

class SliceStore {
  /**
   * The store where to retrieve data from
   *
   * @param {Store} store - underlying store where slice data is stored
   */
  constructor (store) {
    this._store = promisify(store)
  }

  async getSlices () {
    const key = `${SLICE_PREFIX}`
    const slices = await this._store.query({ prefix: key })
    if (slices) {
      return slices.map((s) => new Slice(s))
    }
  }

  /**
   * Lookup all slices with a path
   *
   * @param {SliceId} sliceId - the slices to look for
   */
  async getByPath (sliceId) {
    const key = `${SLICE_PREFIX}/${sliceId.path}`
    const slices = await this._store.query({ prefix: key })
    if (slices) {
      return slices.map((s) => new Slice(s))
    }
  }

  /**
   * Lookup a slice by its id
   *
   * @param {SliceId} sliceId - the slice to lookup
   */
  async getById (sliceId) {
    const key = `${SLICE_PREFIX}/${sliceId.path}/${sliceId.depth}/${sliceId.root}`
    const raw = await this._store.get(new Key(key))
    return new Slice(raw)
  }

  /**
   * Store a slice in the underlying store
   *
   * @param {Slice} slice - the slice to store
   */
  async put (slice) {
    const key = `${SLICE_PREFIX}/${slice.path}/${slice.depth}/${slice.root}`
    this._store.put(new Key(key), slice.serialize())
  }
}

module.exports = SliceStore
