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
            sliceIds: []
            // sliceIds: this.networkProvider.getSliceIds()
        }
    }
};
const hexEncoded = '08011001221a0a180a05312e302e30120a6b736e2d636c69656e741801220100';
const hexEncodedLp = '2008011001221a0a180a05312e302e30120a6b736e2d636c69656e741801220100';
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
            chai_1.expect(data[0].toString('hex')).to.eq(hexEncoded);
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
            chai_1.expect(data[0].payload.identify).to.eql(identifyMsg.payload.identify);
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
            chai_1.expect(data[0].toString('hex')).to.eq(hexEncodedLp);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3QvbmV0L3Byb3RvY29scy9rc24vZW5jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFFdEIsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGlCQUFjO0FBQ2QsK0JBQTZCO0FBQzdCLG9GQUErRTtBQUMvRSw4REFBOEI7QUFDOUIsa0VBQW9DO0FBQ3BDLGdGQUFxQztBQUNyQyxrR0FBa0Q7QUFDbEQsa0dBQXNEO0FBRXRELDZDQUk0QjtBQUM1QixpQ0FBZ0M7QUFFaEMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsSUFBSSxFQUFFLGFBQU8sQ0FBQyxRQUFRO0lBQ3RCLE1BQU0sRUFBRSxvQkFBYyxDQUFDLEVBQUU7SUFDekIsT0FBTyxFQUFFO1FBQ1AsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ25CLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFFBQVEsRUFBRSxjQUFRLENBQUMsSUFBSTtZQUN2QixXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFFBQVEsRUFBRSxFQUFFO1lBQ1osK0NBQStDO1NBQ2hEO0tBQ0Y7Q0FDRixDQUFBO0FBRUQsTUFBTSxVQUFVLEdBQUcsa0VBQWtFLENBQUE7QUFDckYsTUFBTSxZQUFZLEdBQUcsb0VBQW9FLENBQUE7QUFFekYsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsTUFBTSxPQUFPLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUE7SUFFaEMsRUFBRSxDQUFDLGVBQWUsRUFBRSxHQUFTLEVBQUU7O1FBQzdCLE1BQU0sUUFBUSxHQUF1QjtZQUNuQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTs7b0JBQ3RCLG9CQUFNLFdBQVcsQ0FBQSxDQUFBO2dCQUNuQixDQUFDO2FBQUE7U0FDRixDQUFBOztZQUVELEtBQXNCLElBQUEsYUFBQSxjQUFBLFFBQVEsQ0FBQSxjQUFBO2dCQUFuQixNQUFNLENBQUMscUJBQUEsQ0FBQTs7b0JBQ2hCLEtBQTRCLElBQUEsS0FBQSxjQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsSUFBQTt3QkFBbEMsTUFBTSxPQUFPLFdBQUEsQ0FBQTt3QkFDdEIsYUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dCQUN4QyxhQUFNLENBQUUsT0FBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFBO3FCQUM5RDs7Ozs7Ozs7O2FBQ0Y7Ozs7Ozs7OztJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsZUFBZSxFQUFFLEdBQVMsRUFBRTs7UUFDN0IsTUFBTSxRQUFRLEdBQXVCO1lBQ25DLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFOztvQkFDdEIsb0JBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUEsQ0FBQTtnQkFDdEMsQ0FBQzthQUFBO1NBQ0YsQ0FBQTs7WUFFRCxLQUFzQixJQUFBLGFBQUEsY0FBQSxRQUFRLENBQUEsY0FBQTtnQkFBbkIsTUFBTSxDQUFDLHFCQUFBLENBQUE7O29CQUNoQixLQUE0QixJQUFBLEtBQUEsY0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBLElBQUE7d0JBQWxDLE1BQU0sT0FBTyxXQUFBLENBQUE7d0JBQ3RCLGFBQU0sQ0FBRSxPQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtxQkFDL0U7Ozs7Ozs7OzthQUNGOzs7Ozs7Ozs7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLCtCQUErQixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDM0MsTUFBTSxRQUFRLEdBQXVCO1lBQ25DLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFOztvQkFDdEIsb0JBQU0sV0FBVyxDQUFBLENBQUE7Z0JBQ25CLENBQUM7YUFBQTtTQUNGLENBQUE7UUFFRCxNQUFNLE1BQU0sR0FBRyx1QkFBUSxFQUFFLENBQUE7UUFDekIscUJBQUksQ0FBQyxNQUFNLEVBQUUscUJBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxHQUFHO2dCQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNsQixhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakQsSUFBSSxFQUFFLENBQUE7UUFDUixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRUgsZ0JBQVEsQ0FBQyxHQUFTLEVBQUU7OztnQkFDbEIsS0FBc0IsSUFBQSxhQUFBLGNBQUEsUUFBUSxDQUFBLGNBQUE7b0JBQW5CLE1BQU0sQ0FBQyxxQkFBQSxDQUFBOzt3QkFDaEIsS0FBNEIsSUFBQSxLQUFBLGNBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQSxJQUFBOzRCQUFsQyxNQUFNLE9BQU8sV0FBQSxDQUFBOzRCQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO3lCQUNyQjs7Ozs7Ozs7O2lCQUNGOzs7Ozs7Ozs7WUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDZCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsK0JBQStCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUMzQyxNQUFNLFFBQVEsR0FBdUI7WUFDbkMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUU7O29CQUN0QixvQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQSxDQUFBO2dCQUN0QyxDQUFDO2FBQUE7U0FDRixDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQUcsdUJBQVEsRUFBRSxDQUFBO1FBQ3pCLHFCQUFJLENBQUMsTUFBTSxFQUFFLHFCQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3RDLElBQUksR0FBRztnQkFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEIsYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3JFLElBQUksRUFBRSxDQUFBO1FBQ1IsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUVILGdCQUFRLENBQUMsR0FBUyxFQUFFOzs7Z0JBQ2xCLEtBQXNCLElBQUEsYUFBQSxjQUFBLFFBQVEsQ0FBQSxjQUFBO29CQUFuQixNQUFNLENBQUMscUJBQUEsQ0FBQTs7d0JBQ2hCLEtBQTRCLElBQUEsS0FBQSxjQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsSUFBQTs0QkFBbEMsTUFBTSxPQUFPLFdBQUEsQ0FBQTs0QkFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTt5QkFDckI7Ozs7Ozs7OztpQkFDRjs7Ozs7Ozs7O1lBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2QsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQXVCO1lBQ25DLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFOztvQkFDdEIsb0JBQU0sV0FBVyxDQUFBLENBQUE7Z0JBQ25CLENBQUM7YUFBQTtTQUNGLENBQUE7UUFFRCxNQUFNLE1BQU0sR0FBRyx1QkFBUSxFQUFFLENBQUE7UUFDekIscUJBQUksQ0FBQyxNQUFNLEVBQUUsOEJBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxxQkFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNuRCxJQUFJLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2xCLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNuRCxJQUFJLEVBQUUsQ0FBQTtRQUNSLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFSCxnQkFBUSxDQUFDLEdBQVMsRUFBRTs7O2dCQUNsQixLQUFzQixJQUFBLGFBQUEsY0FBQSxRQUFRLENBQUEsY0FBQTtvQkFBbkIsTUFBTSxDQUFDLHFCQUFBLENBQUE7O3dCQUNoQixLQUE0QixJQUFBLEtBQUEsY0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBLElBQUE7NEJBQWxDLE1BQU0sT0FBTyxXQUFBLENBQUE7NEJBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7eUJBQ3JCOzs7Ozs7Ozs7aUJBQ0Y7Ozs7Ozs7OztZQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNkLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFTLEVBQUU7O1FBQ3JELE1BQU0sUUFBUSxHQUF1QjtZQUNuQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTs7b0JBQ3RCLG9CQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFBLENBQUE7Z0JBQ3hDLENBQUM7YUFBQTtTQUNGLENBQUE7UUFFRCxNQUFNLElBQUksR0FBRyx1Q0FBVSxDQUFDLHFCQUFJLENBQUMsdUNBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSw4QkFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTs7WUFDNUQsS0FBc0IsSUFBQSxTQUFBLGNBQUEsSUFBSSxDQUFBLFVBQUE7Z0JBQWYsTUFBTSxDQUFDLGlCQUFBLENBQUE7O29CQUNoQixLQUE2QixJQUFBLEtBQUEsY0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBLElBQUE7d0JBQW5DLE1BQU0sUUFBUSxXQUFBLENBQUE7d0JBQ3ZCLGFBQU0sQ0FBRSxRQUFnQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7cUJBQ2hGOzs7Ozs7Ozs7YUFDRjs7Ozs7Ozs7O0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBtb2NoYSAqL1xuXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0ICdtb2NoYSdcbmltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknXG5pbXBvcnQgeyBLc25FbmNvZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMva2l0c3VuZXQva3NuLWVuY29kZXInXG5pbXBvcnQgcHVsbCBmcm9tICdwdWxsLXN0cmVhbSdcbmltcG9ydCBwdXNoYWJsZSBmcm9tICdwdWxsLXB1c2hhYmxlJ1xuaW1wb3J0IGxwIGZyb20gJ3B1bGwtbGVuZ3RoLXByZWZpeGVkJ1xuaW1wb3J0IHRvUHVsbCBmcm9tICdhc3luYy1pdGVyYXRvci10by1wdWxsLXN0cmVhbSdcbmltcG9ydCB0b0l0ZXJhdG9yIGZyb20gJ3B1bGwtc3RyZWFtLXRvLWFzeW5jLWl0ZXJhdG9yJ1xuXG5pbXBvcnQge1xuICBNc2dUeXBlLFxuICBSZXNwb25zZVN0YXR1cyxcbiAgTm9kZVR5cGVcbn0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldCdcbmltcG9ydCB7IG5leHRUaWNrIH0gZnJvbSAnYXN5bmMnXG5cbmNvbnN0IGlkZW50aWZ5TXNnID0ge1xuICB0eXBlOiBNc2dUeXBlLklERU5USUZZLFxuICBzdGF0dXM6IFJlc3BvbnNlU3RhdHVzLk9LLFxuICBwYXlsb2FkOiB7XG4gICAgaWRlbnRpZnk6IHtcbiAgICAgIHZlcnNpb25zOiBbJzEuMC4wJ10sXG4gICAgICB1c2VyQWdlbnQ6ICdrc24tY2xpZW50JyxcbiAgICAgIG5vZGVUeXBlOiBOb2RlVHlwZS5OT0RFLFxuICAgICAgbGF0ZXN0QmxvY2s6IEJ1ZmZlci5mcm9tKFswXSksXG4gICAgICBzbGljZUlkczogW11cbiAgICAgIC8vIHNsaWNlSWRzOiB0aGlzLm5ldHdvcmtQcm92aWRlci5nZXRTbGljZUlkcygpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGhleEVuY29kZWQgPSAnMDgwMTEwMDEyMjFhMGExODBhMDUzMTJlMzAyZTMwMTIwYTZiNzM2ZTJkNjM2YzY5NjU2ZTc0MTgwMTIyMDEwMCdcbmNvbnN0IGhleEVuY29kZWRMcCA9ICcyMDA4MDExMDAxMjIxYTBhMTgwYTA1MzEyZTMwMmUzMDEyMGE2YjczNmUyZDYzNmM2OTY1NmU3NDE4MDEyMjAxMDAnXG5cbmRlc2NyaWJlKCdrc24gZW5jb2RlcicsICgpID0+IHtcbiAgY29uc3QgZW5jb2RlciA9IG5ldyBLc25FbmNvZGVyKClcblxuICBpdCgnc2hvdWxkIGVuY29kZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgeWllbGQgaWRlbnRpZnlNc2dcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgYXdhaXQgKGNvbnN0IG0gb2YgcmVhZGFibGUpIHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgZW5jb2RlZCBvZiBlbmNvZGVyLmVuY29kZShtKSkge1xuICAgICAgICBleHBlY3QoZW5jb2RlZCkudG8uYmUuaW5zdGFuY2VPZihCdWZmZXIpXG4gICAgICAgIGV4cGVjdCgoZW5jb2RlZCBhcyBCdWZmZXIpLnRvU3RyaW5nKCdoZXgnKSkudG8uZXEoaGV4RW5jb2RlZClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBkZWNvZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVhZGFibGU6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHlpZWxkIEJ1ZmZlci5mcm9tKGhleEVuY29kZWQsICdoZXgnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiByZWFkYWJsZSkge1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBkZWNvZGVkIG9mIGVuY29kZXIuZGVjb2RlKG0pKSB7XG4gICAgICAgIGV4cGVjdCgoZGVjb2RlZCBhcyBhbnkpLnBheWxvYWQuaWRlbnRpZnkpLnRvLmVxbChpZGVudGlmeU1zZy5wYXlsb2FkLmlkZW50aWZ5KVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBpdCgnc2hvdWxkIGVuY29kZSBhbmQgcHVsbC1zdHJlYW0nLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBpZGVudGlmeU1zZ1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0cmVhbSA9IHB1c2hhYmxlKClcbiAgICBwdWxsKHN0cmVhbSwgcHVsbC5jb2xsZWN0KChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIGRvbmUoZXJyKVxuICAgICAgZXhwZWN0KGRhdGFbMF0udG9TdHJpbmcoJ2hleCcpKS50by5lcShoZXhFbmNvZGVkKVxuICAgICAgZG9uZSgpXG4gICAgfSkpXG5cbiAgICBuZXh0VGljayhhc3luYyAoKSA9PiB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IG0gb2YgcmVhZGFibGUpIHtcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBlbmNvZGVkIG9mIGVuY29kZXIuZW5jb2RlKG0pKSB7XG4gICAgICAgICAgc3RyZWFtLnB1c2goZW5jb2RlZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RyZWFtLmVuZCgpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGRlY29kZSBhbmQgcHVsbC1zdHJlYW0nLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBCdWZmZXIuZnJvbShoZXhFbmNvZGVkLCAnaGV4JylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdHJlYW0gPSBwdXNoYWJsZSgpXG4gICAgcHVsbChzdHJlYW0sIHB1bGwuY29sbGVjdCgoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSBkb25lKGVycilcbiAgICAgIGV4cGVjdChkYXRhWzBdLnBheWxvYWQuaWRlbnRpZnkpLnRvLmVxbChpZGVudGlmeU1zZy5wYXlsb2FkLmlkZW50aWZ5KVxuICAgICAgZG9uZSgpXG4gICAgfSkpXG5cbiAgICBuZXh0VGljayhhc3luYyAoKSA9PiB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IG0gb2YgcmVhZGFibGUpIHtcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBlbmNvZGVkIG9mIGVuY29kZXIuZGVjb2RlKG0pKSB7XG4gICAgICAgICAgc3RyZWFtLnB1c2goZW5jb2RlZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RyZWFtLmVuZCgpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGVuY29kZSBhbmQgcHVsbC1zdHJlYW0gd2l0aCBscCcsIChkb25lKSA9PiB7XG4gICAgY29uc3QgcmVhZGFibGU6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHlpZWxkIGlkZW50aWZ5TXNnXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyZWFtID0gcHVzaGFibGUoKVxuICAgIHB1bGwoc3RyZWFtLCBscC5lbmNvZGUoKSwgcHVsbC5jb2xsZWN0KChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIGRvbmUoZXJyKVxuICAgICAgZXhwZWN0KGRhdGFbMF0udG9TdHJpbmcoJ2hleCcpKS50by5lcShoZXhFbmNvZGVkTHApXG4gICAgICBkb25lKClcbiAgICB9KSlcblxuICAgIG5leHRUaWNrKGFzeW5jICgpID0+IHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiByZWFkYWJsZSkge1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGVuY29kZWQgb2YgZW5jb2Rlci5lbmNvZGUobSkpIHtcbiAgICAgICAgICBzdHJlYW0ucHVzaChlbmNvZGVkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdHJlYW0uZW5kKClcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZGVjb2RlIGFuZCBwdWxsLXN0cmVhbSB3aXRoIGxwJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBCdWZmZXIuZnJvbShoZXhFbmNvZGVkTHAsICdoZXgnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhdG9yKHB1bGwodG9QdWxsKHJlYWRhYmxlKSwgbHAuZGVjb2RlKCkpKVxuICAgIGZvciBhd2FpdCAoY29uc3QgbSBvZiBpdGVyKSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGRlY2NvZGVkIG9mIGVuY29kZXIuZGVjb2RlKG0pKSB7XG4gICAgICAgIGV4cGVjdCgoZGVjY29kZWQgYXMgYW55KS5wYXlsb2FkLmlkZW50aWZ5KS50by5lcWwoaWRlbnRpZnlNc2cucGF5bG9hZC5pZGVudGlmeSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuIl19