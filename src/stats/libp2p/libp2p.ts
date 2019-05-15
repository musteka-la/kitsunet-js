'use strict'

import { Libp2pTrafficStats } from './traffic'
import { Libp2pDhtStats } from './dht'
import { register } from 'opium-decorators'
import Libp2p from 'libp2p'

@register()
export class Libp2pStats {
  traffic: Libp2pTrafficStats
  dht: Libp2pDhtStats
  constructor (node: Libp2p) {
    this.traffic = new Libp2pTrafficStats(node)
    this.dht = new Libp2pDhtStats(node)
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
