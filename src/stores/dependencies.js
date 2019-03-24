'use strict'

const KitsunetStore = require('./slice-store')

const MemoryStore = require('interface-datastore').MemoryDatastore

module.exports = (container) => {
  container.registerFactory('store', () => new MemoryStore())
  container.registerFactory('slices-store', (dataStore) => new KitsunetStore(dataStore), ['store'])
  return container
}
