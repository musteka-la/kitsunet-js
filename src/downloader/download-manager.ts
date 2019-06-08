'use strict'

import Block from 'ethereumjs-block'
import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer, EthProtocol } from '../net'
import { IBlockchain } from '../blockchain'

const MAX_PEERS: number = 25
const MAX_HEADERS: number = 256
const DEFAUL_DOWNLOAD_INTERVAL: number = 1000

@register('download-manager')
export class DownloadManager extends EE {
  peers: Peer[] = []
  syncInterval: NodeJS.Timeout | undefined
  maxPeers: number = MAX_PEERS
  downloadInterval: number = DEFAUL_DOWNLOAD_INTERVAL

  // TODO: implement downloader
  constructor (@register('peer-manager')
               public peerManager: PeerManager,
               @register(EthChain)
               public chain: IBlockchain) {
    super()
  }

  async download (peer: Peer): Promise<void> {
    if (this.peers.length <= this.maxPeers) {
      const ethProto: EthProtocol<any> = peer.protocols['eth']
      if (ethProto) {
        const block: Block = await this.chain.getLatestBlock()
        if (ethProto.status.number!.gt(block.header.number)) {
          for await (const header of ethProto.getBlockHeaders(block.header.number, MAX_HEADERS)) {
            await this.chain.putHeaders(header)
          }
        }
      }
    }
  }

  /**
   * Start sync
   */
  async start (): Promise<void> {
    this.syncInterval = setInterval(
      () => {
        const peer = this.peerManager.getRandomByCapability({ id: 'eth', versions: ['63'] })
        if (peer) {
          return this.download(peer)
        }
      },
      this.downloadInterval)
  }

  /**
   * Stop sync
   */
  async stop (): Promise<void> {
    if (this.syncInterval) clearInterval(this.syncInterval)
  }
}
