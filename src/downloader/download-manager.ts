'use strict'

import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer, EthProtocol } from '../net'
import { IBlockchain } from '../blockchain'
import { IDownloader, DownloaderType } from './inderfaces'
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
  downloaders: { [key: number]: IDownloader }
  syncMode: string = 'fast'

  constructor (@register('peer-manager')
               public peerManager: PeerManager,
               @register(EthChain)
               public chain: IBlockchain,
               @register('options')
               options: any) {
    super()
    this.downloaders = {}
    Object.keys(Downloaders)
    .forEach((d) => {
      const downloader = Reflect.construct(Downloaders[d], [this.chain])
      this.downloaders[downloader.type] = downloader
    })

    this.syncMode = options.syncMode
  }

  async download (peer: Peer): Promise<void> {
    if (!this.peers.has(peer.id) && this.peers.size <= this.maxPeers) {
      this.peers.set(peer.id, peer)
      try {
        switch (this.syncMode) {
          case 'fast': {
            const protocol = peer.protocols.get('eth') as EthProtocol<any>
            if (protocol) return this.downloaders[DownloaderType.FAST].download(protocol)
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
