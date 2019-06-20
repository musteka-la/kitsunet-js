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
            return this.handlers[exports.MSG_CODES.STATUS].send(this.protocolVersion, this.ethChain.common.networkId(), yield this.ethChain.getBlocksTD(), (yield this.ethChain.getBestBlock()).hash(), this.ethChain.genesis().hash);
        });
    }
}
exports.EthProtocol = EthProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFFMUMsTUFBYSxRQUFRO0lBSW5CO1FBRkEsWUFBTyxHQUE0QixRQUFRLENBQUE7UUFDM0MsV0FBTSxHQUE0QixRQUFRLENBQUE7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQVZELDRCQVVDO0FBRUQsTUFBYSxXQUE0QyxTQUFRLDRCQUFlO0lBYTlFOzs7Ozs7O09BT0c7SUFDSCxZQUFhLElBQU8sRUFDUCxlQUF3QixFQUNqQixRQUFrQixFQUN6QixVQUFvQixJQUFJLHdCQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNuRSxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUZuQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBcEI5QixZQUFPLEdBQXFCLElBQUksUUFBUSxFQUFVLENBQUE7UUF1QnhELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdB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Q0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFVLENBQUEsQ0FBQyxJQUFJLEVBQUUsRUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQzdCLENBQUE7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQXZHRCxrQ0F1R0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0ICogYXMgSGFuZGxlcnMgZnJvbSAnLi9oYW5kbGVycydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IHsgQmFzZVByb3RvY29sIH0gZnJvbSAnLi4vLi4vYmFzZS1wcm90b2NvbCdcbmltcG9ydCB7IElFdGhQcm90b2NvbCwgQmxvY2tCb2R5LCBTdGF0dXMgfSBmcm9tICcuL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBJUGVlckRlc2NyaXB0b3IsIE5vZGUsIElFbmNvZGVyIH0gZnJvbSAnLi4vLi4nXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBFdGhIYW5kbGVyIH0gZnJvbSAnLi9ldGgtaGFuZGxlcidcbmltcG9ydCB7IFJscEVuY29kZXIgfSBmcm9tICcuL3JscC1lbmNvZGVyJ1xuaW1wb3J0IHsgRVRIIH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoYGtpdHN1bmV0OmV0aC1wcm90b2ApXG5cbmV4cG9ydCBjb25zdCBNU0dfQ09ERVMgPSBFVEguTUVTU0FHRV9DT0RFU1xuXG5leHBvcnQgY2xhc3MgRGVmZXJyZWQ8VD4ge1xuICBwcm9taXNlOiBQcm9taXNlPFQ+XG4gIHJlc29sdmU6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55ID0gRnVuY3Rpb25cbiAgcmVqZWN0OiAoLi4uYXJnczogYW55W10pID0+IGFueSA9IEZ1bmN0aW9uXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlXG4gICAgICB0aGlzLnJlamVjdCA9IHJlamVjdFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV0aFByb3RvY29sPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBCYXNlUHJvdG9jb2w8UD4gaW1wbGVtZW50cyBJRXRoUHJvdG9jb2wge1xuICBwcm90b2NvbFZlcnNpb246IG51bWJlclxuICBoYW5kbGVyczogeyBba2V5OiBudW1iZXJdOiBFdGhIYW5kbGVyPFA+IH1cbiAgcHJpdmF0ZSBfc3RhdHVzOiBEZWZlcnJlZDxTdGF0dXM+ID0gbmV3IERlZmVycmVkPFN0YXR1cz4oKVxuXG4gIGFzeW5jIGdldFN0YXR1cyAoKTogUHJvbWlzZTxTdGF0dXM+IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdHVzLnByb21pc2VcbiAgfVxuXG4gIGFzeW5jIHNldFN0YXR1cyAoc3RhdHVzOiBTdGF0dXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdHVzLnJlc29sdmUoc3RhdHVzKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbiBFdGhlcmV1bSBwcm90b2NvbFxuICAgKlxuICAgKiBAcGFyYW0gYmxvY2tDaGFpbiAtIHRoZSBibG9ja2NoYWluIHRvIHVzZSBmb3IgdGhpcyBwZWVyXG4gICAqIEBwYXJhbSBwZWVyIC0gdGhlIHBlZXIgZGVzY3JpcHRvciBmb3IgdGhpcyBwZWVyXG4gICAqIEBwYXJhbSBuZXR3b3JrUHJvdmlkZXIgLSB0aGUgbmV0d29yayBwcm92aWRlclxuICAgKiBAcGFyYW0gZW5jb2RlciAtIGFuIGVuY29kZXIgdG8gdXNlIHdpdGggdGhlIHBlZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQLFxuICAgICAgICAgICAgICAgbmV0d29ya1Byb3ZpZGVyOiBOb2RlPFA+LFxuICAgICAgICAgICAgICAgcHVibGljIGV0aENoYWluOiBFdGhDaGFpbixcbiAgICAgICAgICAgICAgIGVuY29kZXI6IElFbmNvZGVyID0gbmV3IFJscEVuY29kZXIobmV0d29ya1Byb3ZpZGVyLnR5cGUpKSB7XG4gICAgc3VwZXIocGVlciwgbmV0d29ya1Byb3ZpZGVyLCBlbmNvZGVyKVxuICAgIHRoaXMucHJvdG9jb2xWZXJzaW9uID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgdGhpcy52ZXJzaW9ucy5tYXAodiA9PiBOdW1iZXIodikpKVxuXG4gICAgdGhpcy5oYW5kbGVycyA9IHt9XG4gICAgT2JqZWN0LmtleXMoSGFuZGxlcnMpLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgIGNvbnN0IGg6IEV0aEhhbmRsZXI8UD4gPSBSZWZsZWN0LmNvbnN0cnVjdChIYW5kbGVyc1toYW5kbGVyXSwgW3RoaXMsIHRoaXMucGVlcl0pXG4gICAgICB0aGlzLmhhbmRsZXJzW2guaWRdID0gaFxuICAgIH0pXG4gIH1cblxuICBnZXQgaWQgKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdldGgnXG4gIH1cblxuICBnZXQgdmVyc2lvbnMgKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW1xuICAgICAgRVRILmV0aDYyLnZlcnNpb24udG9TdHJpbmcoKSxcbiAgICAgIEVUSC5ldGg2My52ZXJzaW9uLnRvU3RyaW5nKClcbiAgICBdXG4gIH1cblxuICBhc3luYyAqcmVjZWl2ZTxULCBVPiAocmVhZGFibGU6IEFzeW5jSXRlcmFibGU8VD4pOiBBc3luY0l0ZXJhYmxlPFUgfCBVW10gfCBudWxsPiB7XG4gICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2Ygc3VwZXIucmVjZWl2ZTxULCBhbnlbXT4ocmVhZGFibGUpKSB7XG4gICAgICBpZiAoIW1zZykgcmV0dXJuXG4gICAgICBjb25zdCBjb2RlOiBFVEguTUVTU0FHRV9DT0RFUyA9IG1zZy5zaGlmdCgpIGFzIEVUSC5NRVNTQUdFX0NPREVTXG4gICAgICBpZiAoIXRoaXMuaGFuZGxlcnNbY29kZV0pIHtcbiAgICAgICAgZGVidWcoYHVuc3VwcG9ydGVkIG1ldGhvZCAtICR7TVNHX0NPREVTW2NvZGVdfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLmhhbmRsZXJzW2NvZGVdLmhhbmRsZSguLi5tc2cpXG4gICAgICBpZiAoIXJlcykgeWllbGQgbnVsbFxuICAgICAgZm9yIGF3YWl0IChjb25zdCBlbmNvZGVkIG9mIHRoaXMuZW5jb2RlciEuZW5jb2RlKHJlcykpIHtcbiAgICAgICAgeWllbGQgZW5jb2RlZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VCwgVT4gKG1zZzogVCk6IFByb21pc2U8VSB8IFVbXSB8IHZvaWQgfCBudWxsPiB7XG4gICAgcmV0dXJuIHN1cGVyLnNlbmQobXNnLCB0aGlzKVxuICB9XG5cbiAgYXN5bmMgKmdldEhlYWRlcnMgKGJsb2NrOiBudW1iZXIgfCBCdWZmZXIgfCBCTixcbiAgICAgICAgICAgICAgICAgICAgIG1heDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgc2tpcD86IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgIHJldmVyc2U/OiBib29sZWFuKTogQXN5bmNJdGVyYWJsZTxCbG9jay5IZWFkZXJbXT4ge1xuICAgIHlpZWxkIG5ldyBQcm9taXNlPEJsb2NrLkhlYWRlcltdPihhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVyc1tNU0dfQ09ERVMuQkxPQ0tfSEVBREVSU10ub24oJ21lc3NhZ2UnLCAoaGVhZGVycykgPT4ge1xuICAgICAgICByZXNvbHZlKGhlYWRlcnMpXG4gICAgICB9KVxuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVyc1tNU0dfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlNdLnNlbmQoYmxvY2ssIG1heCwgc2tpcCwgcmV2ZXJzZSlcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgKmdldEJsb2NrQm9kaWVzIChoYXNoZXM6IEJ1ZmZlcltdIHwgc3RyaW5nW10pOiBBc3luY0l0ZXJhYmxlPEJsb2NrQm9keVtdPiB7XG4gICAgeWllbGQgbmV3IFByb21pc2U8QmxvY2tCb2R5W10+KGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5CTE9DS19CT0RJRVNdLm9uKCdtZXNzYWdlJywgKGJvZGllcykgPT4ge1xuICAgICAgICByZXNvbHZlKGJvZGllcylcbiAgICAgIH0pXG4gICAgICBjb25zdCBidWZIYXNoZXMgPSAoaGFzaGVzIGFzIGFueSkubWFwKGggPT4gQnVmZmVyLmlzQnVmZmVyKGgpID8gaCA6IEJ1ZmZlci5mcm9tKGgpKVxuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVyc1tNU0dfQ09ERVMuR0VUX0JMT0NLX0JPRElFU10uc2VuZChidWZIYXNoZXMpXG4gICAgfSlcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgc2VuZE5ld0hhc2hlcyAoaGFzaGVzOiBzdHJpbmdbXSB8IEJ1ZmZlcltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpXG4gIH1cblxuICBhc3luYyBoYW5kc2hha2UgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5TVEFUVVNdLnNlbmQoXG4gICAgICB0aGlzLnByb3RvY29sVmVyc2lvbixcbiAgICAgIHRoaXMuZXRoQ2hhaW4uY29tbW9uLm5ldHdvcmtJZCgpLFxuICAgICAgYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCbG9ja3NURCgpLFxuICAgICAgKGF3YWl0IHRoaXMuZXRoQ2hhaW4uZ2V0QmVzdEJsb2NrKCkgYXMgYW55KS5oYXNoKCksXG4gICAgICB0aGlzLmV0aENoYWluLmdlbmVzaXMoKS5oYXNoXG4gICAgKVxuICB9XG59XG4iXX0=