import CID from 'cids';
import Libp2p from 'libp2p';
import { Discovery } from './base';
import { SliceId } from '../slice-id';
export declare class DhtDiscovery extends Discovery {
    contentRouting: any;
    /**
     * Discover nodes for slices using the kademlia DHT
     *
     * @param {Libp2p} node - the libp2p kademlia dht instance
     */
    constructor(node: Libp2p);
    _makeKeyId(sliceId: SliceId): Promise<CID>;
    /**
     * Discover peers tracking this slice
     *
     * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
     * @returns {Array<PeerInfo>} peers - an array of peers tracking the slice
     */
    findPeers(sliceId: SliceId[]): Promise<any[]>;
    /**
     * Announces slice to the network using whatever
     * mechanisms are available, e.g DHT, RPC, etc...
     *
     * @param {Array<SliceId>} slices - the slices to announce to the network
     */
    announce(slices: SliceId[]): Promise<void>;
}
//# sourceMappingURL=dht.d.ts.map