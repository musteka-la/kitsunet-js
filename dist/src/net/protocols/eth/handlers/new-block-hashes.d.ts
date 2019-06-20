/// <reference types="node" />
import BN from 'bn.js';
import { EthHandler } from '../eth-handler';
import { EthProtocol } from '../eth-protocol';
import { IPeerDescriptor } from '../../../interfaces';
export declare class NewBlockHashes<P extends IPeerDescriptor<any>> extends EthHandler<P> {
    constructor(protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    handle<U extends any[]>(...msg: U): Promise<any>;
    send<U extends any[]>(...hashes: U & [[Buffer, BN][]]): Promise<any>;
}
//# sourceMappingURL=new-block-hashes.d.ts.map