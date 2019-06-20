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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9uZXQvbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7O0FBRVosbUNBQTJDO0FBYTNDOzs7OztHQUtHO0FBQ0gsTUFBc0IsSUFBUSxTQUFRLHFCQUFFO0lBQXhDOztRQUNFLGNBQVMsR0FBOEIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNoRCxVQUFLLEdBQW1CLElBQUksR0FBRyxFQUFFLENBQUE7UUFDakMsU0FBSSxHQUFrQixFQUFFLENBQUE7SUF5RTFCLENBQUM7SUFsRUM7Ozs7T0FJRztJQUNILGdCQUFnQixDQUFFLGVBQXVDO1FBQ3ZELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDekMsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQzdCLE9BQU8sZUFBZTt5QkFDbkIsR0FBRzt5QkFDSCxRQUFRO3lCQUNSLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEIsQ0FBQyxDQUFDLENBQUE7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw2REFBNkQ7SUFDN0QsSUFBSSxDQUFZLEdBQU0sRUFBRSxRQUF1QixFQUFFLElBQVE7UUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsNkRBQTZEO0lBQzdELE9BQU8sQ0FBZSxRQUEwQjtRQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELG1CQUFtQjtJQUNuQiw2REFBNkQ7SUFDN0QsS0FBSyxDQUFFLFFBQXNCO0lBQzdCLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsNkRBQTZEO0lBQzdELE9BQU8sQ0FBRSxRQUFzQjtJQUMvQixDQUFDO0lBRVMsY0FBYyxDQUFFLGdCQUEwQyxFQUMxQyxJQUEyQjtRQUNuRCxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQXVDLEVBQUUsRUFBRTtZQUN0RSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDMUMsTUFBTSxRQUFRLEdBQTRCLGVBQWUsQ0FBQyxXQUFXLENBQUE7Z0JBQ3JFLE1BQU0sS0FBSyxHQUFpQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQ0osSUFBbUIsRUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNqQixPQUFPLEtBQUssQ0FBQTthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBUSxDQUFBO0lBQzNCLENBQUM7Q0FJRjtBQTVFRCxvQkE0RUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuXG5pbXBvcnQge1xuICBJUHJvdG9jb2wsXG4gIElOZXR3b3JrLFxuICBOZXR3b3JrVHlwZSxcbiAgSUNhcGFiaWxpdHksXG4gIElQcm90b2NvbERlc2NyaXB0b3IsXG4gIElQcm90b2NvbENvbnN0cnVjdG9yXG59IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IElCbG9ja2NoYWluIH0gZnJvbSAnLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi9wZWVyJ1xuXG4vKipcbiAqIEFic3RyYWN0IE5vZGVcbiAqXG4gKiBAZmlyZXMgTm9kZU1hbmFnZXIja2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQgLSBmaXJlcyBvbiBuZXcgY29ubmVjdGVkIHBlZXJcbiAqIEBmaXJlcyBOb2RlTWFuYWdlciNraXRzdW5ldDpwZWVyOmRpc2NvdmVyZWQgLSBmaXJlcyBvbiBuZXcgZGlzY292ZXJlZCBwZWVyXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2RlPFA+IGV4dGVuZHMgRUUgaW1wbGVtZW50cyBJTmV0d29yazxQPiB7XG4gIHByb3RvY29sczogTWFwPHN0cmluZywgSVByb3RvY29sPFA+PiA9IG5ldyBNYXAoKVxuICBwZWVyczogTWFwPHN0cmluZywgUD4gPSBuZXcgTWFwKClcbiAgY2FwczogSUNhcGFiaWxpdHlbXSA9IFtdXG5cbiAgYWJzdHJhY3Qgc3RhcnRlZDogYm9vbGVhblxuICBhYnN0cmFjdCBwZWVyPzogUFxuICBhYnN0cmFjdCB0eXBlOiBOZXR3b3JrVHlwZVxuICBhYnN0cmFjdCBjaGFpbjogSUJsb2NrY2hhaW5cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhpcyBub2RlIHN1cHBvcnRzIHRoZSBwcm90b2NvbFxuICAgKlxuICAgKiBAcGFyYW0gcHJvdG9EZXNjcmlwdG9yXG4gICAqL1xuICBpc1Byb3RvU3VwcG9ydGVkIChwcm90b0Rlc2NyaXB0b3I6IElQcm90b2NvbERlc2NyaXB0b3I8UD4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmNhcHMuZmluZCgoY2FwOiBhbnkpID0+IHtcbiAgICAgIGlmIChjYXAuaWQgPT09IHByb3RvRGVzY3JpcHRvci5jYXAuaWQpIHtcbiAgICAgICAgcmV0dXJuIGNhcC52ZXJzaW9ucy5maW5kKCh2KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb3RvRGVzY3JpcHRvclxuICAgICAgICAgICAgLmNhcFxuICAgICAgICAgICAgLnZlcnNpb25zXG4gICAgICAgICAgICAuaW5jbHVkZXModilcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBzZW5kIGEgbWVzc2FnZSB0byBhIHJlbW90ZVxuICAgKlxuICAgKiBAcGFyYW0gbXNnIC0gdGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0gcHJvdG9jb2wgLSBhIHByb3RvY29sIG9iamVjdCB0byBwYXNzIHRvIHRoZSBuZXR3b3JrIHByb3ZpZGVyXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gIHNlbmQ8VCwgVSA9IFQ+IChtc2c6IFQsIHByb3RvY29sPzogSVByb3RvY29sPFA+LCBwZWVyPzogUCk6IFByb21pc2U8VSB8IFVbXSB8IHZvaWQ+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgLyoqXG4gICAqIGhhbmRsZSBpbmNvbWluZyBtZXNzYWdlc1xuICAgKlxuICAgKiBAcGFyYW0gcmVhZGFibGUgLSBhbiBBc3luY0l0ZXJhYmxlIHRvIHJlYWQgZnJvbVxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICByZWNlaXZlIDwgVCwgVSA9IFQgPiAocmVhZGFibGU6IEFzeW5jSXRlcmFibGU8VD4pOiBBc3luY0l0ZXJhYmxlIDwgVSB8IFVbXSA+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgLy8gbW91bnQgYSBwcm90b2NvbFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gIG1vdW50IChwcm90b2NvbDogSVByb3RvY29sPFA+KTogdm9pZCB7XG4gIH1cblxuICAvLyB1bm1vdW50IGEgcHJvdG9jb2xcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICB1bm1vdW50IChwcm90b2NvbDogSVByb3RvY29sPFA+KTogdm9pZCB7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJQcm90b3MgKHByb3RvY29sUmVnaXN0cnk6IElQcm90b2NvbERlc2NyaXB0b3I8UD5bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZWVyOiBOZXR3b3JrUGVlcjxhbnksIGFueT4pOiBJUHJvdG9jb2w8UD5bXSB7XG4gICAgcmV0dXJuIHByb3RvY29sUmVnaXN0cnkubWFwKChwcm90b0Rlc2NyaXB0b3I6IElQcm90b2NvbERlc2NyaXB0b3I8UD4pID0+IHtcbiAgICAgIGlmICh0aGlzLmlzUHJvdG9TdXBwb3J0ZWQocHJvdG9EZXNjcmlwdG9yKSkge1xuICAgICAgICBjb25zdCBQcm90b2NvbDogSVByb3RvY29sQ29uc3RydWN0b3I8UD4gPSBwcm90b0Rlc2NyaXB0b3IuY29uc3RydWN0b3JcbiAgICAgICAgY29uc3QgcHJvdG86IElQcm90b2NvbDxQPiA9IG5ldyBQcm90b2NvbChwZWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgYXMgSU5ldHdvcms8UD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFpbilcbiAgICAgICAgcGVlci5wcm90b2NvbHMuc2V0KHByb3RvLmlkLCBwcm90bylcbiAgICAgICAgdGhpcy5tb3VudChwcm90bylcbiAgICAgICAgcmV0dXJuIHByb3RvXG4gICAgICB9XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pIGFzIGFueVxuICB9XG5cbiAgYWJzdHJhY3Qgc3RhcnQgKCk6IFByb21pc2UgPHZvaWQ+XG4gIGFic3RyYWN0IHN0b3AgKCk6IFByb21pc2U8dm9pZD5cbn1cbiJdfQ==