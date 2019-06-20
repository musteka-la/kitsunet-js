import { KsnProtocol } from '../ksn-protocol';
import { IPeerDescriptor } from '../../../interfaces';
import { KitsunetHandler } from '../kitsunet-handler';
export declare class Identify<P extends IPeerDescriptor<any>> extends KitsunetHandler<P> {
    constructor(networkProvider: KsnProtocol<P>, peer: P);
    handle(): Promise<any>;
    send(): Promise<any>;
}
//# sourceMappingURL=identify.d.ts.map