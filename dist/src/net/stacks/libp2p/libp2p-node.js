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
            try {
                yield Promise.all(protocols.map(p => p.handshake()));
            }
            catch (e) {
                debug(e);
                this.libp2pDialer.banPeer(peer, 60 * 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLW5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixvREFBMkI7QUFFM0Isa0dBQXNEO0FBQ3RELDhEQUE4QjtBQUM5QixrREFBeUI7QUFDekIsa0VBQW9DO0FBQ3BDLGdGQUFxQztBQUNyQywrQ0FBZ0M7QUFDaEMsdURBQTJDO0FBQzNDLHFDQUFpQztBQUNqQywrQ0FBMEM7QUFFMUMsaURBS3lCO0FBQ3pCLG1EQUE4QztBQUM5QyxvREFBMkQ7QUFFM0QsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFFL0M7Ozs7O0dBS0c7QUFFSCxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsV0FBZ0I7SUFtQjlDLFlBQW9CLElBQVksRUFDWixJQUFnQixFQUNmLFlBQTBCLEVBRTNCLEtBQWtCLEVBRWxCLGdCQUFtRDtRQUNyRSxLQUFLLEVBQUUsQ0FBQTtRQVBXLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2YsaUJBQVksR0FBWixZQUFZLENBQWM7UUFFM0IsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUVsQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW1DO1FBeEJ2RSxZQUFPLEdBQVksS0FBSyxDQUFBO1FBRXhCLHdDQUF3QztRQUN4QyxTQUFJLEdBQWtCO1lBQ3BCO2dCQUNFLEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUNwQjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDdkI7U0FDRixDQUFBO1FBZUMseUJB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QUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7b0JBQ3BCLE9BQU8sRUFBRSxDQUFBO2dCQUNYLENBQUMsQ0FBQSxDQUFDLENBQUE7WUFDSixDQUFDLENBQUEsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3RCLE9BQU8sT0FBTyxDQUFBO1FBQ2hCLENBQUM7S0FBQTtDQUNGLENBQUE7QUF0S1ksVUFBVTtJQUR0QiwyQkFBUSxFQUFFO0lBdUJLLFdBQUEsMkJBQVEsQ0FBQyxxQkFBUSxDQUFDLENBQUE7SUFFbEIsV0FBQSwyQkFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUE7cUNBTGpCLGdCQUFNO1FBQ04sd0JBQVU7UUFDRCw0QkFBWTtHQXJCcEMsVUFBVSxDQXNLdEI7QUF0S1ksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IExpYnAycCBmcm9tICdsaWJwMnAnXG5pbXBvcnQgUGVlckluZm8gZnJvbSAncGVlci1pbmZvJ1xuaW1wb3J0IHRvSXRlcmF0b3IgZnJvbSAncHVsbC1zdHJlYW0tdG8tYXN5bmMtaXRlcmF0b3InXG5pbXBvcnQgcHVsbCBmcm9tICdwdWxsLXN0cmVhbSdcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBwdXNoYWJsZSBmcm9tICdwdWxsLXB1c2hhYmxlJ1xuaW1wb3J0IGxwIGZyb20gJ3B1bGwtbGVuZ3RoLXByZWZpeGVkJ1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcidcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9ub2RlJ1xuaW1wb3J0IHsgTGlicDJwUGVlciB9IGZyb20gJy4vbGlicDJwLXBlZXInXG5cbmltcG9ydCB7XG4gIElQcm90b2NvbCxcbiAgTmV0d29ya1R5cGUsXG4gIElQcm90b2NvbERlc2NyaXB0b3IsXG4gIElDYXBhYmlsaXR5XG59IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBMaWJwMnBEaWFsZXIgfSBmcm9tICcuL2xpYnAycC1kaWFsZXInXG5pbXBvcnQgeyBFdGhDaGFpbiwgSUJsb2NrY2hhaW4gfSBmcm9tICcuLi8uLi8uLi9ibG9ja2NoYWluJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpuZXQ6bGlicDJwOm5vZGUnKVxuXG4vKipcbiAqIExpYnAycCBub2RlXG4gKlxuICogQGZpcmVzIExpYnAycE5vZGUja2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQgLSBmaXJlcyBvbiBuZXcgY29ubmVjdGVkIHBlZXJcbiAqIEBmaXJlcyBMaWJwMnBOb2RlI2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGRpc2NvdmVyZWQgcGVlclxuICovXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIExpYnAycE5vZGUgZXh0ZW5kcyBOb2RlPExpYnAycFBlZXI+IHtcbiAgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgLy8gdGhlIHByb3RvY29scyB0aGF0IHRoaXMgbm9kZSBzdXBwb3J0c1xuICBjYXBzOiBJQ2FwYWJpbGl0eVtdID0gW1xuICAgIHtcbiAgICAgIGlkOiAna3NuJyxcbiAgICAgIHZlcnNpb25zOiBbJzEuMC4wJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnZXRoJyxcbiAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ11cbiAgICB9XG4gIF1cblxuICBnZXQgdHlwZSAoKTogTmV0d29ya1R5cGUge1xuICAgIHJldHVybiBOZXR3b3JrVHlwZS5MSUJQMlBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgbm9kZTogTGlicDJwLFxuICAgICAgICAgICAgICAgcHVibGljIHBlZXI6IExpYnAycFBlZXIsXG4gICAgICAgICAgICAgICBwcml2YXRlIGxpYnAycERpYWxlcjogTGlicDJwRGlhbGVyLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKEV0aENoYWluKVxuICAgICAgICAgICAgICAgcHVibGljIGNoYWluOiBJQmxvY2tjaGFpbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcigncHJvdG9jb2wtcmVnaXN0cnknKVxuICAgICAgICAgICAgICAgcHVibGljIHByb3RvY29sUmVnaXN0cnk6IElQcm90b2NvbERlc2NyaXB0b3I8TGlicDJwUGVlcj5bXSkge1xuICAgIHN1cGVyKClcblxuICAgIC8vIHJlZ2lzdGVyIG93biBwcm90b2NvbHNcbiAgICB0aGlzLnJlZ2lzdGVyUHJvdG9zKHByb3RvY29sUmVnaXN0cnksIHRoaXMucGVlcilcblxuICAgIC8vIGEgcGVlciBoYXMgY29ubmVjdGVkLCBzdG9yZSBpdFxuICAgIGxpYnAycERpYWxlci5vbigncGVlcjpkaWFsZWQnLCB0aGlzLmhhbmRsZVBlZXIuYmluZCh0aGlzKSlcbiAgICAvLyBub2RlLm9uKCdwZWVyOmNvbm5lY3RlZCcsIHRoaXMuaGFuZGxlUGVlci5iaW5kKHRoaXMpKVxuICAgIG5vZGUub24oJ3BlZXI6ZGlzY29ubmVjdCcsIChwZWVySW5mbzogUGVlckluZm8pID0+IHtcbiAgICAgIC8vIHJlbW92ZSBkaXNjb25uZWN0ZWQgcGVlclxuICAgICAgY29uc3QgbGlicDJwUGVlcjogTGlicDJwUGVlciB8IHVuZGVmaW5lZCA9IHRoaXMucGVlcnMuZ2V0KHBlZXJJbmZvLmlkLnRvQjU4U3RyaW5nKCkpXG4gICAgICBpZiAobGlicDJwUGVlcikge1xuICAgICAgICB0aGlzLnBlZXJzLmRlbGV0ZShwZWVySW5mby5pZC50b0I1OFN0cmluZygpKVxuICAgICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgbGlicDJwUGVlcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlUGVlciAocGVlcjogUGVlckluZm8pOiBQcm9taXNlPExpYnAycFBlZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBsZXQgbGlicDJwUGVlcjogTGlicDJwUGVlciB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMucGVlcnMuZ2V0KHBlZXIuaWQudG9CNThTdHJpbmcoKSlcbiAgICBpZiAobGlicDJwUGVlcikgcmV0dXJuIGxpYnAycFBlZXJcbiAgICBsaWJwMnBQZWVyID0gbmV3IExpYnAycFBlZXIocGVlcilcbiAgICB0aGlzLnBlZXJzLnNldChsaWJwMnBQZWVyLmlkLCBsaWJwMnBQZWVyKVxuICAgIGNvbnN0IHByb3RvY29scyA9IHRoaXMucmVnaXN0ZXJQcm90b3ModGhpcy5wcm90b2NvbFJlZ2lzdHJ5LCBsaWJwMnBQZWVyKVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm90b2NvbHMubWFwKHAgPT4gcC5oYW5kc2hha2UoKSkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICAgIHRoaXMubGlicDJwRGlhbGVyLmJhblBlZXIocGVlciwgNjAgKiAxMDAwKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIGxpYnAycFBlZXIpXG4gICAgcmV0dXJuIGxpYnAycFBlZXJcbiAgfVxuXG4gIG1vdW50IChwcm90b2NvbDogSVByb3RvY29sPExpYnAycFBlZXI+KTogdm9pZCB7XG4gICAgY29uc3QgY29kZWMgPSB0aGlzLm1rQ29kZWMocHJvdG9jb2wuaWQsIHByb3RvY29sLnZlcnNpb25zKVxuICAgIHRoaXMubm9kZS5oYW5kbGUoY29kZWMsIGFzeW5jIChfOiBhbnksIGNvbm46IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlSW5jb21pbmcocHJvdG9jb2wuaWQsIGNvbm4pXG4gICAgfSlcbiAgfVxuXG4gIHVubW91bnQgKHByb3RvY29sOiBJUHJvdG9jb2w8TGlicDJwUGVlcj4pOiB2b2lkIHtcbiAgICB0aGlzLm5vZGUudW5oYW5kbGUocHJvdG9jb2wuaWQpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUluY29taW5nIChpZDogc3RyaW5nLCBjb25uOiBhbnkpIHtcbiAgICBjb25uLmdldFBlZXJJbmZvKGFzeW5jIChlcnI6IEVycm9yLCBwZWVySW5mbzogUGVlckluZm8pID0+IHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVyclxuICAgICAgY29uc3QgcGVlcjogTGlicDJwUGVlciB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuaGFuZGxlUGVlcihwZWVySW5mbylcbiAgICAgIGlmIChwZWVyKSB7XG4gICAgICAgIGNvbnN0IHByb3RvY29sOiBJUHJvdG9jb2w8TGlicDJwUGVlcj4gfCB1bmRlZmluZWQgPSBwZWVyLnByb3RvY29scy5nZXQoaWQpXG4gICAgICAgIGlmIChwcm90b2NvbCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdHJlYW0gPSBwdXNoYWJsZSgpXG4gICAgICAgICAgICBwdWxsKHN0cmVhbSwgbHAuZW5jb2RlKCksIGNvbm4pXG4gICAgICAgICAgICBjb25zdCBpblN0cmVhbSA9IHRvSXRlcmF0b3IocHVsbChjb25uLCBscC5kZWNvZGUoKSkpXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBwcm90b2NvbC5yZWNlaXZlKGluU3RyZWFtKSkge1xuICAgICAgICAgICAgICBpZiAoIW1zZykgYnJlYWtcbiAgICAgICAgICAgICAgc3RyZWFtLnB1c2gobXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyZWFtLmVuZCgpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWJ1ZyhlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgbWtDb2RlYyAoaWQ6IHN0cmluZywgdmVyc2lvbnM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBjb25zdCB2ID0gdmVyc2lvbnMubWFwKCh2KSA9PiB7XG4gICAgICBpZiAoIXNlbXZlci52YWxpZCh2KSkge1xuICAgICAgICByZXR1cm4gYCR7dn0uMC4wYFxuICAgICAgfVxuICAgICAgcmV0dXJuIHZcbiAgICB9KVxuICAgIHJldHVybiBgL2tpdHN1bmV0LyR7aWR9LyR7c2VtdmVyLnJzb3J0KHYpWzBdfWBcbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VCwgVSA9IFQ+IChtc2c6IFQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90b2NvbD86IElQcm90b2NvbDxMaWJwMnBQZWVyPixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZXI/OiBMaWJwMnBQZWVyKTogUHJvbWlzZTx2b2lkIHwgVSB8IFVbXT4ge1xuICAgIGlmICghcGVlciB8fCAhcHJvdG9jb2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYm90aCBwZWVyIGFuZCBwcm90b2NvbCBhcmUgcmVxdWlyZWQhJylcbiAgICB9XG5cbiAgICBjb25zdCBjb25uID0gYXdhaXQgdGhpcy5ub2RlLmRpYWxQcm90b2NvbChwZWVyLnBlZXIsIHRoaXMubWtDb2RlYyhwcm90b2NvbC5pZCwgcHJvdG9jb2wudmVyc2lvbnMpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwdWxsKFxuICAgICAgICBwdWxsLnZhbHVlcyhbbXNnXSksXG4gICAgICAgIGxwLmVuY29kZSgpLFxuICAgICAgICBjb25uLFxuICAgICAgICBscC5kZWNvZGUoKSxcbiAgICAgICAgcHVsbC5jb2xsZWN0KChlcnI6IEVycm9yLCB2YWx1ZXM6IFVbXSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBnZW5lcmljIHN0cmVhbSBlbmRlZCBtZXNzYWdlXG4gICAgICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoJ3N0cmVhbSBlbmRlZCB3aXRoOjAgYnV0IHdhbnRlZDoxJylcbiAgICAgICAgICAgIGlmICghcmUudGVzdChlcnIubWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgZGVidWcoJ2FuIGVycm9yIG9jY3VycmVkIHNlbmRpbmcgbWVzc2FnZSAnLCBlcnIpXG4gICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKC4uLnZhbHVlcylcbiAgICAgICAgfSkpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICBjb25zdCBzdGFydGVyID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMubm9kZS5vbignc3RhcnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMubm9kZS5fbXVsdGljYXN0LnN0YXJ0KClcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuICAgICAgICB0aGlzLnBlZXIuYWRkcnMuZm9yRWFjaCgobWEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbGlicDJwIGxpc3RlbmluZyBvbicsIG1hLnRvU3RyaW5nKCkpXG4gICAgICAgIH0pXG5cbiAgICAgICAgYXdhaXQgdGhpcy5saWJwMnBEaWFsZXIuc3RhcnQoKVxuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBhd2FpdCB0aGlzLm5vZGUuc3RhcnQoKVxuICAgIHJldHVybiBzdGFydGVyXG4gIH1cblxuICBhc3luYyBzdG9wICgpIHtcbiAgICBjb25zdCBzdG9wcGVyID0gbmV3IFByb21pc2U8dm9pZD4oYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMubGlicDJwRGlhbGVyLnN0b3AoKVxuICAgICAgcmV0dXJuIHRoaXMubm9kZS5vbignc3RvcCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5ub2RlLl9tdWx0aWNhc3Quc3RvcCgpXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgYXdhaXQgdGhpcy5ub2RlLnN0b3AoKVxuICAgIHJldHVybiBzdG9wcGVyXG4gIH1cbn1cbiJdfQ==