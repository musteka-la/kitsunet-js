export = index;
declare function index(source: any): any;
declare namespace index {
  function duplex(duplex: any): void;
  function sink(sink: any): any;
  // Circular reference from index
  const source: any;
  function through(source: any): void;
  function transform(source: any): void;
}
