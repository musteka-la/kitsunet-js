export = index;
declare class index {
  static isWebSockets(obj: any): void;
  constructor(args: any);
  createListener(options: any, handler: any): any;
  dial(ma: any, options: any, callback: any): any;
  filter(multiaddrs: any): any;
}
