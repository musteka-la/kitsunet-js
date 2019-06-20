/// <reference types="node" />
import EE from 'events';
import { KsnNodeType } from './constants';
import { Discovery } from './slice/discovery/base';
import { Slice } from './slice';
import KistunetBlockTracker from 'kitsunet-block-tracker';
import Block from 'ethereumjs-block';
import { NodeManager, Libp2pPeer, NetworkPeer } from './net';
import { IBlockchain } from './blockchain';
import { DownloadManager } from './downloader';
export declare class KsnDriver<T extends NetworkPeer<any, any>> extends EE {
    isBridge: any;
    discovery: Discovery;
    nodeManager: NodeManager<T>;
    downloadManager: DownloadManager;
    blockTracker: KistunetBlockTracker;
    chain: IBlockchain;
    libp2pPeer: Libp2pPeer;
    nodeType: KsnNodeType;
    peers: Map<string, T>;
    _stats: any;
    constructor(isBridge: any, discovery: Discovery, nodeManager: NodeManager<T>, downloadManager: DownloadManager, blockTracker: KistunetBlockTracker, chain: IBlockchain, libp2pPeer: Libp2pPeer);
    readonly clientPeers: T[];
    /**
     * Get the latest block
     */
    getLatestBlock(): Promise<Block | undefined>;
    /**
     * Get a block by number
     * @param {String|Number} blockId - the number/tag of the block to retrieve
     */
    getBlockByNumber(blockId: number): Promise<Block | undefined>;
    getHeaders(blockId: Buffer | number, maxBlocks?: number, skip?: number, reverse?: boolean): Promise<unknown[] | undefined>;
    /**
     * Discover peers tracking this slice
     *
     * @param {Array<SliceId>|SliceId} slice - the slices to find the peers for
     * @returns {Array<Peer>} peers - an array of peers tracking the slice
     */
    findPeers(slice: any): Promise<any>;
    /**
     * Discover and connect to peers tracking this slice
     *
     * @param {Array<SliceId>} slices - the slices to find the peers for
     */
    findSlicePeers(slices: any): Promise<unknown[] | undefined>;
    /**
     * Resolve slices from remotes
     *
     * @param {Array<slices>} slices - slices to resolve from peers
     * @param {Array<RpcPeer>} peers - peers to query
     */
    _rpcResolve(slices: Slice[], peers: NetworkPeer<any, any>[]): Promise<any[] | undefined>;
    /**
     * Find the requested slices, by trying different
     * underlying mechanisms
     *
     * 1) RPC - ask each peer for the slice, if that fails
     * 2) Discovery - ask different discovery mechanisms to
     * find peers tracking the requested slices
     * 3) RPC - repeat 1st step with the new peers
     *
     * @param {Array<SliceId>} slices
     */
    resolveSlices(slices: any): Promise<any[] | Slice | undefined>;
    /**
     * Announces slice to the network using whatever mechanisms
     * are available, e.g DHT, RPC, etc...
     *
     * @param {Array<SliceId>} slices - the slices to announce to the network
     */
    announce(slices: any): Promise<any>;
    /**
     * Start the driver
     */
    start(): Promise<void>;
    /**
     * Stop the driver
     */
    stop(): Promise<void>;
    getState(): any;
}
//# sourceMappingURL=ksn-driver.d.ts.map