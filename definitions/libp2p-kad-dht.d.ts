export = index;
declare class index {
  static defaultMaxListeners: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(sw: any, options: any);
  switch: any;
  kBucketSize: any;
  ncp: any;
  routingTable: any;
  datastore: any;
  providers: any;
  validators: any;
  selectors: any;
  network: any;
  randomWalk: any;
  addListener(type: any, listener: any): any;
  emit(type: any, args: any): any;
  eventNames(): any;
  findPeer(id: any, options: any, callback: any): void;
  findPeerLocal(peer: any, callback: any): void;
  findProviders(key: any, options: any, callback: any): void;
  get(key: any, options: any, callback: any): void;
  getClosestPeers(key: any, options: any, callback: any): void;
  getMany(key: any, nvals: any, options: any, callback: any): void;
  getMaxListeners(): any;
  getPublicKey(peer: any, callback: any): any;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  provide(key: any, callback: any): void;
  put(key: any, value: any, options: any, callback: any): void;
  rawListeners(type: any): any;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  setMaxListeners(n: any): any;
  start(callback: any): void;
  stop(callback: any): void;
}
declare namespace index {
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
