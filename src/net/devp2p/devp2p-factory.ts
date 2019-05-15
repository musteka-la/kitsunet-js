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

export class DTPOptions {
  key!: Buffer
  refreshInterval!: number
  endpoint!: PeerInfo
}

export class DevP2PFactory {
  @register()
  static createDPT (options: DTPOptions): DPT {
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
