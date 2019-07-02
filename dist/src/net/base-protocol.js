'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:net:base-protocol');
const passthroughEncoder = {
    encode: function (msg) { return __asyncGenerator(this, arguments, function* () { yield yield __await(msg); }); },
    decode: function (msg) { return __asyncGenerator(this, arguments, function* () { yield yield __await(msg); }); }
};
class BaseProtocol extends events_1.default {
    constructor(peer, networkProvider, encoder = passthroughEncoder) {
        super();
        this.peer = peer;
        this.networkProvider = networkProvider;
        this.encoder = encoder;
    }
    receive(readable) {
        return __asyncGenerator(this, arguments, function* receive_1() {
            var e_1, _a, e_2, _b;
            if (!this.encoder) {
                throw new Error('encoder not set!');
            }
            try {
                debug(`reading incoming stream from ${this.peer.id}`);
                try {
                    for (var readable_1 = __asyncValues(readable), readable_1_1; readable_1_1 = yield __await(readable_1.next()), !readable_1_1.done;) {
                        const msg = readable_1_1.value;
                        try {
                            // debug('read message ', msg)
                            for (var _c = __asyncValues(this.encoder.decode(msg)), _d; _d = yield __await(_c.next()), !_d.done;) {
                                const decoded = _d.value;
                                yield yield __await(decoded);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (readable_1_1 && !readable_1_1.done && (_a = readable_1.return)) yield __await(_a.call(readable_1));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                debug('an error occurred reading stream ', e);
            }
        });
    }
    send(msg, protocol) {
        var e_3, _a, e_4, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.networkProvider) {
                throw new Error('networkProvider not set!');
            }
            if (!this.encoder) {
                throw new Error('encoder not set!');
            }
            try {
                try {
                    for (var _c = __asyncValues(this.encoder.encode(msg)), _d; _d = yield _c.next(), !_d.done;) {
                        const chunk = _d.value;
                        // protocol might choose to reply
                        // we might return something from send
                        const res = yield this.networkProvider.send(chunk, protocol, this.peer);
                        if (res && res.length > 0) {
                            try {
                                for (var _e = __asyncValues(this.encoder.decode(res)), _f; _f = yield _e.next(), !_f.done;) {
                                    const recvd = _f.value;
                                    return recvd;
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                        }
                        return res;
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            catch (e) {
                debug('an error occurred sending stream ', e);
            }
        });
    }
}
exports.BaseProtocol = BaseProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1wcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9uZXQvYmFzZS1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosb0RBQXVCO0FBU3ZCLGtEQUF5QjtBQUV6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtBQUVqRCxNQUFNLGtCQUFrQixHQUFhO0lBQ25DLE1BQU0sRUFBRSxVQUF1QixHQUFHLDREQUFJLG9CQUFNLEdBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBQyxJQUFBO0lBQ2pELE1BQU0sRUFBRSxVQUF1QixHQUFHLDREQUFJLG9CQUFNLEdBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBQyxJQUFBO0NBQ2xELENBQUE7QUFFRCxNQUFzQixZQUFtRCxTQUFRLGdCQUFFO0lBT2pGLFlBQWEsSUFBTyxFQUNQLGVBQXdCLEVBQ3hCLFVBQW9CLGtCQUFrQjtRQUNqRCxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFBO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3hCLENBQUM7SUFFTSxPQUFPLENBQVEsUUFBMEI7OztZQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO2FBQ3BDO1lBRUQsSUFBSTtnQkFDRixLQUFLLENBQUMsZ0NBQWdDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7b0JBQ3JELEtBQXdCLElBQUEsYUFBQSxjQUFBLFFBQVEsQ0FBQSxjQUFBO3dCQUFyQixNQUFNLEdBQUcscUJBQUEsQ0FBQTs7NEJBQ2xCLDhCQUE4Qjs0QkFDOUIsS0FBNEIsSUFBQSxLQUFBLGNBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUksR0FBRyxDQUFDLENBQUEsSUFBQTtnQ0FBNUMsTUFBTSxPQUFPLFdBQUEsQ0FBQTtnQ0FDdEIsb0JBQU0sT0FBK0IsQ0FBQSxDQUFBOzZCQUN0Qzs7Ozs7Ozs7O3FCQUNGOzs7Ozs7Ozs7YUFDRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUM5QztRQUNILENBQUM7S0FBQTtJQUVLLElBQUksQ0FBUSxHQUFNLEVBQUUsUUFBdUI7OztZQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO2FBQzVDO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQTthQUNwQztZQUVELElBQUk7O29CQUNGLEtBQTBCLElBQUEsS0FBQSxjQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUE7d0JBQXZDLE1BQU0sS0FBSyxXQUFBLENBQUE7d0JBQ3RCLGlDQUFpQzt3QkFDakMsc0NBQXNDO3dCQUNwQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUV2RSxJQUFJLEdBQUcsSUFBSyxHQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7Z0NBQ2xDLEtBQTBCLElBQUEsS0FBQSxjQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUE7b0NBQXZDLE1BQU0sS0FBSyxXQUFBLENBQUE7b0NBQ3BCLE9BQU8sS0FBcUIsQ0FBQTtpQ0FDN0I7Ozs7Ozs7Ozt5QkFDRjt3QkFFRCxPQUFPLEdBQW1CLENBQUE7cUJBQzNCOzs7Ozs7Ozs7YUFDRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUM5Qzs7S0FDRjtDQUdGO0FBL0RELG9DQStEQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRUUgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHtcbiAgSVByb3RvY29sLFxuICBJTmV0d29yayxcbiAgSUVuY29kZXIsXG4gIElQZWVyRGVzY3JpcHRvclxufSBmcm9tICcuL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi9ub2RlJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBQZWVyVHlwZXMgfSBmcm9tICcuL2hlbHBlci10eXBlcydcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0Om5ldDpiYXNlLXByb3RvY29sJylcblxuY29uc3QgcGFzc3Rocm91Z2hFbmNvZGVyOiBJRW5jb2RlciA9IHtcbiAgZW5jb2RlOiBhc3luYyBmdW5jdGlvbiogPFQsIFU+KG1zZykgeyB5aWVsZCBtc2cgfSxcbiAgZGVjb2RlOiBhc3luYyBmdW5jdGlvbiogPFQsIFU+KG1zZykgeyB5aWVsZCBtc2cgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVByb3RvY29sPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8UGVlclR5cGVzPj4gZXh0ZW5kcyBFRSBpbXBsZW1lbnRzIElQcm90b2NvbDxQPiB7XG4gIGFic3RyYWN0IGdldCBpZCAoKTogc3RyaW5nXG4gIGFic3RyYWN0IGdldCB2ZXJzaW9ucyAoKTogc3RyaW5nW11cblxuICBwZWVyOiBQXG4gIG5ldHdvcmtQcm92aWRlcjogSU5ldHdvcms8UD5cbiAgZW5jb2Rlcj86IElFbmNvZGVyXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQLFxuICAgICAgICAgICAgICAgbmV0d29ya1Byb3ZpZGVyOiBOb2RlPFA+LFxuICAgICAgICAgICAgICAgZW5jb2RlcjogSUVuY29kZXIgPSBwYXNzdGhyb3VnaEVuY29kZXIpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5wZWVyID0gcGVlclxuICAgIHRoaXMubmV0d29ya1Byb3ZpZGVyID0gbmV0d29ya1Byb3ZpZGVyXG4gICAgdGhpcy5lbmNvZGVyID0gZW5jb2RlclxuICB9XG5cbiAgYXN5bmMgKnJlY2VpdmU8VCwgVT4gKHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KTogQXN5bmNJdGVyYWJsZTxVIHwgVVtdIHwgbnVsbD4ge1xuICAgIGlmICghdGhpcy5lbmNvZGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuY29kZXIgbm90IHNldCEnKVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBkZWJ1ZyhgcmVhZGluZyBpbmNvbWluZyBzdHJlYW0gZnJvbSAke3RoaXMucGVlci5pZH1gKVxuICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2YgcmVhZGFibGUpIHtcbiAgICAgICAgLy8gZGVidWcoJ3JlYWQgbWVzc2FnZSAnLCBtc2cpXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgZGVjb2RlZCBvZiB0aGlzLmVuY29kZXIuZGVjb2RlPFQ+KG1zZykpIHtcbiAgICAgICAgICB5aWVsZCBkZWNvZGVkIGFzIHVua25vd24gYXMgKFUgfCBVW10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZygnYW4gZXJyb3Igb2NjdXJyZWQgcmVhZGluZyBzdHJlYW0gJywgZSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kPFQsIFU+IChtc2c6IFQsIHByb3RvY29sPzogSVByb3RvY29sPFA+KTogUHJvbWlzZTxVIHwgVVtdIHwgdm9pZCB8IG51bGw+IHtcbiAgICBpZiAoIXRoaXMubmV0d29ya1Byb3ZpZGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25ldHdvcmtQcm92aWRlciBub3Qgc2V0IScpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVuY29kZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZW5jb2RlciBub3Qgc2V0IScpXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgdGhpcy5lbmNvZGVyLmVuY29kZShtc2cpKSB7XG4gICAgICAvLyBwcm90b2NvbCBtaWdodCBjaG9vc2UgdG8gcmVwbHlcbiAgICAgIC8vIHdlIG1pZ2h0IHJldHVybiBzb21ldGhpbmcgZnJvbSBzZW5kXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMubmV0d29ya1Byb3ZpZGVyLnNlbmQoY2h1bmssIHByb3RvY29sLCB0aGlzLnBlZXIpXG5cbiAgICAgICAgaWYgKHJlcyAmJiAocmVzIGFzIGFueSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcmVjdmQgb2YgdGhpcy5lbmNvZGVyLmRlY29kZShyZXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjdmQgYXMgdW5rbm93biBhcyBVXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcyBhcyB1bmtub3duIGFzIFVcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZygnYW4gZXJyb3Igb2NjdXJyZWQgc2VuZGluZyBzdHJlYW0gJywgZSlcbiAgICB9XG4gIH1cblxuICBhYnN0cmFjdCBoYW5kc2hha2UgKCk6IFByb21pc2U8dm9pZD5cbn1cbiJdfQ==