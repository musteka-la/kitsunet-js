/// <reference types="node" />
import BN from 'bn.js';
import { Block, Blockchain } from 'ethereumjs-blockchain';
import Common from 'ethereumjs-common';
import { EventEmitter as EE } from 'events';
import { LevelUp } from 'levelup';
import { PromisifyAll } from 'promisify-this';
import { IBlockchain } from './interfaces';
export declare class EthChain extends EE implements IBlockchain {
    private blockchain;
    common: Common;
    db: LevelUp;
    static blockChain(common: Common, db: LevelUp): PromisifyAll<Blockchain>;
    static common(options: any): Common;
    static getChainDb(options: any): Promise<LevelUp>;
    /**
     * Create a blockchain
     *
     * @param {Object} options
     * @param {Blockchain} Options.blockchain
     * @param {BaseSync} Options.sync
     */
    constructor(blockchain: Blockchain, common: Common, db: LevelUp);
    /**
     * Get the total difficulty of the chain
     *
     * @returns {Number}
     */
    getBlocksTD(): Promise<BN>;
    /**
     * Get the total difficulty of the chain
     *
     * @returns {Number}
     */
    getHeadersTD(): Promise<BN>;
    /**
     * Get the current blocks height
     */
    getBlocksHeight(): Promise<BN>;
    /**
     * Get the current header height
     */
    getHeadersHeight(): Promise<BN>;
    /**
     * Get latest header
     *
     * @returns {Array<Header>}
     */
    getLatestHeader<T>(): Promise<T | undefined>;
    /**
     * Get latest block
     *
     * @returns {Array<Block>}
     */
    getLatestBlock<T>(): Promise<T | undefined>;
    /**
     * Get an array of blocks
     *
     * @param {Number|String} from - block number or hash
     * @param {Number} max - how many blocks to return
     * @returns {Array<Block>} - an array of blocks
     */
    getBlocks<T>(blockId: Buffer | number, maxBlocks?: number, skip?: number, reverse?: boolean): Promise<T[] | undefined>;
    /**
     * Get an array of blocks
     *
     * @param {Number|String} from - block number or hash
     * @param {Number} max - how many blocks to return
     * @returns {Array<Header>} - an array of blocks
     */
    getHeaders<T>(blockId: Buffer | BN | number, maxBlocks?: number, skip?: number, reverse?: boolean): Promise<T[] | undefined>;
    /**
     * Put blocks to the blockchain
     *
     * @param {Block} block
     */
    putBlocks<T>(block: T[]): Promise<void>;
    /**
     * Put headers to the blockchain
     *
     * @param {Header} header
     */
    putHeaders<T>(header: T[]): Promise<void>;
    getBestBlock<T>(): Promise<T>;
    getNetworkId(): number;
    genesis(): any;
    putCheckpoint(block: Block): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=eth-chain.d.ts.map