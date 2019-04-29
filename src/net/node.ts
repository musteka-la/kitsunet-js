'use strict'

import { IProtocol, INetwork, NodeType } from './interfaces'

export abstract class Node<P> implements INetwork<P> {
  abstract type: NodeType
  abstract protocols: Map<string, IProtocol<P>>

  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   */
  abstract send<T, U> (msg: T, protocol: IProtocol<P>): Promise<U | void>

  /**
   * handle incoming messages
   *
   * @param readable - an iterable to read from
   */
  abstract receive<T> (readable: AsyncIterable<T>): AsyncIterable<T>

  abstract mount (protocol: IProtocol<P>): void
  abstract unmount (protocol: IProtocol<P>): void

  abstract start (): Promise<void>
  abstract stop (): Promise<void>
}
