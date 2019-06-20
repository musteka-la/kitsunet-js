import PeerInfo from 'peer-info';
import { NetworkPeer } from '../../peer';
export declare class Libp2pPeer extends NetworkPeer<PeerInfo, Libp2pPeer> {
    used: boolean;
    peer: PeerInfo;
    readonly id: string;
    readonly addrs: Set<string>;
    constructor(peer: PeerInfo);
}
//# sourceMappingURL=libp2p-peer.d.ts.map