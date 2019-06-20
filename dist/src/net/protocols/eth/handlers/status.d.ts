/// <reference types="node" />
import BN from 'bn.js';
import { EthHandler } from '../eth-handler';
import { EthProtocol } from '../eth-protocol';
import { IPeerDescriptor } from '../../../interfaces';
export declare class Status<P extends IPeerDescriptor<any>> extends EthHandler<P> {
    constructor(protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    handle<U extends any[]>(...msg: U & [Buffer, Buffer, Buffer, Buffer, Buffer, Buffer]): Promise<any>;
    send<U extends any[]>(...msg: U & [number, number, BN, Buffer, string]): Promise<any>;
}
//# sourceMappingURL=status.d.ts.map