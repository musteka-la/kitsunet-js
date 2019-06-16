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
