'use strict'

import { SliceStore } from './slice-store'
import { MemoryDatastore } from 'interface-datastore'
import { register } from 'opium-decorator-resolvers'

export class StoresFactory {
  @register()
  createStore (): MemoryDatastore {
    return new MemoryDatastore()
  }

  @register()
  createSliceStore (dataStore: MemoryDatastore): SliceStore {
    return new SliceStore(dataStore)
  }
}
