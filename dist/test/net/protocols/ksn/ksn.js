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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const proto_1 = __importDefault(require("../../../../src/net/protocols/kitsunet/proto"));
const net_1 = require("../../../../src/net");
const handlers_1 = require("../../../../src/net/protocols/kitsunet/handlers");
const jsonBlock = __importStar(require("../../../fixtures/block.json"));
const bn_js_1 = __importDefault(require("bn.js"));
const fromRpc = require("ethereumjs-block/from-rpc");
const { Kitsunet } = proto_1.default;
const block = new ethereumjs_block_1.default(fromRpc(jsonBlock.block));
describe('Ksn protocol', () => {
    describe('setup', () => {
        let ksnProtocol;
        beforeEach(() => {
            ksnProtocol = new net_1.KsnProtocol({}, {}, {});
        });
        it('should have correct protocol id', () => {
            chai_1.expect(ksnProtocol.id).to.eql('ksn');
        });
        it('should have correct protocol versions', () => {
            chai_1.expect(ksnProtocol.versions).to.eql(['1.0.0']);
        });
    });
    describe('handlers - handle', () => {
        let ksnProtocol;
        beforeEach(() => {
            ksnProtocol = new net_1.KsnProtocol({}, {}, { getLatestBlock: () => __awaiter(this, void 0, void 0, function* () { return block; }) });
        });
        it('should handle Identify request', () => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const identify = {
                type: net_1.MsgType.IDENTIFY,
                status: net_1.ResponseStatus.OK,
                payload: {
                    identify: {
                        versions: ['1.0.0'],
                        userAgent: 'ksn-client',
                        nodeType: net_1.NodeType.NODE,
                        latestBlock: new bn_js_1.default(0).toBuffer()
                        // sliceIds: this.networkProvider.getSliceIds()
                    }
                }
            };
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await(Kitsunet.encode(identify));
                    });
                }
            };
            try {
                for (var _b = __asyncValues(ksnProtocol.receive(source)), _c; _c = yield _b.next(), !_c.done;) {
                    const msg = _c.value;
                    chai_1.expect(msg.payload).to.deep.eq(identify.payload);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }));
        it('should handle Ping request', () => __awaiter(this, void 0, void 0, function* () {
            var e_2, _d;
            const ping = {
                type: net_1.MsgType.PING,
                status: net_1.ResponseStatus.OK
            };
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await(Kitsunet.encode(ping));
                    });
                }
            };
            try {
                for (var _e = __asyncValues(ksnProtocol.receive(source)), _f; _f = yield _e.next(), !_f.done;) {
                    const msg = _f.value;
                    chai_1.expect(msg).to.deep.eq(ping);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) yield _d.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }));
    });
    describe('handles - request', () => {
        let sendHandler;
        let receiveHandler;
        const networkProvider = {
            send: function (msg, protocol, peer) {
                return __awaiter(this, void 0, void 0, function* () {
                    return sendHandler ? sendHandler(msg) : msg;
                });
            },
            receive: function (readable) {
                return __asyncGenerator(this, arguments, function* () {
                    return yield __await(receiveHandler ? receiveHandler(readable) : receiveHandler);
                });
            }
        };
        let ksnProtocol;
        beforeEach(() => {
            ksnProtocol = new net_1.KsnProtocol({}, networkProvider, { getLatestBlock: () => __awaiter(this, void 0, void 0, function* () { return block; }) });
        });
        it('should send Identify request', () => __awaiter(this, void 0, void 0, function* () {
            const identifyMsg = {
                type: net_1.MsgType.IDENTIFY,
                status: net_1.ResponseStatus.OK,
                payload: {
                    identify: {
                        versions: ['1.0.0'],
                        userAgent: 'ksn-client',
                        nodeType: net_1.NodeType.NODE,
                        latestBlock: block.header.number,
                        sliceIds: []
                        // sliceIds: this.networkProvider.getSliceIds()
                    }
                }
            };
            sendHandler = (msg) => {
                chai_1.expect(msg).to.eql(Kitsunet.encode({ type: net_1.MsgType.IDENTIFY }));
                return Kitsunet.encode(identifyMsg);
            };
            const identify = new handlers_1.Identify(ksnProtocol, {});
            const res = yield identify.send();
            chai_1.expect(res).to.eql(identifyMsg.payload.identify);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC9uZXQvcHJvdG9jb2xzL2tzbi9rc24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0JBQXNCO0FBRXRCLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosaUJBQWM7QUFDZCwrQkFBNkI7QUFDN0Isd0VBQW9DO0FBR3BDLHlGQUFnRTtBQUVoRSw2Q0FVNEI7QUFFNUIsOEVBQTZGO0FBRTdGLHdFQUF5RDtBQUN6RCxrREFBc0I7QUFDdEIscURBQXFEO0FBQ3JELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUE7QUFDMUIsTUFBTSxLQUFLLEdBQVUsSUFBSSwwQkFBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtBQUV4RCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixJQUFJLFdBQVcsQ0FBQTtRQUNmLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEVBQWdCLEVBQ2hCLEVBQWdCLEVBQ2hCLEVBQWMsQ0FBQyxDQUFBO1FBQy9DLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxhQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLGFBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDaEQsQ0FB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LENBQUE7WUFDakMsYUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgbW9jaGEgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCAnbW9jaGEnXG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5cbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL2Jsb2NrY2hhaW4nXG5pbXBvcnQgcHJvdG8gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMva2l0c3VuZXQvcHJvdG8nXG5cbmltcG9ydCB7XG4gIElQZWVyRGVzY3JpcHRvcixcbiAgSU5ldHdvcmssXG4gIElQcm90b2NvbCxcbiAgS3NuUHJvdG9jb2wsXG4gIExpYnAycFBlZXIsXG4gIExpYnAycE5vZGUsXG4gIE1zZ1R5cGUsXG4gIFJlc3BvbnNlU3RhdHVzLFxuICBOb2RlVHlwZVxufSBmcm9tICcuLi8uLi8uLi8uLi9zcmMvbmV0J1xuXG5pbXBvcnQgeyBJZGVudGlmeSBhcyBJZGVudGlmeUhhbmRsZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9raXRzdW5ldC9oYW5kbGVycydcblxuaW1wb3J0ICogYXMganNvbkJsb2NrIGZyb20gJy4uLy4uLy4uL2ZpeHR1cmVzL2Jsb2NrLmpzb24nXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgZnJvbVJwYyA9IHJlcXVpcmUoJ2V0aGVyZXVtanMtYmxvY2svZnJvbS1ycGMnKVxuY29uc3QgeyBLaXRzdW5ldCB9ID0gcHJvdG9cbmNvbnN0IGJsb2NrOiBCbG9jayA9IG5ldyBCbG9jayhmcm9tUnBjKGpzb25CbG9jay5ibG9jaykpXG5cbmRlc2NyaWJlKCdLc24gcHJvdG9jb2wnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdzZXR1cCcsICgpID0+IHtcbiAgICBsZXQga3NuUHJvdG9jb2xcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGtzblByb3RvY29sID0gbmV3IEtzblByb3RvY29sKHt9IGFzIExpYnAycFBlZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSBhcyBMaWJwMnBOb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge30gYXMgRXRoQ2hhaW4pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHByb3RvY29sIGlkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGtzblByb3RvY29sLmlkKS50by5lcWwoJ2tzbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHByb3RvY29sIHZlcnNpb25zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGtzblByb3RvY29sLnZlcnNpb25zKS50by5lcWwoWycxLjAuMCddKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2hhbmRsZXJzIC0gaGFuZGxlJywgKCkgPT4ge1xuICAgIGxldCBrc25Qcm90b2NvbFxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAga3NuUHJvdG9jb2wgPSBuZXcgS3NuUHJvdG9jb2woe30gYXMgTGlicDJwUGVlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9IGFzIExpYnAycE5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGdldExhdGVzdEJsb2NrOiBhc3luYyAoKSA9PiBibG9jayB9IGFzIGFueSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgSWRlbnRpZnkgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGlkZW50aWZ5ID0ge1xuICAgICAgICB0eXBlOiBNc2dUeXBlLklERU5USUZZLFxuICAgICAgICBzdGF0dXM6IFJlc3BvbnNlU3RhdHVzLk9LLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgaWRlbnRpZnk6IHtcbiAgICAgICAgICAgIHZlcnNpb25zOiBbJzEuMC4wJ10sXG4gICAgICAgICAgICB1c2VyQWdlbnQ6ICdrc24tY2xpZW50JyxcbiAgICAgICAgICAgIG5vZGVUeXBlOiBOb2RlVHlwZS5OT0RFLFxuICAgICAgICAgICAgbGF0ZXN0QmxvY2s6IG5ldyBCTigwKS50b0J1ZmZlcigpXG4gICAgICAgICAgICAvLyBzbGljZUlkczogdGhpcy5uZXR3b3JrUHJvdmlkZXIuZ2V0U2xpY2VJZHMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3VyY2U6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICB5aWVsZCBLaXRzdW5ldC5lbmNvZGUoaWRlbnRpZnkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2Yga3NuUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICAgIGV4cGVjdChtc2cucGF5bG9hZCkudG8uZGVlcC5lcShpZGVudGlmeS5wYXlsb2FkKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBQaW5nIHJlcXVlc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwaW5nID0ge1xuICAgICAgICB0eXBlOiBNc2dUeXBlLlBJTkcsXG4gICAgICAgIHN0YXR1czogUmVzcG9uc2VTdGF0dXMuT0tcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgS2l0c3VuZXQuZW5jb2RlKHBpbmcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2Yga3NuUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICAgIGV4cGVjdChtc2cpLnRvLmRlZXAuZXEocGluZylcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdoYW5kbGVzIC0gcmVxdWVzdCcsICgpID0+IHtcbiAgICBsZXQgc2VuZEhhbmRsZXI6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkXG4gICAgbGV0IHJlY2VpdmVIYW5kbGVyOiAobXNnOiBhbnkpID0+IEFzeW5jSXRlcmFibGU8YW55PiB8IHVuZGVmaW5lZFxuXG4gICAgY29uc3QgbmV0d29ya1Byb3ZpZGVyOiBhbnkgPSB7XG4gICAgICBzZW5kOiBhc3luYyBmdW5jdGlvbiA8VCwgVT4gKG1zZzogVCwgcHJvdG9jb2w/OiBJUHJvdG9jb2w8YW55PiwgcGVlcj86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBzZW5kSGFuZGxlciA/IHNlbmRIYW5kbGVyKG1zZykgOiBtc2dcbiAgICAgIH0sXG4gICAgICByZWNlaXZlOiBhc3luYyBmdW5jdGlvbiogPFQsIFU+KHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KTogQXN5bmNJdGVyYWJsZTxVIHwgVVtdPiB7XG4gICAgICAgIHJldHVybiByZWNlaXZlSGFuZGxlciA/IHJlY2VpdmVIYW5kbGVyKHJlYWRhYmxlKSA6IHJlY2VpdmVIYW5kbGVyXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGtzblByb3RvY29sXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBrc25Qcm90b2NvbCA9IG5ldyBLc25Qcm90b2NvbCh7fSBhcyBMaWJwMnBQZWVyLCBuZXR3b3JrUHJvdmlkZXIsIHsgZ2V0TGF0ZXN0QmxvY2s6IGFzeW5jICgpID0+IGJsb2NrIH0gYXMgYW55KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgSWRlbnRpZnkgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGlkZW50aWZ5TXNnID0ge1xuICAgICAgICB0eXBlOiBNc2dUeXBlLklERU5USUZZLFxuICAgICAgICBzdGF0dXM6IFJlc3BvbnNlU3RhdHVzLk9LLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgaWRlbnRpZnk6IHtcbiAgICAgICAgICAgIHZlcnNpb25zOiBbJzEuMC4wJ10sXG4gICAgICAgICAgICB1c2VyQWdlbnQ6ICdrc24tY2xpZW50JyxcbiAgICAgICAgICAgIG5vZGVUeXBlOiBOb2RlVHlwZS5OT0RFLFxuICAgICAgICAgICAgbGF0ZXN0QmxvY2s6IGJsb2NrLmhlYWRlci5udW1iZXIsXG4gICAgICAgICAgICBzbGljZUlkczogW11cbiAgICAgICAgICAgIC8vIHNsaWNlSWRzOiB0aGlzLm5ldHdvcmtQcm92aWRlci5nZXRTbGljZUlkcygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBleHBlY3QobXNnKS50by5lcWwoS2l0c3VuZXQuZW5jb2RlKHsgdHlwZTogTXNnVHlwZS5JREVOVElGWSB9KSlcbiAgICAgICAgcmV0dXJuIEtpdHN1bmV0LmVuY29kZShpZGVudGlmeU1zZylcbiAgICAgIH1cblxuICAgICAgY29uc3QgaWRlbnRpZnkgPSBuZXcgSWRlbnRpZnlIYW5kbGVyKGtzblByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGlkZW50aWZ5LnNlbmQoKVxuICAgICAgZXhwZWN0KHJlcykudG8uZXFsKGlkZW50aWZ5TXNnLnBheWxvYWQuaWRlbnRpZnkpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=