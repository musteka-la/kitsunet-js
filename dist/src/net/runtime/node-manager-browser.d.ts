/// <reference types="node" />
import { Node } from '../node';
import { EventEmitter } from 'events';
import { IPeerDescriptor } from '../interfaces';
import { Libp2pNode } from '../stacks/libp2p';
import { KsnProtocol, EthProtocol } from '../protocols';
/**
 * A node manager to start/stop nodes as well
 * as subscribed to discovery events
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:disconnected - fires when a peer disconnects
 */
export declare class NodeManager<T extends IPeerDescriptor<any>> extends EventEmitter {
    static createNodes<U extends Node<any>>(libp2pNode: Libp2pNode): Node<U>[];
    /**
     * Create a protocol registry
     */
    static protocolRegistry(): ({
        constructor: typeof KsnProtocol;
        cap: {
            id: string;
            versions: string[];
        };
    } | {
        constructor: typeof EthProtocol;
        cap: {
            id: string;
            versions: string[];
        };
    })[];
    private connectedHandler;
    private disconnectedHandler;
    nodes: Node<T>[];
    constructor(nodes: Node<T>[]);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=node-manager-browser.d.ts.map