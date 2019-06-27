import { Devp2pPeer, Libp2pPeer } from './stacks';
import { KsnProtocol, EthProtocol } from './protocols';
import { NetworkPeer } from './network-peer';
import { Node } from './node';
import { IPeerDescriptor } from './interfaces';
import PeerInfo from 'peer-info';
export declare type ExtractFromDevp2pPeer = Node<Pick<Devp2pPeer, keyof IPeerDescriptor<Peer>>>;
export declare type ExtractFromLibp2pPeer = Node<Pick<Libp2pPeer, keyof IPeerDescriptor<PeerInfo>>>;
export declare type PeerTypes = Libp2pPeer | Devp2pPeer;
export declare type ProtocolTypes = KsnProtocol<PeerTypes> | EthProtocol<PeerTypes>;
export declare type Peer = NetworkPeer<PeerTypes, ProtocolTypes>;
//# sourceMappingURL=helper-types.d.ts.map