"use strict";
// 'use strict'
// import { BaseHandler }  from '../base'
// import { Slice } from '../../../../slice'
// import Kitsunet = require('../proto')
// const { MsgType, Status } = Kitsunet
// export class Slices<P> extends BaseHandler<P> {
//   constructor (rpcEngine, peerInfo) {
//     super('slices', MsgType.SLICES, rpcEngine, peerInfo)
//   }
//   async handle (msg): Promise<any> {
//     const slices = await this.rpcEngine.getSlices(msg.payload.slices)
//     return {
//       type: MsgType.SLICES,
//       status: Status.OK,
//       payload: {
//         slices
//       }
//     }
//   }
//   async request (slices): Promise<any> {
//     const res = await this.sendRequest({
//       type: MsgType.SLICES,
//       payload: {
//         slices: slices ? slices.map((s) => s.serialize()) : null
//       }
//     })
//     let _slices: Slice[] = []
//     if (res.payload.slices) {
//       _slices = res.payload.slices.map((s) => new Slice(s))
//     }
//     return _slices
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMva2l0c3VuZXQvaGFuZGxlcnMvc2xpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxlQUFlO0FBRWYseUNBQXlDO0FBQ3pDLDRDQUE0QztBQUM1Qyx3Q0FBd0M7QUFFeEMsdUNBQXVDO0FBRXZDLGtEQUFrRDtBQUNsRCx3Q0FBd0M7QUFDeEMsMkRBQTJEO0FBQzNELE1BQU07QUFFTix1Q0FBdUM7QUFDdkMsd0VBQXdFO0FBQ3hFLGVBQWU7QUFDZiw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsVUFBVTtBQUNWLFFBQVE7QUFDUixNQUFNO0FBRU4sMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw4QkFBOEI7QUFDOUIsbUJBQW1CO0FBQ25CLG1FQUFtRTtBQUNuRSxVQUFVO0FBQ1YsU0FBUztBQUVULGdDQUFnQztBQUNoQyxnQ0FBZ0M7QUFDaEMsOERBQThEO0FBQzlELFFBQVE7QUFFUixxQkFBcUI7QUFDckIsTUFBTTtBQUNOLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAndXNlIHN0cmljdCdcblxuLy8gaW1wb3J0IHsgQmFzZUhhbmRsZXIgfSAgZnJvbSAnLi4vYmFzZSdcbi8vIGltcG9ydCB7IFNsaWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2xpY2UnXG4vLyBpbXBvcnQgS2l0c3VuZXQgPSByZXF1aXJlKCcuLi9wcm90bycpXG5cbi8vIGNvbnN0IHsgTXNnVHlwZSwgU3RhdHVzIH0gPSBLaXRzdW5ldFxuXG4vLyBleHBvcnQgY2xhc3MgU2xpY2VzPFA+IGV4dGVuZHMgQmFzZUhhbmRsZXI8UD4ge1xuLy8gICBjb25zdHJ1Y3RvciAocnBjRW5naW5lLCBwZWVySW5mbykge1xuLy8gICAgIHN1cGVyKCdzbGljZXMnLCBNc2dUeXBlLlNMSUNFUywgcnBjRW5naW5lLCBwZWVySW5mbylcbi8vICAgfVxuXG4vLyAgIGFzeW5jIGhhbmRsZSAobXNnKTogUHJvbWlzZTxhbnk+IHtcbi8vICAgICBjb25zdCBzbGljZXMgPSBhd2FpdCB0aGlzLnJwY0VuZ2luZS5nZXRTbGljZXMobXNnLnBheWxvYWQuc2xpY2VzKVxuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICB0eXBlOiBNc2dUeXBlLlNMSUNFUyxcbi8vICAgICAgIHN0YXR1czogU3RhdHVzLk9LLFxuLy8gICAgICAgcGF5bG9hZDoge1xuLy8gICAgICAgICBzbGljZXNcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cblxuLy8gICBhc3luYyByZXF1ZXN0IChzbGljZXMpOiBQcm9taXNlPGFueT4ge1xuLy8gICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuc2VuZFJlcXVlc3Qoe1xuLy8gICAgICAgdHlwZTogTXNnVHlwZS5TTElDRVMsXG4vLyAgICAgICBwYXlsb2FkOiB7XG4vLyAgICAgICAgIHNsaWNlczogc2xpY2VzID8gc2xpY2VzLm1hcCgocykgPT4gcy5zZXJpYWxpemUoKSkgOiBudWxsXG4vLyAgICAgICB9XG4vLyAgICAgfSlcblxuLy8gICAgIGxldCBfc2xpY2VzOiBTbGljZVtdID0gW11cbi8vICAgICBpZiAocmVzLnBheWxvYWQuc2xpY2VzKSB7XG4vLyAgICAgICBfc2xpY2VzID0gcmVzLnBheWxvYWQuc2xpY2VzLm1hcCgocykgPT4gbmV3IFNsaWNlKHMpKVxuLy8gICAgIH1cblxuLy8gICAgIHJldHVybiBfc2xpY2VzXG4vLyAgIH1cbi8vIH1cbiJdfQ==