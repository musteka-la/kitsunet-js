/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const promisify = require('promisify-this')
const { MemoryDatastore } = require('interface-datastore')
const { Slice } = require('../src/slice')
const { Store } = require('../src/stores')

const loadFixture = require('aegir/fixtures')
const sliceData = loadFixture('test/fixtures/account.json')

describe('store tests', () => {
  const slice = new Slice(JSON.parse(sliceData).result)
  const datastore = promisify(new MemoryDatastore())
  const store = new Store(datastore)

  it('should store and retrieve with correct key', async () => {
    const key = `/slices/${slice.prefix}/${slice.depth}/${slice.root}`
    store.put(key, slice)
    const val = await store.get(key)
    expect(val).to.deep.equal(slice)
  })
})
