'use strict'

import {
  DPT,
  RLPx,
  PeerInfo,
  Capabilities,
  RLPxOptions,
  ETH,
  pk2id
} from 'ethereumjs-devp2p'

import { publicKeyCreate } from 'secp256k1'
import { randomBytes } from 'crypto'
import { register } from 'opium-decorators'
import Common from 'ethereumjs-common'
import { Devp2pPeer } from './devp2p-peer'
import { rlp } from 'ethereumjs-util';

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
  clientId?: Buffer
  timeout?: number = 1000 * 60 * 60 * 10
  remoteClientIdFilter?: string[] = defaultRemoteClientIdFilter
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
  refreshInterval: number = 30 * 1000
  timeout: number = 1000 * 60 * 60 * 10
  endpoint: PeerInfo = {
    address: '0.0.0.0',
    udpPort: 30303,
    tcpPort: 30303
  }
}

export class DevP2PFactory {
  @register('devp2p-peer-info')
  static createPeerInfo (@register('options') options: any,
                         @register('rlpx-key') rlpxKey: Buffer): PeerInfo {
    return {
      id: pk2id(rlpxKey),
      address: '0.0.0.0',
      udpPort: options.devp2PPort,
      tcpPort: options.devp2PPort
    }
  }

  @register('rlpx-key')
  static rlpxKey (@register('options') options: any): Buffer {
    return (options.devp2pIdentity && options.devp2pIdentity.privKey)
      ? publicKeyCreate(Buffer.from(options.devp2pIdentity.privKey, 'base64'), false)
      : randomBytes(32)
  }

  @register()
  static createDptOptions (@register('devp2p-peer-info') peerInfo: PeerInfo,
                           @register('rlpx-key') rlpxKey: Buffer): DPTOptions {
    const dptOpts = new DPTOptions()
    dptOpts.key = rlpxKey
    dptOpts.endpoint = peerInfo
    return dptOpts
  }

  @register()
  static createRlpxOptions (common: Common,
                            dptOptions: DPTOptions,
                            dpt: DPT,
                            @register('devp2p-peer-info')
                            peerInfo: PeerInfo,
                            @register('rlpx-key')
                            rlpxKey: Buffer): RLPxNodeOptions {
    const rlpx = new RLPxNodeOptions()
    rlpx.dpt = dpt
    rlpx.bootnodes = common.bootstrapNodes()
    rlpx.capabilities = [ETH.eth62, ETH.eth63]
    rlpx.listenPort = peerInfo.tcpPort || 30303
    rlpx.key = rlpxKey
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

  @register('devp2p-peer')
  static async createLibp2pPeer (@register('devp2p-peer-info') peerInfo: PeerInfo): Promise<Devp2pPeer> {
    return new Devp2pPeer(peerInfo)
  }
}
