/// <reference types="node" />
import EE from 'events';
import { IProtocol, INetwork, IEncoder, IPeerDescriptor } from './interfaces';
import { Node } from './node';
import { PeerTypes } from './helper-types';
export declare abstract class BaseProtocol<P extends IPeerDescriptor<PeerTypes>> extends EE implements IProtocol<P> {
    abstract readonly id: string;
    abstract readonly versions: string[];
    peer: P;
    networkProvider: INetwork<P>;
    encoder?: IEncoder;
    constructor(peer: P, networkProvider: Node<P>, encoder?: IEncoder);
    receive<T, U>(readable: AsyncIterable<T>): AsyncIterable<U | U[] | null>;
    send<T, U>(msg: T, protocol?: IProtocol<P>): Promise<U | U[] | void | null>;
    abstract handshake(): Promise<void>;
}
//# sourceMappingURL=base-protocol.d.ts.map