export declare class SliceId {
    path: string;
    depth: number;
    root: string;
    isStorage: boolean;
    constructor(path?: string, depth?: number, root?: string, isStorage?: boolean);
    static parse(path: string, depth: number | string, root?: string, isStorage?: boolean): any;
    readonly id: string;
    serialize(): any;
}
//# sourceMappingURL=slice-id.d.ts.map