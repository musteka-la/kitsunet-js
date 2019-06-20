import './dependencies';
import { Slice, SliceId } from '../slice';
import { Datastore } from 'interface-datastore';
export declare class SliceStore {
    _store: Datastore;
    /**
     * The store where to retrieve data from
     *
     * @param {Store} store - underlying store where slice data is stored
     */
    constructor(store: Datastore);
    getSlices(): Promise<Slice[] | undefined>;
    static _mkKey(...entries: string[]): string;
    /**
     * Lookup all slices with a path
     *
     * @param {SliceId} sliceId - the slices to look for
     */
    getByPath(sliceId: SliceId): Promise<Slice[] | undefined>;
    /**
     * Lookup a slice by its id
     *
     * @param {SliceId} sliceId - the slice to lookup
     */
    getById(sliceId: SliceId): Promise<Slice | undefined>;
    /**
     * Store a slice in the underlying store
     *
     * @param {Slice} slice - the slice to store
     */
    put(slice: Slice): Promise<unknown>;
}
//# sourceMappingURL=slice-store.d.ts.map