'use strict'

const SLICE_PREFIX = '/slices'
const ACCOUNT_PREFIX = '/accounts'

const { Slice } = require('../slice')

class KitsunetStore {
  /**
   * The store where to retrieve data from
   *
   * @param {Store} store - underlying store where slice data is stored
   */
  constructor (store) {
    this._store = store
  }

  /**
   * Lookup all slices with a prefix
   *
   * @param {SliceId} sliceId - the slices to look for
   */
  async getByPrefix (sliceId) {
    return new Slice(await this._store.get(sliceId.path))
  }

  /**
   * Lookup a slice by its id
   *
   * @param {SliceId} sliceId - the slice to lookup
   */
  async getById (sliceId) {
    const key = `${SLICE_PREFIX}/${sliceId.path}/${sliceId.depth}/${sliceId.root}`
    return new Slice(await this._store.get(key))
  }

  /**
   * Store a slice in the underlying store
   *
   * @param {Slice} slice - the slice to store
   */
  async put (slice) {
    const key = `${SLICE_PREFIX}/${slice.path}/${slice.depth}/${slice.root}`
    this._store.put(key, slice.serialize())
  }
}

module.exports = KitsunetStore
