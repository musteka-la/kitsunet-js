'use strict'

export enum NodeType {
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
  send<T, U> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | void>

  /**
   * handle incoming messages
   *
   * @param readable - an iterable to ber read from asynchronously
   */
  receive<T> (readable: AsyncIterable<T>): AsyncIterable<T>
}

export interface IEncoder {
  /**
   * Encode a buffer
   *
   * @param msg - a buffer to encode
   */
  encode<T, U> (msg: T): AsyncIterable<U>

  /**
   * A buffer to decode
   *
   * @param msg - decode a buffer
   */
  decode<T, U> (msg: T): AsyncIterable<U>
}

export interface IPeerDescriptor<T> {
  peer: T               // the raw peer (if any)
  id: string            // the string representation of the peers id
  addrs: Set<string>    // a set of peer addresses
}

export interface IProtocolConstructor<T> {
  new(peer: IPeerDescriptor<T>, provider: INetwork<T>, encoder?: IEncoder): IProtocol<T>
}

export interface IProtocol<T> extends INetwork<T> {
  id: string                            // id of the protocol
  codec: string                         // the codec for the protocol
  peer: IPeerDescriptor<T>              // protocols peer
  encoder?: IEncoder                    // the encoder
  networkProvider: INetwork<T>          // the network provider
}
