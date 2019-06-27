import PeerInfo from 'peer-info';
import { NetworkPeer } from '../../network-peer';
import { ExtractFromLibp2pPeer } from '../../helper-types';
export declare class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
    node?: ExtractFromLibp2pPeer;
    peer: PeerInfo;
    readonly id: string;
    readonly addrs: Set<string>;
    constructor(peer: PeerInfo, node?: ExtractFromLibp2pPeer);
    disconnect<R extends any>(reason?: R): Promise<void>;
    ban<R extends any>(reason?: R, maxAge?: number): Promise<void>;
}
//# sourceMappingURL=libp2p-peer.d.ts.map