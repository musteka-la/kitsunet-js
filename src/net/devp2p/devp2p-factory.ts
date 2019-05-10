'use strict'

import {
  DPT,
  RLPx,
  PeerInfo,
  Capabilities
} from 'ethereumjs-devp2p'
import { randomBytes } from 'crypto'
import { inject } from 'opium-decorator-resolvers'

export interface RLPxNodeOptions {
  key: Buffer
  port: number
  bootnodes: string[]
  clientFilter: string[]
}

export const defaultOptions: RLPxNodeOptions = {
  port: 30303,
  key: randomBytes(32),
  clientFilter: ['go1.5', 'go1.6', 'go1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain'],
  bootnodes: []
}

export class DevP2PFactory {
  static createDPT (key: Buffer, refreshInterval: number, endpoint: PeerInfo): DPT {
    endpoint = endpoint || {
      address: '0.0.0.0',
      udpPort: null,
      tcpPort: null
    }

    return new DPT(key, { refreshInterval: refreshInterval, endpoint })
  }

  createRLPx (dpt: DPT,
              key: Buffer,
              maxPeers: number,
              capabilities: Capabilities[],
              remoteClientIdFilter: string,
              port: number): RLPx {
    // TODO: manage multiaddr addresses instead of port/addr pairs
    return new RLPx(key, {
      dpt: dpt,
      maxPeers: maxPeers,
      capabilities,
      remoteClientIdFilter,
      listenPort: port
    })
  }
}
