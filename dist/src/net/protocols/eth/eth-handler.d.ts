/// <reference types="node" />
import EE from 'events';
import debug from 'debug';
import { IHandler, IPeerDescriptor } from '../../interfaces';
import { EthProtocol } from './eth-protocol';
export declare abstract class EthHandler<P extends IPeerDescriptor<any>> extends EE implements IHandler<P> {
    name: string;
    id: number;
    protocol: EthProtocol<P>;
    peer: IPeerDescriptor<P>;
    log: debug.Debugger;
    constructor(name: string, id: number, protocol: EthProtocol<P>, peer: IPeerDescriptor<P>);
    /**
     * Handle an incoming message
     *
     * @param msg - the message to be sent
     */
    abstract handle<U extends any[]>(...msg: U): Promise<any>;
    /**
     * Send a request
     *
     * @param msg - the message to be sent
     */
    abstract send<U extends any[]>(...msg: U): Promise<any>;
    protected _send<U extends any[]>(msg: U): Promise<any>;
}
//# sourceMappingURL=eth-handler.d.ts.map