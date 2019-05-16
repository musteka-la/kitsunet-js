'use strict'

import { SliceStore } from './slice-store'
import {
  MemoryDatastore,
  Datastore
} from 'interface-datastore'
import { register } from 'opium-decorators'

export class StoresFactory {
  @register('data-store')
  createStore (): Datastore {
    return new MemoryDatastore()
  }

  @register()
  createSliceStore (@register('data-store')
                    dataStore: Datastore): SliceStore {
    return new SliceStore(dataStore)
  }
}
