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
                        debug('read message ', msg);
                        try {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1wcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9uZXQvYmFzZS1wcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosb0RBQXVCO0FBU3ZCLGtEQUF5QjtBQUV6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtBQUVqRCxNQUFNLGtCQUFrQixHQUFhO0lBQ25DLE1BQU0sRUFBRSxVQUF1QixHQUFHLDREQUFJLG9CQUFNLEdBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBQyxJQUFBO0lBQ2pELE1BQU0sRUFBRSxVQUF1QixHQUFHLDREQUFJLG9CQUFNLEdBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBQyxJQUFBO0NBQ2xELENBQUE7QUFFRCxNQUFzQixZQUFtRCxTQUFRLGdCQUFFO0lBT2pGLFlBQWEsSUFBTyxFQUNQLGVBQXdCLEVBQ3hCLFVBQW9CLGtCQUFrQjtRQUNqRCxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFBO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3hCLENBQUM7SUFFTSxPQUFPLENBQVEsUUFBMEI7OztZQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO2FBQ3BDO1lBRUQsSUFBSTtnQkFDRixLQUFLLENBQUMsZ0NBQWdDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7b0JBQ3JELEtBQXdCLElBQUEsYUFBQSxjQUFBLFFBQVEsQ0FBQSxjQUFBO3dCQUFyQixNQUFNLEdBQUcscUJBQUEsQ0FBQTt3QkFDbEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQTs7NEJBQzNCLEtBQTRCLElBQUEsS0FBQSxjQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFJLEdBQUcsQ0FBQyxDQUFBLElBQUE7Z0NBQTVDLE1BQU0sT0FBTyxXQUFBLENBQUE7Z0NBQ3RCLG9CQUFNLE9BQStCLENBQUEsQ0FBQTs2QkFDdEM7Ozs7Ozs7OztxQkFDRjs7Ozs7Ozs7O2FBQ0Y7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixLQUFLLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUE7YUFDOUM7UUFDSCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQVEsR0FBTSxFQUFFLFFBQXVCOzs7WUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTthQUM1QztZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7YUFDcEM7WUFFRCxJQUFJOztvQkFDRixLQUEwQixJQUFBLEtBQUEsY0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFBO3dCQUF2QyxNQUFNLEtBQUssV0FBQSxDQUFBO3dCQUN0QixpQ0FBaUM7d0JBQ2pDLHNDQUFzQzt3QkFDcEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTt3QkFFdkUsSUFBSSxHQUFHLElBQUssR0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O2dDQUNsQyxLQUEwQixJQUFBLEtBQUEsY0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFBO29DQUF2QyxNQUFNLEtBQUssV0FBQSxDQUFBO29DQUNwQixPQUFPLEtBQXFCLENBQUE7aUNBQzdCOzs7Ozs7Ozs7eUJBQ0Y7d0JBRUQsT0FBTyxHQUFtQixDQUFBO3FCQUMzQjs7Ozs7Ozs7O2FBQ0Y7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixLQUFLLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUE7YUFDOUM7O0tBQ0Y7Q0FHRjtBQS9ERCxvQ0ErREMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEVFIGZyb20gJ2V2ZW50cydcbmltcG9ydCB7XG4gIElQcm90b2NvbCxcbiAgSU5ldHdvcmssXG4gIElFbmNvZGVyLFxuICBJUGVlckRlc2NyaXB0b3Jcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4vbm9kZSdcblxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgUGVlclR5cGVzIH0gZnJvbSAnLi9oZWxwZXItdHlwZXMnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpuZXQ6YmFzZS1wcm90b2NvbCcpXG5cbmNvbnN0IHBhc3N0aHJvdWdoRW5jb2RlcjogSUVuY29kZXIgPSB7XG4gIGVuY29kZTogYXN5bmMgZnVuY3Rpb24qIDxULCBVPihtc2cpIHsgeWllbGQgbXNnIH0sXG4gIGRlY29kZTogYXN5bmMgZnVuY3Rpb24qIDxULCBVPihtc2cpIHsgeWllbGQgbXNnIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VQcm90b2NvbDxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPFBlZXJUeXBlcz4+IGV4dGVuZHMgRUUgaW1wbGVtZW50cyBJUHJvdG9jb2w8UD4ge1xuICBhYnN0cmFjdCBnZXQgaWQgKCk6IHN0cmluZ1xuICBhYnN0cmFjdCBnZXQgdmVyc2lvbnMgKCk6IHN0cmluZ1tdXG5cbiAgcGVlcjogUFxuICBuZXR3b3JrUHJvdmlkZXI6IElOZXR3b3JrPFA+XG4gIGVuY29kZXI/OiBJRW5jb2RlclxuICBjb25zdHJ1Y3RvciAocGVlcjogUCxcbiAgICAgICAgICAgICAgIG5ldHdvcmtQcm92aWRlcjogTm9kZTxQPixcbiAgICAgICAgICAgICAgIGVuY29kZXI6IElFbmNvZGVyID0gcGFzc3Rocm91Z2hFbmNvZGVyKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMucGVlciA9IHBlZXJcbiAgICB0aGlzLm5ldHdvcmtQcm92aWRlciA9IG5ldHdvcmtQcm92aWRlclxuICAgIHRoaXMuZW5jb2RlciA9IGVuY29kZXJcbiAgfVxuXG4gIGFzeW5jICpyZWNlaXZlPFQsIFU+IChyZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxUPik6IEFzeW5jSXRlcmFibGU8VSB8IFVbXSB8IG51bGw+IHtcbiAgICBpZiAoIXRoaXMuZW5jb2Rlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdlbmNvZGVyIG5vdCBzZXQhJylcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZGVidWcoYHJlYWRpbmcgaW5jb21pbmcgc3RyZWFtIGZyb20gJHt0aGlzLnBlZXIuaWR9YClcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHJlYWRhYmxlKSB7XG4gICAgICAgIGRlYnVnKCdyZWFkIG1lc3NhZ2UgJywgbXNnKVxuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGRlY29kZWQgb2YgdGhpcy5lbmNvZGVyLmRlY29kZTxUPihtc2cpKSB7XG4gICAgICAgICAgeWllbGQgZGVjb2RlZCBhcyB1bmtub3duIGFzIChVIHwgVVtdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoJ2FuIGVycm9yIG9jY3VycmVkIHJlYWRpbmcgc3RyZWFtICcsIGUpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2VuZDxULCBVPiAobXNnOiBULCBwcm90b2NvbD86IElQcm90b2NvbDxQPik6IFByb21pc2U8VSB8IFVbXSB8IHZvaWQgfCBudWxsPiB7XG4gICAgaWYgKCF0aGlzLm5ldHdvcmtQcm92aWRlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCduZXR3b3JrUHJvdmlkZXIgbm90IHNldCEnKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5lbmNvZGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuY29kZXIgbm90IHNldCEnKVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHRoaXMuZW5jb2Rlci5lbmNvZGUobXNnKSkge1xuICAgICAgLy8gcHJvdG9jb2wgbWlnaHQgY2hvb3NlIHRvIHJlcGx5XG4gICAgICAvLyB3ZSBtaWdodCByZXR1cm4gc29tZXRoaW5nIGZyb20gc2VuZFxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLm5ldHdvcmtQcm92aWRlci5zZW5kKGNodW5rLCBwcm90b2NvbCwgdGhpcy5wZWVyKVxuXG4gICAgICAgIGlmIChyZXMgJiYgKHJlcyBhcyBhbnkpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHJlY3ZkIG9mIHRoaXMuZW5jb2Rlci5kZWNvZGUocmVzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlY3ZkIGFzIHVua25vd24gYXMgVVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXMgYXMgdW5rbm93biBhcyBVXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoJ2FuIGVycm9yIG9jY3VycmVkIHNlbmRpbmcgc3RyZWFtICcsIGUpXG4gICAgfVxuICB9XG5cbiAgYWJzdHJhY3QgaGFuZHNoYWtlICgpOiBQcm9taXNlPHZvaWQ+XG59XG4iXX0=