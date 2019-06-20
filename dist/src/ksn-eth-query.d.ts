import HttpProvider from 'ethjs-provider-http';
import EthQuery from 'eth-query';
/**
 * Extends EthQuery with getSlice call
 */
export declare class KsnEthQuery extends EthQuery {
    getSlice: (path: string, depth: number, root: string, isStorage: boolean) => any;
    constructor(provider: HttpProvider);
    protected generateFnFor(methodName: string): (...args: any[]) => void;
}
//# sourceMappingURL=ksn-eth-query.d.ts.map