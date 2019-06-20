/// <reference types="node" />
import BN from 'bn.js';
import { EthHandler } from '../eth-handler';
import { IPeerDescriptor } from '../../../interfaces';
import { EthProtocol } from '../eth-protocol';
export declare type BlockHeadersRequest = [Buffer | BN | number, number, number, boolean];
export declare class GetBlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
    constructor(protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    handle<U extends any[]>(...msg: U): Promise<any>;
    send<U extends any[]>(...msg: U & BlockHeadersRequest): Promise<any>;
}
export declare type BlockRequest = [number | Buffer | BN, number | Buffer, number | Buffer, boolean | Buffer];
export declare class BlockHeaders<P extends IPeerDescriptor<any>> extends EthHandler<P> {
    constructor(protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    handle<U extends any[]>(...msg: U): Promise<any>;
    send<U extends any[]>(...msg: U & BlockRequest): Promise<any>;
}
//# sourceMappingURL=block-headers.d.ts.map