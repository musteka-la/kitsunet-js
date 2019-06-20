'use strict'

import { EthProtocol } from '../net'

export enum DownloaderType {
  FAST
}

/**
 * Interface for downloaders
 */
export interface IDownloader {
  type: DownloaderType
  download (protocol: EthProtocol<any>): Promise<void>
}
