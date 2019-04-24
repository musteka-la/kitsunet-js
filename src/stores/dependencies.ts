'use strict'

import KitsunetStore = require('./slice-store')

const MemoryStore = require('interface-datastore').MemoryDatastore

export function (container): Container {
  container.registerFactory('store', () => new MemoryStore())
  container.registerFactory('slices-store', (dataStore) => new KitsunetStore(dataStore), ['store'])
  return container
}
