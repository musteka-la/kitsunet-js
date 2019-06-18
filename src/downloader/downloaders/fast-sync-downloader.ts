'use strict'

import { DownloaderType } from '../interfaces'
import Block from 'ethereumjs-block'
import {
  EthProtocol,
  BlockBody,
  IPeerDescriptor
} from '../../net'
import { EthChain } from '../../blockchain'

import BN from 'bn.js'

import Debug from 'debug'
import { BaseDownloader } from './base'
const debug = Debug('kitsunet:downloaders:fast-sync')

const MAX_PER_REQUEST: number = 128

export class FastSyncDownloader<T extends IPeerDescriptor<any>> extends BaseDownloader<T> {
  constructor (public protocol: EthProtocol<T>,
               public peer: IPeerDescriptor<T>,
               public chain: EthChain) {
    super(protocol, DownloaderType.FAST, chain)
  }

  async download (): Promise<void> {
    let blockNumber: BN = new BN(0)
    const block: Block | undefined = await this.chain.getLatestBlock()
    if (block) {
      blockNumber = new BN(block.header.number)
    }

    try {
      debug(`trying to sync with ${this.protocol.peer.id}`)
      const remoteHeader: Block | undefined = await this.latest()
      if (remoteHeader) {
        const remoteNumber: BN = new BN(remoteHeader.header.number)
        blockNumber = blockNumber.addn(1)
        debug(`latest block is ${blockNumber.toString(10)} remote block is ${remoteNumber.toString(10)}`)
        while (blockNumber.lte(remoteNumber)) {
          debug(`requesting ${MAX_PER_REQUEST} blocks from ${this.protocol.peer.id} starting ` +
          `from ${blockNumber.toString(10)}`)

          let headers: Block.Header[] = await this.getHeaders(blockNumber, MAX_PER_REQUEST)
          if (!headers.length) return
          let bodies: BlockBody[] = await this.getBodies(headers.map(h => h.hash()))
          await this.chain.putBlocks(bodies.map((body, i) => new Block([headers[i].raw].concat(body))))
          blockNumber = blockNumber.addn(headers.length)
          debug(`imported ${headers.length} blocks`)
        }
      }
    } catch (err) {
      debug(err)
    }
  }
}
