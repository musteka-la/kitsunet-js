/// <reference types="node" />
import { EventEmitter as EE } from 'events';
import { NodeManager } from './node-manager';
import { ICapability } from './interfaces';
import { Peer } from './helper-types';
import LRUCache from 'lru-cache';
interface PeerHolder {
    peer: Peer;
    used?: boolean;
    banned?: boolean;
}
export declare class PeerManager extends EE {
    nodeManager: NodeManager<Peer>;
    peers: LRUCache<string, PeerHolder>;
    constructor(nodeManager: NodeManager<Peer>);
    getById(id: string): Peer | undefined;
    getByCapability(cap: ICapability): Peer[];
    getRandomByCapability(cap: ICapability): Peer | undefined;
    getUnusedPeers(): Peer[];
    getRandomPeer(): Peer | undefined;
    releasePeers(peers: Peer[]): void;
    reserve(peers: Peer[]): void;
    ban(peers: Peer[]): void;
    isUsed(peer: Peer): boolean | undefined;
}
export {};
//# sourceMappingURL=peer-manager.d.ts.map