'use strict'

import { EventEmitter as EE } from 'events'

import {
  IProtocol,
  INetwork,
  NetworkType,
  ICapability,
  IProtocolDescriptor,
  IProtocolConstructor,
  IPeerDescriptor
} from './interfaces'
import { IBlockchain } from '../blockchain'
import { NetworkPeer } from './network-peer'

/**
 * Abstract Node
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:discovered - fires on new discovered peer
 */
export abstract class Node<P> extends EE implements INetwork<P> {
  protocols: Map<string, IProtocol<P>> = new Map()
  peers: Map<string, P> = new Map()
  caps: ICapability[] = []

  abstract started: boolean
  abstract peer?: P
  abstract type: NetworkType
  abstract chain: IBlockchain

  /**
   * Check if this node supports the protocol
   *
   * @param protoDescriptor
   */
  isProtoSupported (protoDescriptor: IProtocolDescriptor<P>): boolean {
    return Boolean(this.caps.find((cap: any) => {
      if (cap.id === protoDescriptor.cap.id) {
        return cap.versions.find((v) => {
          return protoDescriptor
            .cap
            .versions
            .includes(v)
        })
      }
    }))
  }

  /**
   * send a message to a remote
   *
   * @param msg - the message to send
   * @param protocol - a protocol object to pass to the network provider
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send<T, U = T> (msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | U[] | void> {
    throw new Error('Method not implemented')
  }

  /**
   * handle incoming messages
   *
   * @param readable - an AsyncIterable to read from
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  receive <T, U = T> (readable: AsyncIterable<T>): AsyncIterable <U | U[]> {
    throw new Error('Method not implemented')
  }

  // mount a protocol
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mount (protocol: IProtocol<P>): void {
  }

  // unmount a protocol
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unmount (protocol: IProtocol<P>): void {
  }

  protected registerProtos (protocolRegistry: IProtocolDescriptor<P>[],
                            peer: NetworkPeer<any, any>): IProtocol<P>[] {
    return protocolRegistry.map((protoDescriptor: IProtocolDescriptor<P>) => {
      if (this.isProtoSupported(protoDescriptor)) {
        const Protocol: IProtocolConstructor<P> = protoDescriptor.constructor
        const proto: IProtocol<P> = new Protocol(peer,
                                                 this as INetwork<P>,
                                                 this.chain)
        peer.protocols.set(proto.id, proto)
        this.mount(proto)
        return proto
      }
    }).filter(Boolean) as any
  }

  abstract disconnectPeer(peer: P, reason?: any): Promise<void>
  abstract banPeer(peer: P, maxAge?: number, reason?: any): Promise<void>
  abstract start (): Promise <void>
  abstract stop (): Promise<void>
}
