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
