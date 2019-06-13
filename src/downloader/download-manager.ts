'use strict'

import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer, EthProtocol } from '../net'
import { IBlockchain } from '../blockchain'
import { IDownloader } from './inderfaces'
import * as Downloaders from './downloaders'

import Debug from 'debug'
const debug = Debug('kitsunet:downloader:download-manager')

const MAX_PEERS: number = 25
const DEFAUL_DOWNLOAD_INTERVAL: number = 1000 * 5

@register('download-manager')
export class DownloadManager extends EE {
  peers: Map<string, Peer> = new Map()
  syncInterval: NodeJS.Timeout | undefined
  maxPeers: number = MAX_PEERS
  downloadInterval: number = DEFAUL_DOWNLOAD_INTERVAL
  downloaders: IDownloader[] = []

  constructor (@register('peer-manager')
               public peerManager: PeerManager,
               @register(EthChain)
               public chain: IBlockchain) {
    super()
    this.downloaders = Object.keys(Downloaders).map((d) => Reflect.construct(Downloaders[d]))
  }

  async download (peer: Peer): Promise<void> {
    if (!this.peers.has(peer.id) && this.peers.size <= this.maxPeers) {

    }
  }

  /**
   * Start sync
   */
  async start (): Promise<void> {
    this.syncInterval = setInterval(
      () => {
        const peer = this.peerManager.getRandomByCapability({
          id: 'eth',
          versions: ['63']
        })

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
