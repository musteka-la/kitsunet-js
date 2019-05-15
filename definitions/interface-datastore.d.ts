export namespace Errors {
  function dbDeleteFailedError(err: any): any;
  function dbOpenFailedError(err: any): any;
  function dbWriteFailedError(err: any): any;
  function notFoundError(err: any): any;
}
export class Key {
  static isKey(obj: any): void;
  static random(): any;
  static withNamespaces(list: any): any;
  constructor(args: any);
  baseNamespace(): any;
  child(key: any): any;
  clean(): void;
  instance(s: any): any;
  isAncestorOf(other: any): any;
  isDecendantOf(other: any): any;
  isTopLevel(): any;
  less(key: any): any;
  list(): any;
  name(): any;
  namespaces(): any;
  parent(): any;
  path(): any;
  reverse(): any;
  toBuffer(): any;
  toString(encoding: any): any;
  type(): any;
}

export interface Datastore {
  data: any;
  batch(): any;
  close<T>(): Promise<T>;
  get<T>(key: Key): Promise<T>;
  has<T>(key: Key): Promise<T>;
  open(key: Key): void;
  put<T>(key: Key, val: any): Promise<T>;
  query(q: any): Iterable<any>;
}

export class MemoryDatastore implements Datastore {
  data: any;
  batch(): any;
  close<T>(): Promise<T>;
  get<T>(key: Key): Promise<T>;
  has<T>(key: Key): Promise<T>;
  open(key: Key): void;
  put<T>(key: Key, val: any): Promise<T>;
  query(q: any): Iterable<any>;
}
export namespace utils {
  function filter(iterable: any, filterer: any): any;
  function map(iterable: any, mapper: any): any;
  function replaceStartWith(s: any, r: any): any;
  function sortAll(iterable: any, sorter: any): any;
  function take(iterable: any, n: any): any;
  function tmpdir(): any;
}
