export class Client {
  constructor(swarm: any);
  swarm: any;
  store: any;
  dial(peer: any): any;
  discover(ns: any, cb: any): void;
  register(ns: any, peer: any, ttl: any, cb: any): void;
  sync(): void;
  unregister(ns: any, id: any): void;
}
export class Discovery {
  static defaultMaxListeners: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static tag: string;
  static usingDomains: boolean;
  swarm: any;
  addListener(type: any, listener: any): any;
  emit(type: any, args: any): any;
  eventNames(): any;
  getMaxListeners(): any;
  init(swarm: any, opt: any): void;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  register(ns: any, ttl: any): void;
  removeAllListeners(type: any, ...args: any[]): any;
  removeListener(type: any, listener: any): any;
  setMaxListeners(n: any): any;
  start(cb: any): void;
  stop(cb: any): void;
  unregister(ns: any): void;
}
export namespace Discovery {
  class EventEmitter {
    // Circular reference from index.Discovery.EventEmitter
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
export class Server {
  constructor(opt: any);
  swarm: any;
  Store: any;
  store: any;
  gcTime: any;
  gc(): void;
  start(cb: any): void;
  stop(cb: any): void;
}
