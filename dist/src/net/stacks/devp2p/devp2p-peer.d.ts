import { PeerInfo, Peer } from 'ethereumjs-devp2p';
import { NetworkPeer } from '../../network-peer';
import { ExtractFromDevp2pPeer } from '../../helper-types';
export declare class Devp2pPeer extends NetworkPeer<Peer, Devp2pPeer> {
    node?: ExtractFromDevp2pPeer;
    peer: Peer;
    addrs: Set<string>;
    peerInfo: PeerInfo;
    private _id;
    readonly id: string;
    constructor(peer: Peer | PeerInfo, node?: ExtractFromDevp2pPeer);
    disconnect<R>(reason?: R): Promise<void>;
    ban<R extends any>(reason?: R, maxAge?: number): Promise<void>;
}
//# sourceMappingURL=devp2p-peer.d.ts.map