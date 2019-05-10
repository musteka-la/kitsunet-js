'use strict'

import { SliceStore } from './slice-store'
import { MemoryDatastore } from 'interface-datastore'
import { inject } from 'opium-decorator-resolvers'

export class StoresFactory {
  @inject()
  createStore (): MemoryDatastore {
    return new MemoryDatastore()
  }

  @inject()
  createSliceStore (dataStore: MemoryDatastore): SliceStore {
    return new SliceStore(dataStore)
  }
}
