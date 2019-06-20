import './dependencies';
import { BaseTracker } from './base';
import { Slice, SliceId } from '../';
import KitsunetBlockTracker from 'kitsunet-block-tracker';
import PollingBlockTracker from 'eth-block-tracker';
import { KsnEthQuery } from '../../ksn-eth-query';
export declare class KitsunetBridge extends BaseTracker {
    rpcUrl: string;
    blockTracker: KitsunetBlockTracker;
    rpcBlockTracker: PollingBlockTracker;
    ethQuery: any;
    constructor(options: any, blockTracker: KitsunetBlockTracker, rpcBlockTracker: PollingBlockTracker, ethQuery: KsnEthQuery, slices?: Set<Slice>);
    publish(slice: Slice): Promise<void>;
    /**
     * Handle blocks via the `latest` event
     *
     * @param {string|number} blockId - an rpc (JSON) block
     */
    _blockHandler(blockId: string | number): void;
    /**
     * Stop tracking the provided slices
     *
     * @param {Set<SliceId>} slices - the slices to stop tracking
     */
    untrack(slices: any): Promise<void>;
    /**
     * This will discover, connect and start tracking
     * the requested slices from the network.
     *
     * @param {Set<SliceId>} slices - a slice or an Set of slices to track
     */
    track(slices: any): Promise<void>;
    /**
     * Fetch a slice from the Ethereum RPC
     *
     * @param {SliceId} sliceId - the slice id to fetch
     */
    _fetchSlice(sliceId: any): Promise<any>;
    /**
     * Check wether the slice is already being tracked
     *
     * @param {SliceId} sliceId - the slice id
     * @returns {Boolean}
     */
    isTracking(sliceId: any): Promise<boolean>;
    /**
     * Get the requested slice
     *
     * @param {SliceId} slice
     */
    getSlice(slice: SliceId): Promise<Slice>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=bridge.d.ts.map