'use strict'

import BN from 'bn.js'
import Block from 'ethereumjs-block'

import { DownloaderType } from '../interfaces'
import {
  BlockBody,
  Peer,
  IEthProtocol,
  PeerManager,
  EthProtocol,
  IProtocol,
  ProtocolTypes
} from '../../net'

import {
  BaseDownloader,
  MAX_PER_REQUEST,
  CONCCURENT_REQUESTS,
  MAX_REQUEST
} from './base'

import { EthChain } from '../../blockchain'
import { queue, AsyncQueue, asyncify } from 'async'

import Debug from 'debug'
const debug = Debug('kitsunet:downloaders:fast-sync')

interface TaskPayload {
  protocol: IProtocol<ProtocolTypes>
  from: BN
  to: BN
  reverse?: boolean
  skip?: number
  peer: Peer
}

export class FastSyncDownloader extends BaseDownloader {
  type: DownloaderType
  queue: AsyncQueue<TaskPayload>
  highestBlock: BN = new BN(0)

  constructor (public chain: EthChain,
               peerManager: PeerManager) {
    super(chain, peerManager)
    this.type = DownloaderType.FAST
    this.queue = queue(asyncify(this.task.bind(this)), CONCCURENT_REQUESTS)
  }

  protected async task ({ from, to, skip, reverse, protocol, peer }: TaskPayload) {
    const fromStr: string = from.toString(10)

    // increment current block to set as start
    debug(`requesting ${MAX_PER_REQUEST} blocks ` +
      `from ${protocol.peer.id} starting from ${fromStr}`)
    while (from.lte(to)) {
      const headers: Block.Header[] = await this.getHeaders(
        protocol as unknown as IEthProtocol,
        peer,
        from,
        MAX_PER_REQUEST,
        skip,
        reverse)

      if (!headers.length) {
        debug(`couldn't import blocks from ${peer.id}, aborting`)
        return
      }

      const bodies: BlockBody[] = await this.getBodies(
        protocol as unknown as IEthProtocol,
        peer,
        headers.map(h => h.hash()))

      await this.store(bodies.map((body, i) => new Block([headers[i].raw].concat(body))))
      from.iaddn(headers.length)
      debug(`imported ${headers.length} blocks from ${peer.id}`)
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
    let from: BN = new BN(0)
    const block: Block | undefined = await this.chain.getLatestBlock()
    if (block) {
      from = new BN(block.header.number)
    }

    const protocol = peer.protocols.get('eth')
    if (!protocol) {
      throw new Error('fast sync requires the ETH capability!')
    }

    const remoteHeader: Block | undefined = await this.latest(protocol as unknown as IEthProtocol, peer)
    if (!remoteHeader) {
      debug(`unable to get remote header from ${peer.id}!`)
      return
    }

    const remote: BN = new BN(remoteHeader.header.number)
    const remoteStr: string = remote.toString(10)
    if (from.gte(remote)) {
      debug(`remote block ${remoteStr} is lower or equal to local block, skiping!`)
      return
    }

    const ancestor = await this.findAncestor(protocol as unknown as IEthProtocol, peer, from)
    if (!ancestor) {
      debug(new Error(`unable to find common ancestor with peer ${peer.id}`))
      this.peerManager.ban([peer])
      return
    }

    from = new BN(ancestor.header.number)
    const localStr: string = from.toString(10)
    debug(`latest block is ${localStr} remote block is ${remoteStr}`)

    from.iaddn(1)
    const to = remote.sub(from).gten(MAX_REQUEST)
      ? from.addn(MAX_REQUEST)
      : remote

    try {
      const payload: TaskPayload = { from: from.clone(), to: to.clone(), protocol, peer }
      await this.queue.push(payload)
      debug(`queue contains ${this.queue.length()} tasks and ${this.queue.workersList().length} workers`)
    } catch (err) {
      debug(`an error occurred processing fast sync task `, err)
    }
  }
}
