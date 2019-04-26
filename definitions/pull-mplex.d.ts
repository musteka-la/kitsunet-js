export = index;
declare function index(conn: any, isListener: any): any;
declare namespace index {
  function dialer(conn: any): void;
  function listener(conn: any): void;
  const multicodec: string;
  class pullMplex {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    constructor(opts: any);
    source: any;
    sink: any;
    addListener(type: any, listener: any): any;
    close(err: any): void;
    createStream(name: any): any;
    destroy(err: any): void;
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
    push(data: any): void;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
  }
  namespace pullMplex {
    class EventEmitter {
      // Circular reference from index.pullMplex.EventEmitter
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
}
