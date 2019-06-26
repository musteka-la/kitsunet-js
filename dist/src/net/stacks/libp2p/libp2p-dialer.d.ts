/// <reference types="node" />
import EE from 'events';
import PeerInfo from 'peer-info';
import Libp2p from 'libp2p';
/**
 * A dialer module that handles ambient
 * node discovery and such.
 *
 * FIXME: This is here also to mitigate various
 * issues with concurrent dialing in libp2p
 */
export declare class Libp2pDialer extends EE {
    node: Libp2p;
    intervalTimer: NodeJS.Timeout | null;
    connected: Map<string, PeerInfo>;
    discovered: Map<string, PeerInfo>;
    dialing: Map<string, boolean>;
    banned: Map<string, boolean>;
    interval: number;
    maxPeers: number;
    constructor(node: Libp2p, options: any);
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly b58Id: any;
    banPeer(peerInfo: PeerInfo, maxAge?: number): void;
    tryConnect(): Promise<void>;
    dial(peerInfo: PeerInfo, protocol?: string): Promise<any>;
    hangup(peer: PeerInfo): Promise<void>;
}
//# sourceMappingURL=libp2p-dialer.d.ts.map