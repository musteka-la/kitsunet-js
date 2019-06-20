"use strict";
// /* eslint-env mocha */
// 'use strict'
// const chai = require('chai')
// const dirtyChai = require('dirty-chai')
// const expect = chai.expect
// chai.use(dirtyChai)
// const utils = require('ethereumjs-util')
// const { Slice } = require('../src/slice')
// const fromRpc = require('ethereumjs-block/from-rpc')
// const Block = require('ethereumjs-block')
// const { NodeTypes } = require('../src/constants')
// const KitsunetProto = require('../src/net/kitsunet-rpc/proto').Kitsunet
// const { MsgType, Status } = KitsunetProto
// const loadFixture = require('aegir/fixtures')
// const accountSlice = JSON.parse(loadFixture('test/fixtures/account.json').toString()).result
// const contractSlice = JSON.parse(loadFixture('test/fixtures/contract.json').toString()).result
// const block = fromRpc(JSON.parse(loadFixture('test/fixtures/block.json').toString()).result)
// describe('kitsunet rpc', () => {
//   it('should encode IDENTIFY message', () => {
//     const msg = {
//       type: MsgType.IDENTIFY,
//       status: Status.OK,
//       data: {
//         identify: {
//           version: '1.0.0',
//           userAgent: 'ksn-js',
//           nodeType: NodeTypes.NODE,
//           latestBlock: Buffer.from('0x12345'),
//           sliceIds: ['0x0000', '0x0001', '0x0002', '0x0003'].map(s => Buffer.from(s))
//         }
//       }
//     }
//     const encoded = KitsunetProto.encode(msg)
//     const decoded = KitsunetProto.decode(encoded)
//     expect(encoded).to.exist()
//     expect(decoded).to.exist()
//     expect(decoded.type).to.eq(MsgType.IDENTIFY)
//     expect(decoded.status).to.eq(Status.OK)
//     expect(msg.data.identify).to.deep.eq(decoded.data.identify)
//   })
//   it('should encode SLICE_ID message', () => {
//     const msg = {
//       type: MsgType.SLICE_ID,
//       status: Status.OK,
//       data: {
//         sliceIds: ['0x0000', '0x0001', '0x0002', '0x0003'].map(s => Buffer.from(s))
//       }
//     }
//     const encoded = KitsunetProto.encode(msg)
//     const decoded = KitsunetProto.decode(encoded)
//     expect(encoded).to.exist()
//     expect(decoded).to.exist()
//     expect(decoded.type).to.eq(MsgType.SLICE_ID)
//     expect(decoded.status).to.eq(Status.OK)
//     expect(msg.data.sliceIds).to.deep.eq(decoded.data.sliceIds)
//   })
//   it('should encode SLICES message', () => {
//     const msg = {
//       type: MsgType.SLICES,
//       status: Status.OK,
//       data: {
//         slices: [accountSlice, contractSlice].map(s => (new Slice(s)).serialize())
//       }
//     }
//     const encoded = KitsunetProto.encode(msg)
//     const decoded = KitsunetProto.decode(encoded)
//     expect(encoded).to.exist()
//     expect(decoded).to.exist()
//     expect(decoded.type).to.eq(MsgType.SLICES)
//     expect(decoded.status).to.eq(Status.OK)
//     expect(msg.data.slices).to.deep.eq(decoded.data.slices)
//   })
//   it('should encode HEADERS message', () => {
//     const msg = {
//       type: MsgType.HEADERS,
//       status: Status.OK,
//       data: {
//         headers: [block].map(b => utils.rlp.encode(new Block.Header(b).raw))
//       }
//     }
//     const encoded = KitsunetProto.encode(msg)
//     const decoded = KitsunetProto.decode(encoded)
//     expect(encoded).to.exist()
//     expect(decoded).to.exist()
//     expect(decoded.type).to.eq(MsgType.HEADERS)
//     expect(decoded.status).to.eq(Status.OK)
//     expect(msg.data.headers).to.deep.eq(decoded.data.headers)
//   })
//   it('should encode LATEST_BLOCK message', () => {
//     const msg = {
//       type: MsgType.LATEST_BLOCK,
//       status: Status.OK,
//       data: {
//         latestBlock: Buffer.from('0x7777777')
//       }
//     }
//     const encoded = KitsunetProto.encode(msg)
//     const decoded = KitsunetProto.decode(encoded)
//     expect(encoded).to.exist()
//     expect(decoded).to.exist()
//     expect(decoded.type).to.eq(MsgType.LATEST_BLOCK)
//     expect(decoded.status).to.eq(Status.OK)
//     expect(msg.data.latestBlock).to.deep.eq(decoded.data.latestBlock)
//   })
//   it('should encode NODE_TYPE message', () => {
//     const msg = {
//       type: MsgType.NODE_TYPE,
//       status: Status.OK,
//       data: {
//         type: NodeTypes.BRIDGE
//       }
//     }
//     const encoded = KitsunetProto.encode(msg)
//     const decoded = KitsunetProto.decode(encoded)
//     expect(encoded).to.exist()
//     expect(decoded).to.exist()
//     expect(decoded.type).to.eq(MsgType.NODE_TYPE)
//     expect(decoded.status).to.eq(Status.OK)
//     expect(msg.data.type).to.deep.eq(decoded.data.type)
//   })
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2l0c3VuZXQtcnBjLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2tpdHN1bmV0LXJwYy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5QkFBeUI7QUFDekIsZUFBZTtBQUVmLCtCQUErQjtBQUMvQiwwQ0FBMEM7QUFDMUMsNkJBQTZCO0FBQzdCLHNCQUFzQjtBQUV0QiwyQ0FBMkM7QUFDM0MsNENBQTRDO0FBQzVDLHVEQUF1RDtBQUN2RCw0Q0FBNEM7QUFDNUMsb0RBQW9EO0FBQ3BELDBFQUEwRTtBQUMxRSw0Q0FBNEM7QUFFNUMsZ0RBQWdEO0FBQ2hELCtGQUErRjtBQUMvRixpR0FBaUc7QUFDakcsK0ZBQStGO0FBRS9GLG1DQUFtQztBQUNuQyxpREFBaUQ7QUFDakQsb0JBQW9CO0FBQ3BCLGdDQUFnQztBQUNoQywyQkFBMkI7QUFDM0IsZ0JBQWdCO0FBQ2hCLHNCQUFzQjtBQUN0Qiw4QkFBOEI7QUFDOUIsaUNBQWlDO0FBQ2pDLHNDQUFzQztBQUN0QyxpREFBaUQ7QUFDakQsd0ZBQXdGO0FBQ3hGLFlBQVk7QUFDWixVQUFVO0FBQ1YsUUFBUTtBQUVSLGdEQUFnRDtBQUNoRCxvREFBb0Q7QUFFcEQsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxtREFBbUQ7QUFDbkQsOENBQThDO0FBQzlDLGtFQUFrRTtBQUNsRSxPQUFPO0FBRVAsaURBQWlEO0FBQ2pELG9CQUFvQjtBQUNwQixnQ0FBZ0M7QUFDaEMsMkJBQTJCO0FBQzNCLGdCQUFnQjtBQUNoQixzRkFBc0Y7QUFDdEYsVUFBVTtBQUNWLFFBQVE7QUFFUixnREFBZ0Q7QUFDaEQsb0RBQW9EO0FBRXBELGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFFakMsbURBQW1EO0FBQ25ELDhDQUE4QztBQUM5QyxrRUFBa0U7QUFDbEUsT0FBTztBQUVQLCtDQUErQztBQUMvQyxvQkFBb0I7QUFDcEIsOEJBQThCO0FBQzlCLDJCQUEyQjtBQUMzQixnQkFBZ0I7QUFDaEIscUZBQXFGO0FBQ3JGLFVBQVU7QUFDVixRQUFRO0FBRVIsZ0RBQWdEO0FBQ2hELG9EQUFvRDtBQUVwRCxpQ0FBaUM7QUFDakMsaUNBQWlDO0FBRWpDLGlEQUFpRDtBQUNqRCw4Q0FBOEM7QUFDOUMsOERBQThEO0FBQzlELE9BQU87QUFFUCxnREFBZ0Q7QUFDaEQsb0JBQW9CO0FBQ3BCLCtCQUErQjtBQUMvQiwyQkFBMkI7QUFDM0IsZ0JBQWdCO0FBQ2hCLCtFQUErRTtBQUMvRSxVQUFVO0FBQ1YsUUFBUTtBQUVSLGdEQUFnRDtBQUNoRCxvREFBb0Q7QUFFcEQsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUVqQyxrREFBa0Q7QUFDbEQsOENBQThDO0FBQzlDLGdFQUFnRTtBQUNoRSxPQUFPO0FBRVAscURBQXFEO0FBQ3JELG9CQUFvQjtBQUNwQixvQ0FBb0M7QUFDcEMsMkJBQTJCO0FBQzNCLGdCQUFnQjtBQUNoQixnREFBZ0Q7QUFDaEQsVUFBVTtBQUNWLFFBQVE7QUFFUixnREFBZ0Q7QUFDaEQsb0RBQW9EO0FBRXBELGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFFakMsdURBQXVEO0FBQ3ZELDhDQUE4QztBQUM5Qyx3RUFBd0U7QUFDeEUsT0FBTztBQUVQLGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsaUNBQWlDO0FBQ2pDLDJCQUEyQjtBQUMzQixnQkFBZ0I7QUFDaEIsaUNBQWlDO0FBQ2pDLFVBQVU7QUFDVixRQUFRO0FBRVIsZ0RBQWdEO0FBQ2hELG9EQUFvRDtBQUVwRCxpQ0FBaUM7QUFDakMsaUNBQWlDO0FBRWpDLG9EQUFvRDtBQUNwRCw4Q0FBOEM7QUFDOUMsMERBQTBEO0FBQzFELE9BQU87QUFDUCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyogZXNsaW50LWVudiBtb2NoYSAqL1xuLy8gJ3VzZSBzdHJpY3QnXG5cbi8vIGNvbnN0IGNoYWkgPSByZXF1aXJlKCdjaGFpJylcbi8vIGNvbnN0IGRpcnR5Q2hhaSA9IHJlcXVpcmUoJ2RpcnR5LWNoYWknKVxuLy8gY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Rcbi8vIGNoYWkudXNlKGRpcnR5Q2hhaSlcblxuLy8gY29uc3QgdXRpbHMgPSByZXF1aXJlKCdldGhlcmV1bWpzLXV0aWwnKVxuLy8gY29uc3QgeyBTbGljZSB9ID0gcmVxdWlyZSgnLi4vc3JjL3NsaWNlJylcbi8vIGNvbnN0IGZyb21ScGMgPSByZXF1aXJlKCdldGhlcmV1bWpzLWJsb2NrL2Zyb20tcnBjJylcbi8vIGNvbnN0IEJsb2NrID0gcmVxdWlyZSgnZXRoZXJldW1qcy1ibG9jaycpXG4vLyBjb25zdCB7IE5vZGVUeXBlcyB9ID0gcmVxdWlyZSgnLi4vc3JjL2NvbnN0YW50cycpXG4vLyBjb25zdCBLaXRzdW5ldFByb3RvID0gcmVxdWlyZSgnLi4vc3JjL25ldC9raXRzdW5ldC1ycGMvcHJvdG8nKS5LaXRzdW5ldFxuLy8gY29uc3QgeyBNc2dUeXBlLCBTdGF0dXMgfSA9IEtpdHN1bmV0UHJvdG9cblxuLy8gY29uc3QgbG9hZEZpeHR1cmUgPSByZXF1aXJlKCdhZWdpci9maXh0dXJlcycpXG4vLyBjb25zdCBhY2NvdW50U2xpY2UgPSBKU09OLnBhcnNlKGxvYWRGaXh0dXJlKCd0ZXN0L2ZpeHR1cmVzL2FjY291bnQuanNvbicpLnRvU3RyaW5nKCkpLnJlc3VsdFxuLy8gY29uc3QgY29udHJhY3RTbGljZSA9IEpTT04ucGFyc2UobG9hZEZpeHR1cmUoJ3Rlc3QvZml4dHVyZXMvY29udHJhY3QuanNvbicpLnRvU3RyaW5nKCkpLnJlc3VsdFxuLy8gY29uc3QgYmxvY2sgPSBmcm9tUnBjKEpTT04ucGFyc2UobG9hZEZpeHR1cmUoJ3Rlc3QvZml4dHVyZXMvYmxvY2suanNvbicpLnRvU3RyaW5nKCkpLnJlc3VsdClcblxuLy8gZGVzY3JpYmUoJ2tpdHN1bmV0IHJwYycsICgpID0+IHtcbi8vICAgaXQoJ3Nob3VsZCBlbmNvZGUgSURFTlRJRlkgbWVzc2FnZScsICgpID0+IHtcbi8vICAgICBjb25zdCBtc2cgPSB7XG4vLyAgICAgICB0eXBlOiBNc2dUeXBlLklERU5USUZZLFxuLy8gICAgICAgc3RhdHVzOiBTdGF0dXMuT0ssXG4vLyAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgIGlkZW50aWZ5OiB7XG4vLyAgICAgICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbi8vICAgICAgICAgICB1c2VyQWdlbnQ6ICdrc24tanMnLFxuLy8gICAgICAgICAgIG5vZGVUeXBlOiBOb2RlVHlwZXMuTk9ERSxcbi8vICAgICAgICAgICBsYXRlc3RCbG9jazogQnVmZmVyLmZyb20oJzB4MTIzNDUnKSxcbi8vICAgICAgICAgICBzbGljZUlkczogWycweDAwMDAnLCAnMHgwMDAxJywgJzB4MDAwMicsICcweDAwMDMnXS5tYXAocyA9PiBCdWZmZXIuZnJvbShzKSlcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH1cblxuLy8gICAgIGNvbnN0IGVuY29kZWQgPSBLaXRzdW5ldFByb3RvLmVuY29kZShtc2cpXG4vLyAgICAgY29uc3QgZGVjb2RlZCA9IEtpdHN1bmV0UHJvdG8uZGVjb2RlKGVuY29kZWQpXG5cbi8vICAgICBleHBlY3QoZW5jb2RlZCkudG8uZXhpc3QoKVxuLy8gICAgIGV4cGVjdChkZWNvZGVkKS50by5leGlzdCgpXG4vLyAgICAgZXhwZWN0KGRlY29kZWQudHlwZSkudG8uZXEoTXNnVHlwZS5JREVOVElGWSlcbi8vICAgICBleHBlY3QoZGVjb2RlZC5zdGF0dXMpLnRvLmVxKFN0YXR1cy5PSylcbi8vICAgICBleHBlY3QobXNnLmRhdGEuaWRlbnRpZnkpLnRvLmRlZXAuZXEoZGVjb2RlZC5kYXRhLmlkZW50aWZ5KVxuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgZW5jb2RlIFNMSUNFX0lEIG1lc3NhZ2UnLCAoKSA9PiB7XG4vLyAgICAgY29uc3QgbXNnID0ge1xuLy8gICAgICAgdHlwZTogTXNnVHlwZS5TTElDRV9JRCxcbi8vICAgICAgIHN0YXR1czogU3RhdHVzLk9LLFxuLy8gICAgICAgZGF0YToge1xuLy8gICAgICAgICBzbGljZUlkczogWycweDAwMDAnLCAnMHgwMDAxJywgJzB4MDAwMicsICcweDAwMDMnXS5tYXAocyA9PiBCdWZmZXIuZnJvbShzKSlcbi8vICAgICAgIH1cbi8vICAgICB9XG5cbi8vICAgICBjb25zdCBlbmNvZGVkID0gS2l0c3VuZXRQcm90by5lbmNvZGUobXNnKVxuLy8gICAgIGNvbnN0IGRlY29kZWQgPSBLaXRzdW5ldFByb3RvLmRlY29kZShlbmNvZGVkKVxuXG4vLyAgICAgZXhwZWN0KGVuY29kZWQpLnRvLmV4aXN0KClcbi8vICAgICBleHBlY3QoZGVjb2RlZCkudG8uZXhpc3QoKVxuXG4vLyAgICAgZXhwZWN0KGRlY29kZWQudHlwZSkudG8uZXEoTXNnVHlwZS5TTElDRV9JRClcbi8vICAgICBleHBlY3QoZGVjb2RlZC5zdGF0dXMpLnRvLmVxKFN0YXR1cy5PSylcbi8vICAgICBleHBlY3QobXNnLmRhdGEuc2xpY2VJZHMpLnRvLmRlZXAuZXEoZGVjb2RlZC5kYXRhLnNsaWNlSWRzKVxuLy8gICB9KVxuXG4vLyAgIGl0KCdzaG91bGQgZW5jb2RlIFNMSUNFUyBtZXNzYWdlJywgKCkgPT4ge1xuLy8gICAgIGNvbnN0IG1zZyA9IHtcbi8vICAgICAgIHR5cGU6IE1zZ1R5cGUuU0xJQ0VTLFxuLy8gICAgICAgc3RhdHVzOiBTdGF0dXMuT0ssXG4vLyAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgIHNsaWNlczogW2FjY291bnRTbGljZSwgY29udHJhY3RTbGljZV0ubWFwKHMgPT4gKG5ldyBTbGljZShzKSkuc2VyaWFsaXplKCkpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgY29uc3QgZW5jb2RlZCA9IEtpdHN1bmV0UHJvdG8uZW5jb2RlKG1zZylcbi8vICAgICBjb25zdCBkZWNvZGVkID0gS2l0c3VuZXRQcm90by5kZWNvZGUoZW5jb2RlZClcblxuLy8gICAgIGV4cGVjdChlbmNvZGVkKS50by5leGlzdCgpXG4vLyAgICAgZXhwZWN0KGRlY29kZWQpLnRvLmV4aXN0KClcblxuLy8gICAgIGV4cGVjdChkZWNvZGVkLnR5cGUpLnRvLmVxKE1zZ1R5cGUuU0xJQ0VTKVxuLy8gICAgIGV4cGVjdChkZWNvZGVkLnN0YXR1cykudG8uZXEoU3RhdHVzLk9LKVxuLy8gICAgIGV4cGVjdChtc2cuZGF0YS5zbGljZXMpLnRvLmRlZXAuZXEoZGVjb2RlZC5kYXRhLnNsaWNlcylcbi8vICAgfSlcblxuLy8gICBpdCgnc2hvdWxkIGVuY29kZSBIRUFERVJTIG1lc3NhZ2UnLCAoKSA9PiB7XG4vLyAgICAgY29uc3QgbXNnID0ge1xuLy8gICAgICAgdHlwZTogTXNnVHlwZS5IRUFERVJTLFxuLy8gICAgICAgc3RhdHVzOiBTdGF0dXMuT0ssXG4vLyAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgIGhlYWRlcnM6IFtibG9ja10ubWFwKGIgPT4gdXRpbHMucmxwLmVuY29kZShuZXcgQmxvY2suSGVhZGVyKGIpLnJhdykpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgY29uc3QgZW5jb2RlZCA9IEtpdHN1bmV0UHJvdG8uZW5jb2RlKG1zZylcbi8vICAgICBjb25zdCBkZWNvZGVkID0gS2l0c3VuZXRQcm90by5kZWNvZGUoZW5jb2RlZClcblxuLy8gICAgIGV4cGVjdChlbmNvZGVkKS50by5leGlzdCgpXG4vLyAgICAgZXhwZWN0KGRlY29kZWQpLnRvLmV4aXN0KClcblxuLy8gICAgIGV4cGVjdChkZWNvZGVkLnR5cGUpLnRvLmVxKE1zZ1R5cGUuSEVBREVSUylcbi8vICAgICBleHBlY3QoZGVjb2RlZC5zdGF0dXMpLnRvLmVxKFN0YXR1cy5PSylcbi8vICAgICBleHBlY3QobXNnLmRhdGEuaGVhZGVycykudG8uZGVlcC5lcShkZWNvZGVkLmRhdGEuaGVhZGVycylcbi8vICAgfSlcblxuLy8gICBpdCgnc2hvdWxkIGVuY29kZSBMQVRFU1RfQkxPQ0sgbWVzc2FnZScsICgpID0+IHtcbi8vICAgICBjb25zdCBtc2cgPSB7XG4vLyAgICAgICB0eXBlOiBNc2dUeXBlLkxBVEVTVF9CTE9DSyxcbi8vICAgICAgIHN0YXR1czogU3RhdHVzLk9LLFxuLy8gICAgICAgZGF0YToge1xuLy8gICAgICAgICBsYXRlc3RCbG9jazogQnVmZmVyLmZyb20oJzB4Nzc3Nzc3NycpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgY29uc3QgZW5jb2RlZCA9IEtpdHN1bmV0UHJvdG8uZW5jb2RlKG1zZylcbi8vICAgICBjb25zdCBkZWNvZGVkID0gS2l0c3VuZXRQcm90by5kZWNvZGUoZW5jb2RlZClcblxuLy8gICAgIGV4cGVjdChlbmNvZGVkKS50by5leGlzdCgpXG4vLyAgICAgZXhwZWN0KGRlY29kZWQpLnRvLmV4aXN0KClcblxuLy8gICAgIGV4cGVjdChkZWNvZGVkLnR5cGUpLnRvLmVxKE1zZ1R5cGUuTEFURVNUX0JMT0NLKVxuLy8gICAgIGV4cGVjdChkZWNvZGVkLnN0YXR1cykudG8uZXEoU3RhdHVzLk9LKVxuLy8gICAgIGV4cGVjdChtc2cuZGF0YS5sYXRlc3RCbG9jaykudG8uZGVlcC5lcShkZWNvZGVkLmRhdGEubGF0ZXN0QmxvY2spXG4vLyAgIH0pXG5cbi8vICAgaXQoJ3Nob3VsZCBlbmNvZGUgTk9ERV9UWVBFIG1lc3NhZ2UnLCAoKSA9PiB7XG4vLyAgICAgY29uc3QgbXNnID0ge1xuLy8gICAgICAgdHlwZTogTXNnVHlwZS5OT0RFX1RZUEUsXG4vLyAgICAgICBzdGF0dXM6IFN0YXR1cy5PSyxcbi8vICAgICAgIGRhdGE6IHtcbi8vICAgICAgICAgdHlwZTogTm9kZVR5cGVzLkJSSURHRVxuLy8gICAgICAgfVxuLy8gICAgIH1cblxuLy8gICAgIGNvbnN0IGVuY29kZWQgPSBLaXRzdW5ldFByb3RvLmVuY29kZShtc2cpXG4vLyAgICAgY29uc3QgZGVjb2RlZCA9IEtpdHN1bmV0UHJvdG8uZGVjb2RlKGVuY29kZWQpXG5cbi8vICAgICBleHBlY3QoZW5jb2RlZCkudG8uZXhpc3QoKVxuLy8gICAgIGV4cGVjdChkZWNvZGVkKS50by5leGlzdCgpXG5cbi8vICAgICBleHBlY3QoZGVjb2RlZC50eXBlKS50by5lcShNc2dUeXBlLk5PREVfVFlQRSlcbi8vICAgICBleHBlY3QoZGVjb2RlZC5zdGF0dXMpLnRvLmVxKFN0YXR1cy5PSylcbi8vICAgICBleHBlY3QobXNnLmRhdGEudHlwZSkudG8uZGVlcC5lcShkZWNvZGVkLmRhdGEudHlwZSlcbi8vICAgfSlcbi8vIH0pXG4iXX0=