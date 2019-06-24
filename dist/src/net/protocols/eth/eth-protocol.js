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
    getHeaders(block, max, skip, reverse) {
        return __asyncGenerator(this, arguments, function* getHeaders_1() {
            yield yield __await(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.handlers[exports.MSG_CODES.BLOCK_HEADERS].on('message', (headers) => {
                    resolve(headers);
                });
                yield this.handlers[exports.MSG_CODES.GET_BLOCK_HEADERS].send(block, max, skip, reverse);
            })));
        });
    }
    getBlockBodies(hashes) {
        return __asyncGenerator(this, arguments, function* getBlockBodies_1() {
            yield yield __await(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.handlers[exports.MSG_CODES.BLOCK_BODIES].on('message', (bodies) => {
                    resolve(bodies);
                });
                const bufHashes = hashes.map(h => Buffer.isBuffer(h) ? h : Buffer.from(h));
                yield this.handlers[exports.MSG_CODES.GET_BLOCK_BODIES].send(bufHashes);
            })));
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendNewHashes(hashes) {
        throw new Error('Method not implemented.');
    }
    handshake() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handlers[exports.MSG_CODES.STATUS].send(this.protocolVersion, this.ethChain.common.networkId(), yield this.ethChain.getBlocksTD(), (yield this.ethChain.getBestBlock()).hash(), this.ethChain.genesis().hash);
            // wait for status to get resolved
            yield this.getStatus();
        });
    }
}
exports.EthProtocol = EthProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFFMUMsTUFBYSxRQUFRO0lBSW5CO1FBRkEsWUFBTyxHQUE0QixRQUFRLENBQUE7UUFDM0MsV0FBTSxHQUE0QixRQUFRLENBQUE7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQVZELDRCQVVDO0FBRUQsTUFBYSxXQUE0QyxTQUFRLDRCQUFlO0lBYTlFOzs7Ozs7O09BT0c7SUFDSCxZQUFhLElBQU8sRUFDUCxlQUF3QixFQUNqQixRQUFrQixFQUN6QixVQUFvQixJQUFJLHdCQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNuRSxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUZuQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBcEI5QixZQUFPLEdBQXFCLElBQUksUUFBUSxFQUFVLENBQUE7UUF1QnhELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdB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TUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBVSxDQUFBLENBQUMsSUFBSSxFQUFFLEVBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUM3QixDQUFBO1lBRUQsa0NBQWtDO1lBQ2xDLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3hCLENBQUM7S0FBQTtDQUNGO0FBMUdELGtDQTBHQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgKiBhcyBIYW5kbGVycyBmcm9tICcuL2hhbmRsZXJzJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgeyBCYXNlUHJvdG9jb2wgfSBmcm9tICcuLi8uLi9iYXNlLXByb3RvY29sJ1xuaW1wb3J0IHsgSUV0aFByb3RvY29sLCBCbG9ja0JvZHksIFN0YXR1cyB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IElQZWVyRGVzY3JpcHRvciwgTm9kZSwgSUVuY29kZXIgfSBmcm9tICcuLi8uLidcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IEV0aEhhbmRsZXIgfSBmcm9tICcuL2V0aC1oYW5kbGVyJ1xuaW1wb3J0IHsgUmxwRW5jb2RlciB9IGZyb20gJy4vcmxwLWVuY29kZXInXG5pbXBvcnQgeyBFVEggfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBCTiBmcm9tICdibi5qcydcblxuY29uc3QgZGVidWcgPSBEZWJ1Zyhga2l0c3VuZXQ6ZXRoLXByb3RvYClcblxuZXhwb3J0IGNvbnN0IE1TR19DT0RFUyA9IEVUSC5NRVNTQUdFX0NPREVTXG5cbmV4cG9ydCBjbGFzcyBEZWZlcnJlZDxUPiB7XG4gIHByb21pc2U6IFByb21pc2U8VD5cbiAgcmVzb2x2ZTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgPSBGdW5jdGlvblxuICByZWplY3Q6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55ID0gRnVuY3Rpb25cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmVcbiAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0XG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXRoUHJvdG9jb2w8UCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEJhc2VQcm90b2NvbDxQPiBpbXBsZW1lbnRzIElFdGhQcm90b2NvbCB7XG4gIHByb3RvY29sVmVyc2lvbjogbnVtYmVyXG4gIGhhbmRsZXJzOiB7IFtrZXk6IG51bWJlcl06IEV0aEhhbmRsZXI8UD4gfVxuICBwcml2YXRlIF9zdGF0dXM6IERlZmVycmVkPFN0YXR1cz4gPSBuZXcgRGVmZXJyZWQ8U3RhdHVzPigpXG5cbiAgYXN5bmMgZ2V0U3RhdHVzICgpOiBQcm9taXNlPFN0YXR1cz4ge1xuICAgIHJldHVybiB0aGlzLl9zdGF0dXMucHJvbWlzZVxuICB9XG5cbiAgYXN5bmMgc2V0U3RhdHVzIChzdGF0dXM6IFN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9zdGF0dXMucmVzb2x2ZShzdGF0dXMpXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGFuIEV0aGVyZXVtIHByb3RvY29sXG4gICAqXG4gICAqIEBwYXJhbSBibG9ja0NoYWluIC0gdGhlIGJsb2NrY2hhaW4gdG8gdXNlIGZvciB0aGlzIHBlZXJcbiAgICogQHBhcmFtIHBlZXIgLSB0aGUgcGVlciBkZXNjcmlwdG9yIGZvciB0aGlzIHBlZXJcbiAgICogQHBhcmFtIG5ldHdvcmtQcm92aWRlciAtIHRoZSBuZXR3b3JrIHByb3ZpZGVyXG4gICAqIEBwYXJhbSBlbmNvZGVyIC0gYW4gZW5jb2RlciB0byB1c2Ugd2l0aCB0aGUgcGVlclxuICAgKi9cbiAgY29uc3RydWN0b3IgKHBlZXI6IFAsXG4gICAgICAgICAgICAgICBuZXR3b3JrUHJvdmlkZXI6IE5vZGU8UD4sXG4gICAgICAgICAgICAgICBwdWJsaWMgZXRoQ2hhaW46IEV0aENoYWluLFxuICAgICAgICAgICAgICAgZW5jb2RlcjogSUVuY29kZXIgPSBuZXcgUmxwRW5jb2RlcihuZXR3b3JrUHJvdmlkZXIudHlwZSkpIHtcbiAgICBzdXBlcihwZWVyLCBuZXR3b3JrUHJvdmlkZXIsIGVuY29kZXIpXG4gICAgdGhpcy5wcm90b2NvbFZlcnNpb24gPSBNYXRoLm1heC5hcHBseShNYXRoLCB0aGlzLnZlcnNpb25zLm1hcCh2ID0+IE51bWJlcih2KSkpXG5cbiAgICB0aGlzLmhhbmRsZXJzID0ge31cbiAgICBPYmplY3Qua2V5cyhIYW5kbGVycykuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgY29uc3QgaDogRXRoSGFuZGxlcjxQPiA9IFJlZmxlY3QuY29uc3RydWN0KEhhbmRsZXJzW2hhbmRsZXJdLCBbdGhpcywgdGhpcy5wZWVyXSlcbiAgICAgIHRoaXMuaGFuZGxlcnNbaC5pZF0gPSBoXG4gICAgfSlcbiAgfVxuXG4gIGdldCBpZCAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2V0aCdcbiAgfVxuXG4gIGdldCB2ZXJzaW9ucyAoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXG4gICAgICBFVEguZXRoNjIudmVyc2lvbi50b1N0cmluZygpLFxuICAgICAgRVRILmV0aDYzLnZlcnNpb24udG9TdHJpbmcoKVxuICAgIF1cbiAgfVxuXG4gIGFzeW5jICpyZWNlaXZlPFQsIFU+IChyZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxUPik6IEFzeW5jSXRlcmFibGU8VSB8IFVbXSB8IG51bGw+IHtcbiAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBzdXBlci5yZWNlaXZlPFQsIGFueVtdPihyZWFkYWJsZSkpIHtcbiAgICAgIGlmICghbXNnKSByZXR1cm5cbiAgICAgIGNvbnN0IGNvZGU6IEVUSC5NRVNTQUdFX0NPREVTID0gbXNnLnNoaWZ0KCkgYXMgRVRILk1FU1NBR0VfQ09ERVNcbiAgICAgIGlmICghdGhpcy5oYW5kbGVyc1tjb2RlXSkge1xuICAgICAgICBkZWJ1ZyhgdW5zdXBwb3J0ZWQgbWV0aG9kIC0gJHtNU0dfQ09ERVNbY29kZV19YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuaGFuZGxlcnNbY29kZV0uaGFuZGxlKC4uLm1zZylcbiAgICAgIGlmICghcmVzKSB5aWVsZCBudWxsXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGVuY29kZWQgb2YgdGhpcy5lbmNvZGVyIS5lbmNvZGUocmVzKSkge1xuICAgICAgICB5aWVsZCBlbmNvZGVkXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2VuZDxULCBVPiAobXNnOiBUKTogUHJvbWlzZTxVIHwgVVtdIHwgdm9pZCB8IG51bGw+IHtcbiAgICByZXR1cm4gc3VwZXIuc2VuZChtc2csIHRoaXMpXG4gIH1cblxuICBhc3luYyAqZ2V0SGVhZGVycyAoYmxvY2s6IG51bWJlciB8IEJ1ZmZlciB8IEJOLFxuICAgICAgICAgICAgICAgICAgICAgbWF4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICBza2lwPzogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZT86IGJvb2xlYW4pOiBBc3luY0l0ZXJhYmxlPEJsb2NrLkhlYWRlcltdPiB7XG4gICAgeWllbGQgbmV3IFByb21pc2U8QmxvY2suSGVhZGVyW10+KGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5CTE9DS19IRUFERVJTXS5vbignbWVzc2FnZScsIChoZWFkZXJzKSA9PiB7XG4gICAgICAgIHJlc29sdmUoaGVhZGVycylcbiAgICAgIH0pXG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5HRVRfQkxPQ0tfSEVBREVSU10uc2VuZChibG9jaywgbWF4LCBza2lwLCByZXZlcnNlKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyAqZ2V0QmxvY2tCb2RpZXMgKGhhc2hlczogQnVmZmVyW10gfCBzdHJpbmdbXSk6IEFzeW5jSXRlcmFibGU8QmxvY2tCb2R5W10+IHtcbiAgICB5aWVsZCBuZXcgUHJvbWlzZTxCbG9ja0JvZHlbXT4oYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlcnNbTVNHX0NPREVTLkJMT0NLX0JPRElFU10ub24oJ21lc3NhZ2UnLCAoYm9kaWVzKSA9PiB7XG4gICAgICAgIHJlc29sdmUoYm9kaWVzKVxuICAgICAgfSlcbiAgICAgIGNvbnN0IGJ1Zkhhc2hlcyA9IChoYXNoZXMgYXMgYW55KS5tYXAoaCA9PiBCdWZmZXIuaXNCdWZmZXIoaCkgPyBoIDogQnVmZmVyLmZyb20oaCkpXG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5HRVRfQkxPQ0tfQk9ESUVTXS5zZW5kKGJ1Zkhhc2hlcylcbiAgICB9KVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICBzZW5kTmV3SGFzaGVzIChoYXNoZXM6IHN0cmluZ1tdIHwgQnVmZmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJylcbiAgfVxuXG4gIGFzeW5jIGhhbmRzaGFrZSAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5oYW5kbGVyc1tNU0dfQ09ERVMuU1RBVFVTXS5zZW5kKFxuICAgICAgdGhpcy5wcm90b2NvbFZlcnNpb24sXG4gICAgICB0aGlzLmV0aENoYWluLmNvbW1vbi5uZXR3b3JrSWQoKSxcbiAgICAgIGF3YWl0IHRoaXMuZXRoQ2hhaW4uZ2V0QmxvY2tzVEQoKSxcbiAgICAgIChhd2FpdCB0aGlzLmV0aENoYWluLmdldEJlc3RCbG9jaygpIGFzIGFueSkuaGFzaCgpLFxuICAgICAgdGhpcy5ldGhDaGFpbi5nZW5lc2lzKCkuaGFzaFxuICAgIClcblxuICAgIC8vIHdhaXQgZm9yIHN0YXR1cyB0byBnZXQgcmVzb2x2ZWRcbiAgICBhd2FpdCB0aGlzLmdldFN0YXR1cygpXG4gIH1cbn1cbiJdfQ==