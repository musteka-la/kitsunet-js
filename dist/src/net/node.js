'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * Abstract Node
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:discovered - fires on new discovered peer
 */
class Node extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.protocols = new Map();
        this.peers = new Map();
        this.caps = [];
    }
    /**
     * Check if this node supports the protocol
     *
     * @param protoDescriptor
     */
    isProtoSupported(protoDescriptor) {
        return Boolean(this.caps.find((cap) => {
            if (cap.id === protoDescriptor.cap.id) {
                return cap.versions.find((v) => {
                    return protoDescriptor
                        .cap
                        .versions
                        .includes(v);
                });
            }
        }));
    }
    /**
     * send a message to a remote
     *
     * @param msg - the message to send
     * @param protocol - a protocol object to pass to the network provider
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    send(msg, protocol, peer) {
        throw new Error('Method not implemented');
    }
    /**
     * handle incoming messages
     *
     * @param readable - an AsyncIterable to read from
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    receive(readable) {
        throw new Error('Method not implemented');
    }
    // mount a protocol
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mount(protocol) {
    }
    // unmount a protocol
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unmount(protocol) {
    }
    registerProtos(protocolRegistry, peer) {
        return protocolRegistry.map((protoDescriptor) => {
            if (this.isProtoSupported(protoDescriptor)) {
                const Protocol = protoDescriptor.constructor;
                const proto = new Protocol(peer, this, this.chain);
                peer.protocols.set(proto.id, proto);
                this.mount(proto);
                return proto;
            }
        }).filter(Boolean);
    }
}
exports.Node = Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9uZXQvbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7O0FBRVosbUNBQTJDO0FBYTNDOzs7OztHQUtHO0FBQ0gsTUFBc0IsSUFBUSxTQUFRLHFCQUFFO0lBQXhDOztRQUNFLGNBQVMsR0FBOEIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNoRCxVQUFLLEdBQW1CLElBQUksR0FBRyxFQUFFLENBQUE7UUFDakMsU0FBSSxHQUFrQixFQUFFLENBQUE7SUEyRTFCLENBQUM7SUFwRUM7Ozs7T0FJRztJQUNILGdCQUFnQixDQUFFLGVBQXVDO1FBQ3ZELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDekMsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQzdCLE9BQU8sZUFBZTt5QkFDbkIsR0FBRzt5QkFDSCxRQUFRO3lCQUNSLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEIsQ0FBQyxDQUFDLENBQUE7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw2REFBNkQ7SUFDN0QsSUFBSSxDQUFZLEdBQU0sRUFBRSxRQUF1QixFQUFFLElBQVE7UUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsNkRBQTZEO0lBQzdELE9BQU8sQ0FBYSxRQUEwQjtRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELG1CQUFtQjtJQUNuQiw2REFBNkQ7SUFDN0QsS0FBSyxDQUFFLFFBQXNCO0lBQzdCLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsNkRBQTZEO0lBQzdELE9BQU8sQ0FBRSxRQUFzQjtJQUMvQixDQUFDO0lBRVMsY0FBYyxDQUFFLGdCQUEwQyxFQUMxQyxJQUEyQjtRQUNuRCxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQXVDLEVBQUUsRUFBRTtZQUN0RSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDMUMsTUFBTSxRQUFRLEdBQTRCLGVBQWUsQ0FBQyxXQUFXLENBQUE7Z0JBQ3JFLE1BQU0sS0FBSyxHQUFpQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQ0osSUFBbUIsRUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNqQixPQUFPLEtBQUssQ0FBQTthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBUSxDQUFBO0lBQzNCLENBQUM7Q0FNRjtBQTlFRCxvQkE4RUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuXG5pbXBvcnQge1xuICBJUHJvdG9jb2wsXG4gIElOZXR3b3JrLFxuICBOZXR3b3JrVHlwZSxcbiAgSUNhcGFiaWxpdHksXG4gIElQcm90b2NvbERlc2NyaXB0b3IsXG4gIElQcm90b2NvbENvbnN0cnVjdG9yXG59IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IElCbG9ja2NoYWluIH0gZnJvbSAnLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi9uZXR3b3JrLXBlZXInXG5cbi8qKlxuICogQWJzdHJhY3QgTm9kZVxuICpcbiAqIEBmaXJlcyBOb2RlTWFuYWdlciNraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCAtIGZpcmVzIG9uIG5ldyBjb25uZWN0ZWQgcGVlclxuICogQGZpcmVzIE5vZGVNYW5hZ2VyI2tpdHN1bmV0OnBlZXI6ZGlzY292ZXJlZCAtIGZpcmVzIG9uIG5ldyBkaXNjb3ZlcmVkIHBlZXJcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vZGU8UD4gZXh0ZW5kcyBFRSBpbXBsZW1lbnRzIElOZXR3b3JrPFA+IHtcbiAgcHJvdG9jb2xzOiBNYXA8c3RyaW5nLCBJUHJvdG9jb2w8UD4+ID0gbmV3IE1hcCgpXG4gIHBlZXJzOiBNYXA8c3RyaW5nLCBQPiA9IG5ldyBNYXAoKVxuICBjYXBzOiBJQ2FwYWJpbGl0eVtdID0gW11cblxuICBhYnN0cmFjdCBzdGFydGVkOiBib29sZWFuXG4gIGFic3RyYWN0IHBlZXI/OiBQXG4gIGFic3RyYWN0IHR5cGU6IE5ldHdvcmtUeXBlXG4gIGFic3RyYWN0IGNoYWluOiBJQmxvY2tjaGFpblxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIG5vZGUgc3VwcG9ydHMgdGhlIHByb3RvY29sXG4gICAqXG4gICAqIEBwYXJhbSBwcm90b0Rlc2NyaXB0b3JcbiAgICovXG4gIGlzUHJvdG9TdXBwb3J0ZWQgKHByb3RvRGVzY3JpcHRvcjogSVByb3RvY29sRGVzY3JpcHRvcjxQPik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuY2Fwcy5maW5kKChjYXA6IGFueSkgPT4ge1xuICAgICAgaWYgKGNhcC5pZCA9PT0gcHJvdG9EZXNjcmlwdG9yLmNhcC5pZCkge1xuICAgICAgICByZXR1cm4gY2FwLnZlcnNpb25zLmZpbmQoKHYpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJvdG9EZXNjcmlwdG9yXG4gICAgICAgICAgICAuY2FwXG4gICAgICAgICAgICAudmVyc2lvbnNcbiAgICAgICAgICAgIC5pbmNsdWRlcyh2KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIHNlbmQgYSBtZXNzYWdlIHRvIGEgcmVtb3RlXG4gICAqXG4gICAqIEBwYXJhbSBtc2cgLSB0aGUgbWVzc2FnZSB0byBzZW5kXG4gICAqIEBwYXJhbSBwcm90b2NvbCAtIGEgcHJvdG9jb2wgb2JqZWN0IHRvIHBhc3MgdG8gdGhlIG5ldHdvcmsgcHJvdmlkZXJcbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgc2VuZDxULCBVID0gVD4gKG1zZzogVCwgcHJvdG9jb2w/OiBJUHJvdG9jb2w8UD4sIHBlZXI/OiBQKTogUHJvbWlzZTxVIHwgVVtdIHwgdm9pZD4ge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZCcpXG4gIH1cblxuICAvKipcbiAgICogaGFuZGxlIGluY29taW5nIG1lc3NhZ2VzXG4gICAqXG4gICAqIEBwYXJhbSByZWFkYWJsZSAtIGFuIEFzeW5jSXRlcmFibGUgdG8gcmVhZCBmcm9tXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gIHJlY2VpdmUgPFQsIFUgPSBUPiAocmVhZGFibGU6IEFzeW5jSXRlcmFibGU8VD4pOiBBc3luY0l0ZXJhYmxlIDxVIHwgVVtdPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIC8vIG1vdW50IGEgcHJvdG9jb2xcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICBtb3VudCAocHJvdG9jb2w6IElQcm90b2NvbDxQPik6IHZvaWQge1xuICB9XG5cbiAgLy8gdW5tb3VudCBhIHByb3RvY29sXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgdW5tb3VudCAocHJvdG9jb2w6IElQcm90b2NvbDxQPik6IHZvaWQge1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyUHJvdG9zIChwcm90b2NvbFJlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPFA+W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVlcjogTmV0d29ya1BlZXI8YW55LCBhbnk+KTogSVByb3RvY29sPFA+W10ge1xuICAgIHJldHVybiBwcm90b2NvbFJlZ2lzdHJ5Lm1hcCgocHJvdG9EZXNjcmlwdG9yOiBJUHJvdG9jb2xEZXNjcmlwdG9yPFA+KSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1Byb3RvU3VwcG9ydGVkKHByb3RvRGVzY3JpcHRvcikpIHtcbiAgICAgICAgY29uc3QgUHJvdG9jb2w6IElQcm90b2NvbENvbnN0cnVjdG9yPFA+ID0gcHJvdG9EZXNjcmlwdG9yLmNvbnN0cnVjdG9yXG4gICAgICAgIGNvbnN0IHByb3RvOiBJUHJvdG9jb2w8UD4gPSBuZXcgUHJvdG9jb2wocGVlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGFzIElOZXR3b3JrPFA+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhaW4pXG4gICAgICAgIHBlZXIucHJvdG9jb2xzLnNldChwcm90by5pZCwgcHJvdG8pXG4gICAgICAgIHRoaXMubW91bnQocHJvdG8pXG4gICAgICAgIHJldHVybiBwcm90b1xuICAgICAgfVxuICAgIH0pLmZpbHRlcihCb29sZWFuKSBhcyBhbnlcbiAgfVxuXG4gIGFic3RyYWN0IGRpc2Nvbm5lY3RQZWVyKHBlZXI6IFAsIHJlYXNvbj86IGFueSk6IFByb21pc2U8dm9pZD5cbiAgYWJzdHJhY3QgYmFuUGVlcihwZWVyOiBQLCBtYXhBZ2U/OiBudW1iZXIsIHJlYXNvbj86IGFueSk6IFByb21pc2U8dm9pZD5cbiAgYWJzdHJhY3Qgc3RhcnQgKCk6IFByb21pc2UgPHZvaWQ+XG4gIGFic3RyYWN0IHN0b3AgKCk6IFByb21pc2U8dm9pZD5cbn1cbiJdfQ==