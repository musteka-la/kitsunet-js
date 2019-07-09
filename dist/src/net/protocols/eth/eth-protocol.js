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
     * Helper to issue requests with timeouts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFDN0IsUUFBQSxtQkFBbUIsR0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFBO0FBRW5ELE1BQWEsUUFBUTtJQUluQjtRQUZBLFlBQU8sR0FBNEIsUUFBUSxDQUFBO1FBQzNDLFdBQU0sR0FBNEIsUUFBUSxDQUFBO1FBRXhDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFWRCw0QkFVQztBQUVELE1BQWEsV0FBNEMsU0FBUSw0QkFBZTtJQWE5RTs7Ozs7OztPQU9HO0lBQ0gsWUFBYSxJQUFPLEVBQ1AsZUFBd0IsRUFDakIsUUFBa0IsRUFDekIsVUFBb0IsSUFBSSx3QkFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7UUFDbkUsS0FBSyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFGbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXBCOUIsWUFBTyxHQUFxQixJQUFJLFFBQVEsRUFBVSxD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RUFDbkUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFBLENBQUE7UUFDZCxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFFLE1BQTJCO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9ELENBQUM7SUFFRDs7O09BR0c7SUFDRyxTQUFTOztZQUNiLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUMxQyxpQkFBUyxDQUFDLE1BQU0sRUFDaEIsaUJBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxlQUFlO2dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7Z0JBQ2pDLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBVSxDQUFBLENBQUMsSUFBSSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUk7YUFDN0IsQ0FBQyxDQUFBO1lBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQUE7Q0FDRjtBQXBKRCxrQ0FvSkMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0ICogYXMgSGFuZGxlcnMgZnJvbSAnLi9oYW5kbGVycydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IHsgQmFzZVByb3RvY29sIH0gZnJvbSAnLi4vLi4vYmFzZS1wcm90b2NvbCdcbmltcG9ydCB7IElFdGhQcm90b2NvbCwgQmxvY2tCb2R5LCBTdGF0dXMgfSBmcm9tICcuL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBJUGVlckRlc2NyaXB0b3IsIE5vZGUsIElFbmNvZGVyIH0gZnJvbSAnLi4vLi4nXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBFdGhIYW5kbGVyIH0gZnJvbSAnLi9ldGgtaGFuZGxlcidcbmltcG9ydCB7IFJscEVuY29kZXIgfSBmcm9tICcuL3JscC1lbmNvZGVyJ1xuaW1wb3J0IHsgRVRIIH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoYGtpdHN1bmV0OmV0aC1wcm90b2ApXG5cbmV4cG9ydCBjb25zdCBNU0dfQ09ERVMgPSBFVEguTUVTU0FHRV9DT0RFU1xuZXhwb3J0IGNvbnN0IEVUSF9SRVFVRVNUX1RJTUVPVVQ6IG51bWJlciA9IDUgKiAxMDAwXG5cbmV4cG9ydCBjbGFzcyBEZWZlcnJlZDxUPiB7XG4gIHByb21pc2U6IFByb21pc2U8VD5cbiAgcmVzb2x2ZTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgPSBGdW5jdGlvblxuICByZWplY3Q6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55ID0gRnVuY3Rpb25cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmVcbiAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0XG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXRoUHJvdG9jb2w8UCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEJhc2VQcm90b2NvbDxQPiBpbXBsZW1lbnRzIElFdGhQcm90b2NvbCB7XG4gIHByb3RvY29sVmVyc2lvbjogbnVtYmVyXG4gIGhhbmRsZXJzOiB7IFtrZXk6IG51bWJlcl06IEV0aEhhbmRsZXI8UD4gfVxuICBwcml2YXRlIF9zdGF0dXM6IERlZmVycmVkPFN0YXR1cz4gPSBuZXcgRGVmZXJyZWQ8U3RhdHVzPigpXG5cbiAgYXN5bmMgZ2V0U3RhdHVzICgpOiBQcm9taXNlPFN0YXR1cz4ge1xuICAgIHJldHVybiB0aGlzLl9zdGF0dXMucHJvbWlzZVxuICB9XG5cbiAgYXN5bmMgc2V0U3RhdHVzIChzdGF0dXM6IFN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9zdGF0dXMucmVzb2x2ZShzdGF0dXMpXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGFuIEV0aGVyZXVtIHByb3RvY29sXG4gICAqXG4gICAqIEBwYXJhbSBibG9ja0NoYWluIC0gdGhlIGJsb2NrY2hhaW4gdG8gdXNlIGZvciB0aGlzIHBlZXJcbiAgICogQHBhcmFtIHBlZXIgLSB0aGUgcGVlciBkZXNjcmlwdG9yIGZvciB0aGlzIHBlZXJcbiAgICogQHBhcmFtIG5ldHdvcmtQcm92aWRlciAtIHRoZSBuZXR3b3JrIHByb3ZpZGVyXG4gICAqIEBwYXJhbSBlbmNvZGVyIC0gYW4gZW5jb2RlciB0byB1c2Ugd2l0aCB0aGUgcGVlclxuICAgKi9cbiAgY29uc3RydWN0b3IgKHBlZXI6IFAsXG4gICAgICAgICAgICAgICBuZXR3b3JrUHJvdmlkZXI6IE5vZGU8UD4sXG4gICAgICAgICAgICAgICBwdWJsaWMgZXRoQ2hhaW46IEV0aENoYWluLFxuICAgICAgICAgICAgICAgZW5jb2RlcjogSUVuY29kZXIgPSBuZXcgUmxwRW5jb2RlcihuZXR3b3JrUHJvdmlkZXIudHlwZSkpIHtcbiAgICBzdXBlcihwZWVyLCBuZXR3b3JrUHJvdmlkZXIsIGVuY29kZXIpXG4gICAgdGhpcy5wcm90b2NvbFZlcnNpb24gPSBNYXRoLm1heC5hcHBseShNYXRoLCB0aGlzLnZlcnNpb25zLm1hcCh2ID0+IE51bWJlcih2KSkpXG5cbiAgICB0aGlzLmhhbmRsZXJzID0ge31cbiAgICBPYmplY3Qua2V5cyhIYW5kbGVycykuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgY29uc3QgaDogRXRoSGFuZGxlcjxQPiA9IFJlZmxlY3QuY29uc3RydWN0KEhhbmRsZXJzW2hhbmRsZXJdLCBbdGhpcywgdGhpcy5wZWVyXSlcbiAgICAgIHRoaXMuaGFuZGxlcnNbaC5pZF0gPSBoXG4gICAgfSlcbiAgfVxuXG4gIGdldCBpZCAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2V0aCdcbiAgfVxuXG4gIGdldCB2ZXJzaW9ucyAoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXG4gICAgICBFVEguZXRoNjIudmVyc2lvbi50b1N0cmluZygpLFxuICAgICAgRVRILmV0aDYzLnZlcnNpb24udG9TdHJpbmcoKVxuICAgIF1cbiAgfVxuXG4gIGFzeW5jICpyZWNlaXZlPFQsIFU+IChyZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxUPik6IEFzeW5jSXRlcmFibGU8VSB8IFVbXSB8IG51bGw+IHtcbiAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBzdXBlci5yZWNlaXZlPFQsIGFueVtdPihyZWFkYWJsZSkpIHtcbiAgICAgIGlmICghbXNnKSByZXR1cm5cbiAgICAgIGNvbnN0IGNvZGU6IEVUSC5NRVNTQUdFX0NPREVTID0gbXNnLnNoaWZ0KCkgYXMgRVRILk1FU1NBR0VfQ09ERVNcbiAgICAgIGlmICghdGhpcy5oYW5kbGVyc1tjb2RlXSkge1xuICAgICAgICBkZWJ1ZyhgdW5zdXBwb3J0ZWQgbWV0aG9kIC0gJHtNU0dfQ09ERVNbY29kZV19YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuaGFuZGxlcnNbY29kZV0uaGFuZGxlKC4uLm1zZylcbiAgICAgIGlmICghcmVzKSB5aWVsZCBudWxsXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGVuY29kZWQgb2YgdGhpcy5lbmNvZGVyIS5lbmNvZGUocmVzKSkge1xuICAgICAgICB5aWVsZCBlbmNvZGVkXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2VuZDxULCBVPiAobXNnOiBUKTogUHJvbWlzZTxVIHwgVVtdIHwgdm9pZCB8IG51bGw+IHtcbiAgICByZXR1cm4gc3VwZXIuc2VuZChtc2csIHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGlzc3VlIHJlcXVlc3RzIHdpdGggdGltZW91dHNcbiAgICpcbiAgICogQHBhcmFtIG91dElkIHtFVEguTUVTU0FHRV9DT0RFU30gLSBvdXQgbWVzc2FnZSBpZFxuICAgKiBAcGFyYW0gaW5JZCB7RVRILk1FU1NBR0VfQ09ERVN9IC0gaW4gbWVzc2FnZSBpZFxuICAgKiBAcGFyYW0gcGF5bG9hZCB7YW55W119IC0gcGF5bG9hZCBmb3IgdGhlIHJlcXVlc3RcbiAgICogQHBhcmFtIHRpbWVvdXQge251bWJlcn0gLSByZXF1ZXN0IHRpbWVvdXRcbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyByZXF1ZXN0V2l0aFRpbWVvdXQ8VD4gKG91dElkOiBFVEguTUVTU0FHRV9DT0RFUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5JZDogRVRILk1FU1NBR0VfQ09ERVMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGFueVtdID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IG51bWJlciA9IEVUSF9SRVFVRVNUX1RJTUVPVVQpOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4oYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHRtOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsXG4gICAgICB0aGlzLmhhbmRsZXJzW2luSWRdLm9uY2UoJ21lc3NhZ2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAodG0pIGNsZWFyVGltZW91dCh0bSlcbiAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgfSlcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlcnNbb3V0SWRdLnNlbmQoLi4ucGF5bG9hZClcbiAgICAgIHRtID0gc2V0VGltZW91dCgoKSA9PlxuICAgICAgICByZWplY3QobmV3IEVycm9yKGByZXF1ZXN0IGZvciBtZXNzYWdlICR7TVNHX0NPREVTW291dElkXX0gdGltZWQgb3V0IGZvciBwZWVyICR7dGhpcy5wZWVyLmlkfWApKSwgdGltZW91dClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBibG9jayBoZWFkZXJzXG4gICAqXG4gICAqIEBwYXJhbSBibG9jayB7bnVtYmVyIHwgQnVmZmVyIHwgQk59IC0gdGhlIGJsb2NrIGZvciB3aGljaCB0byBnZXQgdGhlIGhlYWRlclxuICAgKiBAcGFyYW0gbWF4IHtudW1iZXJ9IC0gbWF4IG51bWJlciBvZiBoZWFkZXJzIHRvIGRvd25sb2FkIGZyb20gcGVlclxuICAgKiBAcGFyYW0gc2tpcCB7bnVtYmVyfSAtIHNraXAgYSBudW1iZXIgb2YgaGVhZGVyc1xuICAgKiBAcGFyYW0gcmV2ZXJzZSB7Ym9vbGVhbn0gLSBpbiByZXZlcnNlIG9yZGVyXG4gICAqL1xuICBhc3luYyAqZ2V0SGVhZGVycyAoYmxvY2s6IG51bWJlciB8IEJ1ZmZlciB8IEJOLFxuICAgICAgICAgICAgICAgICAgICAgbWF4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICBza2lwPzogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZT86IGJvb2xlYW4pOiBBc3luY0l0ZXJhYmxlPEJsb2NrLkhlYWRlcltdPiB7XG4gICAgeWllbGQgdGhpcy5yZXF1ZXN0V2l0aFRpbWVvdXQ8QmxvY2suSGVhZGVyW10+KFxuICAgICAgTVNHX0NPREVTLkdFVF9CTE9DS19IRUFERVJTLFxuICAgICAgTVNHX0NPREVTLkJMT0NLX0hFQURFUlMsXG4gICAgICBbYmxvY2ssIG1heCwgc2tpcCwgcmV2ZXJzZV0sXG4gICAgICA2MCAqIDEwMDApXG4gIH1cblxuICAvKipcbiAgICogR2V0IGJsb2NrIGJvZGllcyBmb3IgYmxvY2sgaGFzaGVzXG4gICAqXG4gICAqIEBwYXJhbSBoYXNoZXMge0J1ZmZlcltdIHwgc3RyaW5nW119IC0gYmxvY2sgaGFzaGVzIGZvciB3aGljaCB0byBnZXQgdGhlIGJvZGllc1xuICAgKi9cbiAgYXN5bmMgKmdldEJsb2NrQm9kaWVzIChoYXNoZXM6IEJ1ZmZlcltdIHwgc3RyaW5nW10pOiBBc3luY0l0ZXJhYmxlPEJsb2NrQm9keVtdPiB7XG4gICAgeWllbGQgdGhpcy5yZXF1ZXN0V2l0aFRpbWVvdXQ8QmxvY2tCb2R5W10+KFxuICAgICAgTVNHX0NPREVTLkdFVF9CTE9DS19CT0RJRVMsXG4gICAgICBNU0dfQ09ERVMuQkxPQ0tfQk9ESUVTLFxuICAgICAgWyhoYXNoZXMgYXMgYW55KS5tYXAoaCA9PiBCdWZmZXIuaXNCdWZmZXIoaCkgPyBoIDogQnVmZmVyLmZyb20oaCkpXSxcbiAgICAgIDYwICogMTAwMClcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZnkgcmVtb3RlIHBlZXIgb2YgbmV3IGhhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0gaGFzaGVzIHtCdWZmZXJbXSB8IHN0cmluZ1tdfSAtIGFycmF5IG9mIG5ldyBoYXNoZXMgdG8gbm90aWZ5IHRoZSBwZWVyXG4gICAqL1xuICBzZW5kTmV3SGFzaGVzIChoYXNoZXM6IHN0cmluZ1tdIHwgQnVmZmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyc1tNU0dfQ09ERVMuTkVXX0JMT0NLX0hBU0hFU10uc2VuZChoYXNoZXMpXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSBwcm90b2NvbCBoYW5kc2hha2UuIEluIHRoZSBjYXNlIG9mIEVUSCBwcm90b2NvbCxcbiAgICogaXQgc2VuZHMgdGhlIGBTdGF0dXNgIG1lc3NhZ2UuXG4gICAqL1xuICBhc3luYyBoYW5kc2hha2UgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucmVxdWVzdFdpdGhUaW1lb3V0PFN0YXR1cz4oXG4gICAgICBNU0dfQ09ERVMuU1RBVFVTLFxuICAgICAgTVNHX0NPREVTLlNUQVRVUywgW1xuICAgICAgICB0aGlzLnByb3RvY29sVmVyc2lvbixcbiAgICAgICAgdGhpcy5ldGhDaGFpbi5jb21tb24ubmV0d29ya0lkKCksXG4gICAgICAgIGF3YWl0IHRoaXMuZXRoQ2hhaW4uZ2V0QmxvY2tzVEQoKSxcbiAgICAgICAgKGF3YWl0IHRoaXMuZXRoQ2hhaW4uZ2V0QmVzdEJsb2NrKCkgYXMgYW55KS5oYXNoKCksXG4gICAgICAgIHRoaXMuZXRoQ2hhaW4uZ2VuZXNpcygpLmhhc2hcbiAgICAgIF0pXG4gICAgdGhpcy5zZXRTdGF0dXMoc3RhdHVzKVxuICB9XG59XG4iXX0=