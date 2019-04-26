'use strict'

export enum NodeType {
  LIBP2P, DEVP2P
}

export interface INetworkProvider<P> {
  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   */
  send<T extends Buffer, U> (msg: T, protocol: IProtocol<P>, peer: P): Promise<U | undefined>

  /**
   * handle incoming messages
   *
   * @param readable - an iterable to ber read from asynchronously
   */
  handle<T extends AsyncIterable<T & Buffer>> (readable: T): void

  /**
   * Create a two way stream with remote
   *
   * @param readable - an async iterable to stream from
   * @returns - an async iterator to pull from
   */
  stream<T extends AsyncIterable<T & Buffer>, U> (readable: T, protocol: IProtocol<P>, peer: P): AsyncIterator<U>
}

export interface IEncoder {
  /**
   * Encode a buffer
   *
   * @param msg - a buffer to encode
   */
  encode<T, U extends Buffer> (msg: T): AsyncIterable<U>

  /**
   * A buffer to decode
   *
   * @param msg - decode a buffer
   */
  decode<T extends Buffer, U> (msg: T): AsyncIterable<U>
}

export abstract class Peer<T> {
  peer: T                                // the raw peer
  id!: string                            // the string representation of the peers id
  addrs!: Set<string>                    // a set of peer addresses
  protocols: Map<string, IProtocol<T>>   // a set of protocols that this peer supports

  constructor (peer: T, protocols: Map<string, IProtocol<T>>) {
    this.peer = peer
    this.protocols = protocols
  }
}

export interface IProtocol<T> extends INetworkProvider<T> {
  id: string                            // id of the protocol
  codec: string                         // the codec for the protocol
  encoder: IEncoder                     // the encoder
  networkProvider: INetworkProvider<T>  // the network provider

  createProtocol (provider?: INetworkProvider<T>, encoder?: IEncoder): IProtocol<T>
}

export abstract class Node<P> implements INetworkProvider<P>, Peer<P> {
  id!: string
  addrs!: Set<string>

  peer!: P
  type!: NodeType
  protocols!: Map<string, IProtocol<P>>

  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   */
  abstract send<T extends Buffer, U> (msg: T, protocol: IProtocol<P>): Promise<U>

  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   */
  abstract handle<T extends AsyncIterable<T>> (readable: T): void

  /**
   * Create a two way stream with remote
   *
   * @param readable - an async iterable to stream from
   * @returns - an async iterator to pull from
   */
  abstract stream<T extends AsyncIterable<T & Buffer>, U> (readable: T, protocol: IProtocol<P>): AsyncIterator<U>

  abstract mount (protocol: IProtocol<P>): void
  abstract unmount (protocol: IProtocol<P>): void

  abstract start (): Promise<void>
  abstract stop (): Promise<void>
}
