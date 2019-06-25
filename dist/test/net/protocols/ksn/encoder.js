/* eslint-env mocha */
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
require("mocha");
const chai_1 = require("chai");
const ksn_encoder_1 = require("../../../../src/net/protocols/kitsunet/ksn-encoder");
const pull_stream_1 = __importDefault(require("pull-stream"));
const pull_pushable_1 = __importDefault(require("pull-pushable"));
const pull_length_prefixed_1 = __importDefault(require("pull-length-prefixed"));
const async_iterator_to_pull_stream_1 = __importDefault(require("async-iterator-to-pull-stream"));
const pull_stream_to_async_iterator_1 = __importDefault(require("pull-stream-to-async-iterator"));
const net_1 = require("../../../../src/net");
const async_1 = require("async");
const identifyMsg = {
    type: net_1.MsgType.IDENTIFY,
    status: net_1.ResponseStatus.OK,
    payload: {
        identify: {
            versions: ['1.0.0'],
            userAgent: 'ksn-client',
            nodeType: net_1.NodeType.NODE,
            latestBlock: Buffer.from([0]),
            sliceIds: [],
            networkId: 0,
            number: null,
            td: null,
            bestHash: null,
            genesis: null
            // sliceIds: this.networkProvider.getSliceIds()
        }
    }
};
const hexEncoded = '08011001221c0a1a0a05312e302e30120a6b736e2d636c69656e7418012201003000';
const hexEncodedLp = '2208011001221c0a1a0a05312e302e30120a6b736e2d636c69656e7418012201003000';
describe('ksn encoder', () => {
    const encoder = new ksn_encoder_1.KsnEncoder();
    it('should encode', () => __awaiter(this, void 0, void 0, function* () {
        var e_1, _a, e_2, _b;
        const readable = {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await(identifyMsg);
                });
            }
        };
        try {
            for (var readable_1 = __asyncValues(readable), readable_1_1; readable_1_1 = yield readable_1.next(), !readable_1_1.done;) {
                const m = readable_1_1.value;
                try {
                    for (var _c = __asyncValues(encoder.encode(m)), _d; _d = yield _c.next(), !_d.done;) {
                        const encoded = _d.value;
                        chai_1.expect(encoded).to.be.instanceOf(Buffer);
                        chai_1.expect(encoded.toString('hex')).to.eq(hexEncoded);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (readable_1_1 && !readable_1_1.done && (_a = readable_1.return)) yield _a.call(readable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }));
    it('should decode', () => __awaiter(this, void 0, void 0, function* () {
        var e_3, _e, e_4, _f;
        const readable = {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await(Buffer.from(hexEncoded, 'hex'));
                });
            }
        };
        try {
            for (var readable_2 = __asyncValues(readable), readable_2_1; readable_2_1 = yield readable_2.next(), !readable_2_1.done;) {
                const m = readable_2_1.value;
                try {
                    for (var _g = __asyncValues(encoder.decode(m)), _h; _h = yield _g.next(), !_h.done;) {
                        const decoded = _h.value;
                        chai_1.expect(decoded.payload.identify).to.eql(identifyMsg.payload.identify);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_f = _g.return)) yield _f.call(_g);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (readable_2_1 && !readable_2_1.done && (_e = readable_2.return)) yield _e.call(readable_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }));
    it('should encode and pull-stream', (done) => {
        const readable = {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await(identifyMsg);
                });
            }
        };
        const stream = pull_pushable_1.default();
        pull_stream_1.default(stream, pull_stream_1.default.collect((err, data) => {
            if (err)
                done(err);
            try {
                chai_1.expect(data[0].toString('hex')).to.eq(hexEncoded);
            }
            catch (e) {
                done(e);
            }
            done();
        }));
        async_1.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            var e_5, _a, e_6, _b;
            try {
                for (var readable_3 = __asyncValues(readable), readable_3_1; readable_3_1 = yield readable_3.next(), !readable_3_1.done;) {
                    const m = readable_3_1.value;
                    try {
                        for (var _c = __asyncValues(encoder.encode(m)), _d; _d = yield _c.next(), !_d.done;) {
                            const encoded = _d.value;
                            stream.push(encoded);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (readable_3_1 && !readable_3_1.done && (_a = readable_3.return)) yield _a.call(readable_3);
                }
                finally { if (e_5) throw e_5.error; }
            }
            stream.end();
        }));
    });
    it('should decode and pull-stream', (done) => {
        const readable = {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await(Buffer.from(hexEncoded, 'hex'));
                });
            }
        };
        const stream = pull_pushable_1.default();
        pull_stream_1.default(stream, pull_stream_1.default.collect((err, data) => {
            if (err)
                done(err);
            try {
                chai_1.expect(data[0].payload.identify).to.eql(identifyMsg.payload.identify);
            }
            catch (e) {
                done(e);
            }
            done();
        }));
        async_1.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            var e_7, _a, e_8, _b;
            try {
                for (var readable_4 = __asyncValues(readable), readable_4_1; readable_4_1 = yield readable_4.next(), !readable_4_1.done;) {
                    const m = readable_4_1.value;
                    try {
                        for (var _c = __asyncValues(encoder.decode(m)), _d; _d = yield _c.next(), !_d.done;) {
                            const encoded = _d.value;
                            stream.push(encoded);
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (readable_4_1 && !readable_4_1.done && (_a = readable_4.return)) yield _a.call(readable_4);
                }
                finally { if (e_7) throw e_7.error; }
            }
            stream.end();
        }));
    });
    it('should encode and pull-stream with lp', (done) => {
        const readable = {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await(identifyMsg);
                });
            }
        };
        const stream = pull_pushable_1.default();
        pull_stream_1.default(stream, pull_length_prefixed_1.default.encode(), pull_stream_1.default.collect((err, data) => {
            if (err)
                done(err);
            try {
                chai_1.expect(data[0].toString('hex')).to.eq(hexEncodedLp);
            }
            catch (e) {
                done(e);
            }
            done();
        }));
        async_1.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            var e_9, _a, e_10, _b;
            try {
                for (var readable_5 = __asyncValues(readable), readable_5_1; readable_5_1 = yield readable_5.next(), !readable_5_1.done;) {
                    const m = readable_5_1.value;
                    try {
                        for (var _c = __asyncValues(encoder.encode(m)), _d; _d = yield _c.next(), !_d.done;) {
                            const encoded = _d.value;
                            stream.push(encoded);
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (readable_5_1 && !readable_5_1.done && (_a = readable_5.return)) yield _a.call(readable_5);
                }
                finally { if (e_9) throw e_9.error; }
            }
            stream.end();
        }));
    });
    it('should decode and pull-stream with lp', () => __awaiter(this, void 0, void 0, function* () {
        var e_11, _j, e_12, _k;
        const readable = {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await(Buffer.from(hexEncodedLp, 'hex'));
                });
            }
        };
        const iter = pull_stream_to_async_iterator_1.default(pull_stream_1.default(async_iterator_to_pull_stream_1.default(readable), pull_length_prefixed_1.default.decode()));
        try {
            for (var iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield iter_1.next(), !iter_1_1.done;) {
                const m = iter_1_1.value;
                try {
                    for (var _l = __asyncValues(encoder.decode(m)), _m; _m = yield _l.next(), !_m.done;) {
                        const deccoded = _m.value;
                        chai_1.expect(deccoded.payload.identify).to.eql(identifyMsg.payload.identify);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_k = _l.return)) yield _k.call(_l);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (iter_1_1 && !iter_1_1.done && (_j = iter_1.return)) yield _j.call(iter_1);
            }
            finally { if (e_11) throw e_11.error; }
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3QvbmV0L3Byb3RvY29scy9rc24vZW5jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFFdEIsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGlCQUFjO0FBQ2QsK0JBQTZCO0FBQzdCLG9GQUErRTtBQUMvRSw4REFBOEI7QUFDOUIsa0VBQW9DO0FBQ3BDLGdGQUFxQztBQUNyQyxrR0FBa0Q7QUFDbEQsa0dBQXNEO0FBRXRELDZDQUk0QjtBQUM1QixpQ0FBZ0M7QUFFaEMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsSUFBSSxFQUFFLGFBQU8sQ0FBQyxRQUFRO0lBQ3RCLE1BQU0sRUFBRSxvQkFBYyxDQUFDLEVBQUU7SUFDekIsT0FBTyxFQUFFO1FBQ1AsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ25CLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFFBQVEsRUFBRSxjQUFRLENBQUMsSUFBSTtZQUN2QixXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLENBQUM7WUFDWixNQUFNLEVBQUUsSUFBSTtZQUNaLEVBQUUsRUFBRSxJQUFJO1lBQ1IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtZQUNiLCtDQUErQztTQUNoRDtLQUNGO0NBQ0YsQ0FBQTtBQUVELE1BQU0sVUFBVSxHQUFHLHNFQUFzRSxDQUFBO0FBQ3pGLE1BQU0sWUFBWSxHQUFHLHdFQUF3RSxDQUFBO0FBRTdGLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQVUsRUFBRSxDQUFBO0lBRWhDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsR0FB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QU8sV0FBQSxDQUFBOzRCQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO3lCQUNyQjs7Ozs7Ozs7O2lCQUNGOzs7Ozs7Ozs7WUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDZCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBUyxFQUFFOztRQUNyRCxNQUFNLFFBQVEsR0FBdUI7WUFDbkMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUU7O29CQUN0QixvQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQSxDQUFBO2dCQUN4QyxDQUFDO2FBQUE7U0FDRixDQUFBO1FBRUQsTUFBTSxJQUFJLEdBQUcsdUNBQVUsQ0FBQyxxQkFBSSxDQUFDLHVDQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsOEJBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7O1lBQzVELEtBQXNCLElBQUEsU0FBQSxjQUFBLElBQUksQ0FBQSxVQUFBO2dCQUFmLE1BQU0sQ0FBQyxpQkFBQSxDQUFBOztvQkFDaEIsS0FBNkIsSUFBQSxLQUFBLGNBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQSxJQUFBO3dCQUFuQyxNQUFNLFFBQVEsV0FBQSxDQUFBO3dCQUN2QixhQUFNLENBQUUsUUFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO3FCQUNoRjs7Ozs7Ozs7O2FBQ0Y7Ozs7Ozs7OztJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgbW9jaGEgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCAnbW9jaGEnXG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJ1xuaW1wb3J0IHsgS3NuRW5jb2RlciB9IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2tpdHN1bmV0L2tzbi1lbmNvZGVyJ1xuaW1wb3J0IHB1bGwgZnJvbSAncHVsbC1zdHJlYW0nXG5pbXBvcnQgcHVzaGFibGUgZnJvbSAncHVsbC1wdXNoYWJsZSdcbmltcG9ydCBscCBmcm9tICdwdWxsLWxlbmd0aC1wcmVmaXhlZCdcbmltcG9ydCB0b1B1bGwgZnJvbSAnYXN5bmMtaXRlcmF0b3ItdG8tcHVsbC1zdHJlYW0nXG5pbXBvcnQgdG9JdGVyYXRvciBmcm9tICdwdWxsLXN0cmVhbS10by1hc3luYy1pdGVyYXRvcidcblxuaW1wb3J0IHtcbiAgTXNnVHlwZSxcbiAgUmVzcG9uc2VTdGF0dXMsXG4gIE5vZGVUeXBlXG59IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQnXG5pbXBvcnQgeyBuZXh0VGljayB9IGZyb20gJ2FzeW5jJ1xuXG5jb25zdCBpZGVudGlmeU1zZyA9IHtcbiAgdHlwZTogTXNnVHlwZS5JREVOVElGWSxcbiAgc3RhdHVzOiBSZXNwb25zZVN0YXR1cy5PSyxcbiAgcGF5bG9hZDoge1xuICAgIGlkZW50aWZ5OiB7XG4gICAgICB2ZXJzaW9uczogWycxLjAuMCddLFxuICAgICAgdXNlckFnZW50OiAna3NuLWNsaWVudCcsXG4gICAgICBub2RlVHlwZTogTm9kZVR5cGUuTk9ERSxcbiAgICAgIGxhdGVzdEJsb2NrOiBCdWZmZXIuZnJvbShbMF0pLFxuICAgICAgc2xpY2VJZHM6IFtdLFxuICAgICAgbmV0d29ya0lkOiAwLFxuICAgICAgbnVtYmVyOiBudWxsLFxuICAgICAgdGQ6IG51bGwsXG4gICAgICBiZXN0SGFzaDogbnVsbCxcbiAgICAgIGdlbmVzaXM6IG51bGxcbiAgICAgIC8vIHNsaWNlSWRzOiB0aGlzLm5ldHdvcmtQcm92aWRlci5nZXRTbGljZUlkcygpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGhleEVuY29kZWQgPSAnMDgwMTEwMDEyMjFjMGExYTBhMDUzMTJlMzAyZTMwMTIwYTZiNzM2ZTJkNjM2YzY5NjU2ZTc0MTgwMTIyMDEwMDMwMDAnXG5jb25zdCBoZXhFbmNvZGVkTHAgPSAnMjIwODAxMTAwMTIyMWMwYTFhMGEwNTMxMmUzMDJlMzAxMjBhNmI3MzZlMmQ2MzZjNjk2NTZlNzQxODAxMjIwMTAwMzAwMCdcblxuZGVzY3JpYmUoJ2tzbiBlbmNvZGVyJywgKCkgPT4ge1xuICBjb25zdCBlbmNvZGVyID0gbmV3IEtzbkVuY29kZXIoKVxuXG4gIGl0KCdzaG91bGQgZW5jb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBpZGVudGlmeU1zZ1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiByZWFkYWJsZSkge1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBlbmNvZGVkIG9mIGVuY29kZXIuZW5jb2RlKG0pKSB7XG4gICAgICAgIGV4cGVjdChlbmNvZGVkKS50by5iZS5pbnN0YW5jZU9mKEJ1ZmZlcilcbiAgICAgICAgZXhwZWN0KChlbmNvZGVkIGFzIEJ1ZmZlcikudG9TdHJpbmcoJ2hleCcpKS50by5lcShoZXhFbmNvZGVkKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBpdCgnc2hvdWxkIGRlY29kZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgeWllbGQgQnVmZmVyLmZyb20oaGV4RW5jb2RlZCwgJ2hleCcpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIGF3YWl0IChjb25zdCBtIG9mIHJlYWRhYmxlKSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGRlY29kZWQgb2YgZW5jb2Rlci5kZWNvZGUobSkpIHtcbiAgICAgICAgZXhwZWN0KChkZWNvZGVkIGFzIGFueSkucGF5bG9hZC5pZGVudGlmeSkudG8uZXFsKGlkZW50aWZ5TXNnLnBheWxvYWQuaWRlbnRpZnkpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZW5jb2RlIGFuZCBwdWxsLXN0cmVhbScsIChkb25lKSA9PiB7XG4gICAgY29uc3QgcmVhZGFibGU6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHlpZWxkIGlkZW50aWZ5TXNnXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyZWFtID0gcHVzaGFibGUoKVxuICAgIHB1bGwoc3RyZWFtLCBwdWxsLmNvbGxlY3QoKGVyciwgZGF0YSkgPT4ge1xuICAgICAgaWYgKGVycikgZG9uZShlcnIpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGV4cGVjdChkYXRhWzBdLnRvU3RyaW5nKCdoZXgnKSkudG8uZXEoaGV4RW5jb2RlZClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZG9uZShlKVxuICAgICAgfVxuICAgICAgZG9uZSgpXG4gICAgfSkpXG5cbiAgICBuZXh0VGljayhhc3luYyAoKSA9PiB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IG0gb2YgcmVhZGFibGUpIHtcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBlbmNvZGVkIG9mIGVuY29kZXIuZW5jb2RlKG0pKSB7XG4gICAgICAgICAgc3RyZWFtLnB1c2goZW5jb2RlZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RyZWFtLmVuZCgpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGRlY29kZSBhbmQgcHVsbC1zdHJlYW0nLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBCdWZmZXIuZnJvbShoZXhFbmNvZGVkLCAnaGV4JylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdHJlYW0gPSBwdXNoYWJsZSgpXG4gICAgcHVsbChzdHJlYW0sIHB1bGwuY29sbGVjdCgoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSBkb25lKGVycilcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4cGVjdChkYXRhWzBdLnBheWxvYWQuaWRlbnRpZnkpLnRvLmVxbChpZGVudGlmeU1zZy5wYXlsb2FkLmlkZW50aWZ5KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkb25lKGUpXG4gICAgICB9XG4gICAgICBkb25lKClcbiAgICB9KSlcblxuICAgIG5leHRUaWNrKGFzeW5jICgpID0+IHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiByZWFkYWJsZSkge1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGVuY29kZWQgb2YgZW5jb2Rlci5kZWNvZGUobSkpIHtcbiAgICAgICAgICBzdHJlYW0ucHVzaChlbmNvZGVkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdHJlYW0uZW5kKClcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZW5jb2RlIGFuZCBwdWxsLXN0cmVhbSB3aXRoIGxwJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCByZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgeWllbGQgaWRlbnRpZnlNc2dcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdHJlYW0gPSBwdXNoYWJsZSgpXG4gICAgcHVsbChzdHJlYW0sIGxwLmVuY29kZSgpLCBwdWxsLmNvbGxlY3QoKGVyciwgZGF0YSkgPT4ge1xuICAgICAgaWYgKGVycikgZG9uZShlcnIpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGV4cGVjdChkYXRhWzBdLnRvU3RyaW5nKCdoZXgnKSkudG8uZXEoaGV4RW5jb2RlZExwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkb25lKGUpXG4gICAgICB9XG4gICAgICBkb25lKClcbiAgICB9KSlcblxuICAgIG5leHRUaWNrKGFzeW5jICgpID0+IHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiByZWFkYWJsZSkge1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGVuY29kZWQgb2YgZW5jb2Rlci5lbmNvZGUobSkpIHtcbiAgICAgICAgICBzdHJlYW0ucHVzaChlbmNvZGVkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdHJlYW0uZW5kKClcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZGVjb2RlIGFuZCBwdWxsLXN0cmVhbSB3aXRoIGxwJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBCdWZmZXIuZnJvbShoZXhFbmNvZGVkTHAsICdoZXgnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhdG9yKHB1bGwodG9QdWxsKHJlYWRhYmxlKSwgbHAuZGVjb2RlKCkpKVxuICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiBpdGVyKSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGRlY2NvZGVkIG9mIGVuY29kZXIuZGVjb2RlKG0pKSB7XG4gICAgICAgIGV4cGVjdCgoZGVjY29kZWQgYXMgYW55KS5wYXlsb2FkLmlkZW50aWZ5KS50by5lcWwoaWRlbnRpZnlNc2cucGF5bG9hZC5pZGVudGlmeSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuIl19