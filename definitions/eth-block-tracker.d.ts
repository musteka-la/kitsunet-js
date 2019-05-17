export = polling;
declare class polling {
  constructor(opts: any);
  addListener(type: any, listener: any): any;
  checkForLatestBlock(): any;
  emit(type: any, ...args: any[]): any;
  eventNames(): any;
  getCurrentBlock(): any;
  getLatestBlock(): any;
  getMaxListeners(): any;
  isRunning(): any;
  listenerCount(type: any): any;
  listeners(type: any): any;
  off(type: any, listener: any): any;
  on(type: any, listener: any): any;
  once(type: any, listener: any): any;
  prependListener(type: any, listener: any): any;
  prependOnceListener(type: any, listener: any): any;
  rawListeners(type: any): any;
  removeAllListeners(eventName: any): void;
  removeListener(type: any, listener: any): any;
  setMaxListeners(n: any): any;
}
