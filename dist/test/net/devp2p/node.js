"use strict";
// /* eslint-env mocha */
// 'use strict'
// import 'mocha'
// import { expect } from 'chai'
// import {
//   EthProtocol,
//   Devp2pNode,
//   IProtocolDescriptor,
//   Devp2pPeer,
//   RLPxNodeOptions
// } from '../../../src/net'
// import {
//   DPT,
//   RLPx,
//   genPrivateKey,
//   ETH,
//   PeerInfo
// } from 'ethereumjs-devp2p'
// import Common from 'ethereumjs-common'
// describe.skip('simple test RLPx Node', () => {
//   const capabilities = [ETH.eth63, ETH.eth62]
//   const udpPort = 55555
//   const tcpPort = 55556
//   const dpt = new DPT(genPrivateKey(), {
//     endpoint: {
//       address: '127.0.0.1',
//       udpPort: udpPort,
//       tcpPort: tcpPort
//     },
//     timeout: 100
//   })
//   const rlpx = new RLPx(dpt.privateKey, {
//     dpt: dpt,
//     maxPeers: 25,
//     capabilities: capabilities,
//     listenPort: tcpPort
//   })
//   rlpx.listen(tcpPort)
//   const peerInfo: PeerInfo = { id: rlpx._clientId, tcpPort, udpPort }
//   const protoRegistry: IProtocolDescriptor<Devp2pPeer>[] = [
//     {
//       constructor: (EthProtocol as any).constructor,
//       cap: {
//         versions: ['62', '63'],
//         id: 'eth'
//       }
//     }
//   ]
//   const bootnodes: any[] = []
//   const blockchain: any = {
//     getBlocksTD: () => Buffer.from([0]),
//     getBestBlock: () => Buffer.from([0]),
//     common: new Common('mainnet')
//   }
//   const rlpxNode = new Devp2pNode(dpt, rlpx, blockchain, peerInfo, protoRegistry as any, bootnodes)
//   after(async () => rlpxNode.stop())
//   it('should create valid rlpx node', () => {
//     expect(rlpxNode).to.be.instanceOf(Devp2pNode)
//   })
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvbmV0L2RldnAycC9ub2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5QkFBeUI7QUFFekIsZUFBZTtBQUVmLGlCQUFpQjtBQUNqQixnQ0FBZ0M7QUFFaEMsV0FBVztBQUNYLGlCQUFpQjtBQUNqQixnQkFBZ0I7QUFDaEIseUJBQXlCO0FBQ3pCLGdCQUFnQjtBQUNoQixvQkFBb0I7QUFDcEIsNEJBQTRCO0FBRTVCLFdBQVc7QUFDWCxTQUFTO0FBQ1QsVUFBVTtBQUNWLG1CQUFtQjtBQUNuQixTQUFTO0FBQ1QsYUFBYTtBQUNiLDZCQUE2QjtBQUM3Qix5Q0FBeUM7QUFFekMsaURBQWlEO0FBQ2pELGdEQUFnRDtBQUVoRCwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLDJDQUEyQztBQUMzQyxrQkFBa0I7QUFDbEIsOEJBQThCO0FBQzlCLDBCQUEwQjtBQUMxQix5QkFBeUI7QUFDekIsU0FBUztBQUNULG1CQUFtQjtBQUNuQixPQUFPO0FBRVAsNENBQTRDO0FBQzVDLGdCQUFnQjtBQUNoQixvQkFBb0I7QUFDcEIsa0NBQWtDO0FBQ2xDLDBCQUEwQjtBQUMxQixPQUFPO0FBQ1AseUJBQXlCO0FBRXpCLHdFQUF3RTtBQUN4RSwrREFBK0Q7QUFDL0QsUUFBUTtBQUNSLHVEQUF1RDtBQUN2RCxlQUFlO0FBQ2Ysa0NBQWtDO0FBQ2xDLG9CQUFvQjtBQUNwQixVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFFTixnQ0FBZ0M7QUFFaEMsOEJBQThCO0FBQzlCLDJDQUEyQztBQUMzQyw0Q0FBNEM7QUFDNUMsb0NBQW9DO0FBQ3BDLE1BQU07QUFDTixzR0FBc0c7QUFFdEcsdUNBQXVDO0FBRXZDLGdEQUFnRDtBQUNoRCxvREFBb0Q7QUFDcEQsT0FBTztBQUNQLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvKiBlc2xpbnQtZW52IG1vY2hhICovXG5cbi8vICd1c2Ugc3RyaWN0J1xuXG4vLyBpbXBvcnQgJ21vY2hhJ1xuLy8gaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSdcblxuLy8gaW1wb3J0IHtcbi8vICAgRXRoUHJvdG9jb2wsXG4vLyAgIERldnAycE5vZGUsXG4vLyAgIElQcm90b2NvbERlc2NyaXB0b3IsXG4vLyAgIERldnAycFBlZXIsXG4vLyAgIFJMUHhOb2RlT3B0aW9uc1xuLy8gfSBmcm9tICcuLi8uLi8uLi9zcmMvbmV0J1xuXG4vLyBpbXBvcnQge1xuLy8gICBEUFQsXG4vLyAgIFJMUHgsXG4vLyAgIGdlblByaXZhdGVLZXksXG4vLyAgIEVUSCxcbi8vICAgUGVlckluZm9cbi8vIH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG4vLyBpbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuXG4vLyBkZXNjcmliZS5za2lwKCdzaW1wbGUgdGVzdCBSTFB4IE5vZGUnLCAoKSA9PiB7XG4vLyAgIGNvbnN0IGNhcGFiaWxpdGllcyA9IFtFVEguZXRoNjMsIEVUSC5ldGg2Ml1cblxuLy8gICBjb25zdCB1ZHBQb3J0ID0gNTU1NTVcbi8vICAgY29uc3QgdGNwUG9ydCA9IDU1NTU2XG4vLyAgIGNvbnN0IGRwdCA9IG5ldyBEUFQoZ2VuUHJpdmF0ZUtleSgpLCB7XG4vLyAgICAgZW5kcG9pbnQ6IHtcbi8vICAgICAgIGFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuLy8gICAgICAgdWRwUG9ydDogdWRwUG9ydCxcbi8vICAgICAgIHRjcFBvcnQ6IHRjcFBvcnRcbi8vICAgICB9LFxuLy8gICAgIHRpbWVvdXQ6IDEwMFxuLy8gICB9KVxuXG4vLyAgIGNvbnN0IHJscHggPSBuZXcgUkxQeChkcHQucHJpdmF0ZUtleSwge1xuLy8gICAgIGRwdDogZHB0LFxuLy8gICAgIG1heFBlZXJzOiAyNSxcbi8vICAgICBjYXBhYmlsaXRpZXM6IGNhcGFiaWxpdGllcyxcbi8vICAgICBsaXN0ZW5Qb3J0OiB0Y3BQb3J0XG4vLyAgIH0pXG4vLyAgIHJscHgubGlzdGVuKHRjcFBvcnQpXG5cbi8vICAgY29uc3QgcGVlckluZm86IFBlZXJJbmZvID0geyBpZDogcmxweC5fY2xpZW50SWQsIHRjcFBvcnQsIHVkcFBvcnQgfVxuLy8gICBjb25zdCBwcm90b1JlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPERldnAycFBlZXI+W10gPSBbXG4vLyAgICAge1xuLy8gICAgICAgY29uc3RydWN0b3I6IChFdGhQcm90b2NvbCBhcyBhbnkpLmNvbnN0cnVjdG9yLFxuLy8gICAgICAgY2FwOiB7XG4vLyAgICAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ10sXG4vLyAgICAgICAgIGlkOiAnZXRoJ1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgXVxuXG4vLyAgIGNvbnN0IGJvb3Rub2RlczogYW55W10gPSBbXVxuXG4vLyAgIGNvbnN0IGJsb2NrY2hhaW46IGFueSA9IHtcbi8vICAgICBnZXRCbG9ja3NURDogKCkgPT4gQnVmZmVyLmZyb20oWzBdKSxcbi8vICAgICBnZXRCZXN0QmxvY2s6ICgpID0+IEJ1ZmZlci5mcm9tKFswXSksXG4vLyAgICAgY29tbW9uOiBuZXcgQ29tbW9uKCdtYWlubmV0Jylcbi8vICAgfVxuLy8gICBjb25zdCBybHB4Tm9kZSA9IG5ldyBEZXZwMnBOb2RlKGRwdCwgcmxweCwgYmxvY2tjaGFpbiwgcGVlckluZm8sIHByb3RvUmVnaXN0cnkgYXMgYW55LCBib290bm9kZXMpXG5cbi8vICAgYWZ0ZXIoYXN5bmMgKCkgPT4gcmxweE5vZGUuc3RvcCgpKVxuXG4vLyAgIGl0KCdzaG91bGQgY3JlYXRlIHZhbGlkIHJscHggbm9kZScsICgpID0+IHtcbi8vICAgICBleHBlY3QocmxweE5vZGUpLnRvLmJlLmluc3RhbmNlT2YoRGV2cDJwTm9kZSlcbi8vICAgfSlcbi8vIH0pXG4iXX0=