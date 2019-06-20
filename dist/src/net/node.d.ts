/// <reference types="node" />
import { EventEmitter as EE } from 'events';
import { IProtocol, INetwork, NetworkType, ICapability, IProtocolDescriptor } from './interfaces';
import { IBlockchain } from '../blockchain';
import { NetworkPeer } from './peer';
/**
 * Abstract Node
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:discovered - fires on new discovered peer
 */
export declare abstract class Node<P> extends EE implements INetwork<P> {
    protocols: Map<string, IProtocol<P>>;
    peers: Map<string, P>;
    caps: ICapability[];
    abstract started: boolean;
    abstract peer?: P;
    abstract type: NetworkType;
    abstract chain: IBlockchain;
    /**
     * Check if this node supports the protocol
     *
     * @param protoDescriptor
     */
    isProtoSupported(protoDescriptor: IProtocolDescriptor<P>): boolean;
    /**
     * send a message to a remote
     *
     * @param msg - the message to send
     * @param protocol - a protocol object to pass to the network provider
     */
    send<T, U = T>(msg: T, protocol?: IProtocol<P>, peer?: P): Promise<U | U[] | void>;
    /**
     * handle incoming messages
     *
     * @param readable - an AsyncIterable to read from
     */
    receive<T, U = T>(readable: AsyncIterable<T>): AsyncIterable<U | U[]>;
    mount(protocol: IProtocol<P>): void;
    unmount(protocol: IProtocol<P>): void;
    protected registerProtos(protocolRegistry: IProtocolDescriptor<P>[], peer: NetworkPeer<any, any>): IProtocol<P>[];
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
}
//# sourceMappingURL=node.d.ts.map