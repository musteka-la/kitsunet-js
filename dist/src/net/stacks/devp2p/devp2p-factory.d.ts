/// <reference types="node" />
import { DPT, RLPx, PeerInfo, Capabilities, RLPxOptions } from 'ethereumjs-devp2p';
import Common from 'ethereumjs-common';
import { Devp2pPeer } from './devp2p-peer';
export declare class RLPxNodeOptions implements RLPxOptions {
    clientId?: Buffer;
    timeout?: number;
    remoteClientIdFilter?: string[];
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
    static createPeerInfo(options: any, rlpxKey: Buffer): PeerInfo;
    static rlpxKey(options: any): Buffer;
    static createDptOptions(peerInfo: PeerInfo, rlpxKey: Buffer): DPTOptions;
    static createRlpxOptions(common: Common, dptOptions: DPTOptions, dpt: DPT, peerInfo: PeerInfo, rlpxKey: Buffer): RLPxNodeOptions;
    static createDPT(options: DPTOptions): DPT;
    createRLPx(options: RLPxNodeOptions): RLPx;
    static createLibp2pPeer(peerInfo: PeerInfo): Promise<Devp2pPeer>;
}
//# sourceMappingURL=devp2p-factory.d.ts.map