/// <reference types="node" />
import Block from 'ethereumjs-block';
import { IDownloader, DownloaderType } from '../interfaces';
import { EthProtocol, BlockBody, IPeerDescriptor } from '../../net';
import BN from 'bn.js';
import { EthChain } from '../../blockchain';
export declare abstract class BaseDownloader<T extends IPeerDescriptor<any>> implements IDownloader {
    protocol: EthProtocol<T>;
    type: DownloaderType;
    chain: EthChain;
    constructor(protocol: EthProtocol<T>, type: DownloaderType, chain: EthChain);
    latest(): Promise<Block | undefined>;
    getHeaders(block: BN | Buffer | number, max: number, skip?: number, reverse?: boolean): Promise<Block.Header[]>;
    getBodies(hashes: Buffer[]): Promise<BlockBody[]>;
    abstract download(protocol: EthProtocol<any>): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map