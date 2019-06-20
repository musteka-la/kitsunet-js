/// <reference types="node" />
import Block from 'ethereumjs-block';
import { BaseProtocol } from '../../base-protocol';
import { IEthProtocol, BlockBody, Status } from './interfaces';
import { IPeerDescriptor, Node, IEncoder } from '../..';
import { EthChain } from '../../../blockchain';
import { EthHandler } from './eth-handler';
import { ETH } from 'ethereumjs-devp2p';
import BN from 'bn.js';
export declare const MSG_CODES: typeof ETH.MESSAGE_CODES;
export declare class Deferred<T> {
    promise: Promise<T>;
    resolve: (...args: any[]) => any;
    reject: (...args: any[]) => any;
    constructor();
}
export declare class EthProtocol<P extends IPeerDescriptor<any>> extends BaseProtocol<P> implements IEthProtocol {
    ethChain: EthChain;
    protocolVersion: number;
    handlers: {
        [key: number]: EthHandler<P>;
    };
    private _status;
    getStatus(): Promise<Status>;
    setStatus(status: Status): Promise<void>;
    /**
     * Construct an Ethereum protocol
     *
     * @param blockChain - the blockchain to use for this peer
     * @param peer - the peer descriptor for this peer
     * @param networkProvider - the network provider
     * @param encoder - an encoder to use with the peer
     */
    constructor(peer: P, networkProvider: Node<P>, ethChain: EthChain, encoder?: IEncoder);
    readonly id: string;
    readonly versions: string[];
    receive<T, U>(readable: AsyncIterable<T>): AsyncIterable<U | U[] | null>;
    send<T, U>(msg: T): Promise<U | U[] | void | null>;
    getHeaders(block: number | Buffer | BN, max: number, skip?: number, reverse?: boolean): AsyncIterable<Block.Header[]>;
    getBlockBodies(hashes: Buffer[] | string[]): AsyncIterable<BlockBody[]>;
    sendNewHashes(hashes: string[] | Buffer[]): Promise<void>;
    handshake(): Promise<void>;
}
//# sourceMappingURL=eth-protocol.d.ts.map