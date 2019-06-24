/// <reference types="node" />
import { EthChain } from '../blockchain/eth-chain';
import { EventEmitter as EE } from 'events';
import { PeerManager, Peer } from '../net';
import LRUCache from 'lru-cache';
export declare class DownloadManager extends EE {
    peerManager: PeerManager;
    chain: EthChain;
    peers: LRUCache<string, Peer>;
    syncInterval: NodeJS.Timeout | undefined;
    maxPeers: number;
    downloadInterval: number;
    syncMode: string;
    constructor(peerManager: PeerManager, chain: EthChain, options: any);
    download(peer: Peer): Promise<void>;
    /**
     * Start sync
     */
    start(): Promise<void>;
    /**
     * Stop sync
     */
    stop(): Promise<void>;
}
//# sourceMappingURL=download-manager.d.ts.map