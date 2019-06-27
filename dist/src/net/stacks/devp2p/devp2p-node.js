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
    constructor(dpt, rlpx, chain, peerInfo, peer, common, protocolRegistry) {
        super();
        this.dpt = dpt;
        this.rlpx = rlpx;
        this.chain = chain;
        this.peerInfo = peerInfo;
        this.peer = peer;
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
    __param(4, opium_decorators_1.register('devp2p-peer')),
    __param(6, opium_decorators_1.register('protocol-registry')),
    __metadata("design:paramtypes", [ethereumjs_devp2p_1.DPT,
        ethereumjs_devp2p_1.RLPx, Object, Object, devp2p_peer_1.Devp2pPeer,
        ethereumjs_common_1.default, Array])
], Devp2pNode);
exports.Devp2pNode = Devp2pNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUF1QztBQUN2QyxxQ0FBaUM7QUFDakMsK0NBQTBDO0FBQzFDLHVEQUEyQztBQUMzQyxpQ0FBZ0M7QUFHaEMseURBTzBCO0FBRTFCLGlEQUt5QjtBQUV6QixvREFBMkQ7QUFDM0QsMEVBQXNDO0FBR3RDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBRS9DLE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQy9CLE9BQU87SUFDUCxZQUFZO0lBQ1osV0FBVztJQUNYLG9CQUFvQjtJQUNwQixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsYUFBYTtJQUNiLDBCQUEwQjtJQUMxQiwwQkFBMEI7SUFDMUIsd0JBQXdCO0NBQ3pCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFFWjs7Ozs7R0FLRztBQUVILElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxXQUFnQjtJQWdCOUMsWUFBb0IsR0FBUSxFQUNSLElBQVUsRUFFVixLQUFrQixFQUVsQixRQUFrQixFQUVsQixJQUFnQixFQUNoQixNQUFjLEVBRWIsZ0JBQW1EO1FBQ3RFLEtBQUssRUFBRSxDQUFBO1FBWFcsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNSLFNBQUksR0FBSixJQUFJLENBQU07UUFFVixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBRWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFFbEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFR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QkFBSSxrQkFNSix3QkFBVTtRQUNSLDJCQUFNO0dBeEJ2QixVQUFVLENBb090QjtBQXBPWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRGVidWcsIHsgRGVidWdnZXIgfSBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9ub2RlJ1xuaW1wb3J0IHsgRGV2cDJwUGVlciB9IGZyb20gJy4vZGV2cDJwLXBlZXInXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBwYXJhbGxlbCB9IGZyb20gJ2FzeW5jJ1xuaW1wb3J0IHsgRXh0cmFjdEZyb21EZXZwMnBQZWVyIH0gZnJvbSAnLi4vLi4vaGVscGVyLXR5cGVzJ1xuXG5pbXBvcnQge1xuICBQZWVyLFxuICBEUFQsXG4gIFJMUHgsXG4gIFBlZXJJbmZvLFxuICBMRVMsXG4gIEVUSFxufSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcblxuaW1wb3J0IHtcbiAgTmV0d29ya1R5cGUsXG4gIElQcm90b2NvbCxcbiAgSVByb3RvY29sRGVzY3JpcHRvcixcbiAgSUNhcGFiaWxpdHlcbn0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcydcblxuaW1wb3J0IHsgRXRoQ2hhaW4sIElCbG9ja2NoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCBDb21tb24gZnJvbSAnZXRoZXJldW1qcy1jb21tb24nXG5pbXBvcnQgeyBOZXR3b3JrUGVlciB9IGZyb20gJy4uLy4uL25ldHdvcmstcGVlcidcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6bmV0OmRldnAycDpub2RlJylcblxuY29uc3QgaWdub3JlZEVycm9ycyA9IG5ldyBSZWdFeHAoW1xuICAnRVBJUEUnLFxuICAnRUNPTk5SRVNFVCcsXG4gICdFVElNRURPVVQnLFxuICAnTmV0d29ya0lkIG1pc21hdGNoJyxcbiAgJ1RpbWVvdXQgZXJyb3I6IHBpbmcnLFxuICAnR2VuZXNpcyBibG9jayBtaXNtYXRjaCcsXG4gICdIYW5kc2hha2UgdGltZWQgb3V0JyxcbiAgJ0ludmFsaWQgYWRkcmVzcyBidWZmZXInLFxuICAnSW52YWxpZCBNQUMnLFxuICAnSW52YWxpZCB0aW1lc3RhbXAgYnVmZmVyJyxcbiAgJ0hhc2ggdmVyaWZpY2F0aW9uIGZhaWxlZCcsXG4gICdzaG91bGQgaGF2ZSB2YWxpZCB0YWc6J1xuXS5qb2luKCd8JykpXG5cbi8qKlxuICogRGV2cDJwIG5vZGVcbiAqXG4gKiBAZmlyZXMgUmxweE5vZGUja2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQgLSBmaXJlcyBvbiBuZXcgY29ubmVjdGVkIHBlZXJcbiAqIEBmaXJlcyBSbHB4Tm9kZSNraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCAtIGZpcmVzIHdoZW4gYSBwZWVyIGRpc2Nvbm5lY3RzXG4gKi9cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgRGV2cDJwTm9kZSBleHRlbmRzIE5vZGU8RGV2cDJwUGVlcj4ge1xuICBzdGFydGVkOiBib29sZWFuID0gZmFsc2VcbiAgbG9nZ2VyOiBEZWJ1Z2dlciA9IGRlYnVnXG5cbiAgLy8gdGhlIHByb3RvY29scyB0aGF0IHRoaXMgbm9kZSBzdXBwb3J0c1xuICBjYXBzOiBJQ2FwYWJpbGl0eVtdID0gW1xuICAgIHtcbiAgICAgIGlkOiAnZXRoJyxcbiAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ11cbiAgICB9XG4gIF1cblxuICBnZXQgdHlwZSAoKTogTmV0d29ya1R5cGUge1xuICAgIHJldHVybiBOZXR3b3JrVHlwZS5ERVZQMlBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgZHB0OiBEUFQsXG4gICAgICAgICAgICAgICBwdWJsaWMgcmxweDogUkxQeCxcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKVxuICAgICAgICAgICAgICAgcHVibGljIHBlZXJJbmZvOiBQZWVySW5mbyxcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZGV2cDJwLXBlZXInKVxuICAgICAgICAgICAgICAgcHVibGljIHBlZXI6IERldnAycFBlZXIsXG4gICAgICAgICAgICAgICBwdWJsaWMgY29tbW9uOiBDb21tb24sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3Byb3RvY29sLXJlZ2lzdHJ5JylcbiAgICAgICAgICAgICAgIHByaXZhdGUgcHJvdG9jb2xSZWdpc3RyeTogSVByb3RvY29sRGVzY3JpcHRvcjxEZXZwMnBQZWVyPltdKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IERldnAycC9STFB4IHNlcnZlci4gUmV0dXJucyBhIHByb21pc2UgdGhhdFxuICAgKiByZXNvbHZlcyBvbmNlIHNlcnZlciBoYXMgYmVlbiBzdGFydGVkLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgc3RhcnQgKCk6IFByb21pc2UgPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCB7IHVkcFBvcnQsIGFkZHJlc3MgfSA9IHRoaXMucGVlckluZm9cbiAgICB0aGlzLmRwdC5iaW5kKHVkcFBvcnQsIGFkZHJlc3MpXG4gICAgdGhpcy5kcHQub24oJ2Vycm9yJywgKGUpID0+IGRlYnVnKGUpKVxuICAgIGF3YWl0IHRoaXMuaW5pdCgpXG4gICAgdGhpcy5jb21tb24uYm9vdHN0cmFwTm9kZXMoKS5tYXAoYXN5bmMgKG5vZGU6IGFueSkgPT4ge1xuICAgICAgY29uc3QgYm9vdG5vZGU6IFBlZXJJbmZvID0ge1xuICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgYWRkcmVzczogbm9kZS5pcCxcbiAgICAgICAgdWRwUG9ydDogbm9kZS5wb3J0LFxuICAgICAgICB0Y3BQb3J0OiBub2RlLnBvcnRcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZHB0LmJvb3RzdHJhcChib290bm9kZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVidWcoZSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgRGV2cDJwL1JMUHggc2VydmVyLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqIHJlc29sdmVzIG9uY2Ugc2VydmVyIGhhcyBiZWVuIHN0b3BwZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBzdG9wICgpOiBQcm9taXNlPGFueT4ge1xuICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHBhcmFsbGVsKFxuICAgICAgICBbXG4gICAgICAgICAgKGNiKSA9PiB0aGlzLnJscHguZGVzdHJveShjYiksXG4gICAgICAgICAgKGNiKSA9PiB0aGlzLmRwdC5kZXN0cm95KGNiKVxuICAgICAgICBdLFxuICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgZXJyb3JzIGZyb20gc2VydmVyIGFuZCBwZWVyc1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtFcnJvcn0gZXJyb3JcbiAgICogQHBhcmFtICB7UGVlcn0gcGVlclxuICAgKiBAZW1pdHMgIGVycm9yXG4gICAqL1xuICBlcnJvciAoZXJyb3I6IEVycm9yLCBwZWVyPzogUGVlcikge1xuICAgIGlmIChpZ25vcmVkRXJyb3JzLnRlc3QoZXJyb3IubWVzc2FnZSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChwZWVyKSB7XG4gICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcmxweCBwcm90b2NvbCBmb3IgdGhpcyBwcm90b1xuICAgKlxuICAgKiBAcGFyYW0ge0lQcm90b2NvbH0gcHJvdG8gLSB0aGUgcHJvdG9jb2wgdG8gcmVzb2x2ZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRSbHB4UHJvdG8gKHByb3RvOiBJUHJvdG9jb2w8RGV2cDJwUGVlcj4pOiBFVEggfCBMRVMgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBwcm90by5wZWVyLnBlZXIuZ2V0UHJvdG9jb2xzKClcbiAgICAgIC5maW5kKChwKSA9PiBwXG4gICAgICAgIC5jb25zdHJ1Y3RvclxuICAgICAgICAubmFtZVxuICAgICAgICAudG9Mb3dlckNhc2UoKSA9PT0gcHJvdG8uaWQpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHJscHhQZWVyXG4gICAqIEBwYXJhbSByZWFzb25cbiAgICovXG4gIHByaXZhdGUgZGlzY29ubmVjdCAocmxweFBlZXIsIHJlYXNvbikge1xuICAgIGlmIChybHB4UGVlci5nZXRJZCgpKSB7XG4gICAgICBjb25zdCBpZCA9IHJscHhQZWVyLmdldElkKCkudG9TdHJpbmcoJ2hleCcpXG4gICAgICBjb25zdCBkZXZwMnBQZWVyID0gdGhpcy5wZWVycy5nZXQoaWQpXG4gICAgICBpZiAoZGV2cDJwUGVlcikge1xuICAgICAgICB0aGlzLnBlZXJzLmRlbGV0ZShpZClcbiAgICAgICAgdGhpcy5sb2dnZXIoYFBlZXIgZGlzY29ubmVjdGVkICgke3JscHhQZWVyLmdldERpc2Nvbm5lY3RQcmVmaXgocmVhc29uKX0pOiAke2lkfWApXG4gICAgICAgIHRoaXMuZW1pdCgna2l0c3VuZXQ6cGVlcjpkaXNjb25uZWN0ZWQnLCBkZXZwMnBQZWVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBSTFB4IGluc3RhbmNlIGZvciBwZWVyIG1hbmFnZW1lbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdCAoKSB7XG4gICAgdGhpcy5ybHB4Lm9uKCdwZWVyOmFkZGVkJywgYXN5bmMgKHJscHhQZWVyOiBQZWVyKSA9PiB7XG4gICAgICBjb25zdCBkZXZwMnBQZWVyOiBEZXZwMnBQZWVyID0gbmV3IERldnAycFBlZXIocmxweFBlZXIsIHRoaXMgYXMgdW5rbm93biBhcyBFeHRyYWN0RnJvbURldnAycFBlZXIpXG4gICAgICBjb25zdCBwcm90b3MgPSB0aGlzLnJlZ2lzdGVyUHJvdG9zKHRoaXMucHJvdG9jb2xSZWdpc3RyeSwgZGV2cDJwUGVlciBhcyB1bmtub3duIGFzIE5ldHdvcmtQZWVyPGFueSwgYW55PilcbiAgICAgIGZvciAoY29uc3QgcHJvdG8gb2YgcHJvdG9zKSB7XG4gICAgICAgIGNvbnN0IHJscHhQcm90byA9IHRoaXMuZ2V0UmxweFByb3RvKHByb3RvKVxuICAgICAgICBpZiAocmxweFByb3RvKSB7XG4gICAgICAgICAgcmxweFByb3RvLm9uKCdtZXNzYWdlJywgYXN5bmMgKGNvZGU6IGFueSwgcGF5bG9hZDogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2U6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgICAgICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBbY29kZSwgLi4ucGF5bG9hZF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZWFkIGZyb20gcmVtb3RlXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBwcm90by5yZWNlaXZlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1zZ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHByb3RvLmhhbmRzaGFrZSgpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkZWJ1ZyhlKVxuICAgICAgICAgIHRoaXMuYmFuUGVlcihkZXZwMnBQZWVyKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGVlcnMuc2V0KGRldnAycFBlZXIuaWQsIGRldnAycFBlZXIpXG4gICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkJywgZGV2cDJwUGVlcilcbiAgICB9KVxuXG4gICAgdGhpcy5ybHB4Lm9uKCdwZWVyOnJlbW92ZWQnLCAocmxweFBlZXIsIHJlYXNvbikgPT4ge1xuICAgICAgdGhpcy5kaXNjb25uZWN0KHJscHhQZWVyLCByZWFzb24pXG4gICAgfSlcblxuICAgIHRoaXMucmxweC5vbigncGVlcjplcnJvcicsIChybHB4UGVlciwgZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuZGlzY29ubmVjdChybHB4UGVlciwgZXJyb3IpXG4gICAgICAvLyB0aGlzLmVycm9yKGVycm9yLCBybHB4UGVlcilcbiAgICB9KVxuXG4gICAgLy8gdGhpcy5ybHB4Lm9uKCdlcnJvcicsIGUgPT4gdGhpcy5lcnJvcihlKSlcbiAgICB0aGlzLnJscHgub24oJ2Vycm9yJywgZSA9PiBkZWJ1ZyhlKSlcbiAgICB0aGlzLnJscHgub24oJ2xpc3RlbmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGVub2RlID0ge1xuICAgICAgICB0cmFuc3BvcnQ6ICdkZXZwMnAnLFxuICAgICAgICB1cmw6IGBlbm9kZTovLyR7dGhpcy5ybHB4Ll9pZC50b1N0cmluZygnaGV4Jyl9QFs6Ol06JHt0aGlzLnBlZXJJbmZvLnRjcFBvcnR9YFxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdsaXN0ZW5pbmcnLCBlbm9kZSlcbiAgICAgIGNvbnNvbGUubG9nKGBkZXZwMnAgbGlzdGVuaW5nIG9uICR7ZW5vZGUudXJsfWApXG4gICAgfSlcblxuICAgIGNvbnN0IHsgdGNwUG9ydCwgYWRkcmVzcyB9ID0gdGhpcy5wZWVySW5mb1xuICAgIGlmICh0Y3BQb3J0KSB7XG4gICAgICB0aGlzLnJscHgubGlzdGVuKHRjcFBvcnQsIGFkZHJlc3MpXG4gICAgfVxuICB9XG5cbiAgc2VuZDxULCBVID0gVD4gKG1zZzogVCB8IFRbXSxcbiAgICAgICAgICAgICAgICAgIHByb3RvY29sPzogSVByb3RvY29sPERldnAycFBlZXI+LFxuICAgICAgICAgICAgICAgICAgcGVlcj86IERldnAycFBlZXIpOiBQcm9taXNlPFUgfCBVW10+IHtcbiAgICBpZiAoIXBlZXIgfHwgIXByb3RvY29sKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JvdGggcGVlciBhbmQgcHJvdG9jb2wgYXJlIHJlcXVpcmVkIScpXG4gICAgfVxuXG4gICAgY29uc3QgcmxweFByb3RvID0gdGhpcy5nZXRSbHB4UHJvdG8ocHJvdG9jb2wpXG4gICAgaWYgKCFybHB4UHJvdG8pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3VjaCBwcm90b2NvbCEnKVxuICAgIH1cblxuICAgIGxldCByZXM6IGFueVxuICAgIHRyeSB7XG4gICAgICByZXMgPSBybHB4UHJvdG8uX3NlbmQoKG1zZyBhcyBUW10pLnNoaWZ0KCksIChtc2cgYXMgVFtdKS5zaGlmdCgpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgYXN5bmMgZGlzY29ubmVjdFBlZXIgKHBlZXI6IERldnAycFBlZXIsIHJlYXNvbj86IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBwZWVyLnBlZXIuZGlzY29ubmVjdChyZWFzb24pXG4gIH1cblxuICBhc3luYyBiYW5QZWVyIChwZWVyOiBEZXZwMnBQZWVyLCBtYXhBZ2U6IG51bWJlciA9IDEwMDAgKiA2LCByZWFzb24/OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmRwdC5iYW5QZWVyKHBlZXIucGVlciwgbWF4QWdlKVxuICAgIHRoaXMuZGlzY29ubmVjdFBlZXIocGVlciwgcmVhc29uKVxuICB9XG59XG4iXX0=