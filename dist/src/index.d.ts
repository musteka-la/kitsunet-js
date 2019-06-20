import { Kitsunet } from './kitsunet';
import { Slice } from './slice';
import { NetworkPeer } from './net';
export * from './kitsunet';
export declare class KitsunetFactory {
    static options: any;
    static getOptions(): any;
    static defaultSlices(options: any): Slice[];
    static kitsunetFactory<T extends NetworkPeer<any, any>>(kitsunet: Kitsunet<T>, slices: Slice[]): Promise<Kitsunet<T>>;
    static createKitsunet(options: any): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map