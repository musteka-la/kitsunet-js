import KitsunetBlockTracker from 'kitsunet-block-tracker';
import HttpProvider from 'ethjs-provider-http';
import PollingBlockTracker from 'eth-block-tracker';
import EthQuery from 'eth-query';
import Libp2p from 'libp2p';
export declare class TrackerFactory {
    createEthHttpProvider(options: any): HttpProvider | null;
    createPollingBlockProvider(options: any, provider: HttpProvider): PollingBlockTracker | null;
    createEthQuery(options: any, provider: HttpProvider): EthQuery | null;
    createKitsunetBlockTracker(node: Libp2p, blockTracker: PollingBlockTracker, ethQuery: EthQuery): KitsunetBlockTracker;
}
//# sourceMappingURL=dependencies.d.ts.map