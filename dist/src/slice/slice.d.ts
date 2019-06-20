/// <reference types="node" />
import { SliceId } from './slice-id';
export declare class Slice extends SliceId {
    parsed: any;
    nodes: any;
    constructor(data: Buffer | string | Object);
    static parse(data: any): any;
    readonly head: any;
    readonly stem: any;
    readonly sliceNodes: any;
    readonly leaves: any;
    serialize(): any;
}
//# sourceMappingURL=slice.d.ts.map