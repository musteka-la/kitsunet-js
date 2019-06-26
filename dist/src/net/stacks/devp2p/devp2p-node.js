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
                    try {
                        yield proto.handshake();
                    }
                    catch (e) {
                        debug(e);
                        this.dpt.banPeer(rlpxPeer.getId(), 1000 * 60);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUF1QztBQUN2QyxxQ0FBaUM7QUFDakMsK0NBQTBDO0FBQzFDLHVEQUEyQztBQUMzQyxpQ0FBZ0M7QUFFaEMseURBTzBCO0FBRTFCLGlEQUt5QjtBQUV6QixvREFBMkQ7QUFDM0QsMEVBQXNDO0FBRXRDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBRS9DLE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQy9CLE9BQU87SUFDUCxZQUFZO0lBQ1osV0FBVztJQUNYLG9CQUFvQjtJQUNwQixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsYUFBYTtJQUNiLDBCQUEwQjtJQUMxQiwwQkFBMEI7SUFDMUIsd0JBQXdCO0NBQ3pCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFFWjs7Ozs7R0FLRztBQUVILElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxXQUFnQjtJQWtCOUMsWUFBb0IsR0FBUSxFQUNSLElBQVUsRUFFVixLQUFrQixFQUVsQixRQUFrQixFQUNsQixNQUFjLEVBRWIsZ0JBQW1EO1FBQ3RFLEtBQUssRUFBRSxDQUFBO1FBVFcsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNSLFNBQUksR0FBSixJQUFJLENBQU07UUFFVixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBRWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUViLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUM7UUF6QnhF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TUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFBO1NBQ3hEO1FBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM3QyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1NBQ3JDO1FBRUQsSUFBSSxHQUFRLENBQUE7UUFDWixJQUFJO1lBQ0YsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUUsR0FBVyxDQUFDLEtBQUssRUFBRSxFQUFHLEdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1NBQ2xFO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDVDtRQUVELE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQztDQUNGLENBQUE7QUEzTlksVUFBVTtJQUR0QiwyQkFBUSxFQUFFO0lBcUJLLFdBQUEsMkJBQVEsQ0FBQyxxQkFBUSxDQUFDLENBQUE7SUFFbEIsV0FBQSwyQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFHNUIsV0FBQSwyQkFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUE7cUNBUGxCLHVCQUFHO1FBQ0Ysd0JBQUksa0JBS0YsMkJBQU07R0F4QnZCLFVBQVUsQ0EyTnRCO0FBM05ZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBEZWJ1ZywgeyBEZWJ1Z2dlciB9IGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL25vZGUnXG5pbXBvcnQgeyBEZXZwMnBQZWVyIH0gZnJvbSAnLi9kZXZwMnAtcGVlcidcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IHBhcmFsbGVsIH0gZnJvbSAnYXN5bmMnXG5cbmltcG9ydCB7XG4gIFBlZXIsXG4gIERQVCxcbiAgUkxQeCxcbiAgUGVlckluZm8sXG4gIExFUyxcbiAgRVRIXG59IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuXG5pbXBvcnQge1xuICBOZXR3b3JrVHlwZSxcbiAgSVByb3RvY29sLFxuICBJUHJvdG9jb2xEZXNjcmlwdG9yLFxuICBJQ2FwYWJpbGl0eVxufSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJ1xuXG5pbXBvcnQgeyBFdGhDaGFpbiwgSUJsb2NrY2hhaW4gfSBmcm9tICcuLi8uLi8uLi9ibG9ja2NoYWluJ1xuaW1wb3J0IENvbW1vbiBmcm9tICdldGhlcmV1bWpzLWNvbW1vbidcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6bmV0OmRldnAycDpub2RlJylcblxuY29uc3QgaWdub3JlZEVycm9ycyA9IG5ldyBSZWdFeHAoW1xuICAnRVBJUEUnLFxuICAnRUNPTk5SRVNFVCcsXG4gICdFVElNRURPVVQnLFxuICAnTmV0d29ya0lkIG1pc21hdGNoJyxcbiAgJ1RpbWVvdXQgZXJyb3I6IHBpbmcnLFxuICAnR2VuZXNpcyBibG9jayBtaXNtYXRjaCcsXG4gICdIYW5kc2hha2UgdGltZWQgb3V0JyxcbiAgJ0ludmFsaWQgYWRkcmVzcyBidWZmZXInLFxuICAnSW52YWxpZCBNQUMnLFxuICAnSW52YWxpZCB0aW1lc3RhbXAgYnVmZmVyJyxcbiAgJ0hhc2ggdmVyaWZpY2F0aW9uIGZhaWxlZCcsXG4gICdzaG91bGQgaGF2ZSB2YWxpZCB0YWc6J1xuXS5qb2luKCd8JykpXG5cbi8qKlxuICogRGV2cDJwIG5vZGVcbiAqXG4gKiBAZmlyZXMgUmxweE5vZGUja2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQgLSBmaXJlcyBvbiBuZXcgY29ubmVjdGVkIHBlZXJcbiAqIEBmaXJlcyBSbHB4Tm9kZSNraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCAtIGZpcmVzIHdoZW4gYSBwZWVyIGRpc2Nvbm5lY3RzXG4gKi9cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgRGV2cDJwTm9kZSBleHRlbmRzIE5vZGU8RGV2cDJwUGVlcj4ge1xuICBzdGFydGVkOiBib29sZWFuID0gZmFsc2VcbiAgcGVlcj86IERldnAycFBlZXJcblxuICBsb2dnZXI6IERlYnVnZ2VyID0gZGVidWdcblxuICAvLyB0aGUgcHJvdG9jb2xzIHRoYXQgdGhpcyBub2RlIHN1cHBvcnRzXG4gIGNhcHM6IElDYXBhYmlsaXR5W10gPSBbXG4gICAge1xuICAgICAgaWQ6ICdldGgnLFxuICAgICAgdmVyc2lvbnM6IFsnNjInLCAnNjMnXVxuICAgIH1cbiAgXVxuXG4gIGdldCB0eXBlICgpOiBOZXR3b3JrVHlwZSB7XG4gICAgcmV0dXJuIE5ldHdvcmtUeXBlLkRFVlAyUFxuICB9XG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBkcHQ6IERQVCxcbiAgICAgICAgICAgICAgIHB1YmxpYyBybHB4OiBSTFB4LFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKEV0aENoYWluKVxuICAgICAgICAgICAgICAgcHVibGljIGNoYWluOiBJQmxvY2tjaGFpbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZGV2cDJwLXBlZXItaW5mbycpXG4gICAgICAgICAgICAgICBwdWJsaWMgcGVlckluZm86IFBlZXJJbmZvLFxuICAgICAgICAgICAgICAgcHVibGljIGNvbW1vbjogQ29tbW9uLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdwcm90b2NvbC1yZWdpc3RyeScpXG4gICAgICAgICAgICAgICBwcml2YXRlIHByb3RvY29sUmVnaXN0cnk6IElQcm90b2NvbERlc2NyaXB0b3I8RGV2cDJwUGVlcj5bXSkge1xuICAgIHN1cGVyKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBEZXZwMnAvUkxQeCBzZXJ2ZXIuIFJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogcmVzb2x2ZXMgb25jZSBzZXJ2ZXIgaGFzIGJlZW4gc3RhcnRlZC5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIHN0YXJ0ICgpOiBQcm9taXNlIDx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgeyB1ZHBQb3J0LCBhZGRyZXNzIH0gPSB0aGlzLnBlZXJJbmZvXG4gICAgdGhpcy5kcHQuYmluZCh1ZHBQb3J0LCBhZGRyZXNzKVxuICAgIHRoaXMuZHB0Lm9uKCdlcnJvcicsIChlKSA9PiBkZWJ1ZyhlKSlcbiAgICBhd2FpdCB0aGlzLmluaXQoKVxuICAgIHRoaXMuY29tbW9uLmJvb3RzdHJhcE5vZGVzKCkubWFwKGFzeW5jIChub2RlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGJvb3Rub2RlOiBQZWVySW5mbyA9IHtcbiAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgIGFkZHJlc3M6IG5vZGUuaXAsXG4gICAgICAgIHVkcFBvcnQ6IG5vZGUucG9ydCxcbiAgICAgICAgdGNwUG9ydDogbm9kZS5wb3J0XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmRwdC5ib290c3RyYXAoYm9vdG5vZGUpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlYnVnKGUpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc3RhcnRlZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIERldnAycC9STFB4IHNlcnZlci4gUmV0dXJucyBhIHByb21pc2UgdGhhdFxuICAgKiByZXNvbHZlcyBvbmNlIHNlcnZlciBoYXMgYmVlbiBzdG9wcGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgc3RvcCAoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwYXJhbGxlbChcbiAgICAgICAgW1xuICAgICAgICAgIChjYikgPT4gdGhpcy5ybHB4LmRlc3Ryb3koY2IpLFxuICAgICAgICAgIChjYikgPT4gdGhpcy5kcHQuZGVzdHJveShjYilcbiAgICAgICAgXSxcbiAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGVycm9ycyBmcm9tIHNlcnZlciBhbmQgcGVlcnNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RXJyb3J9IGVycm9yXG4gICAqIEBwYXJhbSAge1BlZXJ9IHBlZXJcbiAgICogQGVtaXRzICBlcnJvclxuICAgKi9cbiAgZXJyb3IgKGVycm9yOiBFcnJvciwgcGVlcj86IFBlZXIpIHtcbiAgICBpZiAoaWdub3JlZEVycm9ycy50ZXN0KGVycm9yLm1lc3NhZ2UpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAocGVlcikge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJscHggcHJvdG9jb2wgZm9yIHRoaXMgcHJvdG9cbiAgICpcbiAgICogQHBhcmFtIHtJUHJvdG9jb2x9IHByb3RvIC0gdGhlIHByb3RvY29sIHRvIHJlc29sdmVcbiAgICovXG4gIHByaXZhdGUgZ2V0UmxweFByb3RvIChwcm90bzogSVByb3RvY29sPERldnAycFBlZXI+KTogRVRIIHwgTEVTIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gcHJvdG8ucGVlci5wZWVyLmdldFByb3RvY29scygpXG4gICAgICAuZmluZCgocCkgPT4gcFxuICAgICAgICAuY29uc3RydWN0b3JcbiAgICAgICAgLm5hbWVcbiAgICAgICAgLnRvTG93ZXJDYXNlKCkgPT09IHByb3RvLmlkKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBybHB4UGVlclxuICAgKiBAcGFyYW0gcmVhc29uXG4gICAqL1xuICBwcml2YXRlIGRpc2Nvbm5lY3QgKHJscHhQZWVyLCByZWFzb24pIHtcbiAgICBpZiAocmxweFBlZXIuZ2V0SWQoKSkge1xuICAgICAgY29uc3QgaWQgPSBybHB4UGVlci5nZXRJZCgpLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgY29uc3QgZGV2cDJwUGVlciA9IHRoaXMucGVlcnMuZ2V0KGlkKVxuICAgICAgaWYgKGRldnAycFBlZXIpIHtcbiAgICAgICAgdGhpcy5wZWVycy5kZWxldGUoaWQpXG4gICAgICAgIHRoaXMubG9nZ2VyKGBQZWVyIGRpc2Nvbm5lY3RlZCAoJHtybHB4UGVlci5nZXREaXNjb25uZWN0UHJlZml4KHJlYXNvbil9KTogJHtpZH1gKVxuICAgICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgZGV2cDJwUGVlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgUkxQeCBpbnN0YW5jZSBmb3IgcGVlciBtYW5hZ2VtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGluaXQgKCkge1xuICAgIHRoaXMucmxweC5vbigncGVlcjphZGRlZCcsIGFzeW5jIChybHB4UGVlcjogUGVlcikgPT4ge1xuICAgICAgY29uc3QgZGV2cDJwUGVlcjogRGV2cDJwUGVlciA9IG5ldyBEZXZwMnBQZWVyKHJscHhQZWVyKVxuICAgICAgY29uc3QgcHJvdG9zID0gdGhpcy5yZWdpc3RlclByb3Rvcyh0aGlzLnByb3RvY29sUmVnaXN0cnksIGRldnAycFBlZXIpXG4gICAgICBmb3IgKGNvbnN0IHByb3RvIG9mIHByb3Rvcykge1xuICAgICAgICBjb25zdCBybHB4UHJvdG8gPSB0aGlzLmdldFJscHhQcm90byhwcm90bylcbiAgICAgICAgaWYgKHJscHhQcm90bykge1xuICAgICAgICAgIHJscHhQcm90by5vbignbWVzc2FnZScsIGFzeW5jIChjb2RlOiBhbnksIHBheWxvYWQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgW2NvZGUsIC4uLnBheWxvYWRdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVhZCBmcm9tIHJlbW90ZVxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2YgcHJvdG8ucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtc2dcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBwcm90by5oYW5kc2hha2UoKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZGVidWcoZSlcbiAgICAgICAgICB0aGlzLmRwdC5iYW5QZWVyKHJscHhQZWVyLmdldElkKCksIDEwMDAgKiA2MClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnBlZXJzLnNldChkZXZwMnBQZWVyLmlkLCBkZXZwMnBQZWVyKVxuICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIGRldnAycFBlZXIpXG4gICAgfSlcblxuICAgIHRoaXMucmxweC5vbigncGVlcjpyZW1vdmVkJywgKHJscHhQZWVyLCByZWFzb24pID0+IHtcbiAgICAgIHRoaXMuZGlzY29ubmVjdChybHB4UGVlciwgcmVhc29uKVxuICAgIH0pXG5cbiAgICB0aGlzLnJscHgub24oJ3BlZXI6ZXJyb3InLCAocmxweFBlZXIsIGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QocmxweFBlZXIsIGVycm9yKVxuICAgICAgLy8gdGhpcy5lcnJvcihlcnJvciwgcmxweFBlZXIpXG4gICAgfSlcblxuICAgIC8vIHRoaXMucmxweC5vbignZXJyb3InLCBlID0+IHRoaXMuZXJyb3IoZSkpXG4gICAgdGhpcy5ybHB4Lm9uKCdlcnJvcicsIGUgPT4gZGVidWcoZSkpXG4gICAgdGhpcy5ybHB4Lm9uKCdsaXN0ZW5pbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlbm9kZSA9IHtcbiAgICAgICAgdHJhbnNwb3J0OiAnZGV2cDJwJyxcbiAgICAgICAgdXJsOiBgZW5vZGU6Ly8ke3RoaXMucmxweC5faWQudG9TdHJpbmcoJ2hleCcpfUBbOjpdOiR7dGhpcy5wZWVySW5mby50Y3BQb3J0fWBcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgnbGlzdGVuaW5nJywgZW5vZGUpXG4gICAgICBjb25zb2xlLmxvZyhgZGV2cDJwIGxpc3RlbmluZyBvbiAke2Vub2RlLnVybH1gKVxuICAgIH0pXG5cbiAgICBjb25zdCB7IHRjcFBvcnQsIGFkZHJlc3MgfSA9IHRoaXMucGVlckluZm9cbiAgICBpZiAodGNwUG9ydCkge1xuICAgICAgdGhpcy5ybHB4Lmxpc3Rlbih0Y3BQb3J0LCBhZGRyZXNzKVxuICAgIH1cbiAgfVxuXG4gIHNlbmQ8VCwgVSA9IFQ+IChtc2c6IFQgfCBUW10sXG4gICAgICAgICAgICAgICAgICBwcm90b2NvbD86IElQcm90b2NvbDxEZXZwMnBQZWVyPixcbiAgICAgICAgICAgICAgICAgIHBlZXI/OiBEZXZwMnBQZWVyKTogUHJvbWlzZTxVIHwgVVtdPiB7XG4gICAgaWYgKCFwZWVyIHx8ICFwcm90b2NvbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdib3RoIHBlZXIgYW5kIHByb3RvY29sIGFyZSByZXF1aXJlZCEnKVxuICAgIH1cblxuICAgIGNvbnN0IHJscHhQcm90byA9IHRoaXMuZ2V0UmxweFByb3RvKHByb3RvY29sKVxuICAgIGlmICghcmxweFByb3RvKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1Y2ggcHJvdG9jb2whJylcbiAgICB9XG5cbiAgICBsZXQgcmVzOiBhbnlcbiAgICB0cnkge1xuICAgICAgcmVzID0gcmxweFByb3RvLl9zZW5kKChtc2cgYXMgVFtdKS5zaGlmdCgpLCAobXNnIGFzIFRbXSkuc2hpZnQoKSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxufVxuIl19