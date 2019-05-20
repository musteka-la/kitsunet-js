'use strict'

import {
  DPT,
  RLPx,
  PeerInfo,
  Capabilities,
  RLPxOptions
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
  maxPeers: number = 10
}

export class DPTOptions {
  key: Buffer = randomBytes(32)
  refreshInterval: number = 30000
  endpoint: PeerInfo = {
    address: '0.0.0.0',
    udpPort: 30301,
    tcpPort: 30303
  }
}

export class DevP2PFactory {
  @register('devp2p-peer-info')
  static createPeerInfo (): PeerInfo {
    return {
      address: '0.0.0.0',
      udpPort: 30301,
      tcpPort: 30303
    }
  }

  @register()
  static createDptOptions (): DPTOptions {
    return new DPTOptions()
  }

  @register()
  static createRlpxOptions (common: Common, dptOptions: DPTOptions): RLPxNodeOptions {
    const rlpx = new RLPxNodeOptions()
    rlpx.bootnodes = common.genesis().bootnodes
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
