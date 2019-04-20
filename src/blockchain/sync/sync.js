'use strict'

const EE = require('events')

// NOTE: For now this is heavily inspired by the ethereumjs-client

const DOWNLOAD_INTERVAL = 1000 * 20

/**
 * @fires blocks - an event with the latest fetched blocks
 * @fires headers - an event with the latest fetched headers
*/
class Sync extends EE {
  /**
   * Create a sync task
   *
   * @param {Object} Options
   * @param {Chain} Options.chain - the blockchain to store downloaded blocks
   * @param {Chain} Options.minPeers - the minimum amount of peers to be able to start syncing
   * @param {Chain} Options.interval - the download frequency
   */
  constructor ({ chain, peers, minPeers, interval }) {
    super()

    this.chain = chain
    this.peers = peers
    this.minPeers = minPeers
    this.interval = interval || DOWNLOAD_INTERVAL
    this.running = false
  }

  get type () {
    return 'none'
  }

  get syncable () {
    return true
  }

  /**
   * Perform sync with remote endpoint
   */
  async sync () {
    throw new Error('not implemented!')
  }

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

module.exports = Sync
