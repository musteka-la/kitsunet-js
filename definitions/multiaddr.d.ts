export = index;
declare class index {
  static fromNodeAddress(addr: any, transport: any): any;
  static isMultiaddr(obj: any): void;
  static isName(addr: any): any;
  static resolve(addr: any, callback: any): any;
  constructor(args: any);
  decapsulate(addr: any): any;
  encapsulate(addr: any): any;
  equals(addr: any): any;
  getPath(): any;
  getPeerId(): any;
  inspect(): any;
  isThinWaistAddress(addr: any): any;
  nodeAddress(): any;
  protoCodes(): any;
  protoNames(): any;
  protos(): any;
  stringTuples(): any;
  toJSON(): any;
  toOptions(): any;
  tuples(): any;
}
declare namespace index {
  function protocols(proto: any): any;
  namespace protocols {
    const V: number;
    const codes: {
      "132": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "273": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "275": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "276": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "277": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "290": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "301": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "302": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "33": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "4": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "400": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "41": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "42": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "421": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "443": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "444": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "445": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "446": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "460": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "477": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "478": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "479": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "480": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "53": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "54": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "55": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "56": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "6": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
    };
    const lengthPrefixedVarSize: number;
    const names: {
      dccp: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      dns: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      dns4: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      dns6: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      dnsaddr: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      garlic64: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      http: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      https: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      ip4: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      ip6: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      ip6zone: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      ipfs: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      onion: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      onion3: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      p2p: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "p2p-circuit": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "p2p-stardust": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "p2p-webrtc-direct": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "p2p-webrtc-star": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      "p2p-websocket-star": {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      quic: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      sctp: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      tcp: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      udp: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      udt: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      unix: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      utp: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      ws: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
      wss: {
        code: number;
        name: string;
        path: boolean;
        resolvable: boolean;
        size: number;
      };
    };
    function object(code: any, size: any, name: any, resolvable: any, path: any): any;
    const table: number[][];
  }
}
