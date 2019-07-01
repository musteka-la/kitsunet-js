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
exports.ETH_REQUEST_TIMEOUT = 5000;
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
                this.handlers[inId].on('message', (headers) => {
                    if (tm)
                        clearTimeout(tm);
                    resolve(headers);
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
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_HEADERS, exports.MSG_CODES.BLOCK_HEADERS, [block, max, skip, reverse], 1000 * 2 * 60));
        });
    }
    /**
     * Get block bodies for block hashes
     *
     * @param hashes {Buffer[] | string[]} - block hashes for which to get the bodies
     */
    getBlockBodies(hashes) {
        return __asyncGenerator(this, arguments, function* getBlockBodies_1() {
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_BODIES, exports.MSG_CODES.BLOCK_BODIES, [hashes.map(h => Buffer.isBuffer(h) ? h : Buffer.from(h))], 1000 * 2 * 60));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFDN0IsUUFBQSxtQkFBbUIsR0FBVyxJQUFJLENBQUE7QUFFL0MsTUFBYSxRQUFRO0lBSW5CO1FBRkEsWUFBTyxHQUE0QixRQUFRLENBQUE7UUFDM0MsV0FBTSxHQUE0QixRQUFRLENBQUE7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQVZELDRCQVVDO0FBRUQsTUFBYSxXQUE0QyxTQUFRLDRCQUFlO0lBYTlFOzs7Ozs7O09BT0c7SUFDSCxZQUFhLElBQU8sRUFDUCxlQUF3QixFQUNqQixRQUFrQixFQUN6QixVQUFvQixJQUFJLHdCQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNuRSxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUZuQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBcEI5QixZQUFPLEdBQXFCLElBQUksUUFBUSxFQUFVLENBQUE7UUF1QnhE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LEVBQ25FLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUEsQ0FBQTtRQUNsQixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFFLE1BQTJCO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9ELENBQUM7SUFFRDs7O09BR0c7SUFDRyxTQUFTOztZQUNiLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUMxQyxpQkFBUyxDQUFDLE1BQU0sRUFDaEIsaUJBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxlQUFlO2dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7Z0JBQ2pDLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBVSxDQUFBLENBQUMsSUFBSSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUk7YUFDN0IsQ0FBQyxDQUFBO1lBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQUE7Q0FDRjtBQW5KRCxrQ0FtSkMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0ICogYXMgSGFuZGxlcnMgZnJvbSAnLi9oYW5kbGVycydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IHsgQmFzZVByb3RvY29sIH0gZnJvbSAnLi4vLi4vYmFzZS1wcm90b2NvbCdcbmltcG9ydCB7IElFdGhQcm90b2NvbCwgQmxvY2tCb2R5LCBTdGF0dXMgfSBmcm9tICcuL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBJUGVlckRlc2NyaXB0b3IsIE5vZGUsIElFbmNvZGVyIH0gZnJvbSAnLi4vLi4nXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBFdGhIYW5kbGVyIH0gZnJvbSAnLi9ldGgtaGFuZGxlcidcbmltcG9ydCB7IFJscEVuY29kZXIgfSBmcm9tICcuL3JscC1lbmNvZGVyJ1xuaW1wb3J0IHsgRVRIIH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoYGtpdHN1bmV0OmV0aC1wcm90b2ApXG5cbmV4cG9ydCBjb25zdCBNU0dfQ09ERVMgPSBFVEguTUVTU0FHRV9DT0RFU1xuZXhwb3J0IGNvbnN0IEVUSF9SRVFVRVNUX1RJTUVPVVQ6IG51bWJlciA9IDUwMDBcblxuZXhwb3J0IGNsYXNzIERlZmVycmVkPFQ+IHtcbiAgcHJvbWlzZTogUHJvbWlzZTxUPlxuICByZXNvbHZlOiAoLi4uYXJnczogYW55W10pID0+IGFueSA9IEZ1bmN0aW9uXG4gIHJlamVjdDogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgPSBGdW5jdGlvblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZVxuICAgICAgdGhpcy5yZWplY3QgPSByZWplY3RcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdGhQcm90b2NvbDxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgQmFzZVByb3RvY29sPFA+IGltcGxlbWVudHMgSUV0aFByb3RvY29sIHtcbiAgcHJvdG9jb2xWZXJzaW9uOiBudW1iZXJcbiAgaGFuZGxlcnM6IHsgW2tleTogbnVtYmVyXTogRXRoSGFuZGxlcjxQPiB9XG4gIHByaXZhdGUgX3N0YXR1czogRGVmZXJyZWQ8U3RhdHVzPiA9IG5ldyBEZWZlcnJlZDxTdGF0dXM+KClcblxuICBhc3luYyBnZXRTdGF0dXMgKCk6IFByb21pc2U8U3RhdHVzPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cy5wcm9taXNlXG4gIH1cblxuICBhc3luYyBzZXRTdGF0dXMgKHN0YXR1czogU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cy5yZXNvbHZlKHN0YXR1cylcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW4gRXRoZXJldW0gcHJvdG9jb2xcbiAgICpcbiAgICogQHBhcmFtIGJsb2NrQ2hhaW4gLSB0aGUgYmxvY2tjaGFpbiB0byB1c2UgZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gcGVlciAtIHRoZSBwZWVyIGRlc2NyaXB0b3IgZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gbmV0d29ya1Byb3ZpZGVyIC0gdGhlIG5ldHdvcmsgcHJvdmlkZXJcbiAgICogQHBhcmFtIGVuY29kZXIgLSBhbiBlbmNvZGVyIHRvIHVzZSB3aXRoIHRoZSBwZWVyXG4gICAqL1xuICBjb25zdHJ1Y3RvciAocGVlcjogUCxcbiAgICAgICAgICAgICAgIG5ldHdvcmtQcm92aWRlcjogTm9kZTxQPixcbiAgICAgICAgICAgICAgIHB1YmxpYyBldGhDaGFpbjogRXRoQ2hhaW4sXG4gICAgICAgICAgICAgICBlbmNvZGVyOiBJRW5jb2RlciA9IG5ldyBSbHBFbmNvZGVyKG5ldHdvcmtQcm92aWRlci50eXBlKSkge1xuICAgIHN1cGVyKHBlZXIsIG5ldHdvcmtQcm92aWRlciwgZW5jb2RlcilcbiAgICB0aGlzLnByb3RvY29sVmVyc2lvbiA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIHRoaXMudmVyc2lvbnMubWFwKHYgPT4gTnVtYmVyKHYpKSlcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fVxuICAgIE9iamVjdC5rZXlzKEhhbmRsZXJzKS5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICBjb25zdCBoOiBFdGhIYW5kbGVyPFA+ID0gUmVmbGVjdC5jb25zdHJ1Y3QoSGFuZGxlcnNbaGFuZGxlcl0sIFt0aGlzLCB0aGlzLnBlZXJdKVxuICAgICAgdGhpcy5oYW5kbGVyc1toLmlkXSA9IGhcbiAgICB9KVxuICB9XG5cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZXRoJ1xuICB9XG5cbiAgZ2V0IHZlcnNpb25zICgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIEVUSC5ldGg2Mi52ZXJzaW9uLnRvU3RyaW5nKCksXG4gICAgICBFVEguZXRoNjMudmVyc2lvbi50b1N0cmluZygpXG4gICAgXVxuICB9XG5cbiAgYXN5bmMgKnJlY2VpdmU8VCwgVT4gKHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KTogQXN5bmNJdGVyYWJsZTxVIHwgVVtdIHwgbnVsbD4ge1xuICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHN1cGVyLnJlY2VpdmU8VCwgYW55W10+KHJlYWRhYmxlKSkge1xuICAgICAgaWYgKCFtc2cpIHJldHVyblxuICAgICAgY29uc3QgY29kZTogRVRILk1FU1NBR0VfQ09ERVMgPSBtc2cuc2hpZnQoKSBhcyBFVEguTUVTU0FHRV9DT0RFU1xuICAgICAgaWYgKCF0aGlzLmhhbmRsZXJzW2NvZGVdKSB7XG4gICAgICAgIGRlYnVnKGB1bnN1cHBvcnRlZCBtZXRob2QgLSAke01TR19DT0RFU1tjb2RlXX1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5oYW5kbGVyc1tjb2RlXS5oYW5kbGUoLi4ubXNnKVxuICAgICAgaWYgKCFyZXMpIHlpZWxkIG51bGxcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgZW5jb2RlZCBvZiB0aGlzLmVuY29kZXIhLmVuY29kZShyZXMpKSB7XG4gICAgICAgIHlpZWxkIGVuY29kZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kPFQsIFU+IChtc2c6IFQpOiBQcm9taXNlPFUgfCBVW10gfCB2b2lkIHwgbnVsbD4ge1xuICAgIHJldHVybiBzdXBlci5zZW5kKG1zZywgdGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gb3V0SWQge0VUSC5NRVNTQUdFX0NPREVTfSAtIG91dCBtZXNzYWdlIGlkXG4gICAqIEBwYXJhbSBpbklkIHtFVEguTUVTU0FHRV9DT0RFU30gLSBpbiBtZXNzYWdlIGlkXG4gICAqIEBwYXJhbSBwYXlsb2FkIHthbnlbXX0gLSBwYXlsb2FkIGZvciB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0gdGltZW91dCB7bnVtYmVyfSAtIHJlcXVlc3QgdGltZW91dFxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIHJlcXVlc3RXaXRoVGltZW91dDxUPiAob3V0SWQ6IEVUSC5NRVNTQUdFX0NPREVTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbklkOiBFVEguTUVTU0FHRV9DT0RFUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogYW55W10gPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogbnVtYmVyID0gRVRIX1JFUVVFU1RfVElNRU9VVCk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPihhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgdG06IE5vZGVKUy5UaW1lb3V0IHwgbnVsbCA9IG51bGxcbiAgICAgIHRoaXMuaGFuZGxlcnNbaW5JZF0ub24oJ21lc3NhZ2UnLCAoaGVhZGVycykgPT4ge1xuICAgICAgICBpZiAodG0pIGNsZWFyVGltZW91dCh0bSlcbiAgICAgICAgcmVzb2x2ZShoZWFkZXJzKVxuICAgICAgfSlcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlcnNbb3V0SWRdLnNlbmQoLi4ucGF5bG9hZClcbiAgICAgIHRtID0gc2V0VGltZW91dCgoKSA9PlxuICAgICAgICByZWplY3QobmV3IEVycm9yKGByZXF1ZXN0IGZvciBtZXNzYWdlICR7TVNHX0NPREVTW291dElkXX0gdGltZWQgb3V0IGZvciBwZWVyICR7dGhpcy5wZWVyLmlkfWApKSwgdGltZW91dClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBibG9jayBoZWFkZXJzXG4gICAqXG4gICAqIEBwYXJhbSBibG9jayB7bnVtYmVyIHwgQnVmZmVyIHwgQk59IC0gdGhlIGJsb2NrIGZvciB3aGljaCB0byBnZXQgdGhlIGhlYWRlclxuICAgKiBAcGFyYW0gbWF4IHtudW1iZXJ9IC0gbWF4IG51bWJlciBvZiBoZWFkZXJzIHRvIGRvd25sb2FkIGZyb20gcGVlclxuICAgKiBAcGFyYW0gc2tpcCB7bnVtYmVyfSAtIHNraXAgYSBudW1iZXIgb2YgaGVhZGVyc1xuICAgKiBAcGFyYW0gcmV2ZXJzZSB7Ym9vbGVhbn0gLSBpbiByZXZlcnNlIG9yZGVyXG4gICAqL1xuICBhc3luYyAqZ2V0SGVhZGVycyAoYmxvY2s6IG51bWJlciB8IEJ1ZmZlciB8IEJOLFxuICAgICAgICAgICAgICAgICAgICAgbWF4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICBza2lwPzogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZT86IGJvb2xlYW4pOiBBc3luY0l0ZXJhYmxlPEJsb2NrLkhlYWRlcltdPiB7XG4gICAgeWllbGQgdGhpcy5yZXF1ZXN0V2l0aFRpbWVvdXQ8QmxvY2suSGVhZGVyW10+KFxuICAgICAgTVNHX0NPREVTLkdFVF9CTE9DS19IRUFERVJTLFxuICAgICAgTVNHX0NPREVTLkJMT0NLX0hFQURFUlMsXG4gICAgICBbYmxvY2ssIG1heCwgc2tpcCwgcmV2ZXJzZV0sXG4gICAgICAxMDAwICogMiAqIDYwKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBibG9jayBib2RpZXMgZm9yIGJsb2NrIGhhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0gaGFzaGVzIHtCdWZmZXJbXSB8IHN0cmluZ1tdfSAtIGJsb2NrIGhhc2hlcyBmb3Igd2hpY2ggdG8gZ2V0IHRoZSBib2RpZXNcbiAgICovXG4gIGFzeW5jICpnZXRCbG9ja0JvZGllcyAoaGFzaGVzOiBCdWZmZXJbXSB8IHN0cmluZ1tdKTogQXN5bmNJdGVyYWJsZTxCbG9ja0JvZHlbXT4ge1xuICAgIHlpZWxkIHRoaXMucmVxdWVzdFdpdGhUaW1lb3V0PEJsb2NrQm9keVtdPihcbiAgICAgIE1TR19DT0RFUy5HRVRfQkxPQ0tfQk9ESUVTLFxuICAgICAgTVNHX0NPREVTLkJMT0NLX0JPRElFUyxcbiAgICAgIFsoaGFzaGVzIGFzIGFueSkubWFwKGggPT4gQnVmZmVyLmlzQnVmZmVyKGgpID8gaCA6IEJ1ZmZlci5mcm9tKGgpKV0sXG4gICAgICAxMDAwICogMiAqIDYwKVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSByZW1vdGUgcGVlciBvZiBuZXcgaGFzaGVzXG4gICAqXG4gICAqIEBwYXJhbSBoYXNoZXMge0J1ZmZlcltdIHwgc3RyaW5nW119IC0gYXJyYXkgb2YgbmV3IGhhc2hlcyB0byBub3RpZnkgdGhlIHBlZXJcbiAgICovXG4gIHNlbmROZXdIYXNoZXMgKGhhc2hlczogc3RyaW5nW10gfCBCdWZmZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5ORVdfQkxPQ0tfSEFTSEVTXS5zZW5kKGhhc2hlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHByb3RvY29sIGhhbmRzaGFrZS4gSW4gdGhlIGNhc2Ugb2YgRVRIIHByb3RvY29sLFxuICAgKiBpdCBzZW5kcyB0aGUgYFN0YXR1c2AgbWVzc2FnZS5cbiAgICovXG4gIGFzeW5jIGhhbmRzaGFrZSAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5yZXF1ZXN0V2l0aFRpbWVvdXQ8U3RhdHVzPihcbiAgICAgIE1TR19DT0RFUy5TVEFUVVMsXG4gICAgICBNU0dfQ09ERVMuU1RBVFVTLCBbXG4gICAgICAgIHRoaXMucHJvdG9jb2xWZXJzaW9uLFxuICAgICAgICB0aGlzLmV0aENoYWluLmNvbW1vbi5uZXR3b3JrSWQoKSxcbiAgICAgICAgYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCbG9ja3NURCgpLFxuICAgICAgICAoYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCZXN0QmxvY2soKSBhcyBhbnkpLmhhc2goKSxcbiAgICAgICAgdGhpcy5ldGhDaGFpbi5nZW5lc2lzKCkuaGFzaFxuICAgICAgXSlcbiAgICB0aGlzLnNldFN0YXR1cyhzdGF0dXMpXG4gIH1cbn1cbiJdfQ==