import BN from 'bn.js';
import { DownloaderType } from '../interfaces';
import { Peer, PeerManager, IProtocol, ProtocolTypes } from '../../net';
import { BaseDownloader } from './base';
import { EthChain } from '../../blockchain';
import { AsyncQueue } from 'async';
interface TaskPayload {
    protocol: IProtocol<ProtocolTypes>;
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
    protected task({ from, to, skip, reverse, protocol, peer }: TaskPayload): Promise<void>;
    best(): Promise<Peer | undefined>;
    download(peer: Peer): Promise<void>;
}
export {};
//# sourceMappingURL=fast-sync-downloader.d.ts.map