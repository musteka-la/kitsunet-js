'use strict'

class SliceStore {
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
  async getSlicesByPrefix (sliceId) {
    return this._store.get(sliceId.path)
  }

  /**
   * Lookup a slice by its id
   *
   * @param {SliceId} sliceId - the slice to lookup
   */
  async getSliceById (sliceId) {
    const key = `/${sliceId.path}/${sliceId.depth}/${sliceId.root}`
    return this._store.get(key)
  }

  /**
   * Store a slice in the underlying store
   *
   * @param {Slice} slice - the slice to store
   */
  async storeSlice (slice) {
    const key = `/${slice.path}/${slice.depth}/${slice.root}`
    this._store.put(key, slice)
  }
}

module.exports = SliceStore
