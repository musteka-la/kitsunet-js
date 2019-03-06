'use strict'

const EE = require('safe-event-emitter')

class BaseRpc extends EE {
  ping () {
    return 'pong'
  }
}

module.exports = BaseRpc
