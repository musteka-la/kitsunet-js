'use strict'

import { IPeerDescriptor, IProtocol } from './interfaces'
import { Node } from './node'
import { EventEmitter as EE } from 'events'

export abstract class NetworkPeer<T, U = T> extends EE implements IPeerDescriptor<T> {
  abstract node?: Node<IPeerDescriptor<T>>
  abstract peer: T
  abstract id: string
  abstract addrs: Set<string>
  abstract ban<R extends any>(reason?: R, maxAge?: number): Promise<void>
  abstract disconnect<R extends any>(reason?: R): Promise<void>
  protocols: Map<string, IProtocol<U>> = new Map() // a set of protocols that this peer supports
}
