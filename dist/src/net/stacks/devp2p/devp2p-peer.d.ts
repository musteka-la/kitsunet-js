import { PeerInfo, Peer } from 'ethereumjs-devp2p';
import { NetworkPeer } from '../../network-peer';
import { Node } from '../../node';
export declare class Devp2pPeer extends NetworkPeer<Peer, Devp2pPeer> {
    node: Node<Devp2pPeer>;
    peer: Peer;
    addrs: Set<string>;
    private _id;
    readonly id: string;
    peerInfo: PeerInfo;
    constructor(peer: Peer, node: Node<Devp2pPeer>);
    disconnect<R>(reason?: R): Promise<void>;
    ban<R extends any>(reason?: R): Promise<void>;
}
//# sourceMappingURL=devp2p-peer.d.ts.map