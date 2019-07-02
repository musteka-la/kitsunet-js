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
const ethereumjs_util_1 = require("ethereumjs-util");
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
    disconnected(rlpxPeer, reason) {
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
                this.disconnected(rlpxPeer, reason);
            });
            this.rlpx.on('peer:error', (rlpxPeer, error) => {
                this.disconnected(rlpxPeer, error);
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
        const [code, payload] = [msg.shift(), msg.shift()];
        try {
            // FIXME: workaround for devp2p convoluted message handling
            // this is why the protocol (ETH, LES, etc) needs to be separated from
            // the transport interfaces (will be done in a devp2p rework)
            if (protocol.id === 'eth' && code === ethereumjs_devp2p_1.ETH.MESSAGE_CODES.STATUS) {
                rlpxProto._status = ethereumjs_util_1.rlp.decode(payload);
            }
            res = rlpxProto._send(code, payload);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUF1QztBQUN2QyxxQ0FBaUM7QUFDakMsK0NBQTBDO0FBQzFDLHVEQUEyQztBQUMzQyxpQ0FBZ0M7QUFHaEMseURBTzBCO0FBRTFCLGlEQUt5QjtBQUV6QixvREFBMkQ7QUFDM0QsMEVBQXNDO0FBRXRDLHFEQUFzQztBQUV0QyxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUUvQyxNQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQztJQUMvQixPQUFPO0lBQ1AsWUFBWTtJQUNaLFdBQVc7SUFDWCxvQkFBb0I7SUFDcEIscUJBQXFCO0lBQ3JCLHdCQUF3QjtJQUN4QixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLGFBQWE7SUFDYiwwQkFBMEI7SUFDMUIsMEJBQTBCO0lBQzFCLHdCQUF3QjtDQUN6QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBRVo7Ozs7O0dBS0c7QUFFSCxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsV0FBZ0I7SUFnQjlDLFlBQW9CLEdBQVEsRUFDUixJQUFVLEVBRVYsS0FBa0IsRUFFbEIsUUFBa0IsRUFFbEIsSUFBZ0IsRUFDaEIsTUFBYyxFQUViLGdCQUFtRDtRQUN0RSxLQUFLLEVBQUUsQ0FBQTtRQVhXLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFDUixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRVYsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUVsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRWxCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsV0FBTSxH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bkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDbkMsQ0FBQztLQUFBO0NBQ0YsQ0FBQTtBQTNPWSxVQUFVO0lBRHRCLDJCQUFRLEVBQUU7SUFtQkssV0FBQSwyQkFBUSxDQUFDLHFCQUFRLENBQUMsQ0FBQTtJQUVsQixXQUFBLDJCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtJQUU1QixXQUFBLDJCQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7SUFHdkIsV0FBQSwyQkFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUE7cUNBVGxCLHVCQUFHO1FBQ0Ysd0JBQUksa0JBTUosd0JBQVU7UUFDUiwyQkFBTTtHQXhCdkIsVUFBVSxDQTJPdEI7QUEzT1ksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IERlYnVnLCB7IERlYnVnZ2VyIH0gZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbm9kZSdcbmltcG9ydCB7IERldnAycFBlZXIgfSBmcm9tICcuL2RldnAycC1wZWVyJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgcGFyYWxsZWwgfSBmcm9tICdhc3luYydcbmltcG9ydCB7IEV4dHJhY3RGcm9tRGV2cDJwUGVlciB9IGZyb20gJy4uLy4uL2hlbHBlci10eXBlcydcblxuaW1wb3J0IHtcbiAgUGVlcixcbiAgRFBULFxuICBSTFB4LFxuICBQZWVySW5mbyxcbiAgTEVTLFxuICBFVEhcbn0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5cbmltcG9ydCB7XG4gIE5ldHdvcmtUeXBlLFxuICBJUHJvdG9jb2wsXG4gIElQcm90b2NvbERlc2NyaXB0b3IsXG4gIElDYXBhYmlsaXR5XG59IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnXG5cbmltcG9ydCB7IEV0aENoYWluLCBJQmxvY2tjaGFpbiB9IGZyb20gJy4uLy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuLi8uLi9uZXR3b3JrLXBlZXInXG5pbXBvcnQgeyBybHAgfSBmcm9tICdldGhlcmV1bWpzLXV0aWwnO1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpuZXQ6ZGV2cDJwOm5vZGUnKVxuXG5jb25zdCBpZ25vcmVkRXJyb3JzID0gbmV3IFJlZ0V4cChbXG4gICdFUElQRScsXG4gICdFQ09OTlJFU0VUJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdOZXR3b3JrSWQgbWlzbWF0Y2gnLFxuICAnVGltZW91dCBlcnJvcjogcGluZycsXG4gICdHZW5lc2lzIGJsb2NrIG1pc21hdGNoJyxcbiAgJ0hhbmRzaGFrZSB0aW1lZCBvdXQnLFxuICAnSW52YWxpZCBhZGRyZXNzIGJ1ZmZlcicsXG4gICdJbnZhbGlkIE1BQycsXG4gICdJbnZhbGlkIHRpbWVzdGFtcCBidWZmZXInLFxuICAnSGFzaCB2ZXJpZmljYXRpb24gZmFpbGVkJyxcbiAgJ3Nob3VsZCBoYXZlIHZhbGlkIHRhZzonXG5dLmpvaW4oJ3wnKSlcblxuLyoqXG4gKiBEZXZwMnAgbm9kZVxuICpcbiAqIEBmaXJlcyBSbHB4Tm9kZSNraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCAtIGZpcmVzIG9uIG5ldyBjb25uZWN0ZWQgcGVlclxuICogQGZpcmVzIFJscHhOb2RlI2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkIC0gZmlyZXMgd2hlbiBhIHBlZXIgZGlzY29ubmVjdHNcbiAqL1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBEZXZwMnBOb2RlIGV4dGVuZHMgTm9kZTxEZXZwMnBQZWVyPiB7XG4gIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBsb2dnZXI6IERlYnVnZ2VyID0gZGVidWdcblxuICAvLyB0aGUgcHJvdG9jb2xzIHRoYXQgdGhpcyBub2RlIHN1cHBvcnRzXG4gIGNhcHM6IElDYXBhYmlsaXR5W10gPSBbXG4gICAge1xuICAgICAgaWQ6ICdldGgnLFxuICAgICAgdmVyc2lvbnM6IFsnNjInLCAnNjMnXVxuICAgIH1cbiAgXVxuXG4gIGdldCB0eXBlICgpOiBOZXR3b3JrVHlwZSB7XG4gICAgcmV0dXJuIE5ldHdvcmtUeXBlLkRFVlAyUFxuICB9XG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBkcHQ6IERQVCxcbiAgICAgICAgICAgICAgIHB1YmxpYyBybHB4OiBSTFB4LFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKEV0aENoYWluKVxuICAgICAgICAgICAgICAgcHVibGljIGNoYWluOiBJQmxvY2tjaGFpbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZGV2cDJwLXBlZXItaW5mbycpXG4gICAgICAgICAgICAgICBwdWJsaWMgcGVlckluZm86IFBlZXJJbmZvLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdkZXZwMnAtcGVlcicpXG4gICAgICAgICAgICAgICBwdWJsaWMgcGVlcjogRGV2cDJwUGVlcixcbiAgICAgICAgICAgICAgIHB1YmxpYyBjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcigncHJvdG9jb2wtcmVnaXN0cnknKVxuICAgICAgICAgICAgICAgcHJpdmF0ZSBwcm90b2NvbFJlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPERldnAycFBlZXI+W10pIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgRGV2cDJwL1JMUHggc2VydmVyLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqIHJlc29sdmVzIG9uY2Ugc2VydmVyIGhhcyBiZWVuIHN0YXJ0ZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBzdGFydCAoKTogUHJvbWlzZSA8dm9pZD4ge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgdWRwUG9ydCwgYWRkcmVzcyB9ID0gdGhpcy5wZWVySW5mb1xuICAgIHRoaXMuZHB0LmJpbmQodWRwUG9ydCwgYWRkcmVzcylcbiAgICB0aGlzLmRwdC5vbignZXJyb3InLCAoZSkgPT4gZGVidWcoZSkpXG4gICAgYXdhaXQgdGhpcy5pbml0KClcbiAgICB0aGlzLmNvbW1vbi5ib290c3RyYXBOb2RlcygpLm1hcChhc3luYyAobm9kZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBib290bm9kZTogUGVlckluZm8gPSB7XG4gICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICBhZGRyZXNzOiBub2RlLmlwLFxuICAgICAgICB1ZHBQb3J0OiBub2RlLnBvcnQsXG4gICAgICAgIHRjcFBvcnQ6IG5vZGUucG9ydFxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5kcHQuYm9vdHN0cmFwKGJvb3Rub2RlKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWJ1ZyhlKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogU3RvcCBEZXZwMnAvUkxQeCBzZXJ2ZXIuIFJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogcmVzb2x2ZXMgb25jZSBzZXJ2ZXIgaGFzIGJlZW4gc3RvcHBlZC5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcGFyYWxsZWwoXG4gICAgICAgIFtcbiAgICAgICAgICAoY2IpID0+IHRoaXMucmxweC5kZXN0cm95KGNiKSxcbiAgICAgICAgICAoY2IpID0+IHRoaXMuZHB0LmRlc3Ryb3koY2IpXG4gICAgICAgIF0sXG4gICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBlcnJvcnMgZnJvbSBzZXJ2ZXIgYW5kIHBlZXJzXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0Vycm9yfSBlcnJvclxuICAgKiBAcGFyYW0gIHtQZWVyfSBwZWVyXG4gICAqIEBlbWl0cyAgZXJyb3JcbiAgICovXG4gIGVycm9yIChlcnJvcjogRXJyb3IsIHBlZXI/OiBQZWVyKSB7XG4gICAgaWYgKGlnbm9yZWRFcnJvcnMudGVzdChlcnJvci5tZXNzYWdlKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHBlZXIpIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBybHB4IHByb3RvY29sIGZvciB0aGlzIHByb3RvXG4gICAqXG4gICAqIEBwYXJhbSB7SVByb3RvY29sfSBwcm90byAtIHRoZSBwcm90b2NvbCB0byByZXNvbHZlXG4gICAqL1xuICBwcml2YXRlIGdldFJscHhQcm90byAocHJvdG86IElQcm90b2NvbDxEZXZwMnBQZWVyPik6IEVUSCB8IExFUyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHByb3RvLnBlZXIucGVlci5nZXRQcm90b2NvbHMoKVxuICAgICAgLmZpbmQoKHApID0+IHBcbiAgICAgICAgLmNvbnN0cnVjdG9yXG4gICAgICAgIC5uYW1lXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpID09PSBwcm90by5pZClcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmxweFBlZXJcbiAgICogQHBhcmFtIHJlYXNvblxuICAgKi9cbiAgcHJpdmF0ZSBkaXNjb25uZWN0ZWQgKHJscHhQZWVyLCByZWFzb24pIHtcbiAgICBpZiAocmxweFBlZXIuZ2V0SWQoKSkge1xuICAgICAgY29uc3QgaWQgPSBybHB4UGVlci5nZXRJZCgpLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgY29uc3QgZGV2cDJwUGVlciA9IHRoaXMucGVlcnMuZ2V0KGlkKVxuICAgICAgaWYgKGRldnAycFBlZXIpIHtcbiAgICAgICAgdGhpcy5wZWVycy5kZWxldGUoaWQpXG4gICAgICAgIHRoaXMubG9nZ2VyKGBQZWVyIGRpc2Nvbm5lY3RlZCAoJHtybHB4UGVlci5nZXREaXNjb25uZWN0UHJlZml4KHJlYXNvbil9KTogJHtpZH1gKVxuICAgICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgZGV2cDJwUGVlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgUkxQeCBpbnN0YW5jZSBmb3IgcGVlciBtYW5hZ2VtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGluaXQgKCkge1xuICAgIHRoaXMucmxweC5vbigncGVlcjphZGRlZCcsIGFzeW5jIChybHB4UGVlcjogUGVlcikgPT4ge1xuICAgICAgY29uc3QgZGV2cDJwUGVlcjogRGV2cDJwUGVlciA9IG5ldyBEZXZwMnBQZWVyKHJscHhQZWVyLCB0aGlzIGFzIHVua25vd24gYXMgRXh0cmFjdEZyb21EZXZwMnBQZWVyKVxuICAgICAgY29uc3QgcHJvdG9zID0gdGhpcy5yZWdpc3RlclByb3Rvcyh0aGlzLnByb3RvY29sUmVnaXN0cnksIGRldnAycFBlZXIgYXMgdW5rbm93biBhcyBOZXR3b3JrUGVlcjxhbnksIGFueT4pXG4gICAgICBmb3IgKGNvbnN0IHByb3RvIG9mIHByb3Rvcykge1xuICAgICAgICBjb25zdCBybHB4UHJvdG8gPSB0aGlzLmdldFJscHhQcm90byhwcm90bylcbiAgICAgICAgaWYgKHJscHhQcm90bykge1xuICAgICAgICAgIHJscHhQcm90by5vbignbWVzc2FnZScsIGFzeW5jIChjb2RlOiBhbnksIHBheWxvYWQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgW2NvZGUsIC4uLnBheWxvYWRdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVhZCBmcm9tIHJlbW90ZVxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2YgcHJvdG8ucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtc2dcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBwcm90by5oYW5kc2hha2UoKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZGVidWcoZSlcbiAgICAgICAgICB0aGlzLmJhblBlZXIoZGV2cDJwUGVlcilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnBlZXJzLnNldChkZXZwMnBQZWVyLmlkLCBkZXZwMnBQZWVyKVxuICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIGRldnAycFBlZXIpXG4gICAgfSlcblxuICAgIHRoaXMucmxweC5vbigncGVlcjpyZW1vdmVkJywgKHJscHhQZWVyLCByZWFzb24pID0+IHtcbiAgICAgIHRoaXMuZGlzY29ubmVjdGVkKHJscHhQZWVyLCByZWFzb24pXG4gICAgfSlcblxuICAgIHRoaXMucmxweC5vbigncGVlcjplcnJvcicsIChybHB4UGVlciwgZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuZGlzY29ubmVjdGVkKHJscHhQZWVyLCBlcnJvcilcbiAgICAgIC8vIHRoaXMuZXJyb3IoZXJyb3IsIHJscHhQZWVyKVxuICAgIH0pXG5cbiAgICAvLyB0aGlzLnJscHgub24oJ2Vycm9yJywgZSA9PiB0aGlzLmVycm9yKGUpKVxuICAgIHRoaXMucmxweC5vbignZXJyb3InLCBlID0+IGRlYnVnKGUpKVxuICAgIHRoaXMucmxweC5vbignbGlzdGVuaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgZW5vZGUgPSB7XG4gICAgICAgIHRyYW5zcG9ydDogJ2RldnAycCcsXG4gICAgICAgIHVybDogYGVub2RlOi8vJHt0aGlzLnJscHguX2lkLnRvU3RyaW5nKCdoZXgnKX1AWzo6XToke3RoaXMucGVlckluZm8udGNwUG9ydH1gXG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoJ2xpc3RlbmluZycsIGVub2RlKVxuICAgICAgY29uc29sZS5sb2coYGRldnAycCBsaXN0ZW5pbmcgb24gJHtlbm9kZS51cmx9YClcbiAgICB9KVxuXG4gICAgY29uc3QgeyB0Y3BQb3J0LCBhZGRyZXNzIH0gPSB0aGlzLnBlZXJJbmZvXG4gICAgaWYgKHRjcFBvcnQpIHtcbiAgICAgIHRoaXMucmxweC5saXN0ZW4odGNwUG9ydCwgYWRkcmVzcylcbiAgICB9XG4gIH1cblxuICBzZW5kPFQsIFUgPSBUPiAobXNnOiBUIHwgVFtdLFxuICAgICAgICAgICAgICAgICAgcHJvdG9jb2w/OiBJUHJvdG9jb2w8RGV2cDJwUGVlcj4sXG4gICAgICAgICAgICAgICAgICBwZWVyPzogRGV2cDJwUGVlcik6IFByb21pc2U8VSB8IFVbXT4ge1xuICAgIGlmICghcGVlciB8fCAhcHJvdG9jb2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYm90aCBwZWVyIGFuZCBwcm90b2NvbCBhcmUgcmVxdWlyZWQhJylcbiAgICB9XG5cbiAgICBjb25zdCBybHB4UHJvdG8gPSB0aGlzLmdldFJscHhQcm90byhwcm90b2NvbClcbiAgICBpZiAoIXJscHhQcm90bykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIHByb3RvY29sIScpXG4gICAgfVxuXG4gICAgbGV0IHJlczogYW55XG4gICAgY29uc3QgW2NvZGUsIHBheWxvYWRdID0gWyhtc2cgYXMgVFtdKS5zaGlmdCgpLCAobXNnIGFzIFRbXSkuc2hpZnQoKV1cbiAgICB0cnkge1xuICAgICAgLy8gRklYTUU6IHdvcmthcm91bmQgZm9yIGRldnAycCBjb252b2x1dGVkIG1lc3NhZ2UgaGFuZGxpbmdcbiAgICAgIC8vIHRoaXMgaXMgd2h5IHRoZSBwcm90b2NvbCAoRVRILCBMRVMsIGV0YykgbmVlZHMgdG8gYmUgc2VwYXJhdGVkIGZyb21cbiAgICAgIC8vIHRoZSB0cmFuc3BvcnQgaW50ZXJmYWNlcyAod2lsbCBiZSBkb25lIGluIGEgZGV2cDJwIHJld29yaylcbiAgICAgIGlmIChwcm90b2NvbC5pZCA9PT0gJ2V0aCcgJiYgKGNvZGUgYXMgYW55KSA9PT0gRVRILk1FU1NBR0VfQ09ERVMuU1RBVFVTKSB7XG4gICAgICAgIHJscHhQcm90by5fc3RhdHVzID0gcmxwLmRlY29kZShwYXlsb2FkIGFzIGFueSkgYXMgdW5rbm93biBhcyBFVEguU3RhdHVzTXNnXG4gICAgICB9XG4gICAgICByZXMgPSBybHB4UHJvdG8uX3NlbmQoY29kZSwgcGF5bG9hZClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGFzeW5jIGRpc2Nvbm5lY3RQZWVyIChwZWVyOiBEZXZwMnBQZWVyLCByZWFzb24/OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gcGVlci5wZWVyLmRpc2Nvbm5lY3QocmVhc29uKVxuICB9XG5cbiAgYXN5bmMgYmFuUGVlciAocGVlcjogRGV2cDJwUGVlciwgbWF4QWdlOiBudW1iZXIgPSAxMDAwICogNiwgcmVhc29uPzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5kcHQuYmFuUGVlcihwZWVyLnBlZXIsIG1heEFnZSlcbiAgICB0aGlzLmRpc2Nvbm5lY3RQZWVyKHBlZXIsIHJlYXNvbilcbiAgfVxufVxuIl19