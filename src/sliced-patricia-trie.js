'use strict'

const assert = require('assert')

const ZERO_ROOT = '0000000000000000000000000000000000000000000000000000000000000000'

// A fake Merkle PATRICIA Trie to be used with slices
class SlicedPatriciaTrie {
  constructor (root, db) {
    if (!db) {
      db = root
      root = null
    }

    assert(db, 'DB is required!')

    this._db = db
    this.root = root || ZERO_ROOT
  }

  get (key, cb) {
    const keyHex = key.toString('hex')
    const value = this._db.get(keyHex)
    cb(null, value)
  }

  put (key, value, cb) {
    const keyHex = key.toString('hex')
    this._tree.put(keyHex, value)
    cb()
  }

  del (key, cb) {
    const keyHex = key.toString('hex')
    this._db.del(keyHex)
    cb()
  }

  checkpoint () {
  }

  commit (cb) {
    cb()
  }

  revert (cb) {
    cb()
  }

  copy () {
    const copy = new SlicedPatriciaTrie()
    copy._db = this._db.copy()
    return copy
  }

  putRaw (key, value, cb) {
    this._db.put(key, value)
    cb()
  }

  getRaw (key, cb) {
    const value = this._db.get(key)
    cb(null, value)
  }

  delRaw (key, cb) {
    this._db.del(key)
    cb()
  }

  batch (ops, cb) {
    throw new Error('FakeTree - "batch" not implemented')
  }

  createReadStream () {
    throw new Error('FakeTree - "createReadStream" not implemented')
  }
}

module.exports = SlicedPatriciaTrie
