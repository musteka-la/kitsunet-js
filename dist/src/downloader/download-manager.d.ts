/// <reference types="node" />
import { EthChain } from '../blockchain/eth-chain';
import { EventEmitter as EE } from 'events';
import { PeerManager, Peer } from '../net';
import { IDownloader } from './interfaces';
import LRUCache from 'lru-cache';
export declare class DownloadManager extends EE {
    chain: EthChain;
    peerManager: PeerManager;
    downloader: IDownloader;
    peers: LRUCache<string, Peer>;
    syncInterval: NodeJS.Timeout | undefined;
    maxPeers: number;
    downloadInterval: number;
    syncMode: string;
    static createDownloader(chain: EthChain, peerManager: PeerManager, options: any): Promise<IDownloader | undefined>;
    constructor(chain: EthChain, peerManager: PeerManager, options: any, downloader: IDownloader);
    private download;
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