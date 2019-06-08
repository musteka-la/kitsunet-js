'use strict'

import { Downloader } from '../inderfaces'
import Block from 'ethereumjs-block'
import { EthProtocol, NetworkPeer } from '../../net'

type Header = Block.Header
export class FastSyncDownloader implements Downloader {
  constructor (public protocol: EthProtocol<NetworkPeer<any, any>>) {
  }

  async download (): Promise<void> {
    return
  }

  // /**
  //  * Get blocks from remote
  //  *
  //  * @param {Number} from - get blocks from block number/hash
  //  * @param {Number} max - max number of blocks to download
  //  * @returns {Array<Block>}
  //  */
  // async getBlocks (blockTag: number,
  //                  max: number,
  //                  skip?: number,
  //                  reverse?: boolean): Promise<Block[]> {
  //   const blocks: Block[] = []
  //   for await (const headers of this.protocol.getBlockHeaders(blockTag, max, skip, reverse)) {
  //     for await (const bodies of this.protocol.getBlockBodies(headers.map(h => h.header.hash()))) {
  //       headers.forEach((h, i) => {
  //         blocks.push(new Block([h.raw, bodies[i]]))
  //       })
  //     }
  //   }
  //   return blocks
  // }

  // /**
  //  * Get headers from remote
  //  *
  //  * @param {Number} from - get headers from block number/hash
  //  * @param {Number} max - max number of headers to download
  //  * @returns {Array<Header>}
  //  */
  // async getHeaders (blockTag: number,
  //                   max: number,
  //                   skip?: number,
  //                   reverse?: boolean): Promise<Header[]> {
  //   const headers: Header[] = []
  //   for await(const block of this.protocol.getBlockHeaders(blockTag, max, skip, reverse)) {
  //     headers.push(...block.map(b => b.header))
  //   }
  //   return headers
  // }
}
