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
                const devp2pPeer = new devp2p_peer_1.Devp2pPeer(rlpxPeer, this);
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
                    try {
                        yield proto.handshake();
                    }
                    catch (e) {
                        debug(e);
                        this.banPeer(devp2pPeer);
                        return;
                    }
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
    disconnectPeer(peer, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return peer.peer.disconnect(reason);
        });
    }
    banPeer(peer, maxAge = 1000 * 6, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dpt.banPeer(peer.peer, maxAge);
            this.disconnectPeer(peer, reason);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUF1QztBQUN2QyxxQ0FBaUM7QUFDakMsK0NBQTBDO0FBQzFDLHVEQUEyQztBQUMzQyxpQ0FBZ0M7QUFFaEMseURBTzBCO0FBRTFCLGlEQUt5QjtBQUV6QixvREFBMkQ7QUFDM0QsMEVBQXNDO0FBR3RDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBRS9DLE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQy9CLE9BQU87SUFDUCxZQUFZO0lBQ1osV0FBVztJQUNYLG9CQUFvQjtJQUNwQixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsYUFBYTtJQUNiLDBCQUEwQjtJQUMxQiwwQkFBMEI7SUFDMUIsd0JBQXdCO0NBQ3pCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFFWjs7Ozs7R0FLRztBQUVILElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxXQUFnQjtJQWtCOUMsWUFBb0IsR0FBUSxFQUNSLElBQVUsRUFFVixLQUFrQixFQUVsQixRQUFrQixFQUNsQixNQUFjLEVBRWIsZ0JBQW1EO1FBQ3RFLEtBQUssRUFBRSxDQUFBO1FBVFcsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNSLFNBQUksR0FBSixJQUFJLENBQU07UUFFVixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBRWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUViLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUM7UUF6QnhF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dCdcblxuaW1wb3J0IERlYnVnLCB7IERlYnVnZ2VyIH0gZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbm9kZSdcbmltcG9ydCB7IERldnAycFBlZXIgfSBmcm9tICcuL2RldnAycC1wZWVyJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgcGFyYWxsZWwgfSBmcm9tICdhc3luYydcblxuaW1wb3J0IHtcbiAgUGVlcixcbiAgRFBULFxuICBSTFB4LFxuICBQZWVySW5mbyxcbiAgTEVTLFxuICBFVEhcbn0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5cbmltcG9ydCB7XG4gIE5ldHdvcmtUeXBlLFxuICBJUHJvdG9jb2wsXG4gIElQcm90b2NvbERlc2NyaXB0b3IsXG4gIElDYXBhYmlsaXR5XG59IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnXG5cbmltcG9ydCB7IEV0aENoYWluLCBJQmxvY2tjaGFpbiB9IGZyb20gJy4uLy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuLi8uLi9uZXR3b3JrLXBlZXInXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0Om5ldDpkZXZwMnA6bm9kZScpXG5cbmNvbnN0IGlnbm9yZWRFcnJvcnMgPSBuZXcgUmVnRXhwKFtcbiAgJ0VQSVBFJyxcbiAgJ0VDT05OUkVTRVQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ05ldHdvcmtJZCBtaXNtYXRjaCcsXG4gICdUaW1lb3V0IGVycm9yOiBwaW5nJyxcbiAgJ0dlbmVzaXMgYmxvY2sgbWlzbWF0Y2gnLFxuICAnSGFuZHNoYWtlIHRpbWVkIG91dCcsXG4gICdJbnZhbGlkIGFkZHJlc3MgYnVmZmVyJyxcbiAgJ0ludmFsaWQgTUFDJyxcbiAgJ0ludmFsaWQgdGltZXN0YW1wIGJ1ZmZlcicsXG4gICdIYXNoIHZlcmlmaWNhdGlvbiBmYWlsZWQnLFxuICAnc2hvdWxkIGhhdmUgdmFsaWQgdGFnOidcbl0uam9pbignfCcpKVxuXG4vKipcbiAqIERldnAycCBub2RlXG4gKlxuICogQGZpcmVzIFJscHhOb2RlI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgUmxweE5vZGUja2l0c3VuZXQ6cGVlcjpkaXNjb25uZWN0ZWQgLSBmaXJlcyB3aGVuIGEgcGVlciBkaXNjb25uZWN0c1xuICovXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIERldnAycE5vZGUgZXh0ZW5kcyBOb2RlPERldnAycFBlZXI+IHtcbiAgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlXG4gIHBlZXI/OiBEZXZwMnBQZWVyXG5cbiAgbG9nZ2VyOiBEZWJ1Z2dlciA9IGRlYnVnXG5cbiAgLy8gdGhlIHByb3RvY29scyB0aGF0IHRoaXMgbm9kZSBzdXBwb3J0c1xuICBjYXBzOiBJQ2FwYWJpbGl0eVtdID0gW1xuICAgIHtcbiAgICAgIGlkOiAnZXRoJyxcbiAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ11cbiAgICB9XG4gIF1cblxuICBnZXQgdHlwZSAoKTogTmV0d29ya1R5cGUge1xuICAgIHJldHVybiBOZXR3b3JrVHlwZS5ERVZQMlBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgZHB0OiBEUFQsXG4gICAgICAgICAgICAgICBwdWJsaWMgcmxweDogUkxQeCxcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKVxuICAgICAgICAgICAgICAgcHVibGljIHBlZXJJbmZvOiBQZWVySW5mbyxcbiAgICAgICAgICAgICAgIHB1YmxpYyBjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcigncHJvdG9jb2wtcmVnaXN0cnknKVxuICAgICAgICAgICAgICAgcHJpdmF0ZSBwcm90b2NvbFJlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPERldnAycFBlZXI+W10pIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgRGV2cDJwL1JMUHggc2VydmVyLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqIHJlc29sdmVzIG9uY2Ugc2VydmVyIGhhcyBiZWVuIHN0YXJ0ZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBzdGFydCAoKTogUHJvbWlzZSA8dm9pZD4ge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgdWRwUG9ydCwgYWRkcmVzcyB9ID0gdGhpcy5wZWVySW5mb1xuICAgIHRoaXMuZHB0LmJpbmQodWRwUG9ydCwgYWRkcmVzcylcbiAgICB0aGlzLmRwdC5vbignZXJyb3InLCAoZSkgPT4gZGVidWcoZSkpXG4gICAgYXdhaXQgdGhpcy5pbml0KClcbiAgICB0aGlzLmNvbW1vbi5ib290c3RyYXBOb2RlcygpLm1hcChhc3luYyAobm9kZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBib290bm9kZTogUGVlckluZm8gPSB7XG4gICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICBhZGRyZXNzOiBub2RlLmlwLFxuICAgICAgICB1ZHBQb3J0OiBub2RlLnBvcnQsXG4gICAgICAgIHRjcFBvcnQ6IG5vZGUucG9ydFxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5kcHQuYm9vdHN0cmFwKGJvb3Rub2RlKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWJ1ZyhlKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogU3RvcCBEZXZwMnAvUkxQeCBzZXJ2ZXIuIFJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogcmVzb2x2ZXMgb25jZSBzZXJ2ZXIgaGFzIGJlZW4gc3RvcHBlZC5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcGFyYWxsZWwoXG4gICAgICAgIFtcbiAgICAgICAgICAoY2IpID0+IHRoaXMucmxweC5kZXN0cm95KGNiKSxcbiAgICAgICAgICAoY2IpID0+IHRoaXMuZHB0LmRlc3Ryb3koY2IpXG4gICAgICAgIF0sXG4gICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBlcnJvcnMgZnJvbSBzZXJ2ZXIgYW5kIHBlZXJzXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0Vycm9yfSBlcnJvclxuICAgKiBAcGFyYW0gIHtQZWVyfSBwZWVyXG4gICAqIEBlbWl0cyAgZXJyb3JcbiAgICovXG4gIGVycm9yIChlcnJvcjogRXJyb3IsIHBlZXI/OiBQZWVyKSB7XG4gICAgaWYgKGlnbm9yZWRFcnJvcnMudGVzdChlcnJvci5tZXNzYWdlKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHBlZXIpIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBybHB4IHByb3RvY29sIGZvciB0aGlzIHByb3RvXG4gICAqXG4gICAqIEBwYXJhbSB7SVByb3RvY29sfSBwcm90byAtIHRoZSBwcm90b2NvbCB0byByZXNvbHZlXG4gICAqL1xuICBwcml2YXRlIGdldFJscHhQcm90byAocHJvdG86IElQcm90b2NvbDxEZXZwMnBQZWVyPik6IEVUSCB8IExFUyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHByb3RvLnBlZXIucGVlci5nZXRQcm90b2NvbHMoKVxuICAgICAgLmZpbmQoKHApID0+IHBcbiAgICAgICAgLmNvbnN0cnVjdG9yXG4gICAgICAgIC5uYW1lXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpID09PSBwcm90by5pZClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmxweFBlZXJcbiAgICogQHBhcmFtIHJlYXNvblxuICAgKi9cbiAgcHJpdmF0ZSBkaXNjb25uZWN0IChybHB4UGVlciwgcmVhc29uKSB7XG4gICAgaWYgKHJscHhQZWVyLmdldElkKCkpIHtcbiAgICAgIGNvbnN0IGlkID0gcmxweFBlZXIuZ2V0SWQoKS50b1N0cmluZygnaGV4JylcbiAgICAgIGNvbnN0IGRldnAycFBlZXIgPSB0aGlzLnBlZXJzLmdldChpZClcbiAgICAgIGlmIChkZXZwMnBQZWVyKSB7XG4gICAgICAgIHRoaXMucGVlcnMuZGVsZXRlKGlkKVxuICAgICAgICB0aGlzLmxvZ2dlcihgUGVlciBkaXNjb25uZWN0ZWQgKCR7cmxweFBlZXIuZ2V0RGlzY29ubmVjdFByZWZpeChyZWFzb24pfSk6ICR7aWR9YClcbiAgICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIGRldnAycFBlZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIFJMUHggaW5zdGFuY2UgZm9yIHBlZXIgbWFuYWdlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0ICgpIHtcbiAgICB0aGlzLnJscHgub24oJ3BlZXI6YWRkZWQnLCBhc3luYyAocmxweFBlZXI6IFBlZXIpID0+IHtcbiAgICAgIGNvbnN0IGRldnAycFBlZXI6IERldnAycFBlZXIgPSBuZXcgRGV2cDJwUGVlcihybHB4UGVlciwgdGhpcylcbiAgICAgIGNvbnN0IHByb3RvcyA9IHRoaXMucmVnaXN0ZXJQcm90b3ModGhpcy5wcm90b2NvbFJlZ2lzdHJ5LCBkZXZwMnBQZWVyIGFzIHVua25vd24gYXMgTmV0d29ya1BlZXI8YW55LCBhbnk+KVxuICAgICAgZm9yIChjb25zdCBwcm90byBvZiBwcm90b3MpIHtcbiAgICAgICAgY29uc3QgcmxweFByb3RvID0gdGhpcy5nZXRSbHB4UHJvdG8ocHJvdG8pXG4gICAgICAgIGlmIChybHB4UHJvdG8pIHtcbiAgICAgICAgICBybHB4UHJvdG8ub24oJ21lc3NhZ2UnLCBhc3luYyAoY29kZTogYW55LCBwYXlsb2FkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIFtjb2RlLCAuLi5wYXlsb2FkXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlYWQgZnJvbSByZW1vdGVcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHByb3RvLnJlY2VpdmUoc291cmNlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbXNnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgcHJvdG8uaGFuZHNoYWtlKClcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlYnVnKGUpXG4gICAgICAgICAgdGhpcy5iYW5QZWVyKGRldnAycFBlZXIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wZWVycy5zZXQoZGV2cDJwUGVlci5pZCwgZGV2cDJwUGVlcilcbiAgICAgIHRoaXMuZW1pdCgna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCBkZXZwMnBQZWVyKVxuICAgIH0pXG5cbiAgICB0aGlzLnJscHgub24oJ3BlZXI6cmVtb3ZlZCcsIChybHB4UGVlciwgcmVhc29uKSA9PiB7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QocmxweFBlZXIsIHJlYXNvbilcbiAgICB9KVxuXG4gICAgdGhpcy5ybHB4Lm9uKCdwZWVyOmVycm9yJywgKHJscHhQZWVyLCBlcnJvcikgPT4ge1xuICAgICAgdGhpcy5kaXNjb25uZWN0KHJscHhQZWVyLCBlcnJvcilcbiAgICAgIC8vIHRoaXMuZXJyb3IoZXJyb3IsIHJscHhQZWVyKVxuICAgIH0pXG5cbiAgICAvLyB0aGlzLnJscHgub24oJ2Vycm9yJywgZSA9PiB0aGlzLmVycm9yKGUpKVxuICAgIHRoaXMucmxweC5vbignZXJyb3InLCBlID0+IGRlYnVnKGUpKVxuICAgIHRoaXMucmxweC5vbignbGlzdGVuaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgZW5vZGUgPSB7XG4gICAgICAgIHRyYW5zcG9ydDogJ2RldnAycCcsXG4gICAgICAgIHVybDogYGVub2RlOi8vJHt0aGlzLnJscHguX2lkLnRvU3RyaW5nKCdoZXgnKX1AWzo6XToke3RoaXMucGVlckluZm8udGNwUG9ydH1gXG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoJ2xpc3RlbmluZycsIGVub2RlKVxuICAgICAgY29uc29sZS5sb2coYGRldnAycCBsaXN0ZW5pbmcgb24gJHtlbm9kZS51cmx9YClcbiAgICB9KVxuXG4gICAgY29uc3QgeyB0Y3BQb3J0LCBhZGRyZXNzIH0gPSB0aGlzLnBlZXJJbmZvXG4gICAgaWYgKHRjcFBvcnQpIHtcbiAgICAgIHRoaXMucmxweC5saXN0ZW4odGNwUG9ydCwgYWRkcmVzcylcbiAgICB9XG4gIH1cblxuICBzZW5kPFQsIFUgPSBUPiAobXNnOiBUIHwgVFtdLFxuICAgICAgICAgICAgICAgICAgcHJvdG9jb2w/OiBJUHJvdG9jb2w8RGV2cDJwUGVlcj4sXG4gICAgICAgICAgICAgICAgICBwZWVyPzogRGV2cDJwUGVlcik6IFByb21pc2U8VSB8IFVbXT4ge1xuICAgIGlmICghcGVlciB8fCAhcHJvdG9jb2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYm90aCBwZWVyIGFuZCBwcm90b2NvbCBhcmUgcmVxdWlyZWQhJylcbiAgICB9XG5cbiAgICBjb25zdCBybHB4UHJvdG8gPSB0aGlzLmdldFJscHhQcm90byhwcm90b2NvbClcbiAgICBpZiAoIXJscHhQcm90bykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIHByb3RvY29sIScpXG4gICAgfVxuXG4gICAgbGV0IHJlczogYW55XG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IHJscHhQcm90by5fc2VuZCgobXNnIGFzIFRbXSkuc2hpZnQoKSwgKG1zZyBhcyBUW10pLnNoaWZ0KCkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBhc3luYyBkaXNjb25uZWN0UGVlciAocGVlcjogRGV2cDJwUGVlciwgcmVhc29uPzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHBlZXIucGVlci5kaXNjb25uZWN0KHJlYXNvbilcbiAgfVxuXG4gIGFzeW5jIGJhblBlZXIgKHBlZXI6IERldnAycFBlZXIsIG1heEFnZTogbnVtYmVyID0gMTAwMCAqIDYsIHJlYXNvbj86IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZHB0LmJhblBlZXIocGVlci5wZWVyLCBtYXhBZ2UpXG4gICAgdGhpcy5kaXNjb25uZWN0UGVlcihwZWVyLCByZWFzb24pXG4gIH1cbn1cbiJdfQ==