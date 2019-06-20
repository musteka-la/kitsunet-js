import Libp2p from 'libp2p';
import Cache from 'lru-cache';
import { BaseTracker } from './base';
import { Slice, SliceId } from '../';
declare type SliceCache = Cache<string, any>;
export declare class KitsunetPubSub extends BaseTracker {
    multicast: any;
    node: any;
    namespace: string;
    depth: number;
    forwardedSlicesCache: SliceCache;
    isStarted: boolean;
    static defaultNamespace(): string;
    static defaultSliceTimeout(): number;
    constructor(node: Libp2p, namespace?: string, depth?: number, slices?: Set<Slice>);
    /**
     * Helper to subscribe to a slice
     *
     * @param {Slice} slice - slice to subscribe to
     */
    private subscribe;
    /**
     * Helper to unsubscribe from a slice
     *
     * @param {Slice} slice - slice to unsubscribe from
     */
    private unsubscribe;
    /**
     * Helper to make a slice topic
     *
     * @param {Slice|SliceId} slice - a Slice object
     * @returns {String} - a slice topic
     */
    private makeSliceTopic;
    /**
     * This is a hook that will be triggered on each pubsub message.
     *
     * This check if the slice has been already forwarded. This is
     * to check for duplicates at the application level, regardless of the msg id.
     *
     * @param {PeerInfo} peer - the peer sending the message
     * @param {Msg} msg - the pubsub message
     * @param {Function} cb - callback
     * @returns {Function}
     */
    private slicesHook;
    /**
     * Handle incoming pubsub messages.
     *
     * @param {Msg} msg - the pubsub message
     */
    private handleSlice;
    /**
     * Stop tracking the provided slices
     *
     * @param {Set<SliceId>} slices - the slices to stop tracking
     */
    untrack(slices: Set<Slice>): Promise<void>;
    /**
     * This will discover, connect and start tracking
     * the requested slices from the network.
     *
     * @param {Set<SliceId>} slices - a slice or an Set of slices to track
     */
    track(slices: any): Promise<void>;
    /**
     * Check wether the slice is already being tracked
     *
     * @param {SliceId} slice - the slice id
     * @returns {Boolean}
     */
    isTracking(slice: any): Promise<boolean>;
    /**
     * Publish the slice
     *
     * @param {Slice} slice - the slice to be published
     */
    publish(slice: any): Promise<void>;
    getSlice(slice: SliceId): Promise<Slice>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=pubsub.d.ts.map