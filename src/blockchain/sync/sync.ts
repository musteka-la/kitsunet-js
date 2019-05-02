'use strict'

import { EventEmitter as EE } from 'events'
import { Chain } from '../chain'

// NOTE: For now this is heavily inspired by the ethereumjs-client

const DOWNLOAD_INTERVAL: number = 1000 * 20

/**
 * @fires blocks - an event with the latest fetched blocks
 * @fires headers - an event with the latest fetched headers
 */
export abstract class Sync extends EE {
  protected chain: Chain
  protected peers: Array<any> // TODO: should be array of Peers
  protected minPeers: number = 3
  protected interval: number = DOWNLOAD_INTERVAL
  protected running: boolean = false
  protected forceSync: boolean = false

  /**
   * Create a sync task
   *
   * @param {Object} Options
   * @param {Chain} Options.chain - the blockchain to store downloaded blocks
   * @param {Chain} Options.minPeers - the minimum amount of peers to be able to start syncing
   * @param {Chain} Options.interval - the download frequency
   */
  constructor (chain: Chain, peers: Array<any>, minPeers: number, interval: number) {
    super()
    this.chain = chain
    this.peers = peers
    this.minPeers = minPeers
    this.interval = interval
  }

  /**
   * The type of the sync algorithm
   */
  get type (): string {
    return 'none'
  }

  /**
   * Can it be synced against
   */
  get syncable (): boolean {
    return true
  }

  /**
   * Perform sync with remote endpoint
   */
  abstract async sync (): Promise<boolean>

  /**
   * Start synchronization
   * @return {Promise}
   */
  async start () {
    if (this.running) {
      return false
    }
    this.running = true
    const timeout = setTimeout(() => { this.forceSync = true }, this.interval)
    while (this.running) {
      try {
        if (await this.sync()) this.emit('synchronized')
      } catch (error) {
        if (this.running) this.emit('error', error)
      }
      await new Promise(resolve => setTimeout(resolve, this.interval))
    }
    this.running = false
    clearTimeout(timeout)
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.running) {
      return false
    }
    await new Promise(resolve => setTimeout(resolve, this.interval))
    this.running = false
  }
}
