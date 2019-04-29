type Callback<T> = <T>(err?: Error, res?: T) => T

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
  close<T>(callback?: Callback<T>): void | Promise<T>;
  get<T>(key: Key, callback?: Callback<T>): void | Promise<T>;
  has<T>(key: Key, callback?: Callback<T>): void | Promise<T>;
  open(callback: Key): void;
  put<T>(key: Key, val: any, callback?: Callback<T>): void | Promise<T>;
  query(q: any): any;
}

export class MemoryDatastore implements Datastore {
  data: any;
  batch(): any;
  close(callback: any): void;
  get(key: any, callback: any): void;
  has(key: any, callback: any): void;
  open(callback: any): void;
  put(key: any, val: any, callback: any): void;
  query(q: any): any;
}
export namespace utils {
  function asyncFilter(test: any): any;
  function asyncSort(sorter: any): any;
  function replaceStartWith(s: any, r: any): any;
  function tmpdir(): any;
}
