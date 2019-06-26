'use strict'

import {
  DPT,
  RLPx,
  PeerInfo,
  Capabilities,
  RLPxOptions,
  ETH
} from 'ethereumjs-devp2p'
import { randomBytes } from 'crypto'
import { register } from 'opium-decorators'
import Common from 'ethereumjs-common'

const defaultRemoteClientIdFilter = [
  'go1.5',
  'go1.6',
  'go1.7',
  'quorum',
  'pirl',
  'ubiq',
  'gmc',
  'gwhale',
  'prichain'
]

export class RLPxNodeOptions implements RLPxOptions {
  clientId?: Buffer | undefined
  timeout?: number | undefined
  remoteClientIdFilter?: string[] | undefined = defaultRemoteClientIdFilter
  listenPort!: number | null
  dpt!: DPT
  capabilities!: Capabilities[]
  port: number = 30303
  key: Buffer = randomBytes(32)
  bootnodes: string[] = []
  maxPeers: number = 25
}

export class DPTOptions {
  key: Buffer = randomBytes(32)
  refreshInterval: number = 30000
  timeout: number = 1000 * 10
  endpoint: PeerInfo = {
    address: '0.0.0.0',
    udpPort: 30303,
    tcpPort: 30303
  }
}

export class DevP2PFactory {
  @register('devp2p-peer-info')
  static createPeerInfo (@register('options') options: any): PeerInfo {
    return {
      address: '0.0.0.0',
      udpPort: options.devp2PPort,
      tcpPort: options.devp2PPort
    }
  }

  @register()
  static createDptOptions (@register('devp2p-peer-info') peerInfo: PeerInfo): DPTOptions {
    const dptOpts = new DPTOptions()
    dptOpts.endpoint = peerInfo
    dptOpts.timeout = 1000 * 60
    return dptOpts
  }

  @register()
  static createRlpxOptions (common: Common,
                            dpt: DPT,
                            @register('devp2p-peer-info')
                            peerInfo: PeerInfo): RLPxNodeOptions {
    const rlpx = new RLPxNodeOptions()
    rlpx.dpt = dpt
    rlpx.bootnodes = common.bootstrapNodes()
    rlpx.capabilities = [ETH.eth62, ETH.eth63]
    rlpx.listenPort = peerInfo.tcpPort || 30303
    return rlpx
  }

  @register()
  static createDPT (options: DPTOptions): DPT {
    options.endpoint = options.endpoint || {
      address: '0.0.0.0',
      udpPort: null,
      tcpPort: null
    }

    return new DPT(options.key, options)
  }

  @register()
  createRLPx (options: RLPxNodeOptions): RLPx {
    return new RLPx(options.key, options)
  }
}
