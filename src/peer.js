'use strict'

const EE = require('events')

class Peer extends EE {
  /**
   * @param {Map<String, Protocol>} protocols - map of protocols, such as 'ksn', 'eth62', etc...
  */
  constructor (protocols) {
    super()
    this.protocols = protocols
  }

  getProtoById (id) {
    return this.protocols.get(id)
  }
}

module.exports = Peer
