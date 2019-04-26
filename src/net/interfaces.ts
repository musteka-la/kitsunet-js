'use strict'

export enum NodeType {
  LIBP2P, DEVP2P
}

export interface Sender {
  send<T extends Buffer, U> (msg: T, protocol: Protocol): Promise<U>
}

export abstract class Protocol {
  id!: string  // id of the protocol

  abstract setNetworkProvider (provider: Sender): void
  abstract handle<T extends AsyncIterable<T>> (msg: T): void  // handle incoming messages
  abstract send<T, U> (msg: U): Promise<T>  // send a message
}

export abstract class Peer<T> {
  info!: T              // a blob representing the raw peer
  sId!: string          // the string representation of the peers id
  addrs!: Set<string>   // an array of know peer addresses
}

export abstract class Node<T> {
  peer!: Peer<T>
  type!: NodeType

  abstract mount (protocol: Protocol): Promise<boolean>
  abstract unmount (protocol: Protocol): Promise<boolean>

  abstract start (): Promise<void>
  abstract stop (): Promise<void>
}
