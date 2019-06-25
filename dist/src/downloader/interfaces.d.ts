import { Peer, PeerManager } from '../net';
import { IBlockchain } from '../blockchain';
export declare enum DownloaderType {
    FAST = 0
}
export interface IDownloaderConstructor {
    new (chain: IBlockchain, peerManager: PeerManager): IDownloader;
}
/**
 * Interface for downloaders
 */
export interface IDownloader {
    type: DownloaderType;
    download(peer: Peer): Promise<void>;
    best(): Promise<Peer | undefined>;
}
//# sourceMappingURL=interfaces.d.ts.map