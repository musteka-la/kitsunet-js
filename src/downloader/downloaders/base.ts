'use strict'

import Block from 'ethereumjs-block'
import { IDownloader, DownloaderType } from '../interfaces'
import {
  BlockBody,
  IEthProtocol,
  Peer,
  PeerManager
} from '../../net'
import BN from 'bn.js'

import Debug from 'debug'
import { EthChain } from '../../blockchain'
const debug = Debug('kitsunet:downloader:download-manager')

export abstract class BaseDownloader implements IDownloader {
  public chain: EthChain
  public peerManager: PeerManager
  abstract type: DownloaderType

  constructor (chain: EthChain, peerManager: PeerManager) {
    this.chain = chain
    this.peerManager = peerManager
  }

  async latest (protocol: IEthProtocol, peer: Peer): Promise<Block | undefined> {
    const status = await protocol.getStatus()
    const header = await this.getHeaders(protocol, status.bestHash, 1)
    if (header.length) {
      debug(`got peers ${peer.id} latest header - ${(header[0]).hash().toString('hex')}`)
    } else {
      debug(`got empty header from ${peer.id}!`)
      return
    }
    return new Block(header[0], { common: this.chain.common })
  }

  protected async getHeaders (protocol: IEthProtocol,
                              block: BN | Buffer | number,
                              max: number,
                              skip: number = 0,
                              reverse: boolean = false): Promise<Block.Header[]> {
    let headers: Block.Header[] = []
    try {
      for await (const h of protocol.getHeaders(block, max, skip, reverse)) {
        headers = headers.concat(h)
      }
    } catch (e) {
      debug(e)
    }
    return headers
  }

  protected async getBodies (protocol: IEthProtocol, hashes: Buffer[]): Promise<BlockBody[]> {
    let bodies: BlockBody[] = []
    try {
      for await (const b of protocol.getBlockBodies(hashes)) {
        bodies = bodies.concat(b as any[])
      }
    } catch (e) {
      debug(e)
    }
    return bodies
  }

  async store (blocks: Block[]): Promise<void> {
    return this.chain.putBlocks(blocks)
  }

  abstract async download(peer: Peer): Promise<void>
  abstract async best(): Promise<Peer | undefined>
}
