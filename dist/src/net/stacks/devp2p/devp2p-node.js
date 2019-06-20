'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const node_1 = require("../../node");
const devp2p_peer_1 = require("./devp2p-peer");
const opium_decorators_1 = require("opium-decorators");
const async_1 = require("async");
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const interfaces_1 = require("../../interfaces");
const blockchain_1 = require("../../../blockchain");
const ethereumjs_common_1 = __importDefault(require("ethereumjs-common"));
const debug = debug_1.default('kitsunet:net:devp2p:node');
const ignoredErrors = new RegExp([
    'EPIPE',
    'ECONNRESET',
    'ETIMEDOUT',
    'NetworkId mismatch',
    'Timeout error: ping',
    'Genesis block mismatch',
    'Handshake timed out',
    'Invalid address buffer',
    'Invalid MAC',
    'Invalid timestamp buffer',
    'Hash verification failed',
    'should have valid tag:'
].join('|'));
/**
 * Devp2p node
 *
 * @fires RlpxNode#kitsunet:peer:connected - fires on new connected peer
 * @fires RlpxNode#kitsunet:peer:disconnected - fires when a peer disconnects
 */
let Devp2pNode = class Devp2pNode extends node_1.Node {
    constructor(dpt, rlpx, chain, peerInfo, common, protocolRegistry) {
        super();
        this.dpt = dpt;
        this.rlpx = rlpx;
        this.chain = chain;
        this.peerInfo = peerInfo;
        this.common = common;
        this.protocolRegistry = protocolRegistry;
        this.started = false;
        this.logger = debug;
        // the protocols that this node supports
        this.caps = [
            {
                id: 'eth',
                versions: ['62', '63']
            }
        ];
    }
    get type() {
        return interfaces_1.NetworkType.DEVP2P;
    }
    /**
     * Start Devp2p/RLPx server. Returns a promise that
     * resolves once server has been started.
     * @return {Promise}
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.started) {
                return;
            }
            const { udpPort, address } = this.peerInfo;
            this.dpt.bind(udpPort, address);
            this.dpt.on('error', (e) => debug(e));
            yield this.init();
            this.common.bootstrapNodes().map((node) => __awaiter(this, void 0, void 0, function* () {
                const bootnode = {
                    id: node.id,
                    address: node.ip,
                    udpPort: node.port,
                    tcpPort: node.port
                };
                try {
                    yield this.dpt.bootstrap(bootnode);
                }
                catch (e) {
                    debug(e);
                }
            }));
            this.started = true;
        });
    }
    /**
     * Stop Devp2p/RLPx server. Returns a promise that
     * resolves once server has been stopped.
     *
     * @return {Promise}
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.started) {
                return;
            }
            return new Promise((resolve, reject) => {
                async_1.parallel([
                    (cb) => this.rlpx.destroy(cb),
                    (cb) => this.dpt.destroy(cb)
                ], (err) => {
                    if (err)
                        return reject(err);
                    this.started = false;
                    resolve();
                });
            });
        });
    }
    /**
     * Handles errors from server and peers
     * @private
     * @param  {Error} error
     * @param  {Peer} peer
     * @emits  error
     */
    error(error, peer) {
        if (ignoredErrors.test(error.message)) {
            return;
        }
        if (peer) {
            this.emit('error', error);
        }
        else {
            throw error;
        }
    }
    /**
     * Get the rlpx protocol for this proto
     *
     * @param {IProtocol} proto - the protocol to resolve
     */
    getRlpxProto(proto) {
        return proto.peer.peer.getProtocols()
            .find((p) => p
            .constructor
            .name
            .toLowerCase() === proto.id);
    }
    /**
     *
     * @param rlpxPeer
     * @param reason
     */
    disconnect(rlpxPeer, reason) {
        if (rlpxPeer.getId()) {
            const id = rlpxPeer.getId().toString('hex');
            const devp2pPeer = this.peers.get(id);
            if (devp2pPeer) {
                this.peers.delete(id);
                this.logger(`Peer disconnected (${rlpxPeer.getDisconnectPrefix(reason)}): ${id}`);
                this.emit('kitsunet:peer:disconnected', devp2pPeer);
            }
        }
    }
    /**
     * Initializes RLPx instance for peer management
     * @private
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rlpx.on('peer:added', (rlpxPeer) => __awaiter(this, void 0, void 0, function* () {
                const devp2pPeer = new devp2p_peer_1.Devp2pPeer(rlpxPeer);
                const protos = this.registerProtos(this.protocolRegistry, devp2pPeer);
                for (const proto of protos) {
                    const rlpxProto = this.getRlpxProto(proto);
                    if (rlpxProto) {
                        rlpxProto.on('message', (code, payload) => __awaiter(this, void 0, void 0, function* () {
                            var e_1, _a;
                            const source = {
                                [Symbol.asyncIterator]: function () {
                                    return __asyncGenerator(this, arguments, function* () {
                                        yield yield __await([code, ...payload]);
                                    });
                                }
                            };
                            try {
                                // read from remote
                                for (var _b = __asyncValues(proto.receive(source)), _c; _c = yield _b.next(), !_c.done;) {
                                    const msg = _c.value;
                                    return msg;
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }));
                    }
                    yield proto.handshake();
                }
                this.peers.set(devp2pPeer.id, devp2pPeer);
                this.emit('kitsunet:peer:connected', devp2pPeer);
            }));
            this.rlpx.on('peer:removed', (rlpxPeer, reason) => {
                this.disconnect(rlpxPeer, reason);
            });
            this.rlpx.on('peer:error', (rlpxPeer, error) => {
                this.disconnect(rlpxPeer, error);
                // this.error(error, rlpxPeer)
            });
            // this.rlpx.on('error', e => this.error(e))
            this.rlpx.on('error', e => debug(e));
            this.rlpx.on('listening', () => {
                const enode = {
                    transport: 'devp2p',
                    url: `enode://${this.rlpx._id.toString('hex')}@[::]:${this.peerInfo.tcpPort}`
                };
                this.emit('listening', enode);
                console.log(`devp2p listening on ${enode.url}`);
            });
            const { tcpPort, address } = this.peerInfo;
            if (tcpPort) {
                this.rlpx.listen(tcpPort, address);
            }
        });
    }
    send(msg, protocol, peer) {
        if (!peer || !protocol) {
            throw new Error('both peer and protocol are required!');
        }
        const rlpxProto = this.getRlpxProto(protocol);
        if (!rlpxProto) {
            throw new Error('no such protocol!');
        }
        let res;
        try {
            res = rlpxProto._send(msg.shift(), msg.shift());
        }
        catch (e) {
            debug(e);
        }
        return res;
    }
};
Devp2pNode = __decorate([
    opium_decorators_1.register(),
    __param(2, opium_decorators_1.register(blockchain_1.EthChain)),
    __param(3, opium_decorators_1.register('devp2p-peer-info')),
    __param(5, opium_decorators_1.register('protocol-registry')),
    __metadata("design:paramtypes", [ethereumjs_devp2p_1.DPT,
        ethereumjs_devp2p_1.RLPx, Object, Object, ethereumjs_common_1.default, Array])
], Devp2pNode);
exports.Devp2pNode = Devp2pNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUF1QztBQUN2QyxxQ0FBaUM7QUFDakMsK0NBQTBDO0FBQzFDLHVEQUEyQztBQUMzQyxpQ0FBZ0M7QUFFaEMseURBTzBCO0FBRTFCLGlEQUt5QjtBQUV6QixvREFBMkQ7QUFDM0QsMEVBQXNDO0FBRXRDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBRS9DLE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQy9CLE9BQU87SUFDUCxZQUFZO0lBQ1osV0FBVztJQUNYLG9CQUFvQjtJQUNwQixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsYUFBYTtJQUNiLDBCQUEwQjtJQUMxQiwwQkFBMEI7SUFDMUIsd0JBQXdCO0NBQ3pCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFFWjs7Ozs7R0FLRztBQUVILElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxXQUFnQjtJQWtCOUMsWUFBb0IsR0FBUSxFQUNSLElBQVUsRUFFVixLQUFrQixFQUVsQixRQUFrQixFQUNsQixNQUFjLEVBRWIsZ0JBQW1EO1FBQ3RFLEtBQUssRUFBRSxDQUFBO1FBVFcsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNSLFNBQUksR0FBSixJQUFJLENBQU07UUFFVixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBRWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUViLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUM7UUF6QnhF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QUVELElBQUksR0FBUSxDQUFBO1FBQ1osSUFBSTtZQUNGLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFFLEdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRyxHQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtTQUNsRTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ1Q7UUFFRCxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7Q0FDRixDQUFBO0FBck5ZLFVBQVU7SUFEdEIsMkJBQVEsRUFBRTtJQXFCSyxXQUFBLDJCQUFRLENBQUMscUJBQVEsQ0FBQyxDQUFBO0lBRWxCLFdBQUEsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBRzVCLFdBQUEsMkJBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO3FDQVBsQix1QkFBRztRQUNGLHdCQUFJLGtCQUtGLDJCQUFNO0dBeEJ2QixVQUFVLENBcU50QjtBQXJOWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRGVidWcsIHsgRGVidWdnZXIgfSBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9ub2RlJ1xuaW1wb3J0IHsgRGV2cDJwUGVlciB9IGZyb20gJy4vZGV2cDJwLXBlZXInXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBwYXJhbGxlbCB9IGZyb20gJ2FzeW5jJ1xuXG5pbXBvcnQge1xuICBQZWVyLFxuICBEUFQsXG4gIFJMUHgsXG4gIFBlZXJJbmZvLFxuICBMRVMsXG4gIEVUSFxufSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcblxuaW1wb3J0IHtcbiAgTmV0d29ya1R5cGUsXG4gIElQcm90b2NvbCxcbiAgSVByb3RvY29sRGVzY3JpcHRvcixcbiAgSUNhcGFiaWxpdHlcbn0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcydcblxuaW1wb3J0IHsgRXRoQ2hhaW4sIElCbG9ja2NoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCBDb21tb24gZnJvbSAnZXRoZXJldW1qcy1jb21tb24nXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0Om5ldDpkZXZwMnA6bm9kZScpXG5cbmNvbnN0IGlnbm9yZWRFcnJvcnMgPSBuZXcgUmVnRXhwKFtcbiAgJ0VQSVBFJyxcbiAgJ0VDT05OUkVTRVQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ05ldHdvcmtJZCBtaXNtYXRjaCcsXG4gICdUaW1lb3V0IGVycm9yOiBwaW5nJyxcbiAgJ0dlbmVzaXMgYmxvY2sgbWlzbWF0Y2gnLFxuICAnSGFuZHNoYWtlIHRpbWVkIG91dCcsXG4gICdJbnZhbGlkIGFkZHJlc3MgYnVmZmVyJyxcbiAgJ0ludmFsaWQgTUFDJyxcbiAgJ0ludmFsaWQgdGltZXN0YW1wIGJ1ZmZlcicsXG4gICdIYXNoIHZlcmlmaWNhdGlvbiBmYWlsZWQnLFxuICAnc2hvdWxkIGhhdmUgdmFsaWQgdGFnOidcbl0uam9pbignfCcpKVxuXG4vKipcbiAqIERldnAycCBub2RlXG4gKlxuICogQGZpcmVzIFJscHhOb2RlI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgUmxweE5vZGUja2l0c3VuZXQ6cGVlcjpkaXNjb25uZWN0ZWQgLSBmaXJlcyB3aGVuIGEgcGVlciBkaXNjb25uZWN0c1xuICovXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIERldnAycE5vZGUgZXh0ZW5kcyBOb2RlPERldnAycFBlZXI+IHtcbiAgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlXG4gIHBlZXI/OiBEZXZwMnBQZWVyXG5cbiAgbG9nZ2VyOiBEZWJ1Z2dlciA9IGRlYnVnXG5cbiAgLy8gdGhlIHByb3RvY29scyB0aGF0IHRoaXMgbm9kZSBzdXBwb3J0c1xuICBjYXBzOiBJQ2FwYWJpbGl0eVtdID0gW1xuICAgIHtcbiAgICAgIGlkOiAnZXRoJyxcbiAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ11cbiAgICB9XG4gIF1cblxuICBnZXQgdHlwZSAoKTogTmV0d29ya1R5cGUge1xuICAgIHJldHVybiBOZXR3b3JrVHlwZS5ERVZQMlBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgZHB0OiBEUFQsXG4gICAgICAgICAgICAgICBwdWJsaWMgcmxweDogUkxQeCxcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKVxuICAgICAgICAgICAgICAgcHVibGljIHBlZXJJbmZvOiBQZWVySW5mbyxcbiAgICAgICAgICAgICAgIHB1YmxpYyBjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcigncHJvdG9jb2wtcmVnaXN0cnknKVxuICAgICAgICAgICAgICAgcHJpdmF0ZSBwcm90b2NvbFJlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPERldnAycFBlZXI+W10pIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgRGV2cDJwL1JMUHggc2VydmVyLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqIHJlc29sdmVzIG9uY2Ugc2VydmVyIGhhcyBiZWVuIHN0YXJ0ZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBzdGFydCAoKTogUHJvbWlzZSA8dm9pZD4ge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgdWRwUG9ydCwgYWRkcmVzcyB9ID0gdGhpcy5wZWVySW5mb1xuICAgIHRoaXMuZHB0LmJpbmQodWRwUG9ydCwgYWRkcmVzcylcbiAgICB0aGlzLmRwdC5vbignZXJyb3InLCAoZSkgPT4gZGVidWcoZSkpXG4gICAgYXdhaXQgdGhpcy5pbml0KClcbiAgICB0aGlzLmNvbW1vbi5ib290c3RyYXBOb2RlcygpLm1hcChhc3luYyAobm9kZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBib290bm9kZTogUGVlckluZm8gPSB7XG4gICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICBhZGRyZXNzOiBub2RlLmlwLFxuICAgICAgICB1ZHBQb3J0OiBub2RlLnBvcnQsXG4gICAgICAgIHRjcFBvcnQ6IG5vZGUucG9ydFxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5kcHQuYm9vdHN0cmFwKGJvb3Rub2RlKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWJ1ZyhlKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogU3RvcCBEZXZwMnAvUkxQeCBzZXJ2ZXIuIFJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogcmVzb2x2ZXMgb25jZSBzZXJ2ZXIgaGFzIGJlZW4gc3RvcHBlZC5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcGFyYWxsZWwoXG4gICAgICAgIFtcbiAgICAgICAgICAoY2IpID0+IHRoaXMucmxweC5kZXN0cm95KGNiKSxcbiAgICAgICAgICAoY2IpID0+IHRoaXMuZHB0LmRlc3Ryb3koY2IpXG4gICAgICAgIF0sXG4gICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBlcnJvcnMgZnJvbSBzZXJ2ZXIgYW5kIHBlZXJzXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0Vycm9yfSBlcnJvclxuICAgKiBAcGFyYW0gIHtQZWVyfSBwZWVyXG4gICAqIEBlbWl0cyAgZXJyb3JcbiAgICovXG4gIGVycm9yIChlcnJvcjogRXJyb3IsIHBlZXI/OiBQZWVyKSB7XG4gICAgaWYgKGlnbm9yZWRFcnJvcnMudGVzdChlcnJvci5tZXNzYWdlKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHBlZXIpIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBybHB4IHByb3RvY29sIGZvciB0aGlzIHByb3RvXG4gICAqXG4gICAqIEBwYXJhbSB7SVByb3RvY29sfSBwcm90byAtIHRoZSBwcm90b2NvbCB0byByZXNvbHZlXG4gICAqL1xuICBwcml2YXRlIGdldFJscHhQcm90byAocHJvdG86IElQcm90b2NvbDxEZXZwMnBQZWVyPik6IEVUSCB8IExFUyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHByb3RvLnBlZXIucGVlci5nZXRQcm90b2NvbHMoKVxuICAgICAgLmZpbmQoKHApID0+IHBcbiAgICAgICAgLmNvbnN0cnVjdG9yXG4gICAgICAgIC5uYW1lXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpID09PSBwcm90by5pZClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmxweFBlZXJcbiAgICogQHBhcmFtIHJlYXNvblxuICAgKi9cbiAgcHJpdmF0ZSBkaXNjb25uZWN0IChybHB4UGVlciwgcmVhc29uKSB7XG4gICAgaWYgKHJscHhQZWVyLmdldElkKCkpIHtcbiAgICAgIGNvbnN0IGlkID0gcmxweFBlZXIuZ2V0SWQoKS50b1N0cmluZygnaGV4JylcbiAgICAgIGNvbnN0IGRldnAycFBlZXIgPSB0aGlzLnBlZXJzLmdldChpZClcbiAgICAgIGlmIChkZXZwMnBQZWVyKSB7XG4gICAgICAgIHRoaXMucGVlcnMuZGVsZXRlKGlkKVxuICAgICAgICB0aGlzLmxvZ2dlcihgUGVlciBkaXNjb25uZWN0ZWQgKCR7cmxweFBlZXIuZ2V0RGlzY29ubmVjdFByZWZpeChyZWFzb24pfSk6ICR7aWR9YClcbiAgICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIGRldnAycFBlZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFJMUHggaW5zdGFuY2UgZm9yIHBlZXIgbWFuYWdlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0ICgpIHtcbiAgICB0aGlzLnJscHgub24oJ3BlZXI6YWRkZWQnLCBhc3luYyAocmxweFBlZXI6IFBlZXIpID0+IHtcbiAgICAgIGNvbnN0IGRldnAycFBlZXI6IERldnAycFBlZXIgPSBuZXcgRGV2cDJwUGVlcihybHB4UGVlcilcbiAgICAgIGNvbnN0IHByb3RvcyA9IHRoaXMucmVnaXN0ZXJQcm90b3ModGhpcy5wcm90b2NvbFJlZ2lzdHJ5LCBkZXZwMnBQZWVyKVxuICAgICAgZm9yIChjb25zdCBwcm90byBvZiBwcm90b3MpIHtcbiAgICAgICAgY29uc3QgcmxweFByb3RvID0gdGhpcy5nZXRSbHB4UHJvdG8ocHJvdG8pXG4gICAgICAgIGlmIChybHB4UHJvdG8pIHtcbiAgICAgICAgICBybHB4UHJvdG8ub24oJ21lc3NhZ2UnLCBhc3luYyAoY29kZTogYW55LCBwYXlsb2FkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIFtjb2RlLCAuLi5wYXlsb2FkXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlYWQgZnJvbSByZW1vdGVcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHByb3RvLnJlY2VpdmUoc291cmNlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbXNnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHByb3RvLmhhbmRzaGFrZSgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMucGVlcnMuc2V0KGRldnAycFBlZXIuaWQsIGRldnAycFBlZXIpXG4gICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkJywgZGV2cDJwUGVlcilcbiAgICB9KVxuXG4gICAgdGhpcy5ybHB4Lm9uKCdwZWVyOnJlbW92ZWQnLCAocmxweFBlZXIsIHJlYXNvbikgPT4ge1xuICAgICAgdGhpcy5kaXNjb25uZWN0KHJscHhQZWVyLCByZWFzb24pXG4gICAgfSlcblxuICAgIHRoaXMucmxweC5vbigncGVlcjplcnJvcicsIChybHB4UGVlciwgZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuZGlzY29ubmVjdChybHB4UGVlciwgZXJyb3IpXG4gICAgICAvLyB0aGlzLmVycm9yKGVycm9yLCBybHB4UGVlcilcbiAgICB9KVxuXG4gICAgLy8gdGhpcy5ybHB4Lm9uKCdlcnJvcicsIGUgPT4gdGhpcy5lcnJvcihlKSlcbiAgICB0aGlzLnJscHgub24oJ2Vycm9yJywgZSA9PiBkZWJ1ZyhlKSlcbiAgICB0aGlzLnJscHgub24oJ2xpc3RlbmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGVub2RlID0ge1xuICAgICAgICB0cmFuc3BvcnQ6ICdkZXZwMnAnLFxuICAgICAgICB1cmw6IGBlbm9kZTovLyR7dGhpcy5ybHB4Ll9pZC50b1N0cmluZygnaGV4Jyl9QFs6Ol06JHt0aGlzLnBlZXJJbmZvLnRjcFBvcnR9YFxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdsaXN0ZW5pbmcnLCBlbm9kZSlcbiAgICAgIGNvbnNvbGUubG9nKGBkZXZwMnAgbGlzdGVuaW5nIG9uICR7ZW5vZGUudXJsfWApXG4gICAgfSlcblxuICAgIGNvbnN0IHsgdGNwUG9ydCwgYWRkcmVzcyB9ID0gdGhpcy5wZWVySW5mb1xuICAgIGlmICh0Y3BQb3J0KSB7XG4gICAgICB0aGlzLnJscHgubGlzdGVuKHRjcFBvcnQsIGFkZHJlc3MpXG4gICAgfVxuICB9XG5cbiAgc2VuZDxULCBVID0gVD4gKG1zZzogVCB8IFRbXSxcbiAgICAgICAgICAgICAgICAgIHByb3RvY29sPzogSVByb3RvY29sPERldnAycFBlZXI+LFxuICAgICAgICAgICAgICAgICAgcGVlcj86IERldnAycFBlZXIpOiBQcm9taXNlPFUgfCBVW10+IHtcbiAgICBpZiAoIXBlZXIgfHwgIXByb3RvY29sKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JvdGggcGVlciBhbmQgcHJvdG9jb2wgYXJlIHJlcXVpcmVkIScpXG4gICAgfVxuXG4gICAgY29uc3QgcmxweFByb3RvID0gdGhpcy5nZXRSbHB4UHJvdG8ocHJvdG9jb2wpXG4gICAgaWYgKCFybHB4UHJvdG8pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3VjaCBwcm90b2NvbCEnKVxuICAgIH1cblxuICAgIGxldCByZXM6IGFueVxuICAgIHRyeSB7XG4gICAgICByZXMgPSBybHB4UHJvdG8uX3NlbmQoKG1zZyBhcyBUW10pLnNoaWZ0KCksIChtc2cgYXMgVFtdKS5zaGlmdCgpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG4iXX0=