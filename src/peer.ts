'use strict'

import EE from 'events'
import { Protocol } from './net/protocol'

export class Peer extends EE {
  public protocols: Map<string, Protocol>

  /**
   * @param {Map<String, Protocol>} protocols - map of protocols, such as 'ksn', 'eth62', etc...
  */
  constructor (protocols: Map<string, Protocol>) {
    super()
    this.protocols = protocols
  }

  getProtoById (id) {
    return this.protocols.get(id)
  }
}
