'use strict'

import { IProtocol, INetwork, NetworkType } from './interfaces'
import { NetworkPeer } from './peer'

export abstract class Node<P> implements INetwork<P> {
  protocols: Map<string, IProtocol<P>> = new Map()
  peers: Map<string, NetworkPeer<P>> = new Map()

  abstract started: boolean
  abstract peer: NetworkPeer<P>
  abstract type: NetworkType

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

  abstract mount (protocol: IProtocol<P>): void
  abstract unmount (protocol: IProtocol<P>): void

  abstract start (): Promise<void>
  abstract stop (): Promise<void>
}
