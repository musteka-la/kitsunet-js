'use strict'

import EE from 'events'

/**
 * The base class that all protocols such as ksn and eth/62, etc implement
 */
export class Protocol extends EE {
  get id () {
    throw new Error('not implemented!')
  }

  get version () {
    throw new Error('not implemented!')
  }
}
