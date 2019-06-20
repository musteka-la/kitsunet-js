import { IEncoder } from '../../interfaces';
export declare class KsnEncoder implements IEncoder {
    encode<T, U>(msg: T): AsyncIterable<U>;
    decode<T, U>(msg: T): AsyncIterable<U>;
}
//# sourceMappingURL=ksn-encoder.d.ts.map