'use strict'

import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer } from '../net'
import { FastSyncDownloader } from './downloaders'
import { IDownloader } from './interfaces'
import LRUCache from 'lru-cache'

import Debug from 'debug'
import { MAX_PEERS } from '../constants'
const debug = Debug('kitsunet:downloader:download-manager')

const DEFAULT_DOWNLOAD_INTERVAL: number = 1000 * 20

@register('download-manager')
export class DownloadManager extends EE {
  peers: LRUCache<string, Peer> = new LRUCache({ max: MAX_PEERS, maxAge: 1000 * 60 })
  syncInterval: NodeJS.Timeout | undefined
  maxPeers: number = MAX_PEERS
  downloadInterval: number = DEFAULT_DOWNLOAD_INTERVAL
  syncMode: string = 'fast'

  @register('downloader')
  static async createDownloader (chain: EthChain,
                                 @register('peer-manager')
                                 peerManager: PeerManager,
                                 @register('options')
                                 options: any): Promise<IDownloader | undefined> {
    switch (options.syncMode) {
        case 'fast': {
          return new FastSyncDownloader(chain, peerManager)
        }

        default:
          throw new Error(`unknown sync mode ${options.syncMode}`)
    }
  }

  constructor (public chain: EthChain,
               @register('peer-manager')
               public peerManager: PeerManager,
               @register('options')
               options: any,
               @register('downloader')
               public downloader: IDownloader) {
    super()
    this.syncMode = options.syncMode
  }

  private async download (peer: Peer): Promise<void> {
    if (!this.peers.has(peer.id) && this.peers.length <= this.maxPeers) {
      this.peers.set(peer.id, peer)
      try {
        this.peerManager.reserve([peer])
        return this.downloader.download(peer)
      } catch (e) {
        debug(e)
      } finally {
        this.peers.del(peer.id)
        this.peerManager.releasePeers([peer])
      }
    }
  }

  /**
   * Start sync
   */
  async start (): Promise<void> {
    this.syncInterval = setInterval(async () => {
      const bestPeer = await this.downloader.best()
      if (bestPeer) {
        this.download(bestPeer)
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
