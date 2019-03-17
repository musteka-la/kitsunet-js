'use strict'

const assert = require('assert')
const Key = require('interface-datastore').Key

class Store {
  /**
   * Construct a store
   *
   * This is a tin wrapper around [interface-datastore](https://github.com/ipfs/interface-datastore) interface.
   * Datastore allows using hierarchical keys where each
   * key is in the form of `/root/a/b/c:namespace`, with
   * each level being child of it's previous level.
   *
   * @param {InterfaceDatastore} datastore - an object that conforms to
   * the [interface-datastore](https://github.com/ipfs/interface-datastore) interface
   */
  constructor (datastore) {
    this._datastore = datastore
  }

  /**
   * Store a slice
   *
   * @param {String|Buffer} key - the key to store under
   * @param {Buffer} value - the value to store
   */
  async put (key, value) {
    return this._datastore.put(new Key(key), value)
  }

  /**
   * Retrieve a key from the store
   *
   * @param {String|Buffer} key - the key to retrieve
   */
  async get (key) {
    return this._datastore.get(new Key(key))
  }

  /**
   * Check if key is in the store
   *
   * @param {String|Buffer} key - the key to check
   */
  async has (key) {
    return this._datastore.has(new Key(key))
  }

  /**
   * Delete a key from the store
   *
   * @param {String|Buffer} key - the key to delete
   */
  async delete (key) {
    return this._datastore.delete(new Key(key))
  }
}

module.exports = Store
