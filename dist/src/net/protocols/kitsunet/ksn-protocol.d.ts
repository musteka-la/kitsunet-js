import { BaseProtocol } from '../../base-protocol';
import { Node, IPeerDescriptor } from '../..';
import { KitsunetHandler } from './kitsunet-handler';
import { EthChain } from '../../../blockchain';
import { IKsnProtocol, NodeType } from './interfaces';
export declare class KsnProtocol<P extends IPeerDescriptor<any>> extends BaseProtocol<P> implements IKsnProtocol {
    peer: P;
    networkProvider: Node<P>;
    ethChain: EthChain;
    sliceIds: Set<any>;
    type: NodeType;
    handlers: {
        [key: number]: KitsunetHandler<P>;
    };
    versions: string[];
    userAgent: string;
    latestBlock: number | null;
    readonly id: string;
    constructor(peer: P, networkProvider: Node<P>, ethChain: EthChain);
    receive<T, U>(readable: AsyncIterable<T>): AsyncIterable<U | U[] | null>;
    send<T, U>(msg: T): Promise<U | U[] | void | null>;
    /**
     * initiate the identify flow
     */
    handshake(): Promise<void>;
}
//# sourceMappingURL=ksn-protocol.d.ts.map