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

interface TaskPayload {
  number: BN
  protocol: IEthProtocol
  max?: number
  reverse?: boolean
  skip?: number
}

export class FastSyncDownloader extends BaseDownloader {
  type: DownloaderType
  queue: AsyncQueue<TaskPayload>
  highestBlock: BN = new BN(0)

  constructor (public chain: EthChain, peerManager: PeerManager) {
    super(chain, peerManager)
    this.type = DownloaderType.FAST
    this.queue = queue(this.task.bind(this), CONCCURENT_REQUESTS)
  }

  protected async task ({ number, protocol, max, skip, reverse }) {
    try {
      const blockNumberStr: string = number.toString(10)

      // increment current block to set as start
      debug(`requesting ${MAX_PER_REQUEST} blocks ` +
      `from ${protocol.peer.id} starting from ${blockNumberStr}`)

      let headers: Block.Header[] = await this.getHeaders(protocol as unknown as IEthProtocol,
        number, max, skip, reverse)

      if (!headers.length) return

      let bodies: BlockBody[] = await this.getBodies(protocol as unknown as IEthProtocol,
        headers.map(h => h.hash()))

      await this.store(bodies.map((body, i) => new Block([headers[i].raw].concat(body))))
      debug(`imported ${headers.length} blocks`)
    } catch (err) {
      debug(err)
    }
  }

  async best (): Promise<Peer | undefined> {
    const peers: Peer[] = this.peerManager.getByCapability({
      id: 'eth',
      versions: ['63']
    })

    if (!peers.length) return
    const status = await Promise.all(peers.map((p) => {
      return (p.protocols.get('eth') as EthProtocol<any>)!.getStatus()
    }))

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
    let blockNumber: BN = new BN(0)
    const block: Block | undefined = await this.chain.getLatestBlock()
    if (block) {
      blockNumber = new BN(block.header.number)
    }

    const protocol = peer.protocols.get('eth') as unknown as IEthProtocol
    if (!protocol) {
      throw new Error('fast sync requires the ETH capability!')
    }

    const remoteHeader: Block | undefined = await this.latest(protocol, peer)
    if (!remoteHeader) {
      debug(`unable to get remote header from ${peer.id}!`)
      return
    }

    const remoteNumber: BN = new BN(remoteHeader.header.number)
    const blockNumberStr: string = blockNumber.toString(10)
    debug(`latest block is ${blockNumberStr} remote block is ${remoteNumber.toString(10)}`)

    blockNumber.iaddn(1)
    while (blockNumber.lte(remoteNumber)) {
      let max: number = MAX_PER_REQUEST
      if (remoteNumber.lt(blockNumber.addn(max))) {
        max = (remoteNumber.sub(blockNumber).toNumber()) || 1
      }

      this.queue.push({ number: blockNumber.clone(), protocol, max })
      this.highestBlock = blockNumber
      blockNumber.iaddn(max)
    }

    return this.queue.drain()
  }
}
