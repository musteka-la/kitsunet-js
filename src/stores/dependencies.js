'use strict'

const KitsunetStore = require('./kitsunet-store')
const Store = require('./store')

const MemoryStore = require('interface-datastore').MemoryDatastore

module.exports = (container) => {
  container.registerType('data-store', MemoryStore)
  container.registerFactory('store', (dataStore) => new Store(dataStore), ['data-store'])
  container.registerFactory('kitsunet-store', (dataStore) => new KitsunetStore(dataStore), ['store'])
  return container
}
