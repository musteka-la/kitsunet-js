export = index;
declare function index(a: any, ...args: any[]): any;
declare namespace index {
  function asyncMap(map: any): any;
  function collect(cb: any): any;
  function concat(cb: any): any;
  function count(max: any): any;
  function drain(op?: any, done?: any): any;
  function empty(): any;
  function error(err: any): any;
  function filter(test: any): any;
  function filterNot(test: any): any;
  function find(test: any, cb: any): any;
  function flatten(): any;
  function infinite(generate: any): any;
  function keys(object: any): any;
  function log(done: any): any;
  function map(mapper: any): any;
  function nonUnique(field: any): any;
  function onEnd(done: any): any;
  function once(value: any, onAbort: any): any;
  // Circular reference from index
  const pull: any;
  function reduce(reducer: any, acc: any, cb: any, ...args: any[]): any;
  function take(test: any, opts: any): any;
  function through(op: any, onEnd: any): any;
  function unique(field: any, invert: any): any;
  function values(array: any, onAbort?: any): any;
}
