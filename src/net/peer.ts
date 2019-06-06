'use strict'

import { IPeerDescriptor, IProtocol } from './interfaces'
import { EventEmitter as EE } from 'events'

export abstract class NetworkPeer<T, U> extends EE implements IPeerDescriptor<T> {
  abstract peer: T
  abstract id: string
  abstract addrs: Set<string>
  abstract used: boolean = false
  protocols: Map<string, IProtocol<U>> = new Map() // a set of protocols that this peer supports
}
