'use strict'

import { EventEmitter as EE } from 'events'
import { NetworkPeer } from './peer'

import {
  IProtocol,
  INetwork,
  NetworkType,
  ICapability,
  IProtocolDescriptor,
  IPeerDescriptor
} from './interfaces'

export abstract class Node<P> extends EE implements INetwork<P> {
  protocols: Map<string, IProtocol<P>> = new Map()
  peers: Map<string, P> = new Map()
  caps: ICapability[] = []

  abstract started: boolean
  abstract peer?: P
  abstract type: NetworkType

  /**
   * Check if this node supports the protocol
   *
   * @param protoDescriptor
   */
  isProtoSupported (protoDescriptor: IProtocolDescriptor<P>): boolean {
    return this.caps.filter((cap) => {
      if (cap.id === protoDescriptor.cap.id) {
        return cap.versions.filter((v) => {
          return protoDescriptor
            .cap
            .versions
            .includes(v)
        }).length > 0
      }
    }).length > 0
  }

  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   */
  abstract send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U>
  abstract send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U[]>
  abstract send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<void>
  abstract send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | U[] | void>

  /**
   * handle incoming messages
   *
   * @param readable - an AsyncIterable to read from
   */
  abstract receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U>
  abstract receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U[]>
  abstract receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U | U[]>

  // mount a protocol
  abstract mount (protocol: IProtocol<P>): void

  // unmount a protocol
  abstract unmount (protocol: IProtocol<P>): void

  abstract start (): Promise<void>
  abstract stop (): Promise<void>
}
