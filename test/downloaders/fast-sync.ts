/* eslint-env mocha */

'use strict'

import 'mocha'
import { expect } from 'chai'
import { FastSyncDownloader } from '../../src/downloader'
import Block from 'ethereumjs-block'
import BN from 'bn.js'

import * as jsonBlock from '../fixtures/block.json'
import { nextTick } from 'async'
import fromRpc = require('ethereumjs-block/from-rpc')
const block: Block = new Block(fromRpc(jsonBlock.block))

describe('fast sync', () => {
  let ethProtocol
  let peer
  let chain
  let peerManager
  let putHandler: Function | null = null

  beforeEach(() => {
    ethProtocol = {
      getStatus: () => {
        return { td: new BN(10) }
      },
      getHeaders: async function* () {
        const block = new Block()
        block.header.number = new BN(2)
        block.header.difficulty = new BN(2)
        yield [block]
      }
    }

    peer = {
      id: '12345',
      addrs: ['/ip4/127.0.0.1/tcp/5000'],
      protocols: new Map([['eth', ethProtocol]])
    }

    chain = {
      getBlocksTD: () => new BN(9),
      putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
      getLatestBlock: () => {
        const block = new Block()
        block.setGenesisParams()
        return block
      }
    }

    peerManager = {
      getByCapability: () => {
        return [{
          id: '12345',
          addrs: ['/ip4/127.0.0.1/tcp/5000'],
          protocols: new Map([['eth', ethProtocol]])
        }]
      },
      reserve: () => true
    }
  })

  it('should select best peer', async () => {
    ethProtocol = {
      getStatus: () => {
        return { td: new BN(10) }
      },
      getHeaders: async function* () {
        const block = new Block()
        block.header.number = new BN(2)
        block.header.difficulty = new BN(2)
        yield [block]
      }
    }

    peer = {
      id: '12345',
      addrs: ['/ip4/127.0.0.1/tcp/5000'],
      protocols: new Map([['eth', ethProtocol]])
    }

    chain = {
      getBlocksTD: () => new BN(9),
      putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
      getLatestBlock: () => {
        const block = new Block()
        block.setGenesisParams()
        return block
      }
    }

    peerManager = {
      getByCapability: () => {
        return [{
          id: '12345',
          addrs: ['/ip4/127.0.0.1/tcp/5000'],
          protocols: new Map([['eth', ethProtocol]])
        }]
      },
      reserve: () => true
    }

    let fastDownloader = new FastSyncDownloader(chain as any, peerManager as any)
    const bestPeer = await fastDownloader.best()
    expect(bestPeer).to.eql(peer)
  })

  it('should return latest block from remote peer', async () => {
    ethProtocol = {
      getStatus: () => {
        return { td: new BN(10) }
      },
      getHeaders: async function* () {
        yield [block]
      }
    }

    peer = {
      id: '12345',
      addrs: ['/ip4/127.0.0.1/tcp/5000'],
      protocols: new Map([['eth', ethProtocol]])
    }

    chain = {
      getBlocksTD: () => new BN(9),
      putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks
    }

    peerManager = {
      getByCapability: () => {
        return [{
          id: '12345',
          addrs: ['/ip4/127.0.0.1/tcp/5000'],
          protocols: new Map([['eth', ethProtocol]])
        }]
      },
      reserve: () => true
    }

    let fastDownloader = new FastSyncDownloader(chain as any, peerManager as any)
    const latestBlock = await fastDownloader.latest(ethProtocol as any, peer as any)
    expect(latestBlock!.header.raw).to.eql(block.header.raw)
  })

  it('should download from peer', (done) => {
    ethProtocol = {
      getStatus: () => {
        return { td: new BN(10) }
      }
    }

    peer = {
      id: '12345',
      addrs: ['/ip4/127.0.0.1/tcp/5000'],
      protocols: new Map([['eth', ethProtocol]])
    }

    chain = {
      getBlocksTD: () => new BN(9),
      putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
      getLatestBlock: () => {
        const block = new Block()
        block.setGenesisParams()
        return block
      }
    }

    peerManager = {
      getByCapability: () => {
        return [{
          id: '12345',
          addrs: ['/ip4/127.0.0.1/tcp/5000'],
          protocols: new Map([['eth', ethProtocol]])
        }]
      },
      reserve: () => true
    }

    let fastDownloader = new class extends FastSyncDownloader {
      constructor () {
        super(chain, peerManager)
      }

      protected async task ({ from, protocol, to }): Promise<void> {
        expect(from).to.eql(new BN(1))
        expect(to).to.eql(new BN(2))
        expect(protocol).to.eql(ethProtocol)
        done()
      }

      async latest () {
        const block = new Block()
        block.header.number = new BN(2)
        block.header.difficulty = new BN(2)
        return block
      }
    }()

    nextTick(async () => {
      await fastDownloader.download(peer as any)
    })
  })

  it('should execute task correctly', () => {
    ethProtocol = {
      getStatus: () => {
        return { td: new BN(10) }
      },
      getBlockHeaders: () => [block.header.raw],
      getBlockBodies: () => []
    }

    peer = {
      id: '12345',
      addrs: ['/ip4/127.0.0.1/tcp/5000'],
      protocols: new Map([['eth', ethProtocol]])
    }

    chain = {
      getBlocksTD: () => new BN(9),
      putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
      getLatestBlock: () => {
        const block = new Block()
        block.setGenesisParams()
        return block
      }
    }

    peerManager = {
      getByCapability: () => {
        return [{
          id: '12345',
          addrs: ['/ip4/127.0.0.1/tcp/5000'],
          protocols: new Map([['eth', ethProtocol]])
        }]
      },
      reserve: () => true
    }

    let fastDownloader = new FastSyncDownloader(chain as any, peerManager as any)
    fastDownloader.download(peer as any)
  })
})
