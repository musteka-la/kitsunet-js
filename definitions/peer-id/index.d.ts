export = index;
declare class index {
  static create (opts: any, callback: any): void;
  static createFromB58String (str: any): any;
  static createFromBytes (buf: any): any;
  static createFromHexString (str: any): any;
  static createFromJSON (obj: any, callback: any): any;
  static createFromPrivKey (key: any, callback: any): any;
  static createFromPubKey (key: any, callback: any): any;
  static isPeerId (peerId: any): any;
  constructor(args: any);
  isEqual (id: any): any;
  isValid (callback: any): void;
  marshalPrivKey (): any;
  marshalPubKey (): any;
  toB58String (): any;
  toBytes (): any;
  toHexString (): any;
  toJSON (): any;
  toPrint (): any;
}
