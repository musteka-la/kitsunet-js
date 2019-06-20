import PeerInfo from 'peer-info';
export declare class Libp2pConfig {
    /**
     * Return a libp2p config
     *
     * @param peerInfo {PeerInfo} - the peerInfo for this peer
     * @param addrs {string[]} - the addrs array
     * @param bootstrap {string[]} - the bootstraps addrs array
     */
    static getConfig(peerInfo: PeerInfo, addrs?: string[], bootstrap?: string[]): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map