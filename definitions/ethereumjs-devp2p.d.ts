export class Peer {
  static PREFIXES: {
    HELLO: number,
    DISCONNECT: number,
    PING: number,
    PONG: number,
  }

  static DISCONNECT_REASONS: {
    DISCONNECT_REQUESTED: number,
    NETWORK_ERROR: number,
    PROTOCOL_ERROR: number,
    USELESS_PEER: number,
    TOO_MANY_PEERS: number,
    ALREADY_CONNECTED: number,
    INCOMPATIBLE_VERSION: number,
    INVALID_IDENTITY: number,
    CLIENT_QUITTING: number,
    UNEXPECTED_IDENTITY: number,
    SAME_IDENTITY: number,
    TIMEOUT: number,
    SUBPROTOCOL_ERROR: number
  };
  constructor(options?: any);
  getId(): any;
  getHelloMessage(): any;
  getProtocols(): any;
  getMsgPrefix(code): any;
  getDisconnectPrefix(code: any): any;
  disconnect(reason: any): any;
}

export class DPT {
  static defaultMaxListeners: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(privateKey: any, options: any);
  addListener(type: any, listener: any): any;
  addPeer(obj: any): any;
  banPeer(obj: any, maxAge: any): void;
  bind(args: any): void;
  bootstrap(peer: any): any;
  destroy(args: any): void;
  emit(type: any, args: any): any;
  eventNames(): any;
  getClosestPeers(id: any): any;
  getMaxListeners(): any;
  getPeer(obj: any): any;
  getPeers(): any;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  refresh(): void;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  removePeer(obj: any): void;
  setMaxListeners(n: any): any;
}
export namespace DPT {
  class EventEmitter {
    // Circular reference from index.DPT.EventEmitter
    static EventEmitter: any;
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
  }
}
export class ETH {
  static MESSAGE_CODES: {
    BLOCK_BODIES: number;
    BLOCK_HEADERS: number;
    GET_BLOCK_BODIES: number;
    GET_BLOCK_HEADERS: number;
    GET_NODE_DATA: number;
    GET_RECEIPTS: number;
    NEW_BLOCK: number;
    NEW_BLOCK_HASHES: number;
    NODE_DATA: number;
    RECEIPTS: number;
    STATUS: number;
    TX: number;
  };
  static defaultMaxListeners: any;
  static eth62: {
    length: number;
    name: string;
    version: number;
  };
  static eth63: {
    length: number;
    name: string;
    version: number;
  };
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(version: any, peer: any, send: any);
  addListener(type: any, listener: any): any;
  emit(type: any, args: any): any;
  eventNames(): any;
  getMaxListeners(): any;
  getMsgPrefix(msgCode: any): any;
  getVersion(): any;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  sendMessage(code: any, payload: any): void;
  sendStatus(status: any): void;
  setMaxListeners(n: any): any;
}
export namespace ETH {
  class EventEmitter {
    // Circular reference from index.ETH.EventEmitter
    static EventEmitter: any;
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
  }
}
export class LES {
  static MESSAGE_CODES: {
    ANNOUNCE: number;
    BLOCK_BODIES: number;
    BLOCK_HEADERS: number;
    CONTRACT_CODES: number;
    GET_BLOCK_BODIES: number;
    GET_BLOCK_HEADERS: number;
    GET_CONTRACT_CODES: number;
    GET_HEADER_PROOFS: number;
    GET_HELPER_TRIE_PROOFS: number;
    GET_PROOFS: number;
    GET_PROOFS_V2: number;
    GET_RECEIPTS: number;
    GET_TX_STATUS: number;
    HEADER_PROOFS: number;
    HELPER_TRIE_PROOFS: number;
    PROOFS: number;
    PROOFS_V2: number;
    RECEIPTS: number;
    SEND_TX: number;
    SEND_TX_V2: number;
    STATUS: number;
    TX_STATUS: number;
  };
  static defaultMaxListeners: any;
  static init(): void;
  static les2: {
    length: number;
    name: string;
    version: number;
  };
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(version: any, peer: any, send: any);
  addListener(type: any, listener: any): any;
  emit(type: any, args: any): any;
  eventNames(): any;
  getMaxListeners(): any;
  getMsgPrefix(msgCode: any): any;
  getVersion(): any;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  sendMessage(code: any, reqId: any, payload: any): void;
  sendStatus(status: any): void;
  setMaxListeners(n: any): any;
}
export namespace LES {
  class EventEmitter {
    // Circular reference from index.LES.EventEmitter
    static EventEmitter: any;
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
  }
}
export class RLPx {
  static DISCONNECT_REASONS: {
    ALREADY_CONNECTED: number;
    CLIENT_QUITTING: number;
    DISCONNECT_REQUESTED: number;
    INCOMPATIBLE_VERSION: number;
    INVALID_IDENTITY: number;
    NETWORK_ERROR: number;
    PROTOCOL_ERROR: number;
    SAME_IDENTITY: number;
    SUBPROTOCOL_ERROR: number;
    TIMEOUT: number;
    TOO_MANY_PEERS: number;
    UNEXPECTED_IDENTITY: number;
    USELESS_PEER: number;
  };
  static defaultMaxListeners: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(privateKey: any, options: any);
  addListener(type: any, listener: any): any;
  connect(peer: any): any;
  destroy(args: any): void;
  disconnect(id: any): void;
  emit(type: any, args: any): any;
  eventNames(): any;
  getMaxListeners(): any;
  getPeers(): any;
  listen(args: any): void;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  setMaxListeners(n: any): any;
}
export namespace RLPx {
  class EventEmitter {
    // Circular reference from index.RLPx.EventEmitter
    static EventEmitter: any;
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
  }
}
