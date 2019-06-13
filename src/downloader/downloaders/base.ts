'use strict'

import Block from 'ethereumjs-block'
import { IDownloader, DownloaderType } from '../inderfaces'
import { EthProtocol } from '../../net'

import Debug from 'debug'
import { EthChain } from '../../blockchain'
const debug = Debug('kitsunet:downloader:download-manager')

export abstract class BaseDownloader implements IDownloader {
  constructor (public type: DownloaderType,
               public chain: EthChain) {
  }

  async latest (protocol: EthProtocol<any>): Promise<Block | undefined> {
    return new Promise(async (resolve, reject) => {
      const status = await protocol.getStatus()
      for await (const header of protocol.getHeaders(status.bestHash, 1)) {
        debug(`got header ${(header[0]).hash().toString('hex')}`)
        return resolve(new Block(header[0], { common: this.chain.common }))
      }
      reject('no header resolved')
    })
  }

  abstract download (protocol: EthProtocol<any>): Promise<void>
}
