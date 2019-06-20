/// <reference types="node" />
import EE from 'events';
import { SliceManager } from './slice-manager';
import { KsnDriver } from './ksn-driver';
import { NetworkPeer } from './net/peer';
import Block from 'ethereumjs-block';
import { Node } from './net';
export declare class Kitsunet<T extends NetworkPeer<any, any>> extends EE {
    sliceManager: SliceManager<T>;
    ksnDriver: KsnDriver<T>;
    depth: number;
    static getDefaultDepth(options: any): number;
    constructor(sliceManager: SliceManager<T>, ksnDriver: KsnDriver<T>, depth?: number);
    readonly addrs: string[];
    readonly networkNodes: Node<T>[];
    readonly peers: Map<string, T>;
    /**
     * Get a slice
     *
     * @param {SliceId|String} slice - the slice to return
     * TODO: remove this - need to modify Geth to handle storage slices just any any other slice
     * @param {Boolean} storage - weather the slice is a storage slice
     * @return {Slice}
     */
    getSlice(slice: any, storage: any): Promise<import("./slice").Slice>;
    /**
     * Get the slice for a block
     *
     * @param {String|Number} block - the block tag to get the slice for
     * @param {SliceId|String} slice - the slice id to retrieve
     */
    getSliceForBlock(block: any, slice: any): Promise<import("./slice").Slice | undefined>;
    /**
     * Get the latest block
     */
    getLatestBlock(): Promise<Block | undefined>;
    /**
     * Get a block by number
     *
     * @param {String|Number} block - the block number, if string is passed assumed to be in hex
     */
    getBlockByNumber(block: number): Promise<Block | undefined>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=kitsunet.d.ts.map