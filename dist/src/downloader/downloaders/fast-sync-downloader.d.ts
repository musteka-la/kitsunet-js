import BN from 'bn.js';
import { DownloaderType } from '../interfaces';
import { Peer, IEthProtocol, PeerManager } from '../../net';
import { EthChain } from '../../blockchain';
import { BaseDownloader } from './base';
import { AsyncQueue } from 'async';
interface TaskPayload {
    number: BN;
    protocol: IEthProtocol;
    max?: number;
    reverse?: boolean;
    skip?: number;
}
export declare class FastSyncDownloader extends BaseDownloader {
    chain: EthChain;
    type: DownloaderType;
    queue: AsyncQueue<TaskPayload>;
    highestBlock: BN;
    constructor(chain: EthChain, peerManager: PeerManager);
    protected task({ number, protocol, max, skip, reverse }: {
        number: any;
        protocol: any;
        max: any;
        skip: any;
        reverse: any;
    }): Promise<void>;
    best(): Promise<Peer | undefined>;
    download(peer: Peer): Promise<void>;
}
export {};
//# sourceMappingURL=fast-sync-downloader.d.ts.map