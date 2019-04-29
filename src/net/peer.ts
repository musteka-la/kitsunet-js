'use strict'

import { IPeerDescriptor, IProtocol } from './interfaces'

export class NetworkPeer<T> implements IPeerDescriptor<IPeerDescriptor<T>> {
  get id (): string {
    return this.id
  }

  get addrs (): Set<string> {
    return this.peer.addrs
  }

  peer: IPeerDescriptor<T>
  protocols: Map<string, IProtocol<T>>   // a set of protocols that this peer supports
  constructor (peer: IPeerDescriptor<T>, protocols: Map<string, IProtocol<T>>) {
    this.peer = peer
    this.protocols = protocols
  }
}
