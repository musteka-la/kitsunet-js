// /* eslint-env mocha */
// 'use strict'

// const chai = require('chai')
// const dirtyChai = require('dirty-chai')
// const expect = chai.expect
// chai.use(dirtyChai)

// const { SliceId, Slice } = require('../src/slice')
// const cbor = require('borc')

// const loadFixture = require('aegir/fixtures')
// const sliceRaw = loadFixture('test/fixtures/account.json')

// const sliceData = JSON.parse(sliceRaw).result
// const params = ['1372', 12, 'a7511d0abbcc70b8b59ae8eff1ffc2704d47751a6a043c952b4729f656377bce']

// const cborSlice = cbor.encode({
//   __sliceId__: cbor.encode({
//     sliceId: sliceData['slice-id'],
//     path: params[0],
//     depth: params[1],
//     root: params[2],
//     isStorage: false
//   }),
//   trieNodes: {
//     head: sliceData['trie-nodes'].head,
//     stem: sliceData['trie-nodes'].stem,
//     sliceNodes: sliceData['trie-nodes']['slice-nodes']
//   }
// })

// const validateSlice = (sliceId) => {
//   expect(sliceId.path).to.be.eq(params[0])
//   expect(sliceId.depth).to.be.eq(params[1])
//   expect(sliceId.root).to.be.eq(params[2])
//   expect(sliceId.id).to.be.eq(params.join('-'))
// }

// describe('slice', () => {
//   it('should construct a valid slice id', () => {
//     const sliceId = new SliceId(...params)
//     validateSlice(sliceId)
//   })

//   it('should construct a valid slice from string id', () => {
//     const sliceId = new SliceId('1372-12-a7511d0abbcc70b8b59ae8eff1ffc2704d47751a6a043c952b4729f656377bce')
//     validateSlice(sliceId)
//   })

//   it('should construct slice from buffer', () => {
//     const sliceId = new Slice(cborSlice)
//     validateSlice(sliceId)
//   })

//   it('should construct slice from string', () => {
//     const sliceId = new Slice(JSON.stringify(sliceData))
//     validateSlice(sliceId)
//   })

//   it('should construct slice from object', () => {
//     const sliceId = new Slice(sliceData)
//     validateSlice(sliceId)
//   })
// })
