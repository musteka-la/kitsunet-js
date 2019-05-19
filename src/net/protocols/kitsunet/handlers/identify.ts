// 'use strict'

// import { BaseHandler } from '../base'
// import BN from 'bn.js'
// import Kitsunet = require('../proto')
// import { KsnProtocol } from '../../ksn-protocol'
// import { IPeerDescriptor } from '../interfaces'
// import { KitsunetHandler } from '../kitsunet-handler'

// const { MsgType, Status } = Kitsunet

// export class Identify<P> extends KitsunetHandler<P> {
//   constructor (networkProvider: KsnProtocol<P>,
//                peer: IPeerDescriptor<P>) {
//     super('identify', MsgType.IDENTIFY, networkProvider, peer)
//   }

//   async handle (): Promise<any> {
//     try {
//       const block = await this.rpcEngine.getLatestBlock()
//       return {
//         type: MsgType.IDENTIFY,
//         status: Status.OK,
//         payload: {
//           identify: {
//             version: this.rpcEngine.VERSION,
//             userAgent: this.rpcEngine.USER_AGENT,
//             nodeType: this.rpcEngine.nodeType,
//             latestBlock: block ? block.header.number : new BN(0).toBuffer(),
//             sliceIds: this.rpcEngine.getSliceIds()
//           }
//         }
//       }
//     } catch (e) {
//       this.log(e)
//       return this.errResponse(e)
//     }
//   }

//   async request (): Promise<any> {
//     const res = await this.sendRequest({
//       type: MsgType.IDENTIFY
//     })

//     return res.payload.identify
//   }
// }
