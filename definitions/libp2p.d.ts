import PeerInfo from 'peer-info'

export = Libp2p;
declare class Libp2p {
  static defaultMaxListeners: any;
  _dht: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(_options: any);
  multicast: any;
  _multicast: any;
  datastore: any;
  peerInfo: any;
  peerBook: any;
  stats: any;
  connectionManager: any;
  pubsub: any;
  peerRouting: any;
  contentRouting: any;
  dht: any;
  state: any;
  _switch: any;
  addListener(type: any, listener: any): any;
  dial(peer: PeerInfo, callback: any): void | Promise<any>;
  dialFSM(peer: any, protocol: any, callback: any): any;
  dialProtocol(peer: any, callback?: any): any | Promise<any>;
  dialProtocol(peer: any, protocol: any, callback?: any): any | Promise<any>;
  dialProtocol(peer: any, protocol?: any, callback?: any): any | Promise<any>;
  emit(eventName: any, args: any): void;
  eventNames(): any;
  getMaxListeners(): any;
  handle(protocol: string, handlerFunc: Function, matchFunc?: Function): void;
  hangUp(peer: any, callback: any): void;
  isStarted(): any;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  ping(peer: any, callback: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  setMaxListeners(n: any): any;
  start(callback?: any): void | Promise<any>;
  stop(callback?: any): void | Promise<any>;
  unhandle(protocol: any): void;
}
declare namespace Libp2p {
  class EventEmitter {
    // Circular reference from index.EventEmitter
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
