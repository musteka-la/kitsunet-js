export = PeerInfo;
declare class PeerInfo {
  static create(peerId: any, callback?: (err: Error, peer: PeerInfo) => never): never | Promise<PeerInfo>;
  static isPeerInfo(peerInfo: any): boolean;
  constructor(peerId: any);
  id: any;
  multiaddrs: any;
  protocols: any;
  connect(ma: any): void;
  disconnect(): void;
  isConnected(): any;
}
