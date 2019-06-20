"use strict";
// /* eslint-env mocha */
// 'use strict'
// const chai = require('chai')
// const dirtyChai = require('dirty-chai')
// const expect = chai.expect
// const deepEqualInAnyOrder = require('deep-equal-in-any-order')
// chai.use(dirtyChai)
// chai.use(deepEqualInAnyOrder)
// const EventEmitter = require('safe-event-emitter')
// const promisify = require('promisify-this')
// const { MemoryDatastore } = require('interface-datastore')
// const { Slice } = require('../src/slice')
// const { Store, KitsunetStore } = require('../src/stores')
// const SliceManager = require('../src/slice-manager')
// const loadFixture = require('aegir/fixtures')
// const sliceData = loadFixture('test/fixtures/account.json')
// describe('slice manager', () => {
//   const slice = new Slice(JSON.parse(sliceData).result)
//   const kitsunetStore = new KitsunetStore(new MemoryDatastore())
//   it('should track slices', async () => {
//     const tracker = {
//       on: () => {},
//       track: (_slice) => {
//         expect(_slice).to.exist()
//         expect(_slice).to.deep.eq(slice)
//       }
//     }
//     const sliceManager = new SliceManager({
//       bridgeTracker: {},
//       pubsubTracker: tracker,
//       kitsunetStore: kitsunetStore,
//       blockTracker: {},
//       driver: {
//         isBridge: false
//       }
//     })
//     expect(sliceManager).to.exist()
//     sliceManager.track(slice)
//   })
//   it('should untrack slices', async () => {
//     const tracker = {
//       on: () => { },
//       untrack: (_slice) => {
//         expect(_slice).to.exist()
//         expect(_slice).to.deep.eq(slice)
//       }
//     }
//     const sliceManager = new SliceManager({
//       bridgeTracker: {},
//       pubsubTracker: tracker,
//       kitsunetStore: kitsunetStore,
//       blockTracker: {},
//       driver: {
//         isBridge: false
//       }
//     })
//     expect(sliceManager).to.exist()
//     sliceManager.untrack(slice)
//   })
//   it('should store slices', async () => {
//     const tracker = new EventEmitter()
//     const sliceManager = new SliceManager({
//       bridgeTracker: {},
//       pubsubTracker: tracker,
//       kitsunetStore: kitsunetStore,
//       blockTracker: {},
//       driver: {
//         isBridge: false
//       }
//     })
//     expect(sliceManager).to.exist()
//     tracker.emit('slice', slice)
//     const _slice = await kitsunetStore.getById(slice)
//     expect(slice.id).to.deep.eq(_slice.id)
//     expect(slice.stem).to.deep.eq(_slice.stem)
//     expect(slice.head).to.deep.eq(_slice.head)
//     expect(slice.sliceNodes).to.deep.eq(_slice.sliceNodes)
//   })
//   it('should get slice by id', async () => {
//   })
//   it('should get latest slice', async () => {
//   })
//   it('should get slice by block', async () => {
//   })
//   it('should start', async () => {
//   })
//   it('should stop', async () => {
//   })
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UtbWFuYWdlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9zbGljZS1tYW5hZ2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlCQUF5QjtBQUN6QixlQUFlO0FBRWYsK0JBQStCO0FBQy9CLDBDQUEwQztBQUMxQyw2QkFBNkI7QUFDN0IsaUVBQWlFO0FBQ2pFLHNCQUFzQjtBQUN0QixnQ0FBZ0M7QUFFaEMscURBQXFEO0FBQ3JELDhDQUE4QztBQUM5Qyw2REFBNkQ7QUFDN0QsNENBQTRDO0FBQzVDLDREQUE0RDtBQUM1RCx1REFBdUQ7QUFFdkQsZ0RBQWdEO0FBQ2hELDhEQUE4RDtBQUU5RCxvQ0FBb0M7QUFDcEMsMERBQTBEO0FBQzFELG1FQUFtRTtBQUVuRSw0Q0FBNEM7QUFDNUMsd0JBQXdCO0FBQ3hCLHNCQUFzQjtBQUN0Qiw2QkFBNkI7QUFDN0Isb0NBQW9DO0FBQ3BDLDJDQUEyQztBQUMzQyxVQUFVO0FBQ1YsUUFBUTtBQUVSLDhDQUE4QztBQUM5QywyQkFBMkI7QUFDM0IsZ0NBQWdDO0FBQ2hDLHNDQUFzQztBQUN0QywwQkFBMEI7QUFDMUIsa0JBQWtCO0FBQ2xCLDBCQUEwQjtBQUMxQixVQUFVO0FBQ1YsU0FBUztBQUVULHNDQUFzQztBQUN0QyxnQ0FBZ0M7QUFDaEMsT0FBTztBQUVQLDhDQUE4QztBQUM5Qyx3QkFBd0I7QUFDeEIsdUJBQXVCO0FBQ3ZCLCtCQUErQjtBQUMvQixvQ0FBb0M7QUFDcEMsMkNBQTJDO0FBQzNDLFVBQVU7QUFDVixRQUFRO0FBRVIsOENBQThDO0FBQzlDLDJCQUEyQjtBQUMzQixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLDBCQUEwQjtBQUMxQixrQkFBa0I7QUFDbEIsMEJBQTBCO0FBQzFCLFVBQVU7QUFDVixTQUFTO0FBRVQsc0NBQXNDO0FBQ3RDLGtDQUFrQztBQUNsQyxPQUFPO0FBRVAsNENBQTRDO0FBQzVDLHlDQUF5QztBQUN6Qyw4Q0FBOEM7QUFDOUMsMkJBQTJCO0FBQzNCLGdDQUFnQztBQUNoQyxzQ0FBc0M7QUFDdEMsMEJBQTBCO0FBQzFCLGtCQUFrQjtBQUNsQiwwQkFBMEI7QUFDMUIsVUFBVTtBQUNWLFNBQVM7QUFFVCxzQ0FBc0M7QUFDdEMsbUNBQW1DO0FBQ25DLHdEQUF3RDtBQUN4RCw2Q0FBNkM7QUFDN0MsaURBQWlEO0FBQ2pELGlEQUFpRDtBQUNqRCw2REFBNkQ7QUFDN0QsT0FBTztBQUVQLCtDQUErQztBQUMvQyxPQUFPO0FBRVAsZ0RBQWdEO0FBQ2hELE9BQU87QUFFUCxrREFBa0Q7QUFDbEQsT0FBTztBQUVQLHFDQUFxQztBQUNyQyxPQUFPO0FBRVAsb0NBQW9DO0FBQ3BDLE9BQU87QUFDUCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyogZXNsaW50LWVudiBtb2NoYSAqL1xuLy8gJ3VzZSBzdHJpY3QnXG5cbi8vIGNvbnN0IGNoYWkgPSByZXF1aXJlKCdjaGFpJylcbi8vIGNvbnN0IGRpcnR5Q2hhaSA9IHJlcXVpcmUoJ2RpcnR5LWNoYWknKVxuLy8gY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Rcbi8vIGNvbnN0IGRlZXBFcXVhbEluQW55T3JkZXIgPSByZXF1aXJlKCdkZWVwLWVxdWFsLWluLWFueS1vcmRlcicpXG4vLyBjaGFpLnVzZShkaXJ0eUNoYWkpXG4vLyBjaGFpLnVzZShkZWVwRXF1YWxJbkFueU9yZGVyKVxuXG4vLyBjb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdzYWZlLWV2ZW50LWVtaXR0ZXInKVxuLy8gY29uc3QgcHJvbWlzaWZ5ID0gcmVxdWlyZSgncHJvbWlzaWZ5LXRoaXMnKVxuLy8gY29uc3QgeyBNZW1vcnlEYXRhc3RvcmUgfSA9IHJlcXVpcmUoJ2ludGVyZmFjZS1kYXRhc3RvcmUnKVxuLy8gY29uc3QgeyBTbGljZSB9ID0gcmVxdWlyZSgnLi4vc3JjL3NsaWNlJylcbi8vIGNvbnN0IHsgU3RvcmUsIEtpdHN1bmV0U3RvcmUgfSA9IHJlcXVpcmUoJy4uL3NyYy9zdG9yZXMnKVxuLy8gY29uc3QgU2xpY2VNYW5hZ2VyID0gcmVxdWlyZSgnLi4vc3JjL3NsaWNlLW1hbmFnZXInKVxuXG4vLyBjb25zdCBsb2FkRml4dHVyZSA9IHJlcXVpcmUoJ2FlZ2lyL2ZpeHR1cmVzJylcbi8vIGNvbnN0IHNsaWNlRGF0YSA9IGxvYWRGaXh0dXJlKCd0ZXN0L2ZpeHR1cmVzL2FjY291bnQuanNvbicpXG5cbi8vIGRlc2NyaWJlKCdzbGljZSBtYW5hZ2VyJywgKCkgPT4ge1xuLy8gICBjb25zdCBzbGljZSA9IG5ldyBTbGljZShKU09OLnBhcnNlKHNsaWNlRGF0YSkucmVzdWx0KVxuLy8gICBjb25zdCBraXRzdW5ldFN0b3JlID0gbmV3IEtpdHN1bmV0U3RvcmUobmV3IE1lbW9yeURhdGFzdG9yZSgpKVxuXG4vLyAgIGl0KCdzaG91bGQgdHJhY2sgc2xpY2VzJywgYXN5bmMgKCkgPT4ge1xuLy8gICAgIGNvbnN0IHRyYWNrZXIgPSB7XG4vLyAgICAgICBvbjogKCkgPT4ge30sXG4vLyAgICAgICB0cmFjazogKF9zbGljZSkgPT4ge1xuLy8gICAgICAgICBleHBlY3QoX3NsaWNlKS50by5leGlzdCgpXG4vLyAgICAgICAgIGV4cGVjdChfc2xpY2UpLnRvLmRlZXAuZXEoc2xpY2UpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgY29uc3Qgc2xpY2VNYW5hZ2VyID0gbmV3IFNsaWNlTWFuYWdlcih7XG4vLyAgICAgICBicmlkZ2VUcmFja2VyOiB7fSxcbi8vICAgICAgIHB1YnN1YlRyYWNrZXI6IHRyYWNrZXIsXG4vLyAgICAgICBraXRzdW5ldFN0b3JlOiBraXRzdW5ldFN0b3JlLFxuLy8gICAgICAgYmxvY2tUcmFja2VyOiB7fSxcbi8vICAgICAgIGRyaXZlcjoge1xuLy8gICAgICAgICBpc0JyaWRnZTogZmFsc2Vcbi8vICAgICAgIH1cbi8vICAgICB9KVxuXG4vLyAgICAgZXhwZWN0KHNsaWNlTWFuYWdlcikudG8uZXhpc3QoKVxuLy8gICAgIHNsaWNlTWFuYWdlci50cmFjayhzbGljZSlcbi8vICAgfSlcblxuLy8gICBpdCgnc2hvdWxkIHVudHJhY2sgc2xpY2VzJywgYXN5bmMgKCkgPT4ge1xuLy8gICAgIGNvbnN0IHRyYWNrZXIgPSB7XG4vLyAgICAgICBvbjogKCkgPT4geyB9LFxuLy8gICAgICAgdW50cmFjazogKF9zbGljZSkgPT4ge1xuLy8gICAgICAgICBleHBlY3QoX3NsaWNlKS50by5leGlzdCgpXG4vLyAgICAgICAgIGV4cGVjdChfc2xpY2UpLnRvLmRlZXAuZXEoc2xpY2UpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgY29uc3Qgc2xpY2VNYW5hZ2VyID0gbmV3IFNsaWNlTWFuYWdlcih7XG4vLyAgICAgICBicmlkZ2VUcmFja2VyOiB7fSxcbi8vICAgICAgIHB1YnN1YlRyYWNrZXI6IHRyYWNrZXIsXG4vLyAgICAgICBraXRzdW5ldFN0b3JlOiBraXRzdW5ldFN0b3JlLFxuLy8gICAgICAgYmxvY2tUcmFja2VyOiB7fSxcbi8vICAgICAgIGRyaXZlcjoge1xuLy8gICAgICAgICBpc0JyaWRnZTogZmFsc2Vcbi8vICAgICAgIH1cbi8vICAgICB9KVxuXG4vLyAgICAgZXhwZWN0KHNsaWNlTWFuYWdlcikudG8uZXhpc3QoKVxuLy8gICAgIHNsaWNlTWFuYWdlci51bnRyYWNrKHNsaWNlKVxuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgc3RvcmUgc2xpY2VzJywgYXN5bmMgKCkgPT4ge1xuLy8gICAgIGNvbnN0IHRyYWNrZXIgPSBuZXcgRXZlbnRFbWl0dGVyKClcbi8vICAgICBjb25zdCBzbGljZU1hbmFnZXIgPSBuZXcgU2xpY2VNYW5hZ2VyKHtcbi8vICAgICAgIGJyaWRnZVRyYWNrZXI6IHt9LFxuLy8gICAgICAgcHVic3ViVHJhY2tlcjogdHJhY2tlcixcbi8vICAgICAgIGtpdHN1bmV0U3RvcmU6IGtpdHN1bmV0U3RvcmUsXG4vLyAgICAgICBibG9ja1RyYWNrZXI6IHt9LFxuLy8gICAgICAgZHJpdmVyOiB7XG4vLyAgICAgICAgIGlzQnJpZGdlOiBmYWxzZVxuLy8gICAgICAgfVxuLy8gICAgIH0pXG5cbi8vICAgICBleHBlY3Qoc2xpY2VNYW5hZ2VyKS50by5leGlzdCgpXG4vLyAgICAgdHJhY2tlci5lbWl0KCdzbGljZScsIHNsaWNlKVxuLy8gICAgIGNvbnN0IF9zbGljZSA9IGF3YWl0IGtpdHN1bmV0U3RvcmUuZ2V0QnlJZChzbGljZSlcbi8vICAgICBleHBlY3Qoc2xpY2UuaWQpLnRvLmRlZXAuZXEoX3NsaWNlLmlkKVxuLy8gICAgIGV4cGVjdChzbGljZS5zdGVtKS50by5kZWVwLmVxKF9zbGljZS5zdGVtKVxuLy8gICAgIGV4cGVjdChzbGljZS5oZWFkKS50by5kZWVwLmVxKF9zbGljZS5oZWFkKVxuLy8gICAgIGV4cGVjdChzbGljZS5zbGljZU5vZGVzKS50by5kZWVwLmVxKF9zbGljZS5zbGljZU5vZGVzKVxuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgZ2V0IHNsaWNlIGJ5IGlkJywgYXN5bmMgKCkgPT4ge1xuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgZ2V0IGxhdGVzdCBzbGljZScsIGFzeW5jICgpID0+IHtcbi8vICAgfSlcblxuLy8gICBpdCgnc2hvdWxkIGdldCBzbGljZSBieSBibG9jaycsIGFzeW5jICgpID0+IHtcbi8vICAgfSlcblxuLy8gICBpdCgnc2hvdWxkIHN0YXJ0JywgYXN5bmMgKCkgPT4ge1xuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgc3RvcCcsIGFzeW5jICgpID0+IHtcbi8vICAgfSlcbi8vIH0pXG4iXX0=