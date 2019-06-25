/// <reference types="node" />
import { IPeerDescriptor, IProtocol } from './interfaces';
import { EventEmitter as EE } from 'events';
export declare abstract class NetworkPeer<T, U> extends EE implements IPeerDescriptor<T> {
    abstract peer: T;
    abstract id: string;
    abstract addrs: Set<string>;
    protocols: Map<string, IProtocol<U>>;
}
//# sourceMappingURL=peer.d.ts.map