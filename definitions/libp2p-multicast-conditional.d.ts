export = index;
declare class index {
  static defaultMaxListeners: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(libp2p: any);
  cache: any;
  subscriptions: any;
  fwrdHooks: any;
  addFrwdHook(topic: any, hook: any): void;
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
  publish(topics: any, messages: any, hops: any): void;
  rawListeners(type: any): any;
  removeAllListeners(type: any, ...args: any[]): any;
  removeFrwdHook(topic: any, hook: any): void;
  removeListener(type: any, listener: any): any;
  setMaxListeners(n: any): any;
  start(callback: any): any;
  stop(callback: any): void;
  subscribe(topics: any): void;
  unsubscribe(topics: any): void;
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
