'use strict'

import Block from 'ethereumjs-block'
import { IDownloader, DownloaderType } from '../interfaces'
import { EthProtocol, BlockBody, IPeerDescriptor } from '../../net'
import BN from 'bn.js'

import Debug from 'debug'
import { EthChain } from '../../blockchain'
const debug = Debug('kitsunet:downloader:download-manager')

export abstract class BaseDownloader<T extends IPeerDescriptor<any>> implements IDownloader {
  public protocol: EthProtocol<T>
  public type: DownloaderType
  public chain: EthChain

  constructor (protocol: EthProtocol<T>,
               type: DownloaderType,
               chain: EthChain) {
    this.protocol = protocol
    this.type = type
    this.chain = chain
  }

  async latest (): Promise<Block | undefined> {
    return new Promise(async (resolve, reject) => {
      const status = await this.protocol.getStatus()
      for await (const header of this.protocol.getHeaders(status.bestHash, 1)) {
        if (header[0]) {
          debug(`got peers ${this.protocol.peer.id} latest header - ${(header[0]).hash().toString('hex')}`)
        } else {
          debug(`got empty header from ${this.protocol.peer.id}!`)
        }
        return resolve(new Block(header[0], { common: this.chain.common }))
      }
      return reject(new Error('no header resolved'))
    })
  }

  async getHeaders (block: BN | Buffer | number,
                    max: number,
                    skip: number = 0,
                    reverse: boolean = false): Promise<Block.Header[]> {
    let headers: Block.Header[] = []
    for await (const h of this.protocol.getHeaders(block, max, skip, reverse)) {
      headers = headers.concat(h)
    }
    return headers
  }

  async getBodies (hashes: Buffer[]): Promise<BlockBody[]> {
    let bodies: BlockBody[] = []
    for await (const b of this.protocol.getBlockBodies(hashes)) {
      bodies = bodies.concat(b as any[])
    }
    return bodies
  }

  abstract download (protocol: EthProtocol<any>): Promise<void>
}
