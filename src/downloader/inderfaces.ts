'use strict'

import { EthProtocol } from '../net'

export enum DownloaderType {
  FAST
}

/**
 * Interface that all downloaders implemente
 */
export interface IDownloader {
  type: DownloaderType
  download (protocol: EthProtocol<any>): Promise<void>
}
