import { KitsunetHandler } from '../kitsunet-handler';
import { IPeerDescriptor } from '../../../interfaces';
import { KsnProtocol } from '../ksn-protocol';
export declare class Ping<P extends IPeerDescriptor<any>> extends KitsunetHandler<P> {
    constructor(networkProvider: KsnProtocol<P>, peer: P);
    handle(): Promise<any>;
    send(): Promise<any>;
}
//# sourceMappingURL=ping.d.ts.map