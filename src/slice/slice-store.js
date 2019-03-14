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
   * Lookup all slice with a prefix
   *
   * @param {SliceId} slice - the slices to look for
   */
  async getSlicesByPrefix (sliceId) {
    return this.store.get(sliceId.prefix)
  }

  /**
   * Lookup a slice by its id
   *
   * @param {SliceId} sliceId - the slice to lookup
   */
  async getSliceById (sliceId) {
    const key = `/${sliceId.prefix}/${sliceId.depth}/${sliceId.root}`
    return this.store.get(key)
  }

  /**
   * Store a slice in the underlying store
   *
   * @param {Slice} slice - the slice to store
   */
  async storeSlice (slice) {
    const key = `/${slice.prefix}/${slice.depth}/${slice.root}`
    this._store.put(key, slice)
  }
}

module.exports = SliceStore
