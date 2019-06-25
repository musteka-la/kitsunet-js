import { PeerInfo, Peer } from 'ethereumjs-devp2p';
import { NetworkPeer } from '../../peer';
export declare class Devp2pPeer extends NetworkPeer<Peer, Devp2pPeer> {
    peer: Peer;
    addrs: Set<string>;
    private _id;
    readonly id: string;
    peerInfo: PeerInfo;
    constructor(peer: Peer);
}
//# sourceMappingURL=devp2p-peer.d.ts.map