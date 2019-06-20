/// <reference types="node" />
import EE from 'events';
import debug from 'debug';
import { KsnProtocol } from './ksn-protocol';
import { IPeerDescriptor, IHandler } from '../../interfaces';
import { KsnResponse, ResponseStatus } from './interfaces';
export declare abstract class KitsunetHandler<P extends IPeerDescriptor<any>> extends EE implements IHandler<P> {
    name: string;
    id: number;
    protocol: KsnProtocol<P>;
    peer: P;
    log: debug.Debugger;
    constructor(name: string, id: number, protocol: KsnProtocol<P>, peer: P);
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
    protected _send<U extends any[]>(...msg: U): Promise<KsnResponse>;
    errResponse(err: Error): {
        status: ResponseStatus;
        error: Error;
    };
}
//# sourceMappingURL=kitsunet-handler.d.ts.map