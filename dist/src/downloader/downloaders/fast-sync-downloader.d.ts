import { EthProtocol, IPeerDescriptor } from '../../net';
import { EthChain } from '../../blockchain';
import { BaseDownloader } from './base';
export declare class FastSyncDownloader<T extends IPeerDescriptor<any>> extends BaseDownloader<T> {
    protocol: EthProtocol<T>;
    peer: IPeerDescriptor<T>;
    chain: EthChain;
    constructor(protocol: EthProtocol<T>, peer: IPeerDescriptor<T>, chain: EthChain);
    download(): Promise<void>;
}
//# sourceMappingURL=fast-sync-downloader.d.ts.map