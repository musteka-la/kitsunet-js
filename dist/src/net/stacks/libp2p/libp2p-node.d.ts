import Libp2p from 'libp2p';
import PeerInfo from 'peer-info';
import { Node } from '../../node';
import { Libp2pPeer } from './libp2p-peer';
import { IProtocol, NetworkType, IProtocolDescriptor, ICapability } from '../../interfaces';
import { Libp2pDialer } from './libp2p-dialer';
import { IBlockchain } from '../../../blockchain';
/**
 * Libp2p node
 *
 * @fires Libp2pNode#kitsunet:peer:connected - fires on new connected peer
 * @fires Libp2pNode#kitsunet:peer:disconnected - fires on new discovered peer
 */
export declare class Libp2pNode extends Node<Libp2pPeer> {
    node: Libp2p;
    peer: Libp2pPeer;
    private libp2pDialer;
    chain: IBlockchain;
    protocolRegistry: IProtocolDescriptor<Libp2pPeer>[];
    started: boolean;
    caps: ICapability[];
    readonly type: NetworkType;
    constructor(node: Libp2p, peer: Libp2pPeer, libp2pDialer: Libp2pDialer, chain: IBlockchain, protocolRegistry: IProtocolDescriptor<Libp2pPeer>[]);
    handlePeer(peer: PeerInfo): Promise<Libp2pPeer | undefined>;
    mount(protocol: IProtocol<Libp2pPeer>): void;
    unmount(protocol: IProtocol<Libp2pPeer>): void;
    private handleIncoming;
    private mkCodec;
    send<T, U = T>(msg: T, protocol?: IProtocol<Libp2pPeer>, peer?: Libp2pPeer): Promise<void | U | U[]>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=libp2p-node.d.ts.map