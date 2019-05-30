'use strict'

import 'mocha'
import { expect } from 'chai'

import {
  IProtocolDescriptor,
  EthProtocol,
  Devp2pNode,
  Devp2pPeer
} from '../../../src/net'

import {
  DPT,
  RLPx,
  PeerInfo,
  genPrivateKey,
  ETH
} from 'ethereumjs-devp2p'
import Common from 'ethereumjs-common'

describe('simple test RLPx Node', () => {
  const capabilities = [ETH.eth63, ETH.eth62]

  const udpPort = 55555
  const tcpPort = 55556
  const dpt = new DPT(genPrivateKey(), {
    endpoint: {
      address: '127.0.0.1',
      udpPort: udpPort,
      tcpPort: tcpPort
    },
    timeout: 100
  })

  const rlpx = new RLPx(dpt.privateKey, {
    dpt: dpt,
    maxPeers: 25,
    capabilities: capabilities,
    listenPort: tcpPort
  })
  rlpx.listen(tcpPort)

  const peerInfo: PeerInfo = { id: rlpx._clientId, tcpPort, udpPort }
  const protoRegistry: IProtocolDescriptor<Devp2pPeer>[] = [
    {
      constructor: (EthProtocol as any).constructor,
      cap: {
        versions: ['62', '63'],
        id: 'eth'
      }
    }
  ]

  const bootnodes: any[] = []

  const rlpxNode = new Devp2pNode(dpt,
                                  rlpx, {
                                    getBlocksTD: () => Buffer.from([0]),
                                    getBestBlock: () => Buffer.from([0]),
                                    common: new Common('mainnet')
                                  } as any,
                                  peerInfo,
                                  protoRegistry as any,
                                  bootnodes)

  it('should create valid rlpx node', (done) => {
    expect(rlpxNode).to.be.instanceOf(Devp2pNode)
    done()
  })
})
