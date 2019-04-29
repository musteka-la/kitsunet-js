export = index;
declare class index {
  static defaultMaxListeners: any;
  static init(): void;
  static listenerCount(emitter: any, type: any): any;
  static usingDomains: boolean;
  constructor(peerInfo: any, peerBook: any, options: any);
  transports: any;
  conns: any;
  protocols: any;
  muxers: any;
  identify: any;
  crypto: any;
  protector: any;
  transport: any;
  connection: any;
  observer: any;
  stats: any;
  protocolMuxer: any;
  state: any;
  dialer: any;
  dial: any;
  dialFSM: any;
  addListener(type: any, listener: any): any;
  availableTransports(peerInfo: any): any;
  emit(type: any, args: any): any;
  eventNames(): any;
  getMaxListeners(): any;
  handle(protocol: any, handlerFunc: any, matchFunc: any): void;
  hangUp(peer: any, callback: any): void;
  hasTransports(): any;
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
  start(callback: any): void;
  stop(callback: any): void;
  unhandle(protocol: any): void;
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
  namespace errors {
    function CONNECTION_FAILED(err: any): void;
    function DIAL_ABORTED(): void;
    function DIAL_SELF(): void;
    function ERR_BLACKLISTED(): void;
    function INVALID_STATE_TRANSITION(err: any): void;
    function NO_TRANSPORTS_REGISTERED(): void;
    function PROTECTOR_REQUIRED(): void;
    function UNEXPECTED_END(): void;
    function maybeUnexpectedEnd(err: any): any;
  }
}
