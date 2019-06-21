import PeerInfo from 'peer-info';
export declare class Libp2pConfig {
    /**
     * Return a libp2p config
     *
     * @param peerInfo {PeerInfo} - the peerInfo for this peer
     * @param bootstrap {string[]} - the bootstraps addrs array
     */
    static getConfig(peerInfo: PeerInfo, bootstrap?: string[]): Promise<any>;
}
//# sourceMappingURL=browser.d.ts.map