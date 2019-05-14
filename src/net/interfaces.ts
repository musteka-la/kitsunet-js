'use strict'

export enum NetworkType {
  LIBP2P, DEVP2P
}

export interface INetwork<P> {
  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   * @param peer - (optional) raw peer
   */
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U>
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U[]>
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<void>
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | U[] | void>

  /**
   * handle incoming messages
   *
   * @param readable - an AsyncIterable to ber read from asynchronously
   */
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U>
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U[]>
  receive<T, U = T> (readable: AsyncIterable<T>): AsyncIterable<U | U[]>
}

export interface IEncoder {
  /**
   * Encode a buffer
   *
   * @param msg - a buffer to encode
   */
  encode<T, U = T> (msg: T): AsyncIterable<U>

  /**
   * A buffer to decode
   *
   * @param msg - decode a buffer
   */
  decode<T, U = T> (msg: T): AsyncIterable<U>
}

export interface IPeerDescriptor<T> {
  peer: T               // the raw peer
  id: string            // the string representation of the peers id
  addrs: Set<string>    // a set of peer addresses
}

export interface ICapability {
  id: string          // id of the capability/protocol
  versions: string[]  // versions supported
}

export interface IProtocolDescriptor<T> {
  cap: ICapability
  constructor: IProtocolConstructor<T>
}

export interface IProtocolConstructor<T> {
  new(peer: T, provider: INetwork<T>, encoder?: IEncoder): IProtocol<T>
}

export interface IProtocol<T> extends INetwork<T>, ICapability {
  peer: IPeerDescriptor<T>              // protocols peer
  encoder?: IEncoder                    // the encoder
  networkProvider: INetwork<T>          // the network provider
}