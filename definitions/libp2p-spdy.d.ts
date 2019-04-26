export = index;
declare function index(rawConn: any, isListener: any): any;
declare namespace index {
  function dialer(conn: any): void;
  function listener(conn: any): void;
  const multicodec: string;
}
