"use strict";
// 'use strict'
// import { BaseHandler } from '../base'
// import Kitsunet = require('../proto')
// import { KsnProtocol } from '../../ksn-protocol'
// const { MsgType, Status } = Kitsunet
// export class NodeType<P> extends BaseHandler<P> {
//   constructor (rpcEngine: KsnProtocol<P>, peerInfo: any) {
//     super('node-type', MsgType.NODE_TYPE, rpcEngine, peerInfo)
//   }
//   async handle (): Promise<any> {
//     return {
//       type: MsgType.NODE_TYPE,
//       status: Status.OK,
//       payload: {
//         slices: this.rpcEngine.nodeType
//       }
//     }
//   }
//   async request (): Promise<any> {
//     const res = await this.sendRequest({
//       type: MsgType.NODE_TYPE
//     })
//     return res.payload.nodeType
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS10eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMva2l0c3VuZXQvaGFuZGxlcnMvbm9kZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxlQUFlO0FBRWYsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxtREFBbUQ7QUFFbkQsdUNBQXVDO0FBRXZDLG9EQUFvRDtBQUNwRCw2REFBNkQ7QUFDN0QsaUVBQWlFO0FBQ2pFLE1BQU07QUFFTixvQ0FBb0M7QUFDcEMsZUFBZTtBQUNmLGlDQUFpQztBQUNqQywyQkFBMkI7QUFDM0IsbUJBQW1CO0FBQ25CLDBDQUEwQztBQUMxQyxVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFFTixxQ0FBcUM7QUFDckMsMkNBQTJDO0FBQzNDLGdDQUFnQztBQUNoQyxTQUFTO0FBRVQsa0NBQWtDO0FBQ2xDLE1BQU07QUFDTixJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gJ3VzZSBzdHJpY3QnXG5cbi8vIGltcG9ydCB7IEJhc2VIYW5kbGVyIH0gZnJvbSAnLi4vYmFzZSdcbi8vIGltcG9ydCBLaXRzdW5ldCA9IHJlcXVpcmUoJy4uL3Byb3RvJylcbi8vIGltcG9ydCB7IEtzblByb3RvY29sIH0gZnJvbSAnLi4vLi4va3NuLXByb3RvY29sJ1xuXG4vLyBjb25zdCB7IE1zZ1R5cGUsIFN0YXR1cyB9ID0gS2l0c3VuZXRcblxuLy8gZXhwb3J0IGNsYXNzIE5vZGVUeXBlPFA+IGV4dGVuZHMgQmFzZUhhbmRsZXI8UD4ge1xuLy8gICBjb25zdHJ1Y3RvciAocnBjRW5naW5lOiBLc25Qcm90b2NvbDxQPiwgcGVlckluZm86IGFueSkge1xuLy8gICAgIHN1cGVyKCdub2RlLXR5cGUnLCBNc2dUeXBlLk5PREVfVFlQRSwgcnBjRW5naW5lLCBwZWVySW5mbylcbi8vICAgfVxuXG4vLyAgIGFzeW5jIGhhbmRsZSAoKTogUHJvbWlzZTxhbnk+IHtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgdHlwZTogTXNnVHlwZS5OT0RFX1RZUEUsXG4vLyAgICAgICBzdGF0dXM6IFN0YXR1cy5PSyxcbi8vICAgICAgIHBheWxvYWQ6IHtcbi8vICAgICAgICAgc2xpY2VzOiB0aGlzLnJwY0VuZ2luZS5ub2RlVHlwZVxuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIGFzeW5jIHJlcXVlc3QgKCk6IFByb21pc2U8YW55PiB7XG4vLyAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5zZW5kUmVxdWVzdCh7XG4vLyAgICAgICB0eXBlOiBNc2dUeXBlLk5PREVfVFlQRVxuLy8gICAgIH0pXG5cbi8vICAgICByZXR1cm4gcmVzLnBheWxvYWQubm9kZVR5cGVcbi8vICAgfVxuLy8gfVxuIl19