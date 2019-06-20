"use strict";
// 'use strict'
// import { KitsunetHandler } from '../kitsunet-handler'
// import { KsnProtocol } from '../ksn-protocol'
// import { IPeerDescriptor } from '../../../interfaces'
// const { MsgType, Status } = Kitsunet
// export class Header<P> extends KitsunetHandler<P> {
//   constructor (networkProvider: KsnProtocol<P>,
//                peer: IPeerDescriptor<P>) {
//     super('headers', MsgType.HEADERS, networkProvider, peer)
//   }
//   async handle (): Promise<any> {
//     return {
//       type: MsgType.HEADERS,
//       status: Status.OK,
//       payload: {
//         slices: await this.networkProvider.headers()
//       }
//     }
//   }
//   async request<T, BlockHeader> (): Promise<BlockHeader[]> {
//     const res = await this.send({
//       type: MsgType.HEADERS
//     })
//     return res.payload.headers as unknown as BlockHeader[]
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2tpdHN1bmV0L2hhbmRsZXJzL2hlYWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGVBQWU7QUFFZix3REFBd0Q7QUFDeEQsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUV4RCx1Q0FBdUM7QUFFdkMsc0RBQXNEO0FBQ3RELGtEQUFrRDtBQUNsRCw2Q0FBNkM7QUFDN0MsK0RBQStEO0FBQy9ELE1BQU07QUFFTixvQ0FBb0M7QUFDcEMsZUFBZTtBQUNmLCtCQUErQjtBQUMvQiwyQkFBMkI7QUFDM0IsbUJBQW1CO0FBQ25CLHVEQUF1RDtBQUN2RCxVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFFTiwrREFBK0Q7QUFDL0Qsb0NBQW9DO0FBQ3BDLDhCQUE4QjtBQUM5QixTQUFTO0FBQ1QsNkRBQTZEO0FBQzdELE1BQU07QUFDTixJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gJ3VzZSBzdHJpY3QnXG5cbi8vIGltcG9ydCB7IEtpdHN1bmV0SGFuZGxlciB9IGZyb20gJy4uL2tpdHN1bmV0LWhhbmRsZXInXG4vLyBpbXBvcnQgeyBLc25Qcm90b2NvbCB9IGZyb20gJy4uL2tzbi1wcm90b2NvbCdcbi8vIGltcG9ydCB7IElQZWVyRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMnXG5cbi8vIGNvbnN0IHsgTXNnVHlwZSwgU3RhdHVzIH0gPSBLaXRzdW5ldFxuXG4vLyBleHBvcnQgY2xhc3MgSGVhZGVyPFA+IGV4dGVuZHMgS2l0c3VuZXRIYW5kbGVyPFA+IHtcbi8vICAgY29uc3RydWN0b3IgKG5ldHdvcmtQcm92aWRlcjogS3NuUHJvdG9jb2w8UD4sXG4vLyAgICAgICAgICAgICAgICBwZWVyOiBJUGVlckRlc2NyaXB0b3I8UD4pIHtcbi8vICAgICBzdXBlcignaGVhZGVycycsIE1zZ1R5cGUuSEVBREVSUywgbmV0d29ya1Byb3ZpZGVyLCBwZWVyKVxuLy8gICB9XG5cbi8vICAgYXN5bmMgaGFuZGxlICgpOiBQcm9taXNlPGFueT4ge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICB0eXBlOiBNc2dUeXBlLkhFQURFUlMsXG4vLyAgICAgICBzdGF0dXM6IFN0YXR1cy5PSyxcbi8vICAgICAgIHBheWxvYWQ6IHtcbi8vICAgICAgICAgc2xpY2VzOiBhd2FpdCB0aGlzLm5ldHdvcmtQcm92aWRlci5oZWFkZXJzKClcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cblxuLy8gICBhc3luYyByZXF1ZXN0PFQsIEJsb2NrSGVhZGVyPiAoKTogUHJvbWlzZTxCbG9ja0hlYWRlcltdPiB7XG4vLyAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5zZW5kKHtcbi8vICAgICAgIHR5cGU6IE1zZ1R5cGUuSEVBREVSU1xuLy8gICAgIH0pXG4vLyAgICAgcmV0dXJuIHJlcy5wYXlsb2FkLmhlYWRlcnMgYXMgdW5rbm93biBhcyBCbG9ja0hlYWRlcltdXG4vLyAgIH1cbi8vIH1cbiJdfQ==