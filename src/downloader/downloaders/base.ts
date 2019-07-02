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

export const MAX_PER_REQUEST: number = 128
export const CONCCURENT_REQUESTS: number = 15
export const MAX_REQUEST: number = 128 * 16
export const MAX_LOOK_BACK: number = 16

export abstract class BaseDownloader implements IDownloader {
  public chain: EthChain
  public peerManager: PeerManager
  abstract type: DownloaderType

  constructor (chain: EthChain, peerManager: PeerManager) {
    this.chain = chain
    this.peerManager = peerManager
  }

  async findAncestor (protocol: IEthProtocol,
                      peer: Peer,
                      local: BN,
                      max: number = MAX_LOOK_BACK): Promise<Block | undefined> {
    const remote = local.subn(max)
    if (remote.lten(0)) {
      return this.chain.getBestBlock()
    }

    const headers = await this.getHeaders(protocol, peer, remote, max)
    const found = headers.find(async (h) => {
      return this.chain.getHeaders(h.hash(), 1)
    })

    if (found) return new Block([found, [], []], { common: this.chain.common })
  }

  async latest (protocol: IEthProtocol, peer: Peer): Promise<Block | undefined> {
    const status = await protocol.getStatus()
    const header = await this.getHeaders(protocol, peer, status.bestHash, 1)
    if (header.length) {
      debug(`got latest block ${(header[0]).number.toString('hex')} for peer ${peer.id}`)
      return new Block([header[0], [], []], { common: this.chain.common })
    } else {
      debug(`got empty header from ${peer.id}!`)
      this.peerManager.ban([peer])
    }
  }

  protected async getHeaders (protocol: IEthProtocol,
                              peer: Peer,
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
      this.peerManager.ban([peer])
    }
    return headers
  }

  protected async getBodies (protocol: IEthProtocol,
                             peer: Peer,
                             hashes: Buffer[]): Promise<BlockBody[]> {
    let bodies: BlockBody[] = []
    try {
      for await (const b of protocol.getBlockBodies(hashes)) {
        bodies = bodies.concat(b as any[])
      }
    } catch (e) {
      debug(e)
      this.peerManager.ban([peer])
    }
    return bodies
  }

  async store (blocks: Block[]): Promise<void> {
    return this.chain.putBlocks(blocks)
  }

  abstract async download(peer: Peer): Promise<void>
  abstract async best(): Promise<Peer | undefined>
}
