import BN from 'bn.js';
import { DownloaderType } from '../interfaces';
import { Peer, IEthProtocol, PeerManager } from '../../net';
import { EthChain } from '../../blockchain';
import { BaseDownloader } from './base';
import { AsyncQueue } from 'async';
interface TaskPayload {
    protocol: IEthProtocol;
    from: BN;
    to: BN;
    reverse?: boolean;
    skip?: number;
    peer: Peer;
}
export declare class FastSyncDownloader extends BaseDownloader {
    chain: EthChain;
    type: DownloaderType;
    queue: AsyncQueue<TaskPayload>;
    highestBlock: BN;
    constructor(chain: EthChain, peerManager: PeerManager);
    protected task({ from, to, skip, reverse, protocol, peer }: {
        from: any;
        to: any;
        skip: any;
        reverse: any;
        protocol: any;
        peer: any;
    }): Promise<void>;
    best(): Promise<Peer | undefined>;
    download(peer: Peer): Promise<void>;
}
export {};
//# sourceMappingURL=fast-sync-downloader.d.ts.map