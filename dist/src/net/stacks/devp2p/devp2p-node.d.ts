import { Debugger } from 'debug';
import { Node } from '../../node';
import { Devp2pPeer } from './devp2p-peer';
import { Peer, DPT, RLPx, PeerInfo } from 'ethereumjs-devp2p';
import { NetworkType, IProtocol, IProtocolDescriptor, ICapability } from '../../interfaces';
import { IBlockchain } from '../../../blockchain';
import Common from 'ethereumjs-common';
/**
 * Devp2p node
 *
 * @fires RlpxNode#kitsunet:peer:connected - fires on new connected peer
 * @fires RlpxNode#kitsunet:peer:disconnected - fires when a peer disconnects
 */
export declare class Devp2pNode extends Node<Devp2pPeer> {
    dpt: DPT;
    rlpx: RLPx;
    chain: IBlockchain;
    peerInfo: PeerInfo;
    peer: Devp2pPeer;
    common: Common;
    private protocolRegistry;
    started: boolean;
    logger: Debugger;
    caps: ICapability[];
    readonly type: NetworkType;
    constructor(dpt: DPT, rlpx: RLPx, chain: IBlockchain, peerInfo: PeerInfo, peer: Devp2pPeer, common: Common, protocolRegistry: IProtocolDescriptor<Devp2pPeer>[]);
    /**
     * Start Devp2p/RLPx server. Returns a promise that
     * resolves once server has been started.
     * @return {Promise}
     */
    start(): Promise<void>;
    /**
     * Stop Devp2p/RLPx server. Returns a promise that
     * resolves once server has been stopped.
     *
     * @return {Promise}
     */
    stop(): Promise<any>;
    /**
     * Handles errors from server and peers
     * @private
     * @param  {Error} error
     * @param  {Peer} peer
     * @emits  error
     */
    error(error: Error, peer?: Peer): void;
    /**
     * Get the rlpx protocol for this proto
     *
     * @param {IProtocol} proto - the protocol to resolve
     */
    private getRlpxProto;
    /**
     *
     * @param rlpxPeer
     * @param reason
     */
    private disconnect;
    /**
     * Initializes RLPx instance for peer management
     * @private
     */
    private init;
    send<T, U = T>(msg: T | T[], protocol?: IProtocol<Devp2pPeer>, peer?: Devp2pPeer): Promise<U | U[]>;
    disconnectPeer(peer: Devp2pPeer, reason?: any): Promise<void>;
    banPeer(peer: Devp2pPeer, maxAge?: number, reason?: any): Promise<void>;
}
//# sourceMappingURL=devp2p-node.d.ts.map