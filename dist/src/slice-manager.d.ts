import BlockTracker from 'kitsunet-block-tracker';
import { SliceId, Slice } from './slice';
import { SliceStore } from './stores/slice-store';
import { KsnDriver } from './ksn-driver';
import { BaseTracker, KitsunetPubSub, KitsunetBridge } from './slice/trackers';
import { NetworkPeer } from './net/network-peer';
export declare class SliceManager<T extends NetworkPeer<any, any>> extends BaseTracker {
    blockTracker: BlockTracker;
    bridgeTracker: KitsunetBridge;
    pubsubTracker: KitsunetPubSub;
    slicesStore: SliceStore;
    ksnDriver: KsnDriver<T>;
    isBridge: boolean;
    constructor(pubsubTracker: KitsunetPubSub, options: any, bridgeTracker: KitsunetBridge, slicesStore: SliceStore, blockTracker: BlockTracker, ksnDriver: KsnDriver<T>);
    _setUp(): void;
    /**
     * Stop tracking the provided slices
     *
     * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
     */
    untrack(slices: any): Promise<void>;
    /**
     * This will discover, connect and start tracking
     * the requested slices from the network.
     *
     * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
     */
    track(slices: Set<SliceId>): Promise<any>;
    /**
     * Check wether the slice is already being tracked
     *
     * @param {SliceId} slice - the slice id
     * @returns {Boolean}
     */
    isTracking(slice: SliceId): Promise<boolean>;
    /**
     * Publish the slice
     *
     * @param {Slice} slice - the slice to be published
     */
    publish(slice: Slice): Promise<void>;
    /**
     * Get all slice ids currently being tracker
     * @returns {Array<SliceId>}
     */
    getSliceIds(): Slice[];
    /**
     * Get a slice
     *
     * @param {SliceId} sliceId - the slice to return
     * @return {Slice}
     */
    getSlice(sliceId: SliceId): Promise<Slice>;
    /**
     * Get all slices
     *
     * @returns {Array<Slice>} - an array of slice objects
     */
    getSlices(): Promise<Slice[] | undefined>;
    /**
     * Get the slice for a block
     *
     * @param {number|string} tag
     * @param {SliceId} slice
     */
    getSliceForBlock(tag: number | string, slice: {
        path: any;
        depth: any;
    }): Promise<Slice | undefined>;
    _resolveSlice(slice: SliceId): Promise<Slice>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=slice-manager.d.ts.map