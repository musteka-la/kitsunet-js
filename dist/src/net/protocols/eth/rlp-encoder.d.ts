import { IEncoder, NetworkType } from '../../interfaces';
export declare class RlpEncoder implements IEncoder {
    type: NetworkType;
    constructor(type: NetworkType);
    encode<T, U>(msg: T[] | T): AsyncIterable<U>;
    decode<T, U>(msg: T[] | T): AsyncIterable<U>;
}
//# sourceMappingURL=rlp-encoder.d.ts.map