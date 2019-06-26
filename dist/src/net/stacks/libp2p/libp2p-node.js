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
            libp2pPeer = new libp2p_peer_1.Libp2pPeer(peer, this);
            this.peers.set(libp2pPeer.id, libp2pPeer);
            const protocols = this.registerProtos(this.protocolRegistry, libp2pPeer);
            try {
                yield Promise.all(protocols.map(p => p.handshake()));
            }
            catch (e) {
                debug(e);
                this.libp2pDialer.banPeer(peer, 60 * 1000);
                this.libp2pDialer.hangup(peer);
                return;
            }
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
                if (peer) {
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
    disconnectPeer(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.libp2pDialer.hangup(peer.peer);
        });
    }
    banPeer(peer, maxAge, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixvREFBMkI7QUFFM0Isa0dBQXNEO0FBQ3RELDhEQUE4QjtBQUM5QixrREFBeUI7QUFDekIsa0VBQW9DO0FBQ3BDLGdGQUFxQztBQUNyQywrQ0FBZ0M7QUFDaEMsdURBQTJDO0FBQzNDLHFDQUFpQztBQUNqQywrQ0FBMEM7QUFFMUMsaURBS3lCO0FBQ3pCLG1EQUE4QztBQUM5QyxvREFBMkQ7QUFFM0QsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFFL0M7Ozs7O0dBS0c7QUFFSCxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsV0FBZ0I7SUFtQjlDLFlBQW9CLElBQVksRUFDWixJQUFnQixFQUNmLFlBQTBCLEVBRTNCLEtBQWtCLEVBRWxCLGdCQUFtRDtRQUNyRSxLQUFLLEVBQUUsQ0FBQTtRQVBXLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2YsaUJBQVksR0FBWixZQUFZLENBQWM7UUFFM0IsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUVsQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW1DO1FBeEJ2RSxZQUFPLEdBQVksS0FBSyxDQUFBO1FBRXhCLHdDQUF3QztRQUN4QyxTQUFJLEdBQWtCO1lBQ3BCO2dCQUNFLEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUNwQjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDdkI7U0FDRixDQUFBO1FBZUMseUJB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QUFNLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFBO29CQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtvQkFDcEIsT0FBTyxFQUFFLENBQUE7Z0JBQ1gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQSxDQUFDLENBQUE7WUFFRixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDdEIsT0FBTyxPQUFPLENBQUE7UUFDaEIsQ0FBQztLQUFBO0lBRUssY0FBYyxDQUFFLElBQWdCOztZQUNwQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM1QyxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUUsSUFBZ0IsRUFBRSxNQUEyQixFQUFFLE1BQVk7O1lBQ3hFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtRQUM1QyxDQUFDO0tBQUE7Q0FDRixDQUFBO0FBL0tZLFVBQVU7SUFEdEIsMkJBQVEsRUFBRTtJQXVCSyxXQUFBLDJCQUFRLENBQUMscUJBQVEsQ0FBQyxDQUFBO0lBRWxCLFdBQUEsMkJBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO3FDQUxqQixnQkFBTTtRQUNOLHdCQUFVO1FBQ0QsNEJBQVk7R0FyQnBDLFVBQVUsQ0ErS3RCO0FBL0tZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCB0b0l0ZXJhdG9yIGZyb20gJ3B1bGwtc3RyZWFtLXRvLWFzeW5jLWl0ZXJhdG9yJ1xuaW1wb3J0IHB1bGwgZnJvbSAncHVsbC1zdHJlYW0nXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgcHVzaGFibGUgZnJvbSAncHVsbC1wdXNoYWJsZSdcbmltcG9ydCBscCBmcm9tICdwdWxsLWxlbmd0aC1wcmVmaXhlZCdcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbm9kZSdcbmltcG9ydCB7IExpYnAycFBlZXIgfSBmcm9tICcuL2xpYnAycC1wZWVyJ1xuXG5pbXBvcnQge1xuICBJUHJvdG9jb2wsXG4gIE5ldHdvcmtUeXBlLFxuICBJUHJvdG9jb2xEZXNjcmlwdG9yLFxuICBJQ2FwYWJpbGl0eVxufSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgTGlicDJwRGlhbGVyIH0gZnJvbSAnLi9saWJwMnAtZGlhbGVyJ1xuaW1wb3J0IHsgRXRoQ2hhaW4sIElCbG9ja2NoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6bmV0OmxpYnAycDpub2RlJylcblxuLyoqXG4gKiBMaWJwMnAgbm9kZVxuICpcbiAqIEBmaXJlcyBMaWJwMnBOb2RlI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgTGlicDJwTm9kZSNraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCAtIGZpcmVzIG9uIG5ldyBkaXNjb3ZlcmVkIHBlZXJcbiAqL1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBMaWJwMnBOb2RlIGV4dGVuZHMgTm9kZTxMaWJwMnBQZWVyPiB7XG4gIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8vIHRoZSBwcm90b2NvbHMgdGhhdCB0aGlzIG5vZGUgc3VwcG9ydHNcbiAgY2FwczogSUNhcGFiaWxpdHlbXSA9IFtcbiAgICB7XG4gICAgICBpZDogJ2tzbicsXG4gICAgICB2ZXJzaW9uczogWycxLjAuMCddXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2V0aCcsXG4gICAgICB2ZXJzaW9uczogWyc2MicsICc2MyddXG4gICAgfVxuICBdXG5cbiAgZ2V0IHR5cGUgKCk6IE5ldHdvcmtUeXBlIHtcbiAgICByZXR1cm4gTmV0d29ya1R5cGUuTElCUDJQXG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHVibGljIG5vZGU6IExpYnAycCxcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyOiBMaWJwMnBQZWVyLFxuICAgICAgICAgICAgICAgcHJpdmF0ZSBsaWJwMnBEaWFsZXI6IExpYnAycERpYWxlcixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3Byb3RvY29sLXJlZ2lzdHJ5JylcbiAgICAgICAgICAgICAgIHB1YmxpYyBwcm90b2NvbFJlZ2lzdHJ5OiBJUHJvdG9jb2xEZXNjcmlwdG9yPExpYnAycFBlZXI+W10pIHtcbiAgICBzdXBlcigpXG5cbiAgICAvLyByZWdpc3RlciBvd24gcHJvdG9jb2xzXG4gICAgdGhpcy5yZWdpc3RlclByb3Rvcyhwcm90b2NvbFJlZ2lzdHJ5LCB0aGlzLnBlZXIpXG5cbiAgICAvLyBhIHBlZXIgaGFzIGNvbm5lY3RlZCwgc3RvcmUgaXRcbiAgICBsaWJwMnBEaWFsZXIub24oJ3BlZXI6ZGlhbGVkJywgdGhpcy5oYW5kbGVQZWVyLmJpbmQodGhpcykpXG4gICAgLy8gbm9kZS5vbigncGVlcjpjb25uZWN0ZWQnLCB0aGlzLmhhbmRsZVBlZXIuYmluZCh0aGlzKSlcbiAgICBub2RlLm9uKCdwZWVyOmRpc2Nvbm5lY3QnLCAocGVlckluZm86IFBlZXJJbmZvKSA9PiB7XG4gICAgICAvLyByZW1vdmUgZGlzY29ubmVjdGVkIHBlZXJcbiAgICAgIGNvbnN0IGxpYnAycFBlZXI6IExpYnAycFBlZXIgfCB1bmRlZmluZWQgPSB0aGlzLnBlZXJzLmdldChwZWVySW5mby5pZC50b0I1OFN0cmluZygpKVxuICAgICAgaWYgKGxpYnAycFBlZXIpIHtcbiAgICAgICAgdGhpcy5wZWVycy5kZWxldGUocGVlckluZm8uaWQudG9CNThTdHJpbmcoKSlcbiAgICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIGxpYnAycFBlZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZVBlZXIgKHBlZXI6IFBlZXJJbmZvKTogUHJvbWlzZTxMaWJwMnBQZWVyIHwgdW5kZWZpbmVkPiB7XG4gICAgbGV0IGxpYnAycFBlZXI6IExpYnAycFBlZXIgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLnBlZXJzLmdldChwZWVyLmlkLnRvQjU4U3RyaW5nKCkpXG4gICAgaWYgKGxpYnAycFBlZXIpIHJldHVybiBsaWJwMnBQZWVyXG4gICAgbGlicDJwUGVlciA9IG5ldyBMaWJwMnBQZWVyKHBlZXIsIHRoaXMpXG4gICAgdGhpcy5wZWVycy5zZXQobGlicDJwUGVlci5pZCwgbGlicDJwUGVlcilcbiAgICBjb25zdCBwcm90b2NvbHMgPSB0aGlzLnJlZ2lzdGVyUHJvdG9zKHRoaXMucHJvdG9jb2xSZWdpc3RyeSwgbGlicDJwUGVlcilcbiAgICB0cnkge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvdG9jb2xzLm1hcChwID0+IHAuaGFuZHNoYWtlKCkpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgICB0aGlzLmxpYnAycERpYWxlci5iYW5QZWVyKHBlZXIsIDYwICogMTAwMClcbiAgICAgIHRoaXMubGlicDJwRGlhbGVyLmhhbmd1cChwZWVyKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIGxpYnAycFBlZXIpXG4gICAgcmV0dXJuIGxpYnAycFBlZXJcbiAgfVxuXG4gIG1vdW50IChwcm90b2NvbDogSVByb3RvY29sPExpYnAycFBlZXI+KTogdm9pZCB7XG4gICAgY29uc3QgY29kZWMgPSB0aGlzLm1rQ29kZWMocHJvdG9jb2wuaWQsIHByb3RvY29sLnZlcnNpb25zKVxuICAgIHRoaXMubm9kZS5oYW5kbGUoY29kZWMsIGFzeW5jIChfOiBhbnksIGNvbm46IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlSW5jb21pbmcocHJvdG9jb2wuaWQsIGNvbm4pXG4gICAgfSlcbiAgfVxuXG4gIHVubW91bnQgKHByb3RvY29sOiBJUHJvdG9jb2w8TGlicDJwUGVlcj4pOiB2b2lkIHtcbiAgICB0aGlzLm5vZGUudW5oYW5kbGUocHJvdG9jb2wuaWQpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUluY29taW5nIChpZDogc3RyaW5nLCBjb25uOiBhbnkpIHtcbiAgICBjb25uLmdldFBlZXJJbmZvKGFzeW5jIChlcnI6IEVycm9yLCBwZWVySW5mbzogUGVlckluZm8pID0+IHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVyclxuICAgICAgY29uc3QgcGVlcjogTGlicDJwUGVlciB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuaGFuZGxlUGVlcihwZWVySW5mbylcbiAgICAgIGlmIChwZWVyKSB7XG4gICAgICAgIGNvbnN0IHByb3RvY29sOiBJUHJvdG9jb2w8TGlicDJwUGVlcj4gfCB1bmRlZmluZWQgPSBwZWVyLnByb3RvY29scy5nZXQoaWQpXG4gICAgICAgIGlmIChwcm90b2NvbCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdHJlYW0gPSBwdXNoYWJsZSgpXG4gICAgICAgICAgICBwdWxsKHN0cmVhbSwgbHAuZW5jb2RlKCksIGNvbm4pXG4gICAgICAgICAgICBjb25zdCBpblN0cmVhbSA9IHRvSXRlcmF0b3IocHVsbChjb25uLCBscC5kZWNvZGUoKSkpXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBwcm90b2NvbC5yZWNlaXZlKGluU3RyZWFtKSkge1xuICAgICAgICAgICAgICBpZiAoIW1zZykgYnJlYWtcbiAgICAgICAgICAgICAgc3RyZWFtLnB1c2gobXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyZWFtLmVuZCgpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWJ1ZyhlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgbWtDb2RlYyAoaWQ6IHN0cmluZywgdmVyc2lvbnM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBjb25zdCB2ID0gdmVyc2lvbnMubWFwKCh2KSA9PiB7XG4gICAgICBpZiAoIXNlbXZlci52YWxpZCh2KSkge1xuICAgICAgICByZXR1cm4gYCR7dn0uMC4wYFxuICAgICAgfVxuICAgICAgcmV0dXJuIHZcbiAgICB9KVxuICAgIHJldHVybiBgL2tpdHN1bmV0LyR7aWR9LyR7c2VtdmVyLnJzb3J0KHYpWzBdfWBcbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VCwgVSA9IFQ+IChtc2c6IFQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90b2NvbD86IElQcm90b2NvbDxMaWJwMnBQZWVyPixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZXI/OiBMaWJwMnBQZWVyKTogUHJvbWlzZTx2b2lkIHwgVSB8IFVbXT4ge1xuICAgIGlmICghcGVlciB8fCAhcHJvdG9jb2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYm90aCBwZWVyIGFuZCBwcm90b2NvbCBhcmUgcmVxdWlyZWQhJylcbiAgICB9XG5cbiAgICBjb25zdCBjb25uID0gYXdhaXQgdGhpcy5ub2RlLmRpYWxQcm90b2NvbChwZWVyLnBlZXIsIHRoaXMubWtDb2RlYyhwcm90b2NvbC5pZCwgcHJvdG9jb2wudmVyc2lvbnMpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwdWxsKFxuICAgICAgICBwdWxsLnZhbHVlcyhbbXNnXSksXG4gICAgICAgIGxwLmVuY29kZSgpLFxuICAgICAgICBjb25uLFxuICAgICAgICBscC5kZWNvZGUoKSxcbiAgICAgICAgcHVsbC5jb2xsZWN0KChlcnI6IEVycm9yLCB2YWx1ZXM6IFVbXSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBnZW5lcmljIHN0cmVhbSBlbmRlZCBtZXNzYWdlXG4gICAgICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoJ3N0cmVhbSBlbmRlZCB3aXRoOjAgYnV0IHdhbnRlZDoxJylcbiAgICAgICAgICAgIGlmICghcmUudGVzdChlcnIubWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgZGVidWcoJ2FuIGVycm9yIG9jY3VycmVkIHNlbmRpbmcgbWVzc2FnZSAnLCBlcnIpXG4gICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKC4uLnZhbHVlcylcbiAgICAgICAgfSkpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICBjb25zdCBzdGFydGVyID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMubm9kZS5vbignc3RhcnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMubm9kZS5fbXVsdGljYXN0LnN0YXJ0KClcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuICAgICAgICB0aGlzLnBlZXIuYWRkcnMuZm9yRWFjaCgobWEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbGlicDJwIGxpc3RlbmluZyBvbicsIG1hLnRvU3RyaW5nKCkpXG4gICAgICAgIH0pXG5cbiAgICAgICAgYXdhaXQgdGhpcy5saWJwMnBEaWFsZXIuc3RhcnQoKVxuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBhd2FpdCB0aGlzLm5vZGUuc3RhcnQoKVxuICAgIHJldHVybiBzdGFydGVyXG4gIH1cblxuICBhc3luYyBzdG9wICgpIHtcbiAgICBjb25zdCBzdG9wcGVyID0gbmV3IFByb21pc2U8dm9pZD4oYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMubGlicDJwRGlhbGVyLnN0b3AoKVxuICAgICAgcmV0dXJuIHRoaXMubm9kZS5vbignc3RvcCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5ub2RlLl9tdWx0aWNhc3Quc3RvcCgpXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgYXdhaXQgdGhpcy5ub2RlLnN0b3AoKVxuICAgIHJldHVybiBzdG9wcGVyXG4gIH1cblxuICBhc3luYyBkaXNjb25uZWN0UGVlciAocGVlcjogTGlicDJwUGVlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmxpYnAycERpYWxlci5oYW5ndXAocGVlci5wZWVyKVxuICB9XG5cbiAgYXN5bmMgYmFuUGVlciAocGVlcjogTGlicDJwUGVlciwgbWF4QWdlPzogbnVtYmVyIHwgdW5kZWZpbmVkLCByZWFzb24/OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxufVxuIl19