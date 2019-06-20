/// <reference types="node" />
import { DPT, RLPx, PeerInfo, Capabilities, RLPxOptions } from 'ethereumjs-devp2p';
import Common from 'ethereumjs-common';
export declare class RLPxNodeOptions implements RLPxOptions {
    clientId?: Buffer | undefined;
    timeout?: number | undefined;
    remoteClientIdFilter?: string[] | undefined;
    listenPort: number | null;
    dpt: DPT;
    capabilities: Capabilities[];
    port: number;
    key: Buffer;
    bootnodes: string[];
    maxPeers: number;
}
export declare class DPTOptions {
    key: Buffer;
    refreshInterval: number;
    timeout: number;
    endpoint: PeerInfo;
}
export declare class DevP2PFactory {
    static createPeerInfo(options: any): PeerInfo;
    static createDptOptions(peerInfo: PeerInfo): DPTOptions;
    static createRlpxOptions(common: Common, dpt: DPT, peerInfo: PeerInfo): RLPxNodeOptions;
    static createDPT(options: DPTOptions): DPT;
    createRLPx(options: RLPxNodeOptions): RLPx;
}
//# sourceMappingURL=devp2p-factory.d.ts.map