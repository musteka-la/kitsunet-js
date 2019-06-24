'use strict'

import {
  Peer,
  PeerManager
} from '../net'
import { IBlockchain } from '../blockchain'

export enum DownloaderType {
  FAST
}

export interface IDownloaderConstructor {
  new (chain: IBlockchain, peerManager: PeerManager): IDownloader
}

/**
 * Interface for downloaders
 */
export interface IDownloader {
  type: DownloaderType
  download (peer: Peer): Promise<void>
  best(): Promise<Peer | undefined>
}
