'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'

import { DownloaderType } from '../interfaces'
import {
  BlockBody,
  Peer,
  IEthProtocol,
  PeerManager,
  EthProtocol
} from '../../net'
import { EthChain } from '../../blockchain'
import { BaseDownloader } from './base'
import { queue, AsyncQueue } from 'async'

import Debug from 'debug'
const debug = Debug('kitsunet:downloaders:fast-sync')

const MAX_PER_REQUEST: number = 128
const CONCCURENT_REQUESTS: number = 5

async function task (this: FastSyncDownloader, peer: Peer) {
  const protocol = peer.protocols.get('eth')
  if (!protocol) throw new Error('fast sync requires the ETH capability!')

  let blockNumber: BN = new BN(0)
  const block: Block | undefined = await this.chain.getLatestBlock()
  if (block) {
    blockNumber = new BN(block.header.number)
  }

  try {
    debug(`trying to sync with ${protocol.peer.id}`)
    const remoteHeader: Block | undefined = await this.latest(protocol as unknown as IEthProtocol, peer)
    if (remoteHeader) {
      const remoteNumber: BN = new BN(remoteHeader.header.number)
      const blockNumberStr: string = blockNumber.toString(10)
      debug(`latest block is ${blockNumberStr} remote block is ${remoteNumber.toString(10)}`)

      // increment current block to set as start
      blockNumber.iaddn(1)
      while (blockNumber.lte(remoteNumber)) {
        debug(`requesting ${MAX_PER_REQUEST} blocks from ${protocol.peer.id} starting ` +
          `from ${blockNumberStr}`)

        let headers: Block.Header[] = await this.getHeaders(protocol as unknown as IEthProtocol,
          blockNumber, MAX_PER_REQUEST)

        if (!headers.length) return

        let bodies: BlockBody[] = await this.getBodies(protocol as unknown as IEthProtocol,
          headers.map(h => h.hash()))

        await this.store(bodies.map((body, i) => new Block([headers[i].raw].concat(body))))

        blockNumber.iaddn(headers.length)
        debug(`imported ${headers.length} blocks`)
      }
    }
  } catch (err) {
    debug(err)
  }
}

export class FastSyncDownloader extends BaseDownloader {
  type: DownloaderType
  queue: AsyncQueue<Peer>

  constructor (public chain: EthChain, peerManager: PeerManager) {
    super(chain, peerManager)
    this.type = DownloaderType.FAST
    this.queue = queue(task.bind(this), CONCCURENT_REQUESTS)
  }

  async best (): Promise<Peer | undefined> {
    const peers: Peer[] = this.peerManager.getByCapability({
      id: 'eth',
      versions: ['63']
    })

    if (!peers.length) return
    const status = await Promise.all(peers.map((p) =>
        (p.protocols.get('eth') as EthProtocol<any>)!.getStatus()))

    let bestPeer: Peer | undefined
    let bestPeerTd: BN = await this.chain.getBlocksTD()
    status.forEach((s, i) => {
      if (s.td.gt(bestPeerTd)) bestPeer = peers[i]
    })

    if (bestPeer) {
      this.peerManager.reserve([bestPeer])
    }

    return bestPeer
  }

  async download (peer: Peer): Promise<void> {
    return this.queue.push(peer)
  }
}
