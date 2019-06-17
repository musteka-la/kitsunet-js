'use strict'

import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer, EthProtocol } from '../net'
import { FastSyncDownloader } from './downloaders'

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
  syncMode: string = 'fast'

  constructor (@register('peer-manager')
               public peerManager: PeerManager,
               public chain: EthChain,
               @register('options')
               options: any) {
    super()
    this.syncMode = options.syncMode
  }

  async download (peer: Peer): Promise<void> {
    if (!this.peers.has(peer.id) && this.peers.size <= this.maxPeers) {
      this.peers.set(peer.id, peer)
      try {
        switch (this.syncMode) {
            case 'fast': {
              const protocol = peer.protocols.get('eth') as EthProtocol<any>
              if (protocol) {
                const downloader = new FastSyncDownloader(protocol, peer, this.chain)
                await downloader.download()
              }
              break
            }
        }
      } catch (e) {
        debug(e)
      } finally {
        this.peers.delete(peer.id)
      }
    }
  }

  /**
   * Start sync
   */
  async start (): Promise<void> {
    this.syncInterval = setInterval(() => {
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
