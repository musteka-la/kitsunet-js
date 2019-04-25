'use strict'

import EE from 'events'

/**
 * The base class that all protocols such as ksn and eth/62, etc implement
 */
export abstract class Protocol extends EE {
  abstract getId (): string
  abstract getVersion (): string
}
