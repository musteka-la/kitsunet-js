/// <reference types="node" />
import { IBlockchain } from '../blockchain';
import { EventEmitter as EE } from 'events';
import { Node } from './node';
export declare enum NetworkType {
    LIBP2P = 0,
    DEVP2P = 1
}
export interface INetwork<P> {
    /**
     * send a message to a remote
     *
     * @param msg - the message to send
     * @param protocol - a protocol object to pass to the network provider
     * @param peer - (optional) raw peer
     */
    send<T, U = T>(msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U>;
    send<T, U = T>(msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U[]>;
    send<T, U = T>(msg: T, protocol?: IProtocol<P>, peer?: P): Promise<void>;
    send<T, U = T>(msg: T, protocol?: IProtocol<P>, peer?: P): Promise<null>;
    send<T, U = T>(msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | U[] | void | null>;
    /**
     * handle incoming messages
     *
     * @param readable - an AsyncIterable to ber read from asynchronously
     */
    receive<T, U = T>(readable: AsyncIterable<T>): AsyncIterable<U>;
    receive<T, U = T>(readable: AsyncIterable<T>): AsyncIterable<U[]>;
    receive<T, U = T>(readable: AsyncIterable<T>): AsyncIterable<void>;
    receive<T, U = T>(readable: AsyncIterable<T>): AsyncIterable<null>;
    receive<T, U = T>(readable: AsyncIterable<T>): AsyncIterable<U | U[] | void | null>;
}
export interface IEncoder {
    /**
     * Encode a buffer
     *
     * @param msg - a buffer to encode
     */
    encode<T, U = T>(msg: T): AsyncIterable<U>;
    /**
     * A buffer to decode
     *
     * @param msg - decode a buffer
     */
    decode<T, U = T>(msg: T): AsyncIterable<U>;
}
export interface IPeerDescriptor<T> {
    peer: T;
    id: string;
    addrs: Set<string>;
    node?: Node<IPeerDescriptor<T>>;
    ban<R>(reason?: R): Promise<void>;
    disconnect<R>(reason?: R): Promise<void>;
}
export interface ICapability {
    id: string;
    versions: string[];
}
export interface IProtocolDescriptor<T> {
    cap: ICapability;
    constructor: IProtocolConstructor<T>;
}
export interface IProtocolConstructor<T> {
    new (peer: IPeerDescriptor<T>, provider: INetwork<T>, blockchain: IBlockchain, encoder?: IEncoder): IProtocol<T>;
}
export interface IProtocol<T> extends INetwork<T>, ICapability, EE {
    peer: T;
    encoder?: IEncoder;
    networkProvider: INetwork<T>;
    handshake(): Promise<void>;
}
export interface IHandler<P> {
    name: string;
    id: string | number;
    protocol: IProtocol<P>;
    peer: IPeerDescriptor<P>;
    /**
     * Handle an incoming message
     *
     * @param msg - the message to be sent
     */
    handle<U extends any[]>(...msg: U): Promise<any>;
    /**
     * Send a request
     *
     * @param msg - the message to be sent
     */
    send<U extends any[]>(...msg: U): Promise<any>;
}
//# sourceMappingURL=interfaces.d.ts.map