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
    constructor(node, libp2pDialer, peer, chain, protocolRegistry) {
        super();
        this.node = node;
        this.libp2pDialer = libp2pDialer;
        this.peer = peer;
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
    __param(2, opium_decorators_1.register('libp2p-peer')),
    __param(3, opium_decorators_1.register(blockchain_1.EthChain)),
    __param(4, opium_decorators_1.register('protocol-registry')),
    __metadata("design:paramtypes", [libp2p_1.default,
        libp2p_dialer_1.Libp2pDialer,
        libp2p_peer_1.Libp2pPeer, Object, Array])
], Libp2pNode);
exports.Libp2pNode = Libp2pNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixvREFBMkI7QUFFM0Isa0dBQXNEO0FBQ3RELDhEQUE4QjtBQUM5QixrREFBeUI7QUFDekIsa0VBQW9DO0FBQ3BDLGdGQUFxQztBQUNyQywrQ0FBZ0M7QUFDaEMsdURBQTJDO0FBQzNDLHFDQUFpQztBQUNqQywrQ0FBMEM7QUFHMUMsaURBS3lCO0FBQ3pCLG1EQUE4QztBQUM5QyxvREFBMkQ7QUFFM0QsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFFL0M7Ozs7O0dBS0c7QUFFSCxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsV0FBZ0I7SUFtQjlDLFlBQW9CLElBQVksRUFDWCxZQUEwQixFQUUzQixJQUFnQixFQUVoQixLQUFrQixFQUVsQixnQkFBbUQ7UUFDckUsS0FBSyxFQUFFLENBQUE7UUFSVyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1gsaUJBQVksR0FBWixZQUFZLENBQWM7UUFFM0IsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUVoQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBRWxCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUM7UUF6QnZFLFlBQU8sR0FBWSxLQUFLLENBQUE7UUFFeEIsd0NBQXdDO1FBQ3hDLFNBQUksR0FBa0I7WUFDcEI7Z0JBQ0UsRUFBRSxFQUFFLEtBQUs7Z0JBQ1QsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDO2FBQ3BCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLEtBQUs7Z0JBQ1QsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUN2QjtTQUNGLENBQUE7UUFnQkMs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ckMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtvQkFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7b0JBQ3BCLE9BQU8sRUFBRSxDQUFBO2dCQUNYLENBQUMsQ0FBQSxDQUFDLENBQUE7WUFDSixDQUFDLENBQUEsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3RCLE9BQU8sT0FBTyxDQUFBO1FBQ2hCLENBQUM7S0FBQTtJQUVLLGNBQWMsQ0FBRSxJQUFnQjs7WUFDcEMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFFLElBQWdCLEVBQUUsTUFBMkIsRUFBRSxNQUFZOztZQUN4RSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDNUMsQ0FBQztLQUFBO0NBQ0YsQ0FBQTtBQWhMWSxVQUFVO0lBRHRCLDJCQUFRLEVBQUU7SUFzQkssV0FBQSwyQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBRXZCLFdBQUEsMkJBQVEsQ0FBQyxxQkFBUSxDQUFDLENBQUE7SUFFbEIsV0FBQSwyQkFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUE7cUNBTmpCLGdCQUFNO1FBQ0csNEJBQVk7UUFFckIsd0JBQVU7R0F0QnpCLFVBQVUsQ0FnTHRCO0FBaExZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCB0b0l0ZXJhdG9yIGZyb20gJ3B1bGwtc3RyZWFtLXRvLWFzeW5jLWl0ZXJhdG9yJ1xuaW1wb3J0IHB1bGwgZnJvbSAncHVsbC1zdHJlYW0nXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgcHVzaGFibGUgZnJvbSAncHVsbC1wdXNoYWJsZSdcbmltcG9ydCBscCBmcm9tICdwdWxsLWxlbmd0aC1wcmVmaXhlZCdcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbm9kZSdcbmltcG9ydCB7IExpYnAycFBlZXIgfSBmcm9tICcuL2xpYnAycC1wZWVyJ1xuaW1wb3J0IHsgRXh0cmFjdEZyb21MaWJwMnBQZWVyIH0gZnJvbSAnLi4vLi4vaGVscGVyLXR5cGVzJ1xuXG5pbXBvcnQge1xuICBJUHJvdG9jb2wsXG4gIE5ldHdvcmtUeXBlLFxuICBJUHJvdG9jb2xEZXNjcmlwdG9yLFxuICBJQ2FwYWJpbGl0eVxufSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgTGlicDJwRGlhbGVyIH0gZnJvbSAnLi9saWJwMnAtZGlhbGVyJ1xuaW1wb3J0IHsgRXRoQ2hhaW4sIElCbG9ja2NoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6bmV0OmxpYnAycDpub2RlJylcblxuLyoqXG4gKiBMaWJwMnAgbm9kZVxuICpcbiAqIEBmaXJlcyBMaWJwMnBOb2RlI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgTGlicDJwTm9kZSNraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCAtIGZpcmVzIG9uIG5ldyBkaXNjb3ZlcmVkIHBlZXJcbiAqL1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBMaWJwMnBOb2RlIGV4dGVuZHMgTm9kZTxMaWJwMnBQZWVyPiB7XG4gIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8vIHRoZSBwcm90b2NvbHMgdGhhdCB0aGlzIG5vZGUgc3VwcG9ydHNcbiAgY2FwczogSUNhcGFiaWxpdHlbXSA9IFtcbiAgICB7XG4gICAgICBpZDogJ2tzbicsXG4gICAgICB2ZXJzaW9uczogWycxLjAuMCddXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2V0aCcsXG4gICAgICB2ZXJzaW9uczogWyc2MicsICc2MyddXG4gICAgfVxuICBdXG5cbiAgZ2V0IHR5cGUgKCk6IE5ldHdvcmtUeXBlIHtcbiAgICByZXR1cm4gTmV0d29ya1R5cGUuTElCUDJQXG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHVibGljIG5vZGU6IExpYnAycCxcbiAgICAgICAgICAgICAgIHByaXZhdGUgbGlicDJwRGlhbGVyOiBMaWJwMnBEaWFsZXIsXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2xpYnAycC1wZWVyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyOiBMaWJwMnBQZWVyLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKEV0aENoYWluKVxuICAgICAgICAgICAgICAgcHVibGljIGNoYWluOiBJQmxvY2tjaGFpbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcigncHJvdG9jb2wtcmVnaXN0cnknKVxuICAgICAgICAgICAgICAgcHVibGljIHByb3RvY29sUmVnaXN0cnk6IElQcm90b2NvbERlc2NyaXB0b3I8TGlicDJwUGVlcj5bXSkge1xuICAgIHN1cGVyKClcblxuICAgIC8vIHJlZ2lzdGVyIG93biBwcm90b2NvbHNcbiAgICB0aGlzLnJlZ2lzdGVyUHJvdG9zKHByb3RvY29sUmVnaXN0cnksIHRoaXMucGVlcilcblxuICAgIC8vIGEgcGVlciBoYXMgY29ubmVjdGVkLCBzdG9yZSBpdFxuICAgIGxpYnAycERpYWxlci5vbigncGVlcjpkaWFsZWQnLCB0aGlzLmhhbmRsZVBlZXIuYmluZCh0aGlzKSlcbiAgICAvLyBub2RlLm9uKCdwZWVyOmNvbm5lY3RlZCcsIHRoaXMuaGFuZGxlUGVlci5iaW5kKHRoaXMpKVxuICAgIG5vZGUub24oJ3BlZXI6ZGlzY29ubmVjdCcsIChwZWVySW5mbzogUGVlckluZm8pID0+IHtcbiAgICAgIC8vIHJlbW92ZSBkaXNjb25uZWN0ZWQgcGVlclxuICAgICAgY29uc3QgbGlicDJwUGVlcjogTGlicDJwUGVlciB8IHVuZGVmaW5lZCA9IHRoaXMucGVlcnMuZ2V0KHBlZXJJbmZvLmlkLnRvQjU4U3RyaW5nKCkpXG4gICAgICBpZiAobGlicDJwUGVlcikge1xuICAgICAgICB0aGlzLnBlZXJzLmRlbGV0ZShwZWVySW5mby5pZC50b0I1OFN0cmluZygpKVxuICAgICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgbGlicDJwUGVlcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlUGVlciAocGVlcjogUGVlckluZm8pOiBQcm9taXNlPExpYnAycFBlZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBsZXQgbGlicDJwUGVlcjogTGlicDJwUGVlciB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMucGVlcnMuZ2V0KHBlZXIuaWQudG9CNThTdHJpbmcoKSlcbiAgICBpZiAobGlicDJwUGVlcikgcmV0dXJuIGxpYnAycFBlZXJcbiAgICBsaWJwMnBQZWVyID0gbmV3IExpYnAycFBlZXIocGVlciwgdGhpcyBhcyB1bmtub3duIGFzIEV4dHJhY3RGcm9tTGlicDJwUGVlcilcbiAgICB0aGlzLnBlZXJzLnNldChsaWJwMnBQZWVyLmlkLCBsaWJwMnBQZWVyKVxuICAgIGNvbnN0IHByb3RvY29scyA9IHRoaXMucmVnaXN0ZXJQcm90b3ModGhpcy5wcm90b2NvbFJlZ2lzdHJ5LCBsaWJwMnBQZWVyKVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm90b2NvbHMubWFwKHAgPT4gcC5oYW5kc2hha2UoKSkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICAgIHRoaXMubGlicDJwRGlhbGVyLmJhblBlZXIocGVlciwgNjAgKiAxMDAwKVxuICAgICAgdGhpcy5saWJwMnBEaWFsZXIuaGFuZ3VwKHBlZXIpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkJywgbGlicDJwUGVlcilcbiAgICByZXR1cm4gbGlicDJwUGVlclxuICB9XG5cbiAgbW91bnQgKHByb3RvY29sOiBJUHJvdG9jb2w8TGlicDJwUGVlcj4pOiB2b2lkIHtcbiAgICBjb25zdCBjb2RlYyA9IHRoaXMubWtDb2RlYyhwcm90b2NvbC5pZCwgcHJvdG9jb2wudmVyc2lvbnMpXG4gICAgdGhpcy5ub2RlLmhhbmRsZShjb2RlYywgYXN5bmMgKF86IGFueSwgY29ubjogYW55KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVJbmNvbWluZyhwcm90b2NvbC5pZCwgY29ubilcbiAgICB9KVxuICB9XG5cbiAgdW5tb3VudCAocHJvdG9jb2w6IElQcm90b2NvbDxMaWJwMnBQZWVyPik6IHZvaWQge1xuICAgIHRoaXMubm9kZS51bmhhbmRsZShwcm90b2NvbC5pZClcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlSW5jb21pbmcgKGlkOiBzdHJpbmcsIGNvbm46IGFueSkge1xuICAgIGNvbm4uZ2V0UGVlckluZm8oYXN5bmMgKGVycjogRXJyb3IsIHBlZXJJbmZvOiBQZWVySW5mbykgPT4ge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyXG4gICAgICBjb25zdCBwZWVyOiBMaWJwMnBQZWVyIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5oYW5kbGVQZWVyKHBlZXJJbmZvKVxuICAgICAgaWYgKHBlZXIpIHtcbiAgICAgICAgY29uc3QgcHJvdG9jb2w6IElQcm90b2NvbDxMaWJwMnBQZWVyPiB8IHVuZGVmaW5lZCA9IHBlZXIucHJvdG9jb2xzLmdldChpZClcbiAgICAgICAgaWYgKHByb3RvY29sKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9IHB1c2hhYmxlKClcbiAgICAgICAgICAgIHB1bGwoc3RyZWFtLCBscC5lbmNvZGUoKSwgY29ubilcbiAgICAgICAgICAgIGNvbnN0IGluU3RyZWFtID0gdG9JdGVyYXRvcihwdWxsKGNvbm4sIGxwLmRlY29kZSgpKSlcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHByb3RvY29sLnJlY2VpdmUoaW5TdHJlYW0pKSB7XG4gICAgICAgICAgICAgIGlmICghbXNnKSBicmVha1xuICAgICAgICAgICAgICBzdHJlYW0ucHVzaChtc2cpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHJlYW0uZW5kKClcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlYnVnKGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBta0NvZGVjIChpZDogc3RyaW5nLCB2ZXJzaW9uczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IHYgPSB2ZXJzaW9ucy5tYXAoKHYpID0+IHtcbiAgICAgIGlmICghc2VtdmVyLnZhbGlkKHYpKSB7XG4gICAgICAgIHJldHVybiBgJHt2fS4wLjBgXG4gICAgICB9XG4gICAgICByZXR1cm4gdlxuICAgIH0pXG4gICAgcmV0dXJuIGAva2l0c3VuZXQvJHtpZH0vJHtzZW12ZXIucnNvcnQodilbMF19YFxuICB9XG5cbiAgYXN5bmMgc2VuZDxULCBVID0gVD4gKG1zZzogVCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvY29sPzogSVByb3RvY29sPExpYnAycFBlZXI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVlcj86IExpYnAycFBlZXIpOiBQcm9taXNlPHZvaWQgfCBVIHwgVVtdPiB7XG4gICAgaWYgKCFwZWVyIHx8ICFwcm90b2NvbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdib3RoIHBlZXIgYW5kIHByb3RvY29sIGFyZSByZXF1aXJlZCEnKVxuICAgIH1cblxuICAgIGNvbnN0IGNvbm4gPSBhd2FpdCB0aGlzLm5vZGUuZGlhbFByb3RvY29sKHBlZXIucGVlciwgdGhpcy5ta0NvZGVjKHByb3RvY29sLmlkLCBwcm90b2NvbC52ZXJzaW9ucykpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHB1bGwoXG4gICAgICAgIHB1bGwudmFsdWVzKFttc2ddKSxcbiAgICAgICAgbHAuZW5jb2RlKCksXG4gICAgICAgIGNvbm4sXG4gICAgICAgIGxwLmRlY29kZSgpLFxuICAgICAgICBwdWxsLmNvbGxlY3QoKGVycjogRXJyb3IsIHZhbHVlczogVVtdKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgLy8gaWdub3JlIGdlbmVyaWMgc3RyZWFtIGVuZGVkIG1lc3NhZ2VcbiAgICAgICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cCgnc3RyZWFtIGVuZGVkIHdpdGg6MCBidXQgd2FudGVkOjEnKVxuICAgICAgICAgICAgaWYgKCFyZS50ZXN0KGVyci5tZXNzYWdlKSkge1xuICAgICAgICAgICAgICBkZWJ1ZygnYW4gZXJyb3Igb2NjdXJyZWQgc2VuZGluZyBtZXNzYWdlICcsIGVycilcbiAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoLi4udmFsdWVzKVxuICAgICAgICB9KSlcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCkge1xuICAgIGNvbnN0IHN0YXJ0ZXIgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5ub2RlLm9uKCdzdGFydCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5ub2RlLl9tdWx0aWNhc3Quc3RhcnQoKVxuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgIHRoaXMucGVlci5hZGRycy5mb3JFYWNoKChtYSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdsaWJwMnAgbGlzdGVuaW5nIG9uJywgbWEudG9TdHJpbmcoKSlcbiAgICAgICAgfSlcblxuICAgICAgICBhd2FpdCB0aGlzLmxpYnAycERpYWxlci5zdGFydCgpXG4gICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGF3YWl0IHRoaXMubm9kZS5zdGFydCgpXG4gICAgcmV0dXJuIHN0YXJ0ZXJcbiAgfVxuXG4gIGFzeW5jIHN0b3AgKCkge1xuICAgIGNvbnN0IHN0b3BwZXIgPSBuZXcgUHJvbWlzZTx2b2lkPihhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5saWJwMnBEaWFsZXIuc3RvcCgpXG4gICAgICByZXR1cm4gdGhpcy5ub2RlLm9uKCdzdG9wJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLm5vZGUuX211bHRpY2FzdC5zdG9wKClcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBhd2FpdCB0aGlzLm5vZGUuc3RvcCgpXG4gICAgcmV0dXJuIHN0b3BwZXJcbiAgfVxuXG4gIGFzeW5jIGRpc2Nvbm5lY3RQZWVyIChwZWVyOiBMaWJwMnBQZWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMubGlicDJwRGlhbGVyLmhhbmd1cChwZWVyLnBlZXIpXG4gIH1cblxuICBhc3luYyBiYW5QZWVyIChwZWVyOiBMaWJwMnBQZWVyLCBtYXhBZ2U/OiBudW1iZXIgfCB1bmRlZmluZWQsIHJlYXNvbj86IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKVxuICB9XG59XG4iXX0=