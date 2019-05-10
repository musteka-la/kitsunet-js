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
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U>
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U[]>
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<void>
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | U[] | void> {
    throw new Error('Method not implemented')
  }

  /**
   * handle incoming messages
   *
   * @param readable - an AsyncIterable to read from
   */
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U>
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U[]>
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U | U[]> {
    throw new Error('Method not implemented')
  }

  // mount a protocol
  mount (protocol: IProtocol<P>): void {
    throw new Error('Method not implemented')
  }

  // unmount a protocol
  unmount (protocol: IProtocol<P>): void {
    throw new Error('Method not implemented')
  }

  abstract start (): Promise<void>
  abstract stop (): Promise<void>
}
