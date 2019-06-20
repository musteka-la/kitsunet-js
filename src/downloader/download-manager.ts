'use strict'

import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer, EthProtocol } from '../net'
import { FastSyncDownloader } from './downloaders'
import LRUCache from 'lru-cache'

import Debug from 'debug'
const debug = Debug('kitsunet:downloader:download-manager')

const MAX_PEERS: number = 5
const DEFAULT_DOWNLOAD_INTERVAL: number = 1000 * 20

@register('download-manager')
export class DownloadManager extends EE {
  peers: LRUCache<string, Peer> = new LRUCache({ max: MAX_PEERS, maxAge: 1000 * 60 })
  syncInterval: NodeJS.Timeout | undefined
  maxPeers: number = MAX_PEERS
  downloadInterval: number = DEFAULT_DOWNLOAD_INTERVAL
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
    if (!this.peers.has(peer.id) && this.peers.length <= this.maxPeers) {
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
        this.peers.del(peer.id)
        this.peerManager.releasePeers([peer])
      }
    }
  }

  /**
   * Start sync
   */
  async start (): Promise<void> {
    const td = await this.chain.getBlocksTD()
    this.syncInterval = setInterval(async () => {
      const peers: Peer[] = this.peerManager.getByCapability({
        id: 'eth',
        versions: ['63']
      })

      if (!peers.length) return
      const status = await Promise.all(peers.map((p) => (p.protocols.get('eth') as EthProtocol<any>)!.getStatus()))
      let bestPeer: any = td
      status.forEach((s, i) => {
        if (s.td.gt(bestPeer)) bestPeer = peers[i]
      })

      if (bestPeer) {
        this.peerManager.reserve([bestPeer])
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
