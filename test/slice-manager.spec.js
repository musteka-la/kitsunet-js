/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
chai.use(dirtyChai)
chai.use(deepEqualInAnyOrder)

const EventEmitter = require('safe-event-emitter')
const promisify = require('promisify-this')
const { MemoryDatastore } = require('interface-datastore')
const { Slice } = require('../src/slice')
const { Store, KitsunetStore } = require('../src/stores')
const SliceManager = require('../src/slice-manager')

const loadFixture = require('aegir/fixtures')
const sliceData = loadFixture('test/fixtures/account.json')

describe('slice manager', () => {
  const slice = new Slice(JSON.parse(sliceData).result)
  const kitsunetStore = new KitsunetStore(new MemoryDatastore())

  it('should track slices', async () => {
    const tracker = {
      on: () => {},
      track: (_slice) => {
        expect(_slice).to.exist()
        expect(_slice).to.deep.eq(slice)
      }
    }

    const sliceManager = new SliceManager({
      bridgeTracker: {},
      pubsubTracker: tracker,
      kitsunetStore: kitsunetStore,
      blockTracker: {},
      driver: {
        isBridge: false
      }
    })

    expect(sliceManager).to.exist()
    sliceManager.track(slice)
  })

  it('should untrack slices', async () => {
    const tracker = {
      on: () => { },
      untrack: (_slice) => {
        expect(_slice).to.exist()
        expect(_slice).to.deep.eq(slice)
      }
    }

    const sliceManager = new SliceManager({
      bridgeTracker: {},
      pubsubTracker: tracker,
      kitsunetStore: kitsunetStore,
      blockTracker: {},
      driver: {
        isBridge: false
      }
    })

    expect(sliceManager).to.exist()
    sliceManager.untrack(slice)
  })

  it('should store slices', async () => {
    const tracker = new EventEmitter()
    const sliceManager = new SliceManager({
      bridgeTracker: {},
      pubsubTracker: tracker,
      kitsunetStore: kitsunetStore,
      blockTracker: {},
      driver: {
        isBridge: false
      }
    })

    expect(sliceManager).to.exist()
    tracker.emit('slice', slice)
    const _slice = await kitsunetStore.getById(slice)
    expect(slice.id).to.deep.eq(_slice.id)
    expect(slice.stem).to.deep.eq(_slice.stem)
    expect(slice.head).to.deep.eq(_slice.head)
    expect(slice.sliceNodes).to.deep.eq(_slice.sliceNodes)
  })

  it('should get slice by id', async () => {
  })

  it('should get latest slice', async () => {
  })

  it('should get slice by block', async () => {
  })

  it('should start', async () => {
  })

  it('should stop', async () => {
  })
})
