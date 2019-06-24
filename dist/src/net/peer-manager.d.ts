/// <reference types="node" />
import { EventEmitter as EE } from 'events';
import { NodeManager } from './node-manager';
import { ICapability } from './interfaces';
import { Peer } from './helper-types';
import LRUCache from 'lru-cache';
export declare class PeerManager extends EE {
    nodeManager: NodeManager<Peer>;
    peers: LRUCache<string, Peer>;
    constructor(nodeManager: NodeManager<Peer>);
    getById(id: string): Peer | undefined;
    getByCapability(cap: ICapability): Peer[];
    getRandomByCapability(cap: ICapability): Peer | undefined;
    getUnusedPeers(): Peer[];
    getRandomPeer(): Peer | undefined;
    releasePeers(peers: Peer[]): void;
    reserve(peers: Peer[]): void;
}
//# sourceMappingURL=peer-manager.d.ts.map