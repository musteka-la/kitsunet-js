'use strict'

const Sync = require('./sync')
const BN = require('bn.js')

class RpcSync extends Sync {
  constructor ({ chain, peers, minPeers, interval, downloader }) {
    super({ chain, peers, minPeers, interval })
    this.downloader = downloader
  }

  get type () {
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

module.exports = RpcSync
