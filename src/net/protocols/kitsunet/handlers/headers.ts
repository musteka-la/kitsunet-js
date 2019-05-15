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
