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
exports.ETH_REQUEST_TIMEOUT = 15000;
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
            yield yield __await(this.requestWithTimeout(exports.MSG_CODES.GET_BLOCK_BODIES, exports.MSG_CODES.BLOCK_BODIES, [hashes.map(h => Buffer.isBuffer(h) ? h : Buffer.from(h))]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2V0aC1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHFEQUFzQztBQUV0Qyx1REFBa0Q7QUFLbEQsK0NBQTBDO0FBQzFDLHlEQUF1QztBQUN2QyxrREFBeUI7QUFHekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFFNUIsUUFBQSxTQUFTLEdBQUcsdUJBQUcsQ0FBQyxhQUFhLENBQUE7QUFDN0IsUUFBQSxtQkFBbUIsR0FBVyxLQUFLLENBQUE7QUFFaEQsTUFBYSxRQUFRO0lBSW5CO1FBRkEsWUFBTyxHQUE0QixRQUFRLENBQUE7UUFDM0MsV0FBTSxHQUE0QixRQUFRLENBQUE7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQVZELDRCQVVDO0FBRUQsTUFBYSxXQUE0QyxTQUFRLDRCQUFlO0lBYTlFOzs7Ozs7O09BT0c7SUFDSCxZQUFhLElBQU8sRUFDUCxlQUF3QixFQUNqQixRQUFrQixFQUN6QixVQUFvQixJQUFJLHdCQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNuRSxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUZuQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBcEI5QixZQUFPLEdBQXFCLElBQUksUUFBUSxFQUFVLENBQUE7UUF1QnhE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O0lBRUQ7Ozs7T0FJRztJQUNILGFBQWEsQ0FBRSxNQUEyQjtRQUN4QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMvRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0csU0FBUzs7WUFDYixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FDMUMsaUJBQVMsQ0FBQyxNQUFNLEVBQ2hCLGlCQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNoQixJQUFJLENBQUMsZUFBZTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNoQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO2dCQUNqQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQVUsQ0FBQSxDQUFDLElBQUksRUFBRTtnQkFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJO2FBQzdCLENBQUMsQ0FBQTtZQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDeEIsQ0FBQztLQUFBO0NBQ0Y7QUFqSkQsa0NBaUpDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCAqIGFzIEhhbmRsZXJzIGZyb20gJy4vaGFuZGxlcnMnXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcbmltcG9ydCB7IEJhc2VQcm90b2NvbCB9IGZyb20gJy4uLy4uL2Jhc2UtcHJvdG9jb2wnXG5pbXBvcnQgeyBJRXRoUHJvdG9jb2wsIEJsb2NrQm9keSwgU3RhdHVzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yLCBOb2RlLCBJRW5jb2RlciB9IGZyb20gJy4uLy4uJ1xuaW1wb3J0IHsgRXRoQ2hhaW4gfSBmcm9tICcuLi8uLi8uLi9ibG9ja2NoYWluJ1xuaW1wb3J0IHsgRXRoSGFuZGxlciB9IGZyb20gJy4vZXRoLWhhbmRsZXInXG5pbXBvcnQgeyBSbHBFbmNvZGVyIH0gZnJvbSAnLi9ybHAtZW5jb2RlcidcbmltcG9ydCB7IEVUSCB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKGBraXRzdW5ldDpldGgtcHJvdG9gKVxuXG5leHBvcnQgY29uc3QgTVNHX0NPREVTID0gRVRILk1FU1NBR0VfQ09ERVNcbmV4cG9ydCBjb25zdCBFVEhfUkVRVUVTVF9USU1FT1VUOiBudW1iZXIgPSAxNTAwMFxuXG5leHBvcnQgY2xhc3MgRGVmZXJyZWQ8VD4ge1xuICBwcm9taXNlOiBQcm9taXNlPFQ+XG4gIHJlc29sdmU6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55ID0gRnVuY3Rpb25cbiAgcmVqZWN0OiAoLi4uYXJnczogYW55W10pID0+IGFueSA9IEZ1bmN0aW9uXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlXG4gICAgICB0aGlzLnJlamVjdCA9IHJlamVjdFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV0aFByb3RvY29sPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBCYXNlUHJvdG9jb2w8UD4gaW1wbGVtZW50cyBJRXRoUHJvdG9jb2wge1xuICBwcm90b2NvbFZlcnNpb246IG51bWJlclxuICBoYW5kbGVyczogeyBba2V5OiBudW1iZXJdOiBFdGhIYW5kbGVyPFA+IH1cbiAgcHJpdmF0ZSBfc3RhdHVzOiBEZWZlcnJlZDxTdGF0dXM+ID0gbmV3IERlZmVycmVkPFN0YXR1cz4oKVxuXG4gIGFzeW5jIGdldFN0YXR1cyAoKTogUHJvbWlzZTxTdGF0dXM+IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdHVzLnByb21pc2VcbiAgfVxuXG4gIGFzeW5jIHNldFN0YXR1cyAoc3RhdHVzOiBTdGF0dXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdHVzLnJlc29sdmUoc3RhdHVzKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbiBFdGhlcmV1bSBwcm90b2NvbFxuICAgKlxuICAgKiBAcGFyYW0gYmxvY2tDaGFpbiAtIHRoZSBibG9ja2NoYWluIHRvIHVzZSBmb3IgdGhpcyBwZWVyXG4gICAqIEBwYXJhbSBwZWVyIC0gdGhlIHBlZXIgZGVzY3JpcHRvciBmb3IgdGhpcyBwZWVyXG4gICAqIEBwYXJhbSBuZXR3b3JrUHJvdmlkZXIgLSB0aGUgbmV0d29yayBwcm92aWRlclxuICAgKiBAcGFyYW0gZW5jb2RlciAtIGFuIGVuY29kZXIgdG8gdXNlIHdpdGggdGhlIHBlZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQLFxuICAgICAgICAgICAgICAgbmV0d29ya1Byb3ZpZGVyOiBOb2RlPFA+LFxuICAgICAgICAgICAgICAgcHVibGljIGV0aENoYWluOiBFdGhDaGFpbixcbiAgICAgICAgICAgICAgIGVuY29kZXI6IElFbmNvZGVyID0gbmV3IFJscEVuY29kZXIobmV0d29ya1Byb3ZpZGVyLnR5cGUpKSB7XG4gICAgc3VwZXIocGVlciwgbmV0d29ya1Byb3ZpZGVyLCBlbmNvZGVyKVxuICAgIHRoaXMucHJvdG9jb2xWZXJzaW9uID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgdGhpcy52ZXJzaW9ucy5tYXAodiA9PiBOdW1iZXIodikpKVxuXG4gICAgdGhpcy5oYW5kbGVycyA9IHt9XG4gICAgT2JqZWN0LmtleXMoSGFuZGxlcnMpLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgIGNvbnN0IGg6IEV0aEhhbmRsZXI8UD4gPSBSZWZsZWN0LmNvbnN0cnVjdChIYW5kbGVyc1toYW5kbGVyXSwgW3RoaXMsIHRoaXMucGVlcl0pXG4gICAgICB0aGlzLmhhbmRsZXJzW2guaWRdID0gaFxuICAgIH0pXG4gIH1cblxuICBnZXQgaWQgKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdldGgnXG4gIH1cblxuICBnZXQgdmVyc2lvbnMgKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW1xuICAgICAgRVRILmV0aDYyLnZlcnNpb24udG9TdHJpbmcoKSxcbiAgICAgIEVUSC5ldGg2My52ZXJzaW9uLnRvU3RyaW5nKClcbiAgICBdXG4gIH1cblxuICBhc3luYyAqcmVjZWl2ZTxULCBVPiAocmVhZGFibGU6IEFzeW5jSXRlcmFibGU8VD4pOiBBc3luY0l0ZXJhYmxlPFUgfCBVW10gfCBudWxsPiB7XG4gICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2Ygc3VwZXIucmVjZWl2ZTxULCBhbnlbXT4ocmVhZGFibGUpKSB7XG4gICAgICBpZiAoIW1zZykgcmV0dXJuXG4gICAgICBjb25zdCBjb2RlOiBFVEguTUVTU0FHRV9DT0RFUyA9IG1zZy5zaGlmdCgpIGFzIEVUSC5NRVNTQUdFX0NPREVTXG4gICAgICBpZiAoIXRoaXMuaGFuZGxlcnNbY29kZV0pIHtcbiAgICAgICAgZGVidWcoYHVuc3VwcG9ydGVkIG1ldGhvZCAtICR7TVNHX0NPREVTW2NvZGVdfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLmhhbmRsZXJzW2NvZGVdLmhhbmRsZSguLi5tc2cpXG4gICAgICBpZiAoIXJlcykgeWllbGQgbnVsbFxuICAgICAgZm9yIGF3YWl0IChjb25zdCBlbmNvZGVkIG9mIHRoaXMuZW5jb2RlciEuZW5jb2RlKHJlcykpIHtcbiAgICAgICAgeWllbGQgZW5jb2RlZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VCwgVT4gKG1zZzogVCk6IFByb21pc2U8VSB8IFVbXSB8IHZvaWQgfCBudWxsPiB7XG4gICAgcmV0dXJuIHN1cGVyLnNlbmQobXNnLCB0aGlzKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvdXRJZCB7RVRILk1FU1NBR0VfQ09ERVN9IC0gb3V0IG1lc3NhZ2UgaWRcbiAgICogQHBhcmFtIGluSWQge0VUSC5NRVNTQUdFX0NPREVTfSAtIGluIG1lc3NhZ2UgaWRcbiAgICogQHBhcmFtIHBheWxvYWQge2FueVtdfSAtIHBheWxvYWQgZm9yIHRoZSByZXF1ZXN0XG4gICAqIEBwYXJhbSB0aW1lb3V0IHtudW1iZXJ9IC0gcmVxdWVzdCB0aW1lb3V0XG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgcmVxdWVzdFdpdGhUaW1lb3V0PFQ+IChvdXRJZDogRVRILk1FU1NBR0VfQ09ERVMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluSWQ6IEVUSC5NRVNTQUdFX0NPREVTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiBhbnlbXSA9IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiBudW1iZXIgPSBFVEhfUkVRVUVTVF9USU1FT1VUKTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCB0bTogTm9kZUpTLlRpbWVvdXQgfCBudWxsID0gbnVsbFxuICAgICAgdGhpcy5oYW5kbGVyc1tpbklkXS5vbignbWVzc2FnZScsIChoZWFkZXJzKSA9PiB7XG4gICAgICAgIGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKVxuICAgICAgICByZXNvbHZlKGhlYWRlcnMpXG4gICAgICB9KVxuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVyc1tvdXRJZF0uc2VuZCguLi5wYXlsb2FkKVxuICAgICAgdG0gPSBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYHJlcXVlc3QgZm9yIG1lc3NhZ2UgJHtNU0dfQ09ERVNbb3V0SWRdfSB0aW1lZCBvdXQgZm9yIHBlZXIgJHt0aGlzLnBlZXIuaWR9YCkpLCB0aW1lb3V0KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGJsb2NrIGhlYWRlcnNcbiAgICpcbiAgICogQHBhcmFtIGJsb2NrIHtudW1iZXIgfCBCdWZmZXIgfCBCTn0gLSB0aGUgYmxvY2sgZm9yIHdoaWNoIHRvIGdldCB0aGUgaGVhZGVyXG4gICAqIEBwYXJhbSBtYXgge251bWJlcn0gLSBtYXggbnVtYmVyIG9mIGhlYWRlcnMgdG8gZG93bmxvYWQgZnJvbSBwZWVyXG4gICAqIEBwYXJhbSBza2lwIHtudW1iZXJ9IC0gc2tpcCBhIG51bWJlciBvZiBoZWFkZXJzXG4gICAqIEBwYXJhbSByZXZlcnNlIHtib29sZWFufSAtIGluIHJldmVyc2Ugb3JkZXJcbiAgICovXG4gIGFzeW5jICpnZXRIZWFkZXJzIChibG9jazogbnVtYmVyIHwgQnVmZmVyIHwgQk4sXG4gICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgIHNraXA/OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICByZXZlcnNlPzogYm9vbGVhbik6IEFzeW5jSXRlcmFibGU8QmxvY2suSGVhZGVyW10+IHtcbiAgICB5aWVsZCB0aGlzLnJlcXVlc3RXaXRoVGltZW91dDxCbG9jay5IZWFkZXJbXT4oXG4gICAgICBNU0dfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlMsXG4gICAgICBNU0dfQ09ERVMuQkxPQ0tfSEVBREVSUyxcbiAgICAgIFtibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYmxvY2sgYm9kaWVzIGZvciBibG9jayBoYXNoZXNcbiAgICpcbiAgICogQHBhcmFtIGhhc2hlcyB7QnVmZmVyW10gfCBzdHJpbmdbXX0gLSBibG9jayBoYXNoZXMgZm9yIHdoaWNoIHRvIGdldCB0aGUgYm9kaWVzXG4gICAqL1xuICBhc3luYyAqZ2V0QmxvY2tCb2RpZXMgKGhhc2hlczogQnVmZmVyW10gfCBzdHJpbmdbXSk6IEFzeW5jSXRlcmFibGU8QmxvY2tCb2R5W10+IHtcbiAgICB5aWVsZCB0aGlzLnJlcXVlc3RXaXRoVGltZW91dDxCbG9ja0JvZHlbXT4oXG4gICAgICBNU0dfQ09ERVMuR0VUX0JMT0NLX0JPRElFUyxcbiAgICAgIE1TR19DT0RFUy5CTE9DS19CT0RJRVMsXG4gICAgICBbKGhhc2hlcyBhcyBhbnkpLm1hcChoID0+IEJ1ZmZlci5pc0J1ZmZlcihoKSA/IGggOiBCdWZmZXIuZnJvbShoKSldKVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSByZW1vdGUgcGVlciBvZiBuZXcgaGFzaGVzXG4gICAqXG4gICAqIEBwYXJhbSBoYXNoZXMge0J1ZmZlcltdIHwgc3RyaW5nW119IC0gYXJyYXkgb2YgbmV3IGhhc2hlcyB0byBub3RpZnkgdGhlIHBlZXJcbiAgICovXG4gIHNlbmROZXdIYXNoZXMgKGhhc2hlczogc3RyaW5nW10gfCBCdWZmZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXJzW01TR19DT0RFUy5ORVdfQkxPQ0tfSEFTSEVTXS5zZW5kKGhhc2hlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIHByb3RvY29sIGhhbmRzaGFrZS4gSW4gdGhlIGNhc2Ugb2YgRVRIIHByb3RvY29sLFxuICAgKiBpdCBzZW5kcyB0aGUgYFN0YXR1c2AgbWVzc2FnZS5cbiAgICovXG4gIGFzeW5jIGhhbmRzaGFrZSAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5yZXF1ZXN0V2l0aFRpbWVvdXQ8U3RhdHVzPihcbiAgICAgIE1TR19DT0RFUy5TVEFUVVMsXG4gICAgICBNU0dfQ09ERVMuU1RBVFVTLCBbXG4gICAgICAgIHRoaXMucHJvdG9jb2xWZXJzaW9uLFxuICAgICAgICB0aGlzLmV0aENoYWluLmNvbW1vbi5uZXR3b3JrSWQoKSxcbiAgICAgICAgYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCbG9ja3NURCgpLFxuICAgICAgICAoYXdhaXQgdGhpcy5ldGhDaGFpbi5nZXRCZXN0QmxvY2soKSBhcyBhbnkpLmhhc2goKSxcbiAgICAgICAgdGhpcy5ldGhDaGFpbi5nZW5lc2lzKCkuaGFzaFxuICAgICAgXSlcbiAgICB0aGlzLnNldFN0YXR1cyhzdGF0dXMpXG4gIH1cbn1cbiJdfQ==