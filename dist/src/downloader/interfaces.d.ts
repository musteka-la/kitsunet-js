import { EthProtocol } from '../net';
export declare enum DownloaderType {
    FAST = 0
}
/**
 * Interface for downloaders
 */
export interface IDownloader {
    type: DownloaderType;
    download(protocol: EthProtocol<any>): Promise<void>;
}
//# sourceMappingURL=interfaces.d.ts.map