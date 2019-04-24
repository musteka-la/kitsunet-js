'use strict'

import Libp2pTrafficStats from './traffic'
import Libp2pDhtStats from './dht'

export class Libp2pStats {
  constructor ({ node }) {
    this.traffic = new Libp2pTrafficStats({ node })
    this.dht = new Libp2pDhtStats({ node })
  }

  start () {
    this.traffic.start()
    this.dht.start()
  }

  stop () {
    this.traffic.stop()
    this.dht.stop()
  }

  getState () {
    return {
      traffic: this.traffic.getState(),
      dht: this.dht.getState()
    }
  }
}
