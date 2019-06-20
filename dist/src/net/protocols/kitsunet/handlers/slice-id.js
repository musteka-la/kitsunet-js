"use strict";
// 'use strict'
// import { BaseHandler } from '../base'
// import Kitsunet = require('../proto')
// const { MsgType, Status } = Kitsunet
// export class SliceId<P> extends BaseHandler<P> {
//   constructor (rpcEngine, peerInfo) {
//     super('slice-id', MsgType.SLICE_ID, rpcEngine, peerInfo)
//   }
//   async handle (): Promise<any> {
//     return {
//       type: MsgType.SLICE_ID,
//       status: Status.OK,
//       payload: {
//         sliceIds: this.rpcEngine.getSliceIds()
//       }
//     }
//   }
//   async request (): Promise<any> {
//     const res = await this.sendRequest({
//       type: MsgType.SLICE_ID
//     })
//     let ids: Set<string> = new Set()
//     if (res.payload.sliceIds) {
//       ids = new Set(res.payload.sliceIds.map((s) => s.toString()))
//     }
//     return ids
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UtaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9raXRzdW5ldC9oYW5kbGVycy9zbGljZS1pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZUFBZTtBQUVmLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFFeEMsdUNBQXVDO0FBRXZDLG1EQUFtRDtBQUNuRCx3Q0FBd0M7QUFDeEMsK0RBQStEO0FBQy9ELE1BQU07QUFFTixvQ0FBb0M7QUFDcEMsZUFBZTtBQUNmLGdDQUFnQztBQUNoQywyQkFBMkI7QUFDM0IsbUJBQW1CO0FBQ25CLGlEQUFpRDtBQUNqRCxVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFFTixxQ0FBcUM7QUFDckMsMkNBQTJDO0FBQzNDLCtCQUErQjtBQUMvQixTQUFTO0FBRVQsdUNBQXVDO0FBQ3ZDLGtDQUFrQztBQUNsQyxxRUFBcUU7QUFDckUsUUFBUTtBQUVSLGlCQUFpQjtBQUNqQixNQUFNO0FBQ04sSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8vICd1c2Ugc3RyaWN0J1xuXG4vLyBpbXBvcnQgeyBCYXNlSGFuZGxlciB9IGZyb20gJy4uL2Jhc2UnXG4vLyBpbXBvcnQgS2l0c3VuZXQgPSByZXF1aXJlKCcuLi9wcm90bycpXG5cbi8vIGNvbnN0IHsgTXNnVHlwZSwgU3RhdHVzIH0gPSBLaXRzdW5ldFxuXG4vLyBleHBvcnQgY2xhc3MgU2xpY2VJZDxQPiBleHRlbmRzIEJhc2VIYW5kbGVyPFA+IHtcbi8vICAgY29uc3RydWN0b3IgKHJwY0VuZ2luZSwgcGVlckluZm8pIHtcbi8vICAgICBzdXBlcignc2xpY2UtaWQnLCBNc2dUeXBlLlNMSUNFX0lELCBycGNFbmdpbmUsIHBlZXJJbmZvKVxuLy8gICB9XG5cbi8vICAgYXN5bmMgaGFuZGxlICgpOiBQcm9taXNlPGFueT4ge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICB0eXBlOiBNc2dUeXBlLlNMSUNFX0lELFxuLy8gICAgICAgc3RhdHVzOiBTdGF0dXMuT0ssXG4vLyAgICAgICBwYXlsb2FkOiB7XG4vLyAgICAgICAgIHNsaWNlSWRzOiB0aGlzLnJwY0VuZ2luZS5nZXRTbGljZUlkcygpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgYXN5bmMgcmVxdWVzdCAoKTogUHJvbWlzZTxhbnk+IHtcbi8vICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLnNlbmRSZXF1ZXN0KHtcbi8vICAgICAgIHR5cGU6IE1zZ1R5cGUuU0xJQ0VfSURcbi8vICAgICB9KVxuXG4vLyAgICAgbGV0IGlkczogU2V0PHN0cmluZz4gPSBuZXcgU2V0KClcbi8vICAgICBpZiAocmVzLnBheWxvYWQuc2xpY2VJZHMpIHtcbi8vICAgICAgIGlkcyA9IG5ldyBTZXQocmVzLnBheWxvYWQuc2xpY2VJZHMubWFwKChzKSA9PiBzLnRvU3RyaW5nKCkpKVxuLy8gICAgIH1cblxuLy8gICAgIHJldHVybiBpZHNcbi8vICAgfVxuLy8gfVxuIl19