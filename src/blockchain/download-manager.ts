'use strict'

import { Downloader } from './downloader'
import { IBlockchain } from './interfaces'
import { register } from 'opium-decorators'
import { EthChain } from './eth-chain'
import { EventEmitter as EE } from 'events'

class DownloadManager extends EE {
  downloader: Downloader
  chain: IBlockchain

  constructor (downloader: Downloader,
               @register(EthChain)
               chain: IBlockchain) {
    super()
    this.downloader = downloader
    this.chain = chain
  }

  /**
   * Start sync
   */
  async start (): Promise<boolean> {
    return true
  }

  /**
   * Stop sync
   */
  async stop (): Promise<boolean> {
    return true
  }
}
