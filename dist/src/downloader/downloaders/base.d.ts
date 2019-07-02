/// <reference types="node" />
import Block from 'ethereumjs-block';
import { IDownloader, DownloaderType } from '../interfaces';
import { BlockBody, IEthProtocol, Peer, PeerManager } from '../../net';
import BN from 'bn.js';
import { EthChain } from '../../blockchain';
export declare const MAX_PER_REQUEST: number;
export declare const CONCCURENT_REQUESTS: number;
export declare const MAX_REQUEST: number;
export declare const MAX_LOOK_BACK: number;
export declare abstract class BaseDownloader implements IDownloader {
    chain: EthChain;
    peerManager: PeerManager;
    abstract type: DownloaderType;
    constructor(chain: EthChain, peerManager: PeerManager);
    findAncestor(protocol: IEthProtocol, peer: Peer, local: BN, max?: number): Promise<Block | undefined>;
    latest(protocol: IEthProtocol, peer: Peer): Promise<Block | undefined>;
    protected getHeaders(protocol: IEthProtocol, peer: Peer, block: BN | Buffer | number, max: number, skip?: number, reverse?: boolean): Promise<Block.Header[]>;
    protected getBodies(protocol: IEthProtocol, peer: Peer, hashes: Buffer[]): Promise<BlockBody[]>;
    store(blocks: Block[]): Promise<void>;
    abstract download(peer: Peer): Promise<void>;
    abstract best(): Promise<Peer | undefined>;
}
//# sourceMappingURL=base.d.ts.map