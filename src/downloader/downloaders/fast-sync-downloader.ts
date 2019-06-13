'use strict'

import { DownloaderType } from '../inderfaces'
import { Block } from 'ethereumjs-blockchain'
import { NetworkPeer, EthProtocol } from '../../net'
import { EthChain } from '../../blockchain'

import BN from 'bn.js'

import Debug from 'debug'
import { BaseDownloader } from './base'
const debug = Debug('kitsunet:downloaders:fast-sync')

const MAX_PER_REQUEST: number = 128

export class FastSyncDownloader extends BaseDownloader {
  constructor (public chain: EthChain) {
    super(DownloaderType.FAST, chain)
  }

  async download (protocol: EthProtocol<NetworkPeer<any, any>>): Promise<void> {
    let blockNumber: number = 0
    const block: Block.Header | undefined = await this.chain.getLatestHeader()
    if (block) {
      blockNumber = block.number
    }

    try {
      const remoteHeader: Block | undefined = await this.latest(protocol)
      if (remoteHeader) {
        const remoteNumber: number = Number(`0x${remoteHeader.header.number.toString('hex')}`)
        blockNumber++
        let headers: Block.Header[] = []
        while (blockNumber <= remoteNumber) {
          for await (const h of protocol.getHeaders(new BN(blockNumber), MAX_PER_REQUEST)) {
            headers = headers.concat(h)
            blockNumber += h.length
          }

          let bodies: any[] = []
          for await (const b of protocol.getBlockBodies(headers.map(h => h.hash()))) {
            bodies = bodies.concat(b as any[])
          }
          return this.chain.putBlocks(bodies.map((body, i) => new Block([headers[i]].concat(body))))
        }
      }
    } catch (err) {
      debug(err)
    }
  }
}
