import { Block } from 'ethereumjs-blockchain';
import { KsnNodeType } from '../../../constants';
export { KsnNodeType as NodeType };
export declare type BlockHeader = Block.Header;
export declare enum MsgType {
    UNKNOWN_MSG = 0,
    IDENTIFY = 1,
    SLICES = 2,
    SLICE_ID = 3,
    HEADERS = 4,
    LATEST_BLOCK = 5,
    NODE_TYPE = 6,
    PING = 7
}
export declare enum ResponseStatus {
    UNKNOWN_ERROR = 0,
    OK = 1,
    ERROR = 2
}
export interface KsnMsg {
    type: MsgType;
    payload: Data;
}
export interface KsnResponse extends KsnMsg {
    status?: ResponseStatus;
    error?: string;
}
export declare type Message = KsnMsg | KsnResponse;
export interface Identify {
    versions: string[];
    userAgent: string;
    nodeType: KsnNodeType;
    latestBlock: number;
    sliceIds: string[];
}
export interface Data {
    identify: Identify;
    slices: any[];
    headers: BlockHeader[];
    type: KsnNodeType;
    sliceIds: string[];
    latestBlock: Block;
}
export interface IKsnProtocol {
}
//# sourceMappingURL=interfaces.d.ts.map