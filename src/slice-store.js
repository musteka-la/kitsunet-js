'use strict'

class SliceStore {
  /**
   * Store a slice
   *
   * @param {String|Buffer} key - the key to store under
   * @param {Buffer} value - the value to store
   */
  async put (key, value) {
  }

  /**
   * Retrieve a key from the store
   *
   * @param {String|Buffer} key - the key to retrieve
   */
  async get (key) {
  }

  /**
   * Check if key is in the store
   *
   * @param {String|Buffer} key - the key to check
   */
  async has (key) {
  }

  /**
   * Delete a key from the store
   *
   * @param {String|Buffer} key - the key to delete
   */
  async delete (key) {
  }
}

module.exports = SliceStore
