/// <reference types="node" />
import { IPeerDescriptor } from '../../../interfaces';
import { EthHandler } from '../eth-handler';
import { EthProtocol } from '../eth-protocol';
export declare class GetBlockBodies<P extends IPeerDescriptor<any>> extends EthHandler<P> {
    constructor(protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    handle<U extends any[]>(...msg: U & [Buffer][]): Promise<any>;
    send<U extends any[]>(...msg: U): Promise<any>;
}
export declare class BlockBodies<P extends IPeerDescriptor<any>> extends EthHandler<P> {
    constructor(protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    handle<U extends any[]>(...msg: U): Promise<any>;
    send<U extends any[]>(...msg: U & [Buffer][]): Promise<any>;
}
//# sourceMappingURL=block-bodies.d.ts.map