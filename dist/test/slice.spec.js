"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2Uuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2xpY2Uuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQXlCO0FBQ3pCLGVBQWU7QUFFZiwrQkFBK0I7QUFDL0IsMENBQTBDO0FBQzFDLDZCQUE2QjtBQUM3QixzQkFBc0I7QUFFdEIscURBQXFEO0FBQ3JELCtCQUErQjtBQUUvQixnREFBZ0Q7QUFDaEQsNkRBQTZEO0FBRTdELGdEQUFnRDtBQUNoRCxrR0FBa0c7QUFFbEcsa0NBQWtDO0FBQ2xDLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsdUJBQXVCO0FBQ3ZCLHdCQUF3QjtBQUN4Qix1QkFBdUI7QUFDdkIsdUJBQXVCO0FBQ3ZCLFFBQVE7QUFDUixpQkFBaUI7QUFDakIsMENBQTBDO0FBQzFDLDBDQUEwQztBQUMxQyx5REFBeUQ7QUFDekQsTUFBTTtBQUNOLEtBQUs7QUFFTCx1Q0FBdUM7QUFDdkMsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUM5Qyw2Q0FBNkM7QUFDN0Msa0RBQWtEO0FBQ2xELElBQUk7QUFFSiw0QkFBNEI7QUFDNUIsb0RBQW9EO0FBQ3BELDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsT0FBTztBQUVQLGdFQUFnRTtBQUNoRSw4R0FBOEc7QUFDOUcsNkJBQTZCO0FBQzdCLE9BQU87QUFFUCxxREFBcUQ7QUFDckQsMkNBQTJDO0FBQzNDLDZCQUE2QjtBQUM3QixPQUFPO0FBRVAscURBQXFEO0FBQ3JELDJEQUEyRDtBQUMzRCw2QkFBNkI7QUFDN0IsT0FBTztBQUVQLHFEQUFxRDtBQUNyRCwyQ0FBMkM7QUFDM0MsNkJBQTZCO0FBQzdCLE9BQU87QUFDUCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyogZXNsaW50LWVudiBtb2NoYSAqL1xuLy8gJ3VzZSBzdHJpY3QnXG5cbi8vIGNvbnN0IGNoYWkgPSByZXF1aXJlKCdjaGFpJylcbi8vIGNvbnN0IGRpcnR5Q2hhaSA9IHJlcXVpcmUoJ2RpcnR5LWNoYWknKVxuLy8gY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Rcbi8vIGNoYWkudXNlKGRpcnR5Q2hhaSlcblxuLy8gY29uc3QgeyBTbGljZUlkLCBTbGljZSB9ID0gcmVxdWlyZSgnLi4vc3JjL3NsaWNlJylcbi8vIGNvbnN0IGNib3IgPSByZXF1aXJlKCdib3JjJylcblxuLy8gY29uc3QgbG9hZEZpeHR1cmUgPSByZXF1aXJlKCdhZWdpci9maXh0dXJlcycpXG4vLyBjb25zdCBzbGljZVJhdyA9IGxvYWRGaXh0dXJlKCd0ZXN0L2ZpeHR1cmVzL2FjY291bnQuanNvbicpXG5cbi8vIGNvbnN0IHNsaWNlRGF0YSA9IEpTT04ucGFyc2Uoc2xpY2VSYXcpLnJlc3VsdFxuLy8gY29uc3QgcGFyYW1zID0gWycxMzcyJywgMTIsICdhNzUxMWQwYWJiY2M3MGI4YjU5YWU4ZWZmMWZmYzI3MDRkNDc3NTFhNmEwNDNjOTUyYjQ3MjlmNjU2Mzc3YmNlJ11cblxuLy8gY29uc3QgY2JvclNsaWNlID0gY2Jvci5lbmNvZGUoe1xuLy8gICBfX3NsaWNlSWRfXzogY2Jvci5lbmNvZGUoe1xuLy8gICAgIHNsaWNlSWQ6IHNsaWNlRGF0YVsnc2xpY2UtaWQnXSxcbi8vICAgICBwYXRoOiBwYXJhbXNbMF0sXG4vLyAgICAgZGVwdGg6IHBhcmFtc1sxXSxcbi8vICAgICByb290OiBwYXJhbXNbMl0sXG4vLyAgICAgaXNTdG9yYWdlOiBmYWxzZVxuLy8gICB9KSxcbi8vICAgdHJpZU5vZGVzOiB7XG4vLyAgICAgaGVhZDogc2xpY2VEYXRhWyd0cmllLW5vZGVzJ10uaGVhZCxcbi8vICAgICBzdGVtOiBzbGljZURhdGFbJ3RyaWUtbm9kZXMnXS5zdGVtLFxuLy8gICAgIHNsaWNlTm9kZXM6IHNsaWNlRGF0YVsndHJpZS1ub2RlcyddWydzbGljZS1ub2RlcyddXG4vLyAgIH1cbi8vIH0pXG5cbi8vIGNvbnN0IHZhbGlkYXRlU2xpY2UgPSAoc2xpY2VJZCkgPT4ge1xuLy8gICBleHBlY3Qoc2xpY2VJZC5wYXRoKS50by5iZS5lcShwYXJhbXNbMF0pXG4vLyAgIGV4cGVjdChzbGljZUlkLmRlcHRoKS50by5iZS5lcShwYXJhbXNbMV0pXG4vLyAgIGV4cGVjdChzbGljZUlkLnJvb3QpLnRvLmJlLmVxKHBhcmFtc1syXSlcbi8vICAgZXhwZWN0KHNsaWNlSWQuaWQpLnRvLmJlLmVxKHBhcmFtcy5qb2luKCctJykpXG4vLyB9XG5cbi8vIGRlc2NyaWJlKCdzbGljZScsICgpID0+IHtcbi8vICAgaXQoJ3Nob3VsZCBjb25zdHJ1Y3QgYSB2YWxpZCBzbGljZSBpZCcsICgpID0+IHtcbi8vICAgICBjb25zdCBzbGljZUlkID0gbmV3IFNsaWNlSWQoLi4ucGFyYW1zKVxuLy8gICAgIHZhbGlkYXRlU2xpY2Uoc2xpY2VJZClcbi8vICAgfSlcblxuLy8gICBpdCgnc2hvdWxkIGNvbnN0cnVjdCBhIHZhbGlkIHNsaWNlIGZyb20gc3RyaW5nIGlkJywgKCkgPT4ge1xuLy8gICAgIGNvbnN0IHNsaWNlSWQgPSBuZXcgU2xpY2VJZCgnMTM3Mi0xMi1hNzUxMWQwYWJiY2M3MGI4YjU5YWU4ZWZmMWZmYzI3MDRkNDc3NTFhNmEwNDNjOTUyYjQ3MjlmNjU2Mzc3YmNlJylcbi8vICAgICB2YWxpZGF0ZVNsaWNlKHNsaWNlSWQpXG4vLyAgIH0pXG5cbi8vICAgaXQoJ3Nob3VsZCBjb25zdHJ1Y3Qgc2xpY2UgZnJvbSBidWZmZXInLCAoKSA9PiB7XG4vLyAgICAgY29uc3Qgc2xpY2VJZCA9IG5ldyBTbGljZShjYm9yU2xpY2UpXG4vLyAgICAgdmFsaWRhdGVTbGljZShzbGljZUlkKVxuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgY29uc3RydWN0IHNsaWNlIGZyb20gc3RyaW5nJywgKCkgPT4ge1xuLy8gICAgIGNvbnN0IHNsaWNlSWQgPSBuZXcgU2xpY2UoSlNPTi5zdHJpbmdpZnkoc2xpY2VEYXRhKSlcbi8vICAgICB2YWxpZGF0ZVNsaWNlKHNsaWNlSWQpXG4vLyAgIH0pXG5cbi8vICAgaXQoJ3Nob3VsZCBjb25zdHJ1Y3Qgc2xpY2UgZnJvbSBvYmplY3QnLCAoKSA9PiB7XG4vLyAgICAgY29uc3Qgc2xpY2VJZCA9IG5ldyBTbGljZShzbGljZURhdGEpXG4vLyAgICAgdmFsaWRhdGVTbGljZShzbGljZUlkKVxuLy8gICB9KVxuLy8gfSlcbiJdfQ==