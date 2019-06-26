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
    protected requestWithTimeout<T>(outId: ETH.MESSAGE_CODES, inId: ETH.MESSAGE_CODES, payload?: any[], timeout?: number): Promise<T>;
    /**
     * Get block headers
     *
     * @param block {number | Buffer | BN} - the block for which to get the header
     * @param max {number} - max number of headers to download from peer
     * @param skip {number} - skip a number of headers
     * @param reverse {boolean} - in reverse order
     */
    getHeaders(block: number | Buffer | BN, max: number, skip?: number, reverse?: boolean): AsyncIterable<Block.Header[]>;
    /**
     * Get block bodies for block hashes
     *
     * @param hashes {Buffer[] | string[]} - block hashes for which to get the bodies
     */
    getBlockBodies(hashes: Buffer[] | string[]): AsyncIterable<BlockBody[]>;
    /**
     * Notify remote peer of new hashes
     *
     * @param hashes {Buffer[] | string[]} - array of new hashes to notify the peer
     */
    sendNewHashes(hashes: string[] | Buffer[]): Promise<void>;
    /**
     * Perform protocol handshake. In the case of ETH protocol,
     * it sends the `Status` message.
     */
    handshake(): Promise<void>;
}
//# sourceMappingURL=eth-protocol.d.ts.map