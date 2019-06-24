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
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const ethereumjs_common_1 = __importDefault(require("ethereumjs-common"));
const bn_js_1 = __importDefault(require("bn.js"));
const events_1 = require("events");
const chai_1 = require("chai");
const eth_1 = require("../../../../src/net/protocols/eth");
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const handlers_1 = require("../../../../src/net/protocols/eth/handlers");
const jsonBlock = __importStar(require("../../../fixtures/block.json"));
const fromRpc = require("ethereumjs-block/from-rpc");
const block = new ethereumjs_block_1.default(fromRpc(jsonBlock.block));
const passthroughEncoder = {
    encode: function (msg) { return __asyncGenerator(this, arguments, function* () { yield yield __await(msg); }); },
    decode: function (msg) { return __asyncGenerator(this, arguments, function* () { yield yield __await(msg); }); }
};
describe('Eth protocol', () => {
    describe('setup', () => {
        let ethProtocol;
        beforeEach(() => {
            ethProtocol = new eth_1.EthProtocol({}, new events_1.EventEmitter(), {
                getBlocksTD: () => Buffer.from([0]),
                getBestBlock: () => block,
                common: new ethereumjs_common_1.default('mainnet')
            }, passthroughEncoder);
        });
        it('should have correct protocol id', () => {
            chai_1.expect(ethProtocol.id).to.eql('eth');
        });
        it('should have correct protocol versions', () => {
            chai_1.expect(ethProtocol.versions).to.eql(['62', '63']);
        });
    });
    describe('handlers - handle', () => {
        let ethProtocol;
        let provider = new events_1.EventEmitter();
        provider.send = () => [];
        const chain = {
            getBlocksTD: () => Buffer.from([0]),
            getBestBlock: () => block,
            common: new ethereumjs_common_1.default('mainnet')
        };
        beforeEach(() => {
            ethProtocol = new eth_1.EthProtocol({}, provider, chain, passthroughEncoder);
        });
        it('should handle Status request', () => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await([ethereumjs_devp2p_1.ETH.MESSAGE_CODES.STATUS, 0, 0, new bn_js_1.default(0), Buffer.from([0]), '0x0', new bn_js_1.default(0)]);
                    });
                }
            };
            try {
                // eslint-disable-next-line no-unused-vars
                for (var _b = __asyncValues(ethProtocol.receive(source)), _c; _c = yield _b.next(), !_c.done;) {
                    const _ = _c.value;
                    const status = {
                        protocolVersion: 0,
                        networkId: 0,
                        td: new bn_js_1.default(0),
                        bestHash: Buffer.from([0]),
                        genesisHash: '0x0',
                        number: new bn_js_1.default(0)
                    };
                    chai_1.expect(yield ethProtocol.getStatus()).to.eql(status);
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
        it('should handle block headers request', () => __awaiter(this, void 0, void 0, function* () {
            var e_2, _d;
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await([ethereumjs_devp2p_1.ETH.MESSAGE_CODES.BLOCK_HEADERS, block.header.raw]);
                    });
                }
            };
            const msg = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                var e_3, _g;
                try {
                    for (var _h = __asyncValues(ethProtocol.getHeaders(1, 1)), _j; _j = yield _h.next(), !_j.done;) {
                        const msg = _j.value;
                        return resolve(msg);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_g = _h.return)) yield _g.call(_h);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }));
            try {
                // eslint-disable-next-line no-unused-vars
                for (var _e = __asyncValues(ethProtocol.receive(source)), _f; _f = yield _e.next(), !_f.done;) {
                    const _ = _f.value;
                    return msg.then((header) => {
                        chai_1.expect(header[0].bloom).to.eql(fromRpc(jsonBlock.block).header.bloom);
                        chai_1.expect(header[0].coinbase).to.eql(fromRpc(jsonBlock.block).header.coinbase);
                        chai_1.expect(header[0].difficulty).to.eql(fromRpc(jsonBlock.block).header.difficulty);
                        chai_1.expect(header[0].extraData).to.eql(fromRpc(jsonBlock.block).header.extraData);
                        chai_1.expect(header[0].gasLimit).to.eql(fromRpc(jsonBlock.block).header.gasLimit);
                        chai_1.expect(header[0].gasUsed).to.eql(fromRpc(jsonBlock.block).header.gasUsed);
                        chai_1.expect(header[0].mixHash).to.eql(fromRpc(jsonBlock.block).header.mixHash);
                        chai_1.expect(header[0].nonce).to.eql(fromRpc(jsonBlock.block).header.nonce);
                        chai_1.expect(header[0].number).to.eql(fromRpc(jsonBlock.block).header.number);
                        chai_1.expect(header[0].parentHash).to.eql(fromRpc(jsonBlock.block).header.parentHash);
                        chai_1.expect(header[0].raw).to.eql(fromRpc(jsonBlock.block).header.raw);
                        chai_1.expect(header[0].receiptTrie).to.eql(fromRpc(jsonBlock.block).header.receiptTrie);
                        chai_1.expect(header[0].stateRoot).to.eql(fromRpc(jsonBlock.block).header.stateRoot);
                        chai_1.expect(header[0].timestamp).to.eql(fromRpc(jsonBlock.block).header.timestamp);
                    });
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
        it('should handle GetBlockHeaders request using block number', () => __awaiter(this, void 0, void 0, function* () {
            var e_4, _k;
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await([
                            ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS,
                            new bn_js_1.default(block.header.number).toArrayLike(Buffer), 20, 0, 0
                        ]);
                    });
                }
            };
            ethProtocol.handlers[ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS] = {
                handle: (...msg) => chai_1.expect(msg).to.eql([
                    (new bn_js_1.default(block.header.number)).toArrayLike(Buffer), 20, 0, 0
                ])
            };
            try {
                // eslint-disable-next-line no-unused-vars
                for (var _l = __asyncValues(ethProtocol.receive(source)), _m; _m = yield _l.next(), !_m.done;) {
                    const _ = _m.value;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_k = _l.return)) yield _k.call(_l);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }));
        it('should handle GetBlockHeaders request using block hash', () => __awaiter(this, void 0, void 0, function* () {
            var e_5, _o;
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await([
                            ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS,
                            block.header.hash(), 20, 0, 0
                        ]);
                    });
                }
            };
            ethProtocol.handlers[ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS] = {
                handle: (...msg) => chai_1.expect(msg).to.eql([
                    block.header.hash(), 20, 0, 0
                ])
            };
            try {
                // eslint-disable-next-line no-unused-vars
                for (var _p = __asyncValues(ethProtocol.receive(source)), _q; _q = yield _p.next(), !_q.done;) {
                    const _ = _q.value;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_o = _p.return)) yield _o.call(_p);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }));
        it('should handle NewBlockHashes request', () => __awaiter(this, void 0, void 0, function* () {
            var e_6, _r;
            const source = {
                [Symbol.asyncIterator]: function () {
                    return __asyncGenerator(this, arguments, function* () {
                        yield yield __await([
                            ethereumjs_devp2p_1.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, [block.header.hash(), block.header.number]
                        ]);
                    });
                }
            };
            ethProtocol.on('new-block-hashes', (newBlocks) => {
                chai_1.expect(newBlocks[0]).to.eql([block.header.hash(), new bn_js_1.default(block.header.number)]);
            });
            try {
                for (var _s = __asyncValues(ethProtocol.receive(source)), _t; _t = yield _s.next(), !_t.done;) {
                    const msg = _t.value;
                    chai_1.expect(msg[0]).to.eql([block.header.hash(), new bn_js_1.default(block.header.number)]);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_r = _s.return)) yield _r.call(_s);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }));
    });
    describe('handles - request', () => {
        let sendHandler;
        let receiveHandler;
        const networkProvider = {
            send: function (msg) {
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
        let ethProtocol;
        beforeEach(() => {
            ethProtocol = new eth_1.EthProtocol({}, networkProvider, {
                getBlocksTD: () => Buffer.from([0]),
                getBestBlock: () => block,
                common: new ethereumjs_common_1.default('mainnet')
            }, passthroughEncoder);
        });
        it('should send Status request', () => __awaiter(this, void 0, void 0, function* () {
            sendHandler = (msg) => {
                const [msgId, request] = msg;
                const [protocolVersion, networkId, td, bestHash, genesisHash] = request;
                chai_1.expect(msgId).to.eql(ethereumjs_devp2p_1.ETH.MESSAGE_CODES.STATUS);
                chai_1.expect(protocolVersion).to.eql(Buffer.from([0]));
                chai_1.expect(networkId).to.eql(Buffer.from([0]));
                chai_1.expect(td).to.eql(new bn_js_1.default(Buffer.from([0])).toArrayLike(Buffer));
                chai_1.expect(bestHash).to.eql(Buffer.from([0]));
                chai_1.expect(genesisHash).to.eql(Buffer.from('0', 'hex'));
            };
            const status = new handlers_1.Status(ethProtocol, {});
            yield status.send(0, 0, new bn_js_1.default(0), Buffer.from([0]), '0x0');
        }));
        it('should send GetBlockHeaders request using block number', () => __awaiter(this, void 0, void 0, function* () {
            sendHandler = (msg) => {
                const [msgId, req] = msg;
                const [_block, max, skip, reverse] = req;
                chai_1.expect(msgId).to.eql(ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS);
                chai_1.expect(_block).to.eql(block.header.number);
                chai_1.expect(max).to.eql(20);
                chai_1.expect(skip).to.eql(0);
                chai_1.expect(reverse).to.eql(0);
            };
            const getBlockHeaders = new handlers_1.GetBlockHeaders(ethProtocol, {});
            yield getBlockHeaders.send(new bn_js_1.default(block.header.number), 20, 0, false);
        }));
        it('should send GetBlockHeaders request using block hash', () => __awaiter(this, void 0, void 0, function* () {
            sendHandler = (msg) => {
                const [msgId, res] = msg;
                const [_block, max, skip, reverse] = res;
                chai_1.expect(msgId).to.eql(ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS);
                chai_1.expect(_block).to.eql(block.header.hash());
                chai_1.expect(max).to.eql(20);
                chai_1.expect(skip).to.eql(0);
                chai_1.expect(reverse).to.eql(0);
            };
            const getBlockHeaders = new handlers_1.GetBlockHeaders(ethProtocol, {});
            yield getBlockHeaders.send(block.header.hash(), 20, 0, false);
        }));
        it('should send BlockHeaders', () => __awaiter(this, void 0, void 0, function* () {
            sendHandler = (msg) => {
                chai_1.expect(msg[0]).to.eq(ethereumjs_devp2p_1.ETH.MESSAGE_CODES.BLOCK_HEADERS);
                chai_1.expect(msg[1][0]).to.eql(fromRpc(jsonBlock.block).header.raw);
            };
            ethProtocol.ethChain.getHeaders = () => __awaiter(this, void 0, void 0, function* () { return [fromRpc(jsonBlock.block).header]; });
            const blockHeaders = new handlers_1.BlockHeaders(ethProtocol, {});
            yield blockHeaders.send(fromRpc(jsonBlock.block).header, 0, 1, false);
        }));
        it('should send NewBlockHashes', () => __awaiter(this, void 0, void 0, function* () {
            sendHandler = (msg) => {
                chai_1.expect(msg[0]).to.eq(ethereumjs_devp2p_1.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES);
                chai_1.expect(msg[1][0]).to.eql([
                    fromRpc(jsonBlock.block).header.hash(),
                    (new bn_js_1.default(fromRpc(jsonBlock.block).header.number)).toArrayLike(Buffer)
                ]);
            };
            const newBlockHashes = new handlers_1.NewBlockHashes(ethProtocol, {});
            yield newBlockHashes.send([
                fromRpc(jsonBlock.block).header.hash(),
                new bn_js_1.default(fromRpc(jsonBlock.block).header.number)
            ]);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZXN0L25ldC9wcm90b2NvbHMvZXRoL3Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUV0QixZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGlCQUFjO0FBQ2Qsd0VBQW9DO0FBQ3BDLDBFQUFzQztBQUN0QyxrREFBc0I7QUFDdEIsbUNBQTJDO0FBQzNDLCtCQUE2QjtBQUM3QiwyREFBK0Q7QUFDL0QseURBQXVDO0FBUXZDLHlFQUttRDtBQUVuRCx3RUFBeUQ7QUFDekQscURBQXFEO0FBQ3JELE1BQU0sS0FBSyxHQUFVLElBQUksMEJBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFFeEQsTUFBTSxrQkFBa0IsR0FBYTtJQUNuQyxNQUFNLEVBQUUsVUFBdUIsR0FBRyw0REFBSSxvQkFBTSxHQUFHLENBQUEsQ0FBQSxDQUFDLENBQUMsSUFBQTtJQUNqRCxNQUFNLEVBQUUsVUFBdUIsR0FBRyw0REFBSSxvQkFBTSxHQUFHLENBQUEsQ0FBQSxDQUFDLENBQUMsSUFBQTtDQUNsRCxDQUFBO0FBRUQsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDckIsSUFBSSxXQUFXLENBQUE7UUFDZixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsV0FBVyxHQUFHLElBQUksaUJBQVcsQ0FBQyxFQUEwQixFQUMxQixJQUFJLHFCQUFFLEVBQTBCLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLO2dCQUN6QixNQUFNLEVBQUUs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QUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7d0JBQzdFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTt3QkFDM0UsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO3dCQUN6RSxhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7d0JBQ3pFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDckUsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dCQUN2RSxhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFN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QUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDckUsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1lBRUQsTUFBTSxjQUFjLEdBQXdCLElBQUkseUJBQWMsQ0FBQyxXQUFXLEVBQUUsRUFBMEIsQ0FBQyxDQUFBO1lBQ3ZHLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQztnQkFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUN0QyxJQUFJLGVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDL0MsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG1vY2hhICovXG5cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgJ21vY2hhJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSdcbmltcG9ydCB7IEV0aFByb3RvY29sIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoJ1xuaW1wb3J0IHsgRVRIIH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5cbmltcG9ydCB7XG4gIElQZWVyRGVzY3JpcHRvcixcbiAgSUVuY29kZXIsXG4gIE5vZGVcbn0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldCdcblxuaW1wb3J0IHtcbiAgR2V0QmxvY2tIZWFkZXJzLFxuICBCbG9ja0hlYWRlcnMsXG4gIE5ld0Jsb2NrSGFzaGVzLFxuICBTdGF0dXNcbn0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2hhbmRsZXJzJ1xuXG5pbXBvcnQgKiBhcyBqc29uQmxvY2sgZnJvbSAnLi4vLi4vLi4vZml4dHVyZXMvYmxvY2suanNvbidcbmltcG9ydCBmcm9tUnBjID0gcmVxdWlyZSgnZXRoZXJldW1qcy1ibG9jay9mcm9tLXJwYycpXG5jb25zdCBibG9jazogQmxvY2sgPSBuZXcgQmxvY2soZnJvbVJwYyhqc29uQmxvY2suYmxvY2spKVxuXG5jb25zdCBwYXNzdGhyb3VnaEVuY29kZXI6IElFbmNvZGVyID0ge1xuICBlbmNvZGU6IGFzeW5jIGZ1bmN0aW9uKiA8VCwgVT4obXNnKSB7IHlpZWxkIG1zZyB9LFxuICBkZWNvZGU6IGFzeW5jIGZ1bmN0aW9uKiA8VCwgVT4obXNnKSB7IHlpZWxkIG1zZyB9XG59XG5cbmRlc2NyaWJlKCdFdGggcHJvdG9jb2wnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdzZXR1cCcsICgpID0+IHtcbiAgICBsZXQgZXRoUHJvdG9jb2xcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGV0aFByb3RvY29sID0gbmV3IEV0aFByb3RvY29sKHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVFKCkgYXMgdW5rbm93biBhcyBOb2RlPGFueT4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmxvY2tzVEQ6ICgpID0+IEJ1ZmZlci5mcm9tKFswXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEJlc3RCbG9jazogKCkgPT4gYmxvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbjogbmV3IENvbW1vbignbWFpbm5ldCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N0aHJvdWdoRW5jb2RlcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgcHJvdG9jb2wgaWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXRoUHJvdG9jb2wuaWQpLnRvLmVxbCgnZXRoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgcHJvdG9jb2wgdmVyc2lvbnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXRoUHJvdG9jb2wudmVyc2lvbnMpLnRvLmVxbChbJzYyJywgJzYzJ10pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnaGFuZGxlcnMgLSBoYW5kbGUnLCAoKSA9PiB7XG4gICAgbGV0IGV0aFByb3RvY29sOiBFdGhQcm90b2NvbDxhbnk+XG4gICAgbGV0IHByb3ZpZGVyOiBhbnkgPSBuZXcgRUUoKVxuICAgIHByb3ZpZGVyLnNlbmQgPSAoKSA9PiBbXVxuXG4gICAgY29uc3QgY2hhaW46IGFueSA9IHtcbiAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBCdWZmZXIuZnJvbShbMF0pLFxuICAgICAgZ2V0QmVzdEJsb2NrOiAoKSA9PiBibG9jayxcbiAgICAgIGNvbW1vbjogbmV3IENvbW1vbignbWFpbm5ldCcpXG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBldGhQcm90b2NvbCA9IG5ldyBFdGhQcm90b2NvbCh7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PiwgcHJvdmlkZXIsIGNoYWluLCBwYXNzdGhyb3VnaEVuY29kZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIFN0YXR1cyByZXF1ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgW0VUSC5NRVNTQUdFX0NPREVTLlNUQVRVUywgMCwgMCwgbmV3IEJOKDApLCBCdWZmZXIuZnJvbShbMF0pLCAnMHgwJywgbmV3IEJOKDApXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBfIG9mIGV0aFByb3RvY29sLnJlY2VpdmUoc291cmNlKSkge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSB7XG4gICAgICAgICAgcHJvdG9jb2xWZXJzaW9uOiAwLFxuICAgICAgICAgIG5ldHdvcmtJZDogMCxcbiAgICAgICAgICB0ZDogbmV3IEJOKDApLFxuICAgICAgICAgIGJlc3RIYXNoOiBCdWZmZXIuZnJvbShbMF0pLFxuICAgICAgICAgIGdlbmVzaXNIYXNoOiAnMHgwJyxcbiAgICAgICAgICBudW1iZXI6IG5ldyBCTigwKVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0KGF3YWl0IGV0aFByb3RvY29sLmdldFN0YXR1cygpKS50by5lcWwoc3RhdHVzKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBibG9jayBoZWFkZXJzIHJlcXVlc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2U6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICB5aWVsZCBbRVRILk1FU1NBR0VfQ09ERVMuQkxPQ0tfSEVBREVSUywgYmxvY2suaGVhZGVyLnJhd11cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtc2c6IFByb21pc2U8QmxvY2suSGVhZGVyW10+ID0gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2YgZXRoUHJvdG9jb2wuZ2V0SGVhZGVycygxLCAxKSkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKG1zZylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IF8gb2YgZXRoUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICAgIHJldHVybiBtc2cudGhlbigoaGVhZGVyOiBCbG9jay5IZWFkZXJbXSkgPT4ge1xuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uYmxvb20pLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmJsb29tKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uY29pbmJhc2UpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmNvaW5iYXNlKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uZGlmZmljdWx0eSkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuZGlmZmljdWx0eSlcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLmV4dHJhRGF0YSkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuZXh0cmFEYXRhKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uZ2FzTGltaXQpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmdhc0xpbWl0KVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uZ2FzVXNlZCkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuZ2FzVXNlZClcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLm1peEhhc2gpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLm1peEhhc2gpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5ub25jZSkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIubm9uY2UpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5udW1iZXIpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLm51bWJlcilcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLnBhcmVudEhhc2gpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLnBhcmVudEhhc2gpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5yYXcpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLnJhdylcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLnJlY2VpcHRUcmllKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5yZWNlaXB0VHJpZSlcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLnN0YXRlUm9vdCkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuc3RhdGVSb290KVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0udGltZXN0YW1wKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci50aW1lc3RhbXApXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEdldEJsb2NrSGVhZGVycyByZXF1ZXN0IHVzaW5nIGJsb2NrIG51bWJlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIHlpZWxkIFtcbiAgICAgICAgICAgIEVUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19IRUFERVJTLFxuICAgICAgICAgICAgbmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpLnRvQXJyYXlMaWtlKEJ1ZmZlciksIDIwLCAwLCAwXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV0aFByb3RvY29sLmhhbmRsZXJzW0VUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19IRUFERVJTXSA9IHtcbiAgICAgICAgaGFuZGxlOiAoLi4ubXNnKSA9PiBleHBlY3QobXNnKS50by5lcWwoW1xuICAgICAgICAgIChuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcikpLnRvQXJyYXlMaWtlKEJ1ZmZlciksIDIwLCAwLCAwXG4gICAgICAgIF0pXG4gICAgICB9IGFzIGFueVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgXyBvZiBldGhQcm90b2NvbC5yZWNlaXZlKHNvdXJjZSkpIHtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgR2V0QmxvY2tIZWFkZXJzIHJlcXVlc3QgdXNpbmcgYmxvY2sgaGFzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIHlpZWxkIFtcbiAgICAgICAgICAgIEVUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19IRUFERVJTLFxuICAgICAgICAgICAgYmxvY2suaGVhZGVyLmhhc2goKSwgMjAsIDAsIDBcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXRoUHJvdG9jb2wuaGFuZGxlcnNbRVRILk1FU1NBR0VfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlNdID0ge1xuICAgICAgICBoYW5kbGU6ICguLi5tc2cpID0+IGV4cGVjdChtc2cpLnRvLmVxbChbXG4gICAgICAgICAgYmxvY2suaGVhZGVyLmhhc2goKSwgMjAsIDAsIDBcbiAgICAgICAgXSlcbiAgICAgIH0gYXMgYW55XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBfIG9mIGV0aFByb3RvY29sLnJlY2VpdmUoc291cmNlKSkge1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBOZXdCbG9ja0hhc2hlcyByZXF1ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgW1xuICAgICAgICAgICAgRVRILk1FU1NBR0VfQ09ERVMuTkVXX0JMT0NLX0hBU0hFUywgW2Jsb2NrLmhlYWRlci5oYXNoKCksIGJsb2NrLmhlYWRlci5udW1iZXJdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV0aFByb3RvY29sLm9uKCduZXctYmxvY2staGFzaGVzJywgKG5ld0Jsb2NrcykgPT4ge1xuICAgICAgICBleHBlY3QobmV3QmxvY2tzWzBdKS50by5lcWwoW2Jsb2NrLmhlYWRlci5oYXNoKCksIG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKV0pXG4gICAgICB9KVxuXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBldGhQcm90b2NvbC5yZWNlaXZlKHNvdXJjZSkgYXMgYW55KSB7XG4gICAgICAgIGV4cGVjdChtc2dbMF0pLnRvLmVxbChbYmxvY2suaGVhZGVyLmhhc2goKSwgbmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpXSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdoYW5kbGVzIC0gcmVxdWVzdCcsICgpID0+IHtcbiAgICBsZXQgc2VuZEhhbmRsZXI6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkXG4gICAgbGV0IHJlY2VpdmVIYW5kbGVyOiAobXNnOiBhbnkpID0+IEFzeW5jSXRlcmFibGU8YW55PiB8IHVuZGVmaW5lZFxuICAgIGNvbnN0IG5ldHdvcmtQcm92aWRlcjogYW55ID0ge1xuICAgICAgc2VuZDogYXN5bmMgZnVuY3Rpb24gPFQsIFU+IChtc2c6IFQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gc2VuZEhhbmRsZXIgPyBzZW5kSGFuZGxlcihtc2cpIDogbXNnXG4gICAgICB9LFxuICAgICAgcmVjZWl2ZTogYXN5bmMgZnVuY3Rpb24qIDxULCBVPihyZWFkYWJsZTogQXN5bmNJdGVyYWJsZTxUPik6IEFzeW5jSXRlcmFibGU8VSB8IFVbXT4ge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZUhhbmRsZXIgPyByZWNlaXZlSGFuZGxlcihyZWFkYWJsZSkgOiByZWNlaXZlSGFuZGxlclxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBldGhQcm90b2NvbDogRXRoUHJvdG9jb2w8YW55PlxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZXRoUHJvdG9jb2wgPSBuZXcgRXRoUHJvdG9jb2woe30gYXMgSVBlZXJEZXNjcmlwdG9yPGFueT4sXG4gICAgICAgIG5ldHdvcmtQcm92aWRlciwge1xuICAgICAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBCdWZmZXIuZnJvbShbMF0pLFxuICAgICAgICAgIGdldEJlc3RCbG9jazogKCkgPT4gYmxvY2ssXG4gICAgICAgICAgY29tbW9uOiBuZXcgQ29tbW9uKCdtYWlubmV0JylcbiAgICAgICAgfSBhcyBhbnksXG4gICAgICAgIHBhc3N0aHJvdWdoRW5jb2RlcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIFN0YXR1cyByZXF1ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2VuZEhhbmRsZXIgPSAobXNnOiBbYW55LCBhbnldKSA9PiB7XG4gICAgICAgIGNvbnN0IFsgbXNnSWQsIHJlcXVlc3QgXSA9IG1zZ1xuICAgICAgICBjb25zdCBbcHJvdG9jb2xWZXJzaW9uLCBuZXR3b3JrSWQsIHRkLCBiZXN0SGFzaCwgZ2VuZXNpc0hhc2hdID0gcmVxdWVzdFxuICAgICAgICBleHBlY3QobXNnSWQpLnRvLmVxbChFVEguTUVTU0FHRV9DT0RFUy5TVEFUVVMpXG4gICAgICAgIGV4cGVjdChwcm90b2NvbFZlcnNpb24pLnRvLmVxbChCdWZmZXIuZnJvbShbMF0pKVxuICAgICAgICBleHBlY3QobmV0d29ya0lkKS50by5lcWwoQnVmZmVyLmZyb20oWzBdKSlcbiAgICAgICAgZXhwZWN0KHRkKS50by5lcWwobmV3IEJOKEJ1ZmZlci5mcm9tKFswXSkpLnRvQXJyYXlMaWtlKEJ1ZmZlcikpXG4gICAgICAgIGV4cGVjdChiZXN0SGFzaCkudG8uZXFsKEJ1ZmZlci5mcm9tKFswXSkpXG4gICAgICAgIGV4cGVjdChnZW5lc2lzSGFzaCkudG8uZXFsKEJ1ZmZlci5mcm9tKCcwJywgJ2hleCcpKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzdGF0dXM6IFN0YXR1czxhbnk+ID0gbmV3IFN0YXR1cyhldGhQcm90b2NvbCwge30gYXMgSVBlZXJEZXNjcmlwdG9yPGFueT4pXG4gICAgICBhd2FpdCBzdGF0dXMuc2VuZCgwLCAwLCBuZXcgQk4oMCksIEJ1ZmZlci5mcm9tKFswXSksICcweDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgR2V0QmxvY2tIZWFkZXJzIHJlcXVlc3QgdXNpbmcgYmxvY2sgbnVtYmVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2VuZEhhbmRsZXIgPSAobXNnKSA9PiB7XG4gICAgICAgIGNvbnN0IFttc2dJZCwgcmVxXSA9IG1zZ1xuICAgICAgICBjb25zdCBbX2Jsb2NrLCBtYXgsIHNraXAsIHJldmVyc2VdID0gcmVxXG4gICAgICAgIGV4cGVjdChtc2dJZCkudG8uZXFsKEVUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19IRUFERVJTKVxuICAgICAgICBleHBlY3QoX2Jsb2NrKS50by5lcWwoYmxvY2suaGVhZGVyLm51bWJlcilcbiAgICAgICAgZXhwZWN0KG1heCkudG8uZXFsKDIwKVxuICAgICAgICBleHBlY3Qoc2tpcCkudG8uZXFsKDApXG4gICAgICAgIGV4cGVjdChyZXZlcnNlKS50by5lcWwoMClcbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0QmxvY2tIZWFkZXJzOiBHZXRCbG9ja0hlYWRlcnM8YW55PiA9IG5ldyBHZXRCbG9ja0hlYWRlcnMoZXRoUHJvdG9jb2wsIHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+KVxuICAgICAgYXdhaXQgZ2V0QmxvY2tIZWFkZXJzLnNlbmQobmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpLCAyMCwgMCwgZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2VuZCBHZXRCbG9ja0hlYWRlcnMgcmVxdWVzdCB1c2luZyBibG9jayBoYXNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2VuZEhhbmRsZXIgPSAobXNnKSA9PiB7XG4gICAgICAgIGNvbnN0IFttc2dJZCwgcmVzXSA9IG1zZ1xuICAgICAgICBjb25zdCBbX2Jsb2NrLCBtYXgsIHNraXAsIHJldmVyc2VdID0gcmVzXG4gICAgICAgIGV4cGVjdChtc2dJZCkudG8uZXFsKEVUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19IRUFERVJTKVxuICAgICAgICBleHBlY3QoX2Jsb2NrKS50by5lcWwoYmxvY2suaGVhZGVyLmhhc2goKSlcbiAgICAgICAgZXhwZWN0KG1heCkudG8uZXFsKDIwKVxuICAgICAgICBleHBlY3Qoc2tpcCkudG8uZXFsKDApXG4gICAgICAgIGV4cGVjdChyZXZlcnNlKS50by5lcWwoMClcbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0QmxvY2tIZWFkZXJzOiBHZXRCbG9ja0hlYWRlcnM8YW55PiA9IG5ldyBHZXRCbG9ja0hlYWRlcnMoZXRoUHJvdG9jb2wsIHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+KVxuICAgICAgYXdhaXQgZ2V0QmxvY2tIZWFkZXJzLnNlbmQoYmxvY2suaGVhZGVyLmhhc2goKSwgMjAsIDAsIGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgQmxvY2tIZWFkZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2VuZEhhbmRsZXIgPSAobXNnKSA9PiB7XG4gICAgICAgIGV4cGVjdChtc2dbMF0pLnRvLmVxKEVUSC5NRVNTQUdFX0NPREVTLkJMT0NLX0hFQURFUlMpXG4gICAgICAgIGV4cGVjdChtc2dbMV1bMF0pLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLnJhdylcbiAgICAgIH1cblxuICAgICAgZXRoUHJvdG9jb2wuZXRoQ2hhaW4uZ2V0SGVhZGVycyA9IGFzeW5jICgpID0+IFtmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyXVxuICAgICAgY29uc3QgYmxvY2tIZWFkZXJzOiBCbG9ja0hlYWRlcnM8YW55PiA9IG5ldyBCbG9ja0hlYWRlcnMoZXRoUHJvdG9jb2wsIHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+KVxuICAgICAgYXdhaXQgYmxvY2tIZWFkZXJzLnNlbmQoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlciwgMCwgMSwgZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2VuZCBOZXdCbG9ja0hhc2hlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBleHBlY3QobXNnWzBdKS50by5lcShFVEguTUVTU0FHRV9DT0RFUy5ORVdfQkxPQ0tfSEFTSEVTKVxuICAgICAgICBleHBlY3QobXNnWzFdWzBdKS50by5lcWwoW1xuICAgICAgICAgIGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuaGFzaCgpLFxuICAgICAgICAgIChuZXcgQk4oZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5udW1iZXIpKS50b0FycmF5TGlrZShCdWZmZXIpXG4gICAgICAgIF0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld0Jsb2NrSGFzaGVzOiBOZXdCbG9ja0hhc2hlczxhbnk+ID0gbmV3IE5ld0Jsb2NrSGFzaGVzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IG5ld0Jsb2NrSGFzaGVzLnNlbmQoW1xuICAgICAgICBmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmhhc2goKSxcbiAgICAgICAgbmV3IEJOKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIubnVtYmVyKVxuICAgICAgXSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==