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
    requestWithTimeout(outId, inId, payload = [], timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const tm = setTimeout(() => {
                    return reject(new Error(`request for message ${exports.MSG_CODES[outId]} timed out`));
                }, timeout);
                this.handlers[inId].on('message', (headers) => {
                    clearTimeout(tm);
                    resolve(headers);
                });
                yield this.handlers[outId].send(...payload);
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
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_HEADERS, exports.MSG_CODES.BLOCK_HEADERS, [block, max, skip, reverse]));
        });
    }
    /**
     * Get block bodies for block hashes
     *
     * @param hashes {Buffer[] | string[]} - block hashes for which to get the bodies
     */
    getBlockBodies(hashes) {
        return __asyncGenerator(this, arguments, function* getBlockBodies_1() {
            const bufHashes = hashes.map(h => Buffer.isBuffer(h) ? h : Buffer.from(h));
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_BODIES, exports.MSG_CODES.BLOCK_BODIES, bufHashes));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFFMUMsTUFBYSxRQUFRO0lBSW5CO1FBRkEsWUFBTyxHQUE0QixRQUFRLENBQUE7UUFDM0MsV0FBTSxHQUE0QixRQUFRLENBQUE7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQVZELDRCQVVDO0FBRUQsTUFBYSxXQUE0QyxTQUFRLDRCQUFlO0lBYTlFOzs7Ozs7O09BT0c7SUFDSCxZQUFhLElBQU8sRUFDUCxlQUF3QixFQUNqQixRQUFrQixFQUN6QixVQUFvQixJQUFJLHdCQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNuRSxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUZuQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBcEI5QixZQUFPLEdBQXFCLElBQUksUUFBUSxFQUFVLENBQUE7UUF1QnhELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdB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Q0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMvRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0csU0FBUzs7WUFDYixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FDMUMsaUJBQVMsQ0FBQyxNQUFNLEVBQ2hCLGlCQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNoQixJQUFJLENBQUMsZUFBZTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNoQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO2dCQUNqQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQVUsQ0FBQSxDQUFDLElBQUksRUFBRTtnQkFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJO2FBQzdCLENBQUMsQ0FBQTtZQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDeEIsQ0FBQztLQUFBO0NBQ0Y7QUEzSUQsa0NBMklDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCAqIGFzIEhhbmRsZXJzIGZyb20gJy4vaGFuZGxlcnMnXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcbmltcG9ydCB7IEJhc2VQcm90b2NvbCB9IGZyb20gJy4uLy4uL2Jhc2UtcHJvdG9jb2wnXG5pbXBvcnQgeyBJRXRoUHJvdG9jb2wsIEJsb2NrQm9keSwgU3RhdHVzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yLCBOb2RlLCBJRW5jb2RlciB9IGZyb20gJy4uLy4uJ1xuaW1wb3J0IHsgRXRoQ2hhaW4gfSBmcm9tICcuLi8uLi8uLi9ibG9ja2NoYWluJ1xuaW1wb3J0IHsgRXRoSGFuZGxlciB9IGZyb20gJy4vZXRoLWhhbmRsZXInXG5pbXBvcnQgeyBSbHBFbmNvZGVyIH0gZnJvbSAnLi9ybHAtZW5jb2RlcidcbmltcG9ydCB7IEVUSCB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKGBraXRzdW5ldDpldGgtcHJvdG9gKVxuXG5leHBvcnQgY29uc3QgTVNHX0NPREVTID0gRVRILk1FU1NBR0VfQ09ERVNcblxuZXhwb3J0IGNsYXNzIERlZmVycmVkPFQ+IHtcbiAgcHJvbWlzZTogUHJvbWlzZTxUPlxuICByZXNvbHZlOiAoLi4uYXJnczogYW55W10pID0+IGFueSA9IEZ1bmN0aW9uXG4gIHJlamVjdDogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgPSBGdW5jdGlvblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZVxuICAgICAgdGhpcy5yZWplY3QgPSByZWplY3RcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdGhQcm90b2NvbDxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgQmFzZVByb3RvY29sPFA+IGltcGxlbWVudHMgSUV0aFByb3RvY29sIHtcbiAgcHJvdG9jb2xWZXJzaW9uOiBudW1iZXJcbiAgaGFuZGxlcnM6IHsgW2tleTogbnVtYmVyXTogRXRoSGFuZGxlcjxQPiB9XG4gIHByaXZhdGUgX3N0YXR1czogRGVmZXJyZWQ8U3RhdHVzPiA9IG5ldyBEZWZlcnJlZDxTdGF0dXM+KClcblxuICBhc3luYyBnZXRTdGF0dXMgKCk6IFByb21pc2U8U3RhdHVzPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cy5wcm9taXNlXG4gIH1cblxuICBhc3luYyBzZXRTdGF0dXMgKHN0YXR1czogU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cy5yZXNvbHZlKHN0YXR1cylcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW4gRXRoZXJldW0gcHJvdG9jb2xcbiAgICpcbiAgICogQHBhcmFtIGJsb2NrQ2hhaW4gLSB0aGUgYmxvY2tjaGFpbiB0byB1c2UgZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gcGVlciAtIHRoZSBwZWVyIGRlc2NyaXB0b3IgZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gbmV0d29ya1Byb3ZpZGVyIC0gdGhlIG5ldHdvcmsgcHJvdmlkZXJcbiAgICogQHBhcmFtIGVuY29kZXIgLSBhbiBlbmNvZGVyIHRvIHVzZSB3aXRoIHRoZSBwZWVyXG4gICAqL1xuICBjb25zdHJ1Y3RvciAocGVlcjogUCxcbiAgICAgICAgICAgICAgIG5ldHdvcmtQcm92aWRlcjogTm9kZTxQPixcbiAgICAgICAgICAgICAgIHB1YmxpYyBldGhDaGFpbjogRXRoQ2hhaW4sXG4gICAgICAgICAgICAgICBlbmNvZGVyOiBJRW5jb2RlciA9IG5ldyBSbHBFbmNvZGVyKG5ldHdvcmtQcm92aWRlci50eXBlKSkge1xuICAgIHN1cGVyKHBlZXIsIG5ldHdvcmtQcm92aWRlciwgZW5jb2RlcilcbiAgICB0aGlzLnByb3RvY29sVmVyc2lvbiA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIHRoaXMudmVyc2lvbnMubWFwKHYgPT4gTnVtYmVyKHYpKSlcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fVxuICAgIE9iamVjdC5rZXlzKEhhbmRsZXJzKS5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICBjb25zdCBoOiBFdGhIYW5kbGVyPFA+ID0gUmVmbGVjdC5jb25zdHJ1Y3QoSGFuZGxlcnNbaGFuZGxlcl0sIFt0aGlzLCB0aGlzLnBlZXJdKVxuICAgICAgdGhpcy5oYW5kbGVyc1toLmlkXSA9IGhcbiAgICB9KVxuICB9XG5cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZXRoJ1xuICB9XG5cbiAgZ2V0IHZlcnNpb25zICgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIEVUSC5ldGg2Mi52ZXJzaW9uLnRvU3RyaW5nKCksXG4gICAgICBFVEguZXRoNjMudmVyc2lvbi50b1N0cmluZygpXG4gICAgXVxuICB9XG5cbiAgYXN5bmMgKnJlY2VpdmU8VCwgVT4gKHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KTogQXN5bmNJdGVyYWJsZTxVIHwgVVtdIHwgbnVsbD4ge1xuICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHN1cGVyLnJlY2VpdmU8VCwgYW55W10+KHJlYWRhYmxlKSkge1xuICAgICAgaWYgKCFtc2cpIHJldHVyblxuICAgICAgY29uc3QgY29kZTogRVRILk1FU1NBR0VfQ09ERVMgPSBtc2cuc2hpZnQoKSBhcyBFVEguTUVTU0FHRV9DT0RFU1xuICAgICAgaWYgKCF0aGlzLmhhbmRsZXJzW2NvZGVdKSB7XG4gICAgICAgIGRlYnVnKGB1bnN1cHBvcnRlZCBtZXRob2QgLSAke01TR19DT0RFU1tjb2RlXX1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5oYW5kbGVyc1tjb2RlXS5oYW5kbGUoLi4ubXNnKVxuICAgICAgaWYgKCFyZXMpIHlpZWxkIG51bGxcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgZW5jb2RlZCBvZiB0aGlzLmVuY29kZXIhLmVuY29kZShyZXMpKSB7XG4gICAgICAgIHlpZWxkIGVuY29kZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kPFQsIFU+IChtc2c6IFQpOiBQcm9taXNlPFUgfCBVW10gfCB2b2lkIHwgbnVsbD4ge1xuICAgIHJldHVybiBzdXBlci5zZW5kKG1zZywgdGhpcylcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyByZXF1ZXN0V2l0aFRpbWVvdXQ8VD4gKG91dElkOiBFVEguTUVTU0FHRV9DT0RFUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5JZDogRVRILk1FU1NBR0VfQ09ERVMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGFueVtdID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IG51bWJlciA9IDUwMDApOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4oYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoYHJlcXVlc3QgZm9yIG1lc3NhZ2UgJHtNU0dfQ09ERVNbb3V0SWRdfSB0aW1lZCBvdXRgKSlcbiAgICAgIH0sIHRpbWVvdXQpXG4gICAgICB0aGlzLmhhbmRsZXJzW2luSWRdLm9uKCdtZXNzYWdlJywgKGhlYWRlcnMpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRtKVxuICAgICAgICByZXNvbHZlKGhlYWRlcnMpXG4gICAgICB9KVxuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVyc1tvdXRJZF0uc2VuZCguLi5wYXlsb2FkKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGJsb2NrIGhlYWRlcnNcbiAgICpcbiAgICogQHBhcmFtIGJsb2NrIHtudW1iZXIgfCBCdWZmZXIgfCBCTn0gLSB0aGUgYmxvY2sgZm9yIHdoaWNoIHRvIGdldCB0aGUgaGVhZGVyXG4gICAqIEBwYXJhbSBtYXgge251bWJlcn0gLSBtYXggbnVtYmVyIG9mIGhlYWRlcnMgdG8gZG93bmxvYWQgZnJvbSBwZWVyXG4gICAqIEBwYXJhbSBza2lwIHtudW1iZXJ9IC0gc2tpcCBhIG51bWJlciBvZiBoZWFkZXJzXG4gICAqIEBwYXJhbSByZXZlcnNlIHtib29sZWFufSAtIGluIHJldmVyc2Ugb3JkZXJcbiAgICovXG4gIGFzeW5jICpnZXRIZWFkZXJzIChibG9jazogbnVtYmVyIHwgQnVmZmVyIHwgQk4sXG4gICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgIHNraXA/OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICByZXZlcnNlPzogYm9vbGVhbik6IEFzeW5jSXRlcmFibGU8QmxvY2suSGVhZGVyW10+IHtcbiAgICB5aWVsZCB0aGlzLnJlcXVlc3RXaXRoVGltZW91dDxCbG9jay5IZWFkZXJbXT4oXG4gICAgICBNU0dfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlMsXG4gICAgICBNU0dfQ09ERVMuQkxPQ0tfSEVBREVSUyxcbiAgICAgIFtibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYmxvY2sgYm9kaWVzIGZvciBibG9jayBoYXNoZXNcbiAgICpcbiAgICogQHBhcmFtIGhhc2hlcyB7QnVmZmVyW10gfCBzdHJpbmdbXX0gLSBibG9jayBoYXNoZXMgZm9yIHdoaWNoIHRvIGdldCB0aGUgYm9kaWVzXG4gICAqL1xuICBhc3luYyAqZ2V0QmxvY2tCb2RpZXMgKGhhc2hlczogQnVmZmVyW10gfCBzdHJpbmdbXSk6IEFzeW5jSXRlcmFibGU8QmxvY2tCb2R5W10+IHtcbiAgICBjb25zdCBidWZIYXNoZXMgPSAoaGFzaGVzIGFzIGFueSkubWFwKGggPT4gQnVmZmVyLmlzQnVmZmVyKGgpID8gaCA6IEJ1ZmZlci5mcm9tKGgpKVxuICAgIHlpZWxkIHRoaXMucmVxdWVzdFdpdGhUaW1lb3V0PEJsb2NrQm9keVtdPihcbiAgICAgIE1TR19DT0RFUy5HRVRfQkxPQ0tfQk9ESUVTLFxuICAgICAgTVNHX0NPREVTLkJMT0NLX0JPRElFUyxcbiAgICAgIGJ1Zkhhc2hlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZnkgcmVtb3RlIHBlZXIgb2YgbmV3IGhhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0gaGFzaGVzIHtCdWZmZXJbXSB8IHN0cmluZ1tdfSAtIGFycmF5IG9mIG5ldyBoYXNoZXMgdG8gbm90aWZ5IHRoZSBwZWVyXG4gICAqL1xuICBzZW5kTmV3SGFzaGVzIChoYXNoZXM6IHN0cmluZ1tdIHwgQnVmZmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyc1tNU0dfQ09ERVMuTkVXX0JMT0NLX0hBU0hFU10uc2VuZChoYXNoZXMpXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSBwcm90b2NvbCBoYW5kc2hha2UuIEluIHRoZSBjYXNlIG9mIEVUSCBwcm90b2NvbCxcbiAgICogaXQgc2VuZHMgdGhlIGBTdGF0dXNgIG1lc3NhZ2UuXG4gICAqL1xuICBhc3luYyBoYW5kc2hha2UgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucmVxdWVzdFdpdGhUaW1lb3V0PFN0YXR1cz4oXG4gICAgICBNU0dfQ09ERVMuU1RBVFVTLFxuICAgICAgTVNHX0NPREVTLlNUQVRVUywgW1xuICAgICAgICB0aGlzLnByb3RvY29sVmVyc2lvbixcbiAgICAgICAgdGhpcy5ldGhDaGFpbi5jb21tb24ubmV0d29ya0lkKCksXG4gICAgICAgIGF3YWl0IHRoaXMuZXRoQ2hhaW4uZ2V0QmxvY2tzVEQoKSxcbiAgICAgICAgKGF3YWl0IHRoaXMuZXRoQ2hhaW4uZ2V0QmVzdEJsb2NrKCkgYXMgYW55KS5oYXNoKCksXG4gICAgICAgIHRoaXMuZXRoQ2hhaW4uZ2VuZXNpcygpLmhhc2hcbiAgICAgIF0pXG4gICAgdGhpcy5zZXRTdGF0dXMoc3RhdHVzKVxuICB9XG59XG4iXX0=