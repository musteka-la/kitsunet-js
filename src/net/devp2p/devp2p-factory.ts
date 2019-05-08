'use strict'

import { DPT, RLPx, PeerInfo, Capabilities } from 'ethereumjs-devp2p'
import { register } from 'opium-decorator-resolvers'

export class DevP2PFactory {
  @register()
  static createDPT (key: Buffer, refreshInterval: number, endpoint: PeerInfo): DPT {
    endpoint = endpoint || {
      address: '0.0.0.0',
      udpPort: null,
      tcpPort: null
    }

    return new DPT(key, { refreshInterval: refreshInterval, endpoint })
  }

  @register()
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
