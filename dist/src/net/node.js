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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9uZXQvbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7O0FBRVosbUNBQTJDO0FBYzNDOzs7OztHQUtHO0FBQ0gsTUFBc0IsSUFBUSxTQUFRLHFCQUFFO0lBQXhDOztRQUNFLGNBQVMsR0FBOEIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNoRCxVQUFLLEdBQW1CLElBQUksR0FBRyxFQUFFLENBQUE7UUFDakMsU0FBSSxHQUFrQixFQUFFLENBQUE7SUEyRTFCLENBQUM7SUFwRUM7Ozs7T0FJRztJQUNILGdCQUFnQixDQUFFLGVBQXVDO1FBQ3ZELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDekMsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQzdCLE9BQU8sZUFBZTt5QkFDbkIsR0FBRzt5QkFDSCxRQUFRO3lCQUNSLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEIsQ0FBQyxDQUFDLENBQUE7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw2REFBNkQ7SUFDN0QsSUFBSSxDQUFZLEdBQU0sRUFBRSxRQUF1QixFQUFFLElBQVE7UUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsNkRBQTZEO0lBQzdELE9BQU8sQ0FBYSxRQUEwQjtRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELG1CQUFtQjtJQUNuQiw2REFBNkQ7SUFDN0QsS0FBSyxDQUFFLFFBQXNCO0lBQzdCLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsNkRBQTZEO0lBQzdELE9BQU8sQ0FBRSxRQUFzQjtJQUMvQixDQUFDO0lBRVMsY0FBYyxDQUFFLGdCQUEwQyxFQUMxQyxJQUEyQjtRQUNuRCxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQXVDLEVBQUUsRUFBRTtZQUN0RSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDMUMsTUFBTSxRQUFRLEdBQTRCLGVBQWUsQ0FBQyxXQUFXLENBQUE7Z0JBQ3JFLE1BQU0sS0FBSyxHQUFpQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQ0osSUFBbUIsRUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNqQixPQUFPLEtBQUssQ0FBQTthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBUSxDQUFBO0lBQzNCLENBQUM7Q0FNRjtBQTlFRCxvQkE4RUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuXG5pbXBvcnQge1xuICBJUHJvdG9jb2wsXG4gIElOZXR3b3JrLFxuICBOZXR3b3JrVHlwZSxcbiAgSUNhcGFiaWxpdHksXG4gIElQcm90b2NvbERlc2NyaXB0b3IsXG4gIElQcm90b2NvbENvbnN0cnVjdG9yLFxuICBJUGVlckRlc2NyaXB0b3Jcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgSUJsb2NrY2hhaW4gfSBmcm9tICcuLi9ibG9ja2NoYWluJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuL25ldHdvcmstcGVlcidcblxuLyoqXG4gKiBBYnN0cmFjdCBOb2RlXG4gKlxuICogQGZpcmVzIE5vZGVNYW5hZ2VyI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgTm9kZU1hbmFnZXIja2l0c3VuZXQ6cGVlcjpkaXNjb3ZlcmVkIC0gZmlyZXMgb24gbmV3IGRpc2NvdmVyZWQgcGVlclxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9kZTxQPiBleHRlbmRzIEVFIGltcGxlbWVudHMgSU5ldHdvcms8UD4ge1xuICBwcm90b2NvbHM6IE1hcDxzdHJpbmcsIElQcm90b2NvbDxQPj4gPSBuZXcgTWFwKClcbiAgcGVlcnM6IE1hcDxzdHJpbmcsIFA+ID0gbmV3IE1hcCgpXG4gIGNhcHM6IElDYXBhYmlsaXR5W10gPSBbXVxuXG4gIGFic3RyYWN0IHN0YXJ0ZWQ6IGJvb2xlYW5cbiAgYWJzdHJhY3QgcGVlcj86IFBcbiAgYWJzdHJhY3QgdHlwZTogTmV0d29ya1R5cGVcbiAgYWJzdHJhY3QgY2hhaW46IElCbG9ja2NoYWluXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgbm9kZSBzdXBwb3J0cyB0aGUgcHJvdG9jb2xcbiAgICpcbiAgICogQHBhcmFtIHByb3RvRGVzY3JpcHRvclxuICAgKi9cbiAgaXNQcm90b1N1cHBvcnRlZCAocHJvdG9EZXNjcmlwdG9yOiBJUHJvdG9jb2xEZXNjcmlwdG9yPFA+KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5jYXBzLmZpbmQoKGNhcDogYW55KSA9PiB7XG4gICAgICBpZiAoY2FwLmlkID09PSBwcm90b0Rlc2NyaXB0b3IuY2FwLmlkKSB7XG4gICAgICAgIHJldHVybiBjYXAudmVyc2lvbnMuZmluZCgodikgPT4ge1xuICAgICAgICAgIHJldHVybiBwcm90b0Rlc2NyaXB0b3JcbiAgICAgICAgICAgIC5jYXBcbiAgICAgICAgICAgIC52ZXJzaW9uc1xuICAgICAgICAgICAgLmluY2x1ZGVzKHYpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogc2VuZCBhIG1lc3NhZ2UgdG8gYSByZW1vdGVcbiAgICpcbiAgICogQHBhcmFtIG1zZyAtIHRoZSBtZXNzYWdlIHRvIHNlbmRcbiAgICogQHBhcmFtIHByb3RvY29sIC0gYSBwcm90b2NvbCBvYmplY3QgdG8gcGFzcyB0byB0aGUgbmV0d29yayBwcm92aWRlclxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICBzZW5kPFQsIFUgPSBUPiAobXNnOiBULCBwcm90b2NvbD86IElQcm90b2NvbDxQPiwgcGVlcj86IFApOiBQcm9taXNlPFUgfCBVW10gfCB2b2lkPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIC8qKlxuICAgKiBoYW5kbGUgaW5jb21pbmcgbWVzc2FnZXNcbiAgICpcbiAgICogQHBhcmFtIHJlYWRhYmxlIC0gYW4gQXN5bmNJdGVyYWJsZSB0byByZWFkIGZyb21cbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgcmVjZWl2ZSA8VCwgVSA9IFQ+IChyZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxUPik6IEFzeW5jSXRlcmFibGUgPFUgfCBVW10+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgLy8gbW91bnQgYSBwcm90b2NvbFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gIG1vdW50IChwcm90b2NvbDogSVByb3RvY29sPFA+KTogdm9pZCB7XG4gIH1cblxuICAvLyB1bm1vdW50IGEgcHJvdG9jb2xcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICB1bm1vdW50IChwcm90b2NvbDogSVByb3RvY29sPFA+KTogdm9pZCB7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJQcm90b3MgKHByb3RvY29sUmVnaXN0cnk6IElQcm90b2NvbERlc2NyaXB0b3I8UD5bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZWVyOiBOZXR3b3JrUGVlcjxhbnksIGFueT4pOiBJUHJvdG9jb2w8UD5bXSB7XG4gICAgcmV0dXJuIHByb3RvY29sUmVnaXN0cnkubWFwKChwcm90b0Rlc2NyaXB0b3I6IElQcm90b2NvbERlc2NyaXB0b3I8UD4pID0+IHtcbiAgICAgIGlmICh0aGlzLmlzUHJvdG9TdXBwb3J0ZWQocHJvdG9EZXNjcmlwdG9yKSkge1xuICAgICAgICBjb25zdCBQcm90b2NvbDogSVByb3RvY29sQ29uc3RydWN0b3I8UD4gPSBwcm90b0Rlc2NyaXB0b3IuY29uc3RydWN0b3JcbiAgICAgICAgY29uc3QgcHJvdG86IElQcm90b2NvbDxQPiA9IG5ldyBQcm90b2NvbChwZWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgYXMgSU5ldHdvcms8UD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFpbilcbiAgICAgICAgcGVlci5wcm90b2NvbHMuc2V0KHByb3RvLmlkLCBwcm90bylcbiAgICAgICAgdGhpcy5tb3VudChwcm90bylcbiAgICAgICAgcmV0dXJuIHByb3RvXG4gICAgICB9XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pIGFzIGFueVxuICB9XG5cbiAgYWJzdHJhY3QgZGlzY29ubmVjdFBlZXIocGVlcjogUCwgcmVhc29uPzogYW55KTogUHJvbWlzZTx2b2lkPlxuICBhYnN0cmFjdCBiYW5QZWVyKHBlZXI6IFAsIG1heEFnZT86IG51bWJlciwgcmVhc29uPzogYW55KTogUHJvbWlzZTx2b2lkPlxuICBhYnN0cmFjdCBzdGFydCAoKTogUHJvbWlzZSA8dm9pZD5cbiAgYWJzdHJhY3Qgc3RvcCAoKTogUHJvbWlzZTx2b2lkPlxufVxuIl19