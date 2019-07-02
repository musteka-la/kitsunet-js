'use strict';
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Handlers = __importStar(require("./handlers"));
const base_protocol_1 = require("../../base-protocol");
const rlp_encoder_1 = require("./rlp-encoder");
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default(`kitsunet:eth-proto`);
exports.MSG_CODES = ethereumjs_devp2p_1.ETH.MESSAGE_CODES;
exports.ETH_REQUEST_TIMEOUT = 5 * 1000;
class Deferred {
    constructor() {
        this.resolve = Function;
        this.reject = Function;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Deferred = Deferred;
class EthProtocol extends base_protocol_1.BaseProtocol {
    /**
     * Construct an Ethereum protocol
     *
     * @param blockChain - the blockchain to use for this peer
     * @param peer - the peer descriptor for this peer
     * @param networkProvider - the network provider
     * @param encoder - an encoder to use with the peer
     */
    constructor(peer, networkProvider, ethChain, encoder = new rlp_encoder_1.RlpEncoder(networkProvider.type)) {
        super(peer, networkProvider, encoder);
        this.ethChain = ethChain;
        this._status = new Deferred();
        this.protocolVersion = Math.max.apply(Math, this.versions.map(v => Number(v)));
        this.handlers = {};
        Object.keys(Handlers).forEach((handler) => {
            const h = Reflect.construct(Handlers[handler], [this, this.peer]);
            this.handlers[h.id] = h;
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._status.promise;
        });
    }
    setStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._status.resolve(status);
        });
    }
    get id() {
        return 'eth';
    }
    get versions() {
        return [
            ethereumjs_devp2p_1.ETH.eth62.version.toString(),
            ethereumjs_devp2p_1.ETH.eth63.version.toString()
        ];
    }
    receive(readable) {
        const _super = Object.create(null, {
            receive: { get: () => super.receive }
        });
        return __asyncGenerator(this, arguments, function* receive_1() {
            var e_1, _a, e_2, _b;
            try {
                for (var _c = __asyncValues(_super.receive.call(this, readable)), _d; _d = yield __await(_c.next()), !_d.done;) {
                    const msg = _d.value;
                    if (!msg)
                        return yield __await(void 0);
                    const code = msg.shift();
                    if (!this.handlers[code]) {
                        debug(`unsupported method - ${exports.MSG_CODES[code]}`);
                        return yield __await(void 0);
                    }
                    const res = yield __await(this.handlers[code].handle(...msg));
                    if (!res)
                        yield yield __await(null);
                    try {
                        for (var _e = __asyncValues(this.encoder.encode(res)), _f; _f = yield __await(_e.next()), !_f.done;) {
                            const encoded = _f.value;
                            yield yield __await(encoded);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) yield __await(_b.call(_e));
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield __await(_a.call(_c));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    send(msg) {
        const _super = Object.create(null, {
            send: { get: () => super.send }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.send.call(this, msg, this);
        });
    }
    /**
     *
     * @param outId {ETH.MESSAGE_CODES} - out message id
     * @param inId {ETH.MESSAGE_CODES} - in message id
     * @param payload {any[]} - payload for the request
     * @param timeout {number} - request timeout
     */
    requestWithTimeout(outId, inId, payload = [], timeout = exports.ETH_REQUEST_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let tm = null;
                this.handlers[inId].once('message', (data) => {
                    if (tm)
                        clearTimeout(tm);
                    resolve(data);
                });
                yield this.handlers[outId].send(...payload);
                tm = setTimeout(() => reject(new Error(`request for message ${exports.MSG_CODES[outId]} timed out for peer ${this.peer.id}`)), timeout);
            }));
        });
    }
    /**
     * Get block headers
     *
     * @param block {number | Buffer | BN} - the block for which to get the header
     * @param max {number} - max number of headers to download from peer
     * @param skip {number} - skip a number of headers
     * @param reverse {boolean} - in reverse order
     */
    getHeaders(block, max, skip, reverse) {
        return __asyncGenerator(this, arguments, function* getHeaders_1() {
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_HEADERS, exports.MSG_CODES.BLOCK_HEADERS, [block, max, skip, reverse], 60 * 1000));
        });
    }
    /**
     * Get block bodies for block hashes
     *
     * @param hashes {Buffer[] | string[]} - block hashes for which to get the bodies
     */
    getBlockBodies(hashes) {
        return __asyncGenerator(this, arguments, function* getBlockBodies_1() {
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_BODIES, exports.MSG_CODES.BLOCK_BODIES, [hashes.map(h => Buffer.isBuffer(h) ? h : Buffer.from(h))], 60 * 1000));
        });
    }
    /**
     * Notify remote peer of new hashes
     *
     * @param hashes {Buffer[] | string[]} - array of new hashes to notify the peer
     */
    sendNewHashes(hashes) {
        return this.handlers[exports.MSG_CODES.NEW_BLOCK_HASHES].send(hashes);
    }
    /**
     * Perform protocol handshake. In the case of ETH protocol,
     * it sends the `Status` message.
     */
    handshake() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.requestWithTimeout(exports.MSG_CODES.STATUS, exports.MSG_CODES.STATUS, [
                this.protocolVersion,
                this.ethChain.common.networkId(),
                yield this.ethChain.getBlocksTD(),
                (yield this.ethChain.getBestBlock()).hash(),
                this.ethChain.genesis().hash
            ]);
            this.setStatus(status);
        });
    }
}
exports.EthProtocol = EthProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFDN0IsUUFBQSxtQkFBbUIsR0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFBO0FBRW5ELE1BQWEsUUFBUTtJQUluQjtRQUZBLFlBQU8sR0FBNEIsUUFBUSxDQUFBO1FBQzNDLFdBQU0sR0FBNEIsUUFBUSxDQUFBO1FBRXhDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFWRCw0QkFVQztBQUVELE1BQWEsV0FBNEMsU0FBUSw0QkFBZTtJQWE5RTs7Ozs7OztPQU9HO0lBQ0gsWUFBYSxJQUFPLEVBQ1AsZUFBd0IsRUFDakIsUUFBa0IsRUFDekIsVUFBb0IsSUFBSSx3QkFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7UUFDbkUsS0FBSyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFGbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXBCOUIsWUFBTyxHQUFxQixJQUFJLFFBQVEsRUFBVSxD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QUNuRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUEsQ0FBQTtRQUNkLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUUsTUFBMkI7UUFDeEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDL0QsQ0FBQztJQUVEOzs7T0FHRztJQUNHLFNBQVM7O1lBQ2IsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQzFDLGlCQUFTLENBQUMsTUFBTSxFQUNoQixpQkFBUyxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGVBQWU7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDaEMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDakMsQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFVLENBQUEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSTthQUM3QixDQUFDLENBQUE7WUFDSixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hCLENBQUM7S0FBQTtDQUNGO0FBbkpELGtDQW1KQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgKiBhcyBIYW5kbGVycyBmcm9tICcuL2hhbmRsZXJzJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgeyBCYXNlUHJvdG9jb2wgfSBmcm9tICcuLi8uLi9iYXNlLXByb3RvY29sJ1xuaW1wb3J0IHsgSUV0aFByb3RvY29sLCBCbG9ja0JvZHksIFN0YXR1cyB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IElQZWVyRGVzY3JpcHRvciwgTm9kZSwgSUVuY29kZXIgfSBmcm9tICcuLi8uLidcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IEV0aEhhbmRsZXIgfSBmcm9tICcuL2V0aC1oYW5kbGVyJ1xuaW1wb3J0IHsgUmxwRW5jb2RlciB9IGZyb20gJy4vcmxwLWVuY29kZXInXG5pbXBvcnQgeyBFVEggfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBCTiBmcm9tICdibi5qcydcblxuY29uc3QgZGVidWcgPSBEZWJ1Zyhga2l0c3VuZXQ6ZXRoLXByb3RvYClcblxuZXhwb3J0IGNvbnN0IE1TR19DT0RFUyA9IEVUSC5NRVNTQUdFX0NPREVTXG5leHBvcnQgY29uc3QgRVRIX1JFUVVFU1RfVElNRU9VVDogbnVtYmVyID0gNSAqIDEwMDBcblxuZXhwb3J0IGNsYXNzIERlZmVycmVkPFQ+IHtcbiAgcHJvbWlzZTogUHJvbWlzZTxUPlxuICByZXNvbHZlOiAoLi4uYXJnczogYW55W10pID0+IGFueSA9IEZ1bmN0aW9uXG4gIHJlamVjdDogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgPSBGdW5jdGlvblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZVxuICAgICAgdGhpcy5yZWplY3QgPSByZWplY3RcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdGhQcm90b2NvbDxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgQmFzZVByb3RvY29sPFA+IGltcGxlbWVudHMgSUV0aFByb3RvY29sIHtcbiAgcHJvdG9jb2xWZXJzaW9uOiBudW1iZXJcbiAgaGFuZGxlcnM6IHsgW2tleTogbnVtYmVyXTogRXRoSGFuZGxlcjxQPiB9XG4gIHByaXZhdGUgX3N0YXR1czogRGVmZXJyZWQ8U3RhdHVzPiA9IG5ldyBEZWZlcnJlZDxTdGF0dXM+KClcblxuICBhc3luYyBnZXRTdGF0dXMgKCk6IFByb21pc2U8U3RhdHVzPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cy5wcm9taXNlXG4gIH1cblxuICBhc3luYyBzZXRTdGF0dXMgKHN0YXR1czogU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cy5yZXNvbHZlKHN0YXR1cylcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW4gRXRoZXJldW0gcHJvdG9jb2xcbiAgICpcbiAgICogQHBhcmFtIGJsb2NrQ2hhaW4gLSB0aGUgYmxvY2tjaGFpbiB0byB1c2UgZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gcGVlciAtIHRoZSBwZWVyIGRlc2NyaXB0b3IgZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gbmV0d29ya1Byb3ZpZGVyIC0gdGhlIG5ldHdvcmsgcHJvdmlkZXJcbiAgICogQHBhcmFtIGVuY29kZXIgLSBhbiBlbmNvZGVyIHRvIHVzZSB3aXRoIHRoZSBwZWVyXG4gICAqL1xuICBjb25zdHJ1Y3RvciAocGVlcjogUCxcbiAgICAgICAgICAgICAgIG5ldHdvcmtQcm92aWRlcjogTm9kZTxQPixcbiAgICAgICAgICAgICAgIHB1YmxpYyBldGhDaGFpbjogRXRoQ2hhaW4sXG4gICAgICAgICAgICAgICBlbmNvZGVyOiBJRW5jb2RlciA9IG5ldyBSbHBFbmNvZGVyKG5ldHdvcmtQcm92aWRlci50eXBlKSkge1xuICAgIHN1cGVyKHBlZXIsIG5ldHdvcmtQcm92aWRlciwgZW5jb2RlcilcbiAgICB0aGlzLnByb3RvY29sVmVyc2lvbiA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIHRoaXMudmVyc2lvbnMubWFwKHYgPT4gTnVtYmVyKHYpKSlcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fVxuICAgIE9iamVjdC5rZXlzKEhhbmRsZXJzKS5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICBjb25zdCBoOiBFdGhIYW5kbGVyPFA+ID0gUmVmbGVjdC5jb25zdHJ1Y3QoSGFuZGxlcnNbaGFuZGxlcl0sIFt0aGlzLCB0aGlzLnBlZXJdKVxuICAgICAgdGhpcy5oYW5kbGVyc1toLmlkXSA9IGhcbiAgICB9KVxuICB9XG5cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZXRoJ1xuICB9XG5cbiAgZ2V0IHZlcnNpb25zICgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIEVUSC5ldGg2Mi52ZXJzaW9uLnRvU3RyaW5nKCksXG4gICAgICBFVEguZXRoNjMudmVyc2lvbi50b1N0cmluZygpXG4gICAgXVxuICB9XG5cbiAgYXN5bmMgKnJlY2VpdmU8VCwgVT4gKHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KTogQXN5bmNJdGVyYWJsZTxVIHwgVVtdIHwgbnVsbD4ge1xuICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHN1cGVyLnJlY2VpdmU8VCwgYW55W10+KHJlYWRhYmxlKSkge1xuICAgICAgaWYgKCFtc2cpIHJldHVyblxuICAgICAgY29uc3QgY29kZTogRVRILk1FU1NBR0VfQ09ERVMgPSBtc2cuc2hpZnQoKSBhcyBFVEguTUVTU0FHRV9DT0RFU1xuICAgICAgaWYgKCF0aGlzLmhhbmRsZXJzW2NvZGVdKSB7XG4gICAgICAgIGRlYnVnKGB1bnN1cHBvcnRlZCBtZXRob2QgLSAke01TR19DT0RFU1tjb2RlXX1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5oYW5kbGVyc1tjb2RlXS5oYW5kbGUoLi4ubXNnKVxuICAgICAgaWYgKCFyZXMpIHlpZWxkIG51bGxcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgZW5jb2RlZCBvZiB0aGlzLmVuY29kZXIhLmVuY29kZShyZXMpKSB7XG4gICAgICAgIHlpZWxkIGVuY29kZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kPFQsIFU+IChtc2c6IFQpOiBQcm9taXNlPFUgfCBVW10gfCB2b2lkIHwgbnVsbD4ge1xuICAgIHJldHVybiBzdXBlci5zZW5kKG1zZywgdGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gb3V0SWQge0VUSC5NRVNTQUdFX0NPREVTfSAtIG91dCBtZXNzYWdlIGlkXG4gICAqIEBwYXJhbSBpbklkIHtFVEguTUVTU0FHRV9DT0RFU30gLSBpbiBtZXNzYWdlIGlkXG4gICAqIEBwYXJhbSBwYXlsb2FkIHthbnlbXX0gLSBwYXlsb2FkIGZvciB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0gdGltZW91dCB7bnVtYmVyfSAtIHJlcXVlc3QgdGltZW91dFxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIHJlcXVlc3RXaXRoVGltZW91dDxUPiAob3V0SWQ6IEVUSC5NRVNTQUdFX0NPREVTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbklkOiBFVEguTUVTU0FHRV9DT0RFUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogYW55W10gPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogbnVtYmVyID0gRVRIX1JFUVVFU1RfVElNRU9VVCk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPihhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgdG06IE5vZGVKUy5UaW1lb3V0IHwgbnVsbCA9IG51bGxcbiAgICAgIHRoaXMuaGFuZGxlcnNbaW5JZF0ub25jZSgnbWVzc2FnZScsIChkYXRhKSA9PiB7XG4gICAgICAgIGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKVxuICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICB9KVxuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVyc1tvdXRJZF0uc2VuZCguLi5wYXlsb2FkKVxuICAgICAgdG0gPSBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYHJlcXVlc3QgZm9yIG1lc3NhZ2UgJHtNU0dfQ09ERVNbb3V0SWRdfSB0aW1lZCBvdXQgZm9yIHBlZXIgJHt0aGlzLnBlZXIuaWR9YCkpLCB0aW1lb3V0KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGJsb2NrIGhlYWRlcnNcbiAgICpcbiAgICogQHBhcmFtIGJsb2NrIHtudW1iZXIgfCBCdWZmZXIgfCBCTn0gLSB0aGUgYmxvY2sgZm9yIHdoaWNoIHRvIGdldCB0aGUgaGVhZGVyXG4gICAqIEBwYXJhbSBtYXgge251bWJlcn0gLSBtYXggbnVtYmVyIG9mIGhlYWRlcnMgdG8gZG93bmxvYWQgZnJvbSBwZWVyXG4gICAqIEBwYXJhbSBza2lwIHtudW1iZXJ9IC0gc2tpcCBhIG51bWJlciBvZiBoZWFkZXJzXG4gICAqIEBwYXJhbSByZXZlcnNlIHtib29sZWFufSAtIGluIHJldmVyc2Ugb3JkZXJcbiAgICovXG4gIGFzeW5jICpnZXRIZWFkZXJzIChibG9jazogbnVtYmVyIHwgQnVmZmVyIHwgQk4sXG4gICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgIHNraXA/OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICByZXZlcnNlPzogYm9vbGVhbik6IEFzeW5jSXRlcmFibGU8QmxvY2suSGVhZGVyW10+IHtcbiAgICB5aWVsZCB0aGlzLnJlcXVlc3RXaXRoVGltZW91dDxCbG9jay5IZWFkZXJbXT4oXG4gICAgICBNU0dfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlMsXG4gICAgICBNU0dfQ09ERVMuQkxPQ0tfSEVBREVSUyxcbiAgICAgIFtibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSxcbiAgICAgIDYwICogMTAwMClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYmxvY2sgYm9kaWVzIGZvciBibG9jayBoYXNoZXNcbiAgICpcbiAgICogQHBhcmFtIGhhc2hlcyB7QnVmZmVyW10gfCBzdHJpbmdbXX0gLSBibG9jayBoYXNoZXMgZm9yIHdoaWNoIHRvIGdldCB0aGUgYm9kaWVzXG4gICAqL1xuICBhc3luYyAqZ2V0QmxvY2tCb2RpZXMgKGhhc2hlczogQnVmZmVyW10gfCBzdHJpbmdbXSk6IEFzeW5jSXRlcmFibGU8QmxvY2tCb2R5W10+IHtcbiAgICB5aWVsZCB0aGlzLnJlcXVlc3RXaXRoVGltZW91dDxCbG9ja0JvZHlbXT4oXG4gICAgICBNU0dfQ09ERVMuR0VUX0JMT0NLX0JPRElFUyxcbiAgICAgIE1TR19DT0RFUy5CTE9DS19CT0RJRVMsXG4gICAgICBbKGhhc2hlcyBhcyBhbnkpLm1hcChoID0+IEJ1ZmZlci5pc0J1ZmZlcihoKSA/IGggOiBCdWZmZXIuZnJvbShoKSldLFxuICAgICAgNjAgKiAxMDAwKVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSByZW1vdGUgcGVlciBvZiBuZXcgaGFzaGVzXG4gICAqXG4gICAqIEBwYXJhbSBoYXNoZXMge0J1ZmZlcltdIHwgc3RyaW5nW119IC0gYXJyYXkgb2YgbmV3IGhhc2hlcyB0byBub3RpZnkgdGhlIHBlZXJcbiAgICovXG4gIHNlbmROZXdIYXNoZXMgKGhhc2hlczogc3RyaW5nW10gfCBCdWZmZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5ORVdfQkxPQ0tfSEFTSEVTXS5zZW5kKGhhc2hlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHByb3RvY29sIGhhbmRzaGFrZS4gSW4gdGhlIGNhc2Ugb2YgRVRIIHByb3RvY29sLFxuICAgKiBpdCBzZW5kcyB0aGUgYFN0YXR1c2AgbWVzc2FnZS5cbiAgICovXG4gIGFzeW5jIGhhbmRzaGFrZSAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5yZXF1ZXN0V2l0aFRpbWVvdXQ8U3RhdHVzPihcbiAgICAgIE1TR19DT0RFUy5TVEFUVVMsXG4gICAgICBNU0dfQ09ERVMuU1RBVFVTLCBbXG4gICAgICAgIHRoaXMucHJvdG9jb2xWZXJzaW9uLFxuICAgICAgICB0aGlzLmV0aENoYWluLmNvbW1vbi5uZXR3b3JrSWQoKSxcbiAgICAgICAgYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCbG9ja3NURCgpLFxuICAgICAgICAoYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCZXN0QmxvY2soKSBhcyBhbnkpLmhhc2goKSxcbiAgICAgICAgdGhpcy5ldGhDaGFpbi5nZW5lc2lzKCkuaGFzaFxuICAgICAgXSlcbiAgICB0aGlzLnNldFN0YXR1cyhzdGF0dXMpXG4gIH1cbn1cbiJdfQ==