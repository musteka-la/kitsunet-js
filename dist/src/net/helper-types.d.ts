import { Devp2pPeer, Libp2pPeer } from './stacks';
import { KsnProtocol, EthProtocol } from './protocols';
import { NetworkPeer } from './network-peer';
export declare type PeerTypes = Libp2pPeer | Devp2pPeer;
export declare type ProtocolTypes = KsnProtocol<PeerTypes> | EthProtocol<PeerTypes>;
export declare type Peer = NetworkPeer<PeerTypes, ProtocolTypes>;
//# sourceMappingURL=helper-types.d.ts.map