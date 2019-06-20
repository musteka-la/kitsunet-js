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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const libp2p_1 = __importDefault(require("libp2p"));
const pull_stream_to_async_iterator_1 = __importDefault(require("pull-stream-to-async-iterator"));
const pull_stream_1 = __importDefault(require("pull-stream"));
const debug_1 = __importDefault(require("debug"));
const pull_pushable_1 = __importDefault(require("pull-pushable"));
const pull_length_prefixed_1 = __importDefault(require("pull-length-prefixed"));
const semver = __importStar(require("semver"));
const opium_decorators_1 = require("opium-decorators");
const node_1 = require("../../node");
const libp2p_peer_1 = require("./libp2p-peer");
const interfaces_1 = require("../../interfaces");
const libp2p_dialer_1 = require("./libp2p-dialer");
const blockchain_1 = require("../../../blockchain");
const debug = debug_1.default('kitsunet:net:libp2p:node');
/**
 * Libp2p node
 *
 * @fires Libp2pNode#kitsunet:peer:connected - fires on new connected peer
 * @fires Libp2pNode#kitsunet:peer:disconnected - fires on new discovered peer
 */
let Libp2pNode = class Libp2pNode extends node_1.Node {
    constructor(node, peer, libp2pDialer, chain, protocolRegistry) {
        super();
        this.node = node;
        this.peer = peer;
        this.libp2pDialer = libp2pDialer;
        this.chain = chain;
        this.protocolRegistry = protocolRegistry;
        this.started = false;
        // the protocols that this node supports
        this.caps = [
            {
                id: 'ksn',
                versions: ['1.0.0']
            },
            {
                id: 'eth',
                versions: ['62', '63']
            }
        ];
        // register own protocols
        this.registerProtos(protocolRegistry, this.peer);
        // a peer has connected, store it
        libp2pDialer.on('peer:dialed', this.handlePeer.bind(this));
        // node.on('peer:connected', this.handlePeer.bind(this))
        node.on('peer:disconnect', (peerInfo) => {
            // remove disconnected peer
            const libp2pPeer = this.peers.get(peerInfo.id.toB58String());
            if (libp2pPeer) {
                this.peers.delete(peerInfo.id.toB58String());
                this.emit('kitsunet:peer:disconnected', libp2pPeer);
            }
        });
    }
    get type() {
        return interfaces_1.NetworkType.LIBP2P;
    }
    handlePeer(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            let libp2pPeer = yield this.peers.get(peer.id.toB58String());
            if (libp2pPeer)
                return libp2pPeer;
            libp2pPeer = new libp2p_peer_1.Libp2pPeer(peer);
            this.peers.set(libp2pPeer.id, libp2pPeer);
            const protocols = this.registerProtos(this.protocolRegistry, libp2pPeer);
            yield Promise.all(protocols.map(p => p.handshake()));
            this.emit('kitsunet:peer:connected', libp2pPeer);
            return libp2pPeer;
        });
    }
    mount(protocol) {
        const codec = this.mkCodec(protocol.id, protocol.versions);
        this.node.handle(codec, (_, conn) => __awaiter(this, void 0, void 0, function* () {
            return this.handleIncoming(protocol.id, conn);
        }));
    }
    unmount(protocol) {
        this.node.unhandle(protocol.id);
    }
    handleIncoming(id, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            conn.getPeerInfo((err, peerInfo) => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                if (err)
                    throw err;
                const peer = yield this.handlePeer(peerInfo);
                const protocol = peer.protocols.get(id);
                if (protocol) {
                    try {
                        const stream = pull_pushable_1.default();
                        pull_stream_1.default(stream, pull_length_prefixed_1.default.encode(), conn);
                        const inStream = pull_stream_to_async_iterator_1.default(pull_stream_1.default(conn, pull_length_prefixed_1.default.decode()));
                        try {
                            for (var _b = __asyncValues(protocol.receive(inStream)), _c; _c = yield _b.next(), !_c.done;) {
                                const msg = _c.value;
                                if (!msg)
                                    break;
                                stream.push(msg);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        stream.end();
                    }
                    catch (err) {
                        debug(err);
                    }
                }
            }));
        });
    }
    mkCodec(id, versions) {
        const v = versions.map((v) => {
            if (!semver.valid(v)) {
                return `${v}.0.0`;
            }
            return v;
        });
        return `/kitsunet/${id}/${semver.rsort(v)[0]}`;
    }
    send(msg, protocol, peer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!peer || !protocol) {
                throw new Error('both peer and protocol are required!');
            }
            const conn = yield this.node.dialProtocol(peer.peer, this.mkCodec(protocol.id, protocol.versions));
            return new Promise((resolve, reject) => {
                pull_stream_1.default(pull_stream_1.default.values([msg]), pull_length_prefixed_1.default.encode(), conn, pull_length_prefixed_1.default.decode(), pull_stream_1.default.collect((err, values) => {
                    if (err) {
                        // ignore generic stream ended message
                        const re = new RegExp('stream ended with:0 but wanted:1');
                        if (!re.test(err.message)) {
                            debug('an error occurred sending message ', err);
                            return reject(err);
                        }
                    }
                    resolve(...values);
                }));
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const starter = new Promise((resolve) => {
                this.node.on('start', () => __awaiter(this, void 0, void 0, function* () {
                    yield this.node._multicast.start();
                    this.started = true;
                    this.peer.addrs.forEach((ma) => {
                        console.log('libp2p listening on', ma.toString());
                    });
                    yield this.libp2pDialer.start();
                    return resolve();
                }));
            });
            yield this.node.start();
            return starter;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const stopper = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                yield this.libp2pDialer.stop();
                return this.node.on('stop', () => __awaiter(this, void 0, void 0, function* () {
                    yield this.node._multicast.stop();
                    this.started = false;
                    resolve();
                }));
            }));
            yield this.node.stop();
            return stopper;
        });
    }
};
Libp2pNode = __decorate([
    opium_decorators_1.register(),
    __param(3, opium_decorators_1.register(blockchain_1.EthChain)),
    __param(4, opium_decorators_1.register('protocol-registry')),
    __metadata("design:paramtypes", [libp2p_1.default,
        libp2p_peer_1.Libp2pPeer,
        libp2p_dialer_1.Libp2pDialer, Object, Array])
], Libp2pNode);
exports.Libp2pNode = Libp2pNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixvREFBMkI7QUFFM0Isa0dBQXNEO0FBQ3RELDhEQUE4QjtBQUM5QixrREFBeUI7QUFDekIsa0VBQW9DO0FBQ3BDLGdGQUFxQztBQUNyQywrQ0FBZ0M7QUFDaEMsdURBQTJDO0FBQzNDLHFDQUFpQztBQUNqQywrQ0FBMEM7QUFFMUMsaURBS3lCO0FBQ3pCLG1EQUE4QztBQUM5QyxvREFBMkQ7QUFFM0QsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFFL0M7Ozs7O0dBS0c7QUFFSCxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsV0FBZ0I7SUFtQjlDLFlBQW9CLElBQVksRUFDWixJQUFnQixFQUNmLFlBQTBCLEVBRTNCLEtBQWtCLEVBRWxCLGdCQUFtRDtRQUNyRSxLQUFLLEVBQUUsQ0FBQTtRQVBXLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2YsaUJBQVksR0FBWixZQUFZLENBQWM7UUFFM0IsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUVsQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW1DO1FBeEJ2RSxZQUFPLEdBQVksS0FBSyxDQUFBO1FBRXhCLHdDQUF3QztRQUN4QyxTQUFJLEdBQWtCO1lBQ3BCO2dCQUNFLEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUNwQjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDdkI7U0FDRixDQUFBO1FBZUMseUJB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RixDQUFBO0FBOUpZLFVBQVU7SUFEdEIsMkJBQVEsRUFBRTtJQXVCSyxXQUFBLDJCQUFRLENBQUMscUJBQVEsQ0FBQyxDQUFBO0lBRWxCLFdBQUEsMkJBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO3FDQUxqQixnQkFBTTtRQUNOLHdCQUFVO1FBQ0QsNEJBQVk7R0FyQnBDLFVBQVUsQ0E4SnRCO0FBOUpZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCB0b0l0ZXJhdG9yIGZyb20gJ3B1bGwtc3RyZWFtLXRvLWFzeW5jLWl0ZXJhdG9yJ1xuaW1wb3J0IHB1bGwgZnJvbSAncHVsbC1zdHJlYW0nXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgcHVzaGFibGUgZnJvbSAncHVsbC1wdXNoYWJsZSdcbmltcG9ydCBscCBmcm9tICdwdWxsLWxlbmd0aC1wcmVmaXhlZCdcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbm9kZSdcbmltcG9ydCB7IExpYnAycFBlZXIgfSBmcm9tICcuL2xpYnAycC1wZWVyJ1xuXG5pbXBvcnQge1xuICBJUHJvdG9jb2wsXG4gIE5ldHdvcmtUeXBlLFxuICBJUHJvdG9jb2xEZXNjcmlwdG9yLFxuICBJQ2FwYWJpbGl0eVxufSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgTGlicDJwRGlhbGVyIH0gZnJvbSAnLi9saWJwMnAtZGlhbGVyJ1xuaW1wb3J0IHsgRXRoQ2hhaW4sIElCbG9ja2NoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6bmV0OmxpYnAycDpub2RlJylcblxuLyoqXG4gKiBMaWJwMnAgbm9kZVxuICpcbiAqIEBmaXJlcyBMaWJwMnBOb2RlI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgTGlicDJwTm9kZSNraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCAtIGZpcmVzIG9uIG5ldyBkaXNjb3ZlcmVkIHBlZXJcbiAqL1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBMaWJwMnBOb2RlIGV4dGVuZHMgTm9kZTxMaWJwMnBQZWVyPiB7XG4gIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8vIHRoZSBwcm90b2NvbHMgdGhhdCB0aGlzIG5vZGUgc3VwcG9ydHNcbiAgY2FwczogSUNhcGFiaWxpdHlbXSA9IFtcbiAgICB7XG4gICAgICBpZDogJ2tzbicsXG4gICAgICB2ZXJzaW9uczogWycxLjAuMCddXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2V0aCcsXG4gICAgICB2ZXJzaW9uczogWyc2MicsICc2MyddXG4gICAgfVxuICBdXG5cbiAgZ2V0IHR5cGUgKCk6IE5ldHdvcmtUeXBlIHtcbiAgICByZXR1cm4gTmV0d29ya1R5cGUuTElCUDJQXG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHVibGljIG5vZGU6IExpYnAycCxcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyOiBMaWJwMnBQZWVyLFxuICAgICAgICAgICAgICAgcHJpdmF0ZSBsaWJwMnBEaWFsZXI6IExpYnAycERpYWxlcixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3Byb3RvY29sLXJlZ2lzdHJ5JylcbiAgICAgICAgICAgICAgIHB1YmxpYyBwcm90b2NvbFJlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPExpYnAycFBlZXI+W10pIHtcbiAgICBzdXBlcigpXG5cbiAgICAvLyByZWdpc3RlciBvd24gcHJvdG9jb2xzXG4gICAgdGhpcy5yZWdpc3RlclByb3Rvcyhwcm90b2NvbFJlZ2lzdHJ5LCB0aGlzLnBlZXIpXG5cbiAgICAvLyBhIHBlZXIgaGFzIGNvbm5lY3RlZCwgc3RvcmUgaXRcbiAgICBsaWJwMnBEaWFsZXIub24oJ3BlZXI6ZGlhbGVkJywgdGhpcy5oYW5kbGVQZWVyLmJpbmQodGhpcykpXG4gICAgLy8gbm9kZS5vbigncGVlcjpjb25uZWN0ZWQnLCB0aGlzLmhhbmRsZVBlZXIuYmluZCh0aGlzKSlcbiAgICBub2RlLm9uKCdwZWVyOmRpc2Nvbm5lY3QnLCAocGVlckluZm86IFBlZXJJbmZvKSA9PiB7XG4gICAgICAvLyByZW1vdmUgZGlzY29ubmVjdGVkIHBlZXJcbiAgICAgIGNvbnN0IGxpYnAycFBlZXI6IExpYnAycFBlZXIgfCB1bmRlZmluZWQgPSB0aGlzLnBlZXJzLmdldChwZWVySW5mby5pZC50b0I1OFN0cmluZygpKVxuICAgICAgaWYgKGxpYnAycFBlZXIpIHtcbiAgICAgICAgdGhpcy5wZWVycy5kZWxldGUocGVlckluZm8uaWQudG9CNThTdHJpbmcoKSlcbiAgICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIGxpYnAycFBlZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZVBlZXIgKHBlZXI6IFBlZXJJbmZvKTogUHJvbWlzZTxMaWJwMnBQZWVyPiB7XG4gICAgbGV0IGxpYnAycFBlZXI6IExpYnAycFBlZXIgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLnBlZXJzLmdldChwZWVyLmlkLnRvQjU4U3RyaW5nKCkpXG4gICAgaWYgKGxpYnAycFBlZXIpIHJldHVybiBsaWJwMnBQZWVyXG4gICAgbGlicDJwUGVlciA9IG5ldyBMaWJwMnBQZWVyKHBlZXIpXG4gICAgdGhpcy5wZWVycy5zZXQobGlicDJwUGVlci5pZCwgbGlicDJwUGVlcilcbiAgICBjb25zdCBwcm90b2NvbHMgPSB0aGlzLnJlZ2lzdGVyUHJvdG9zKHRoaXMucHJvdG9jb2xSZWdpc3RyeSwgbGlicDJwUGVlcilcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm90b2NvbHMubWFwKHAgPT4gcC5oYW5kc2hha2UoKSkpXG5cbiAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkJywgbGlicDJwUGVlcilcbiAgICByZXR1cm4gbGlicDJwUGVlclxuICB9XG5cbiAgbW91bnQgKHByb3RvY29sOiBJUHJvdG9jb2w8TGlicDJwUGVlcj4pOiB2b2lkIHtcbiAgICBjb25zdCBjb2RlYyA9IHRoaXMubWtDb2RlYyhwcm90b2NvbC5pZCwgcHJvdG9jb2wudmVyc2lvbnMpXG4gICAgdGhpcy5ub2RlLmhhbmRsZShjb2RlYywgYXN5bmMgKF86IGFueSwgY29ubjogYW55KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVJbmNvbWluZyhwcm90b2NvbC5pZCwgY29ubilcbiAgICB9KVxuICB9XG5cbiAgdW5tb3VudCAocHJvdG9jb2w6IElQcm90b2NvbDxMaWJwMnBQZWVyPik6IHZvaWQge1xuICAgIHRoaXMubm9kZS51bmhhbmRsZShwcm90b2NvbC5pZClcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlSW5jb21pbmcgKGlkOiBzdHJpbmcsIGNvbm46IGFueSkge1xuICAgIGNvbm4uZ2V0UGVlckluZm8oYXN5bmMgKGVycjogRXJyb3IsIHBlZXJJbmZvOiBQZWVySW5mbykgPT4ge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyXG4gICAgICBjb25zdCBwZWVyOiBMaWJwMnBQZWVyIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5oYW5kbGVQZWVyKHBlZXJJbmZvKVxuICAgICAgY29uc3QgcHJvdG9jb2w6IElQcm90b2NvbDxMaWJwMnBQZWVyPiB8IHVuZGVmaW5lZCA9IHBlZXIucHJvdG9jb2xzLmdldChpZClcbiAgICAgIGlmIChwcm90b2NvbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHN0cmVhbSA9IHB1c2hhYmxlKClcbiAgICAgICAgICBwdWxsKHN0cmVhbSwgbHAuZW5jb2RlKCksIGNvbm4pXG4gICAgICAgICAgY29uc3QgaW5TdHJlYW0gPSB0b0l0ZXJhdG9yKHB1bGwoY29ubiwgbHAuZGVjb2RlKCkpKVxuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHByb3RvY29sLnJlY2VpdmUoaW5TdHJlYW0pKSB7XG4gICAgICAgICAgICBpZiAoIW1zZykgYnJlYWtcbiAgICAgICAgICAgIHN0cmVhbS5wdXNoKG1zZylcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RyZWFtLmVuZCgpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGRlYnVnKGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwcml2YXRlIG1rQ29kZWMgKGlkOiBzdHJpbmcsIHZlcnNpb25zOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgdiA9IHZlcnNpb25zLm1hcCgodikgPT4ge1xuICAgICAgaWYgKCFzZW12ZXIudmFsaWQodikpIHtcbiAgICAgICAgcmV0dXJuIGAke3Z9LjAuMGBcbiAgICAgIH1cbiAgICAgIHJldHVybiB2XG4gICAgfSlcbiAgICByZXR1cm4gYC9raXRzdW5ldC8ke2lkfS8ke3NlbXZlci5yc29ydCh2KVswXX1gXG4gIH1cblxuICBhc3luYyBzZW5kPFQsIFUgPSBUPiAobXNnOiBULFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2w/OiBJUHJvdG9jb2w8TGlicDJwUGVlcj4sXG4gICAgICAgICAgICAgICAgICAgICAgICBwZWVyPzogTGlicDJwUGVlcik6IFByb21pc2U8dm9pZCB8IFUgfCBVW10+IHtcbiAgICBpZiAoIXBlZXIgfHwgIXByb3RvY29sKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JvdGggcGVlciBhbmQgcHJvdG9jb2wgYXJlIHJlcXVpcmVkIScpXG4gICAgfVxuXG4gICAgY29uc3QgY29ubiA9IGF3YWl0IHRoaXMubm9kZS5kaWFsUHJvdG9jb2wocGVlci5wZWVyLCB0aGlzLm1rQ29kZWMocHJvdG9jb2wuaWQsIHByb3RvY29sLnZlcnNpb25zKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcHVsbChcbiAgICAgICAgcHVsbC52YWx1ZXMoW21zZ10pLFxuICAgICAgICBscC5lbmNvZGUoKSxcbiAgICAgICAgY29ubixcbiAgICAgICAgbHAuZGVjb2RlKCksXG4gICAgICAgIHB1bGwuY29sbGVjdCgoZXJyOiBFcnJvciwgdmFsdWVzOiBVW10pID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgZ2VuZXJpYyBzdHJlYW0gZW5kZWQgbWVzc2FnZVxuICAgICAgICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKCdzdHJlYW0gZW5kZWQgd2l0aDowIGJ1dCB3YW50ZWQ6MScpXG4gICAgICAgICAgICBpZiAoIXJlLnRlc3QoZXJyLm1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgIGRlYnVnKCdhbiBlcnJvciBvY2N1cnJlZCBzZW5kaW5nIG1lc3NhZ2UgJywgZXJyKVxuICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZSguLi52YWx1ZXMpXG4gICAgICAgIH0pKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBzdGFydCAoKSB7XG4gICAgY29uc3Qgc3RhcnRlciA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLm5vZGUub24oJ3N0YXJ0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLm5vZGUuX211bHRpY2FzdC5zdGFydCgpXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWVcbiAgICAgICAgdGhpcy5wZWVyLmFkZHJzLmZvckVhY2goKG1hKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2xpYnAycCBsaXN0ZW5pbmcgb24nLCBtYS50b1N0cmluZygpKVxuICAgICAgICB9KVxuXG4gICAgICAgIGF3YWl0IHRoaXMubGlicDJwRGlhbGVyLnN0YXJ0KClcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgYXdhaXQgdGhpcy5ub2RlLnN0YXJ0KClcbiAgICByZXR1cm4gc3RhcnRlclxuICB9XG5cbiAgYXN5bmMgc3RvcCAoKSB7XG4gICAgY29uc3Qgc3RvcHBlciA9IG5ldyBQcm9taXNlPHZvaWQ+KGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLmxpYnAycERpYWxlci5zdG9wKClcbiAgICAgIHJldHVybiB0aGlzLm5vZGUub24oJ3N0b3AnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMubm9kZS5fbXVsdGljYXN0LnN0b3AoKVxuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGF3YWl0IHRoaXMubm9kZS5zdG9wKClcbiAgICByZXR1cm4gc3RvcHBlclxuICB9XG59XG4iXX0=