'use strict'

import { register } from 'opium-decorators'
import Libp2p from 'libp2p'

@register()
export class Libp2pDhtStats {
  _node: Libp2p
  constructor (node: Libp2p) {
    this._node = node
  }

  start () {}

  stop () {}

  getState () {
    const node = this._node
    const dht = node._dht
    if (!dht) return
    const kBucket = dht.routingTable.kb
    if (!kBucket) return
    return {
      data: dht.datastore.data,
      routingTable: kBucket.toArray().map(contact => {
        return { id: contact.peer.toB58String() }
      })
    }
  }
}

module.exports = Libp2pDhtStats
