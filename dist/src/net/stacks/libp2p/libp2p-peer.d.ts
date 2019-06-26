import PeerInfo from 'peer-info';
import { NetworkPeer } from '../../network-peer';
import { Node } from '../../node';
export declare class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
    node: Node<Libp2pPeer>;
    peer: PeerInfo;
    readonly id: string;
    readonly addrs: Set<string>;
    constructor(peer: PeerInfo, node: Node<Libp2pPeer>);
    disconnect<R extends any>(reason?: R): Promise<void>;
    ban<R extends any>(reason?: R, maxAge?: number): Promise<void>;
}
//# sourceMappingURL=libp2p-peer.d.ts.map