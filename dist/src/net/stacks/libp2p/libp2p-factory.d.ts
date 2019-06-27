import PeerInfo from 'peer-info';
import Libp2p from 'libp2p';
import { PromisifyAll } from 'promisify-this';
import { Libp2pPeer } from './libp2p-peer';
export declare type Libp2pPromisified = PromisifyAll<Pick<Libp2p, 'start' | 'stop' | 'dial' | 'dialProtocol' | 'multicast'>> & Libp2p;
export declare class Libp2pOptions {
    identity?: {
        privKey?: string;
    };
    addrs?: string[];
    bootstrap?: string[];
}
export declare class LibP2PFactory {
    static getLibp2pOptions(options: any): Libp2pOptions;
    /**
     * Create libp2p node
     *
     * @param identity {{privKey: string}} - an object with a private key entry
     * @param addrs {string[]} - an array of multiaddrs
     * @param bootstrap {string[]} - an array of bootstrap multiaddr strings
     */
    static createLibP2PNode(options: Libp2pOptions, peerInfo: PeerInfo): Promise<Libp2pPromisified>;
    /**
     * Create a PeerInfo
     *
     * @param identity {{privKey: string}} - an object with a private key entry
     * @param addrs {string[]} - an array of multiaddrs
     */
    static createPeerInfo(options: Libp2pOptions): Promise<PeerInfo>;
    static createLibp2pPeer(peerInfo: PeerInfo): Promise<Libp2pPeer>;
}
//# sourceMappingURL=libp2p-factory.d.ts.map