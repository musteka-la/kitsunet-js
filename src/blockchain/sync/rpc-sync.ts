'use strict'

import { Sync } from './sync'
import BN from 'bn.js'
import { Chain } from '../chain'
import { Downloader } from '../downloader'

class RpcSync extends Sync {
  protected downloader: Downloader

  constructor (chain: Chain, peers: Array<any>, minPeers: number, interval: number, downloader: Downloader) {
    super(chain, peers, minPeers, interval)
    this.downloader = downloader
  }

  get type (): string {
    return 'rpc'
  }

  async sync () {
    const latest = this.peers[0] // for RPC sync we only expect one peer
    const height = new BN(latest.number)
    const first = (await this.chain.getBlocksHeight()).addn(1)
    const count = height.sub(first).addn(1)
    if (count.lten(0)) return false

    const blocks = await this.downloader.getBlocks(first, count)
    this.chain.putBlocks(blocks)
    return true
  }
}
