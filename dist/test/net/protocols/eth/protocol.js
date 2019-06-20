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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZXN0L25ldC9wcm90b2NvbHMvZXRoL3Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUV0QixZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGlCQUFjO0FBQ2Qsd0VBQW9DO0FBQ3BDLDBFQUFzQztBQUN0QyxrREFBc0I7QUFDdEIsbUNBQTJDO0FBQzNDLCtCQUE2QjtBQUM3QiwyREFBK0Q7QUFDL0QseURBQXVDO0FBU3ZDLHlFQUttRDtBQUVuRCx3RUFBeUQ7QUFDekQscURBQXFEO0FBQ3JELE1BQU0sS0FBSyxHQUFVLElBQUksMEJBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFFeEQsTUFBTSxrQkFBa0IsR0FBYTtJQUNuQyxNQUFNLEVBQUUsVUFBdUIsR0FBRyw0REFBSSxvQkFBTSxHQUFHLENBQUEsQ0FBQSxDQUFDLENBQUMsSUFBQTtJQUNqRCxNQUFNLEVBQUUsVUFBdUIsR0FBRyw0REFBSSxvQkFBTSxHQUFHLENBQUEsQ0FBQSxDQUFDLENBQUMsSUFBQTtDQUNsRCxDQUFBO0FBRUQsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDckIsSUFBSSxXQUFXLENBQUE7UUFDZixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsV0FBVyxHQUFHLElBQUksaUJBQVcsQ0FBQyxFQUEwQixFQUMxQixJQUFJLHFCQUFFLEVBQTBCLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLO2dCQUN6QixNQUFNLEVBQUUs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QUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7d0JBQzdFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTt3QkFDM0UsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO3dCQUN6RSxhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7d0JBQ3pFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDckUsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dCQUN2RSxhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7d0JBQy9FLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTt3QkFDakUsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO3dCQUNqRixhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7d0JBQzdFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFDL0UsQ0FBQyxDQUFDLENBQUE7aUJBQ0g7Ozs7Ozs7OztRQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBUyxFQUFFOztZQUN4RSxNQUFNLE1BQU0sR0FBdUI7Z0JBQ2pDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFOzt3QkFDdEIsb0JBQU07NEJBQ0osdUJBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCOzRCQUNuQyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7eUJBQzFELENBQUEsQ0FBQTtvQkFDSCxDQUFDO2lCQUFBO2FBQ0YsQ0FBQTtZQUVELFdBQVcsQ0FBQyxRQUFRLENBQUMsdUJBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsR0FBRztnQkFDMUQsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLGFBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNyQyxDQUFDLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUM1RCxDQUFDO2FBQ0ksQ0FBQTs7Z0JBRVIsMENBQTBDO2dCQUMxQyxLQUFzQixJQUFBLEtBQUEsY0FBQSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBLElBQUE7b0JBQXRDLE1BQU0sQ0FBQyxXQUFBLENBQUE7aUJBQ2pCOzs7Ozs7Ozs7UUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQVMsRUFBRTs7WUFDdEUsTUFBTSxNQUFNLEdBQXVCO2dCQUNqQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTs7d0JBQ3RCLG9CQUFNOzRCQUNKLHVCQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQjs0QkFDbkMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7eUJBQzlCLENBQUEsQ0FBQTtvQkFDSCxDQUFDO2lCQUFBO2FBQ0YsQ0FBQTtZQUVELFdBQVcsQ0FBQyxRQUFRLENBQUMsdUJBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsR0FBRztnQkFDMUQsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLGFBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNyQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDOUIsQ0FBQzthQUNJLENBQUE7O2dCQUVSLDBDQUEwQztnQkFDMUMsS0FBc0IsSUFBQSxLQUFBLGNBQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQSxJQUFBO29CQUF0QyxNQUFNLENBQUMsV0FBQSxDQUFBO2lCQUNqQjs7Ozs7Ozs7O1FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFTLEVBQUU7O1lBQ3BELE1BQU0sTUFBTSxHQUF1QjtnQkFDakMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUU7O3dCQUN0QixvQkFBTTs0QkFDSix1QkFBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7eUJBQy9FLENBQUEsQ0FBQTtvQkFDSCxDQUFDO2lCQUFBO2FBQ0YsQ0FBQTtZQUVELFdBQVcsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDL0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2pGLENBQUMsQ0FBQyxDQUFBOztnQkFFRixLQUF3QixJQUFBLEtBQUEsY0FBQSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBUSxDQUFBLElBQUE7b0JBQS9DLE1BQU0sR0FBRyxXQUFBLENBQUE7b0JBQ2xCLGFBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDMUU7Ozs7Ozs7OztRQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsSUFBSSxXQUFpQyxDQUFBO1FBQ3JDLElBQUksY0FBNEQsQ0FBQTtRQUNoRSxNQUFNLGVBQWUsR0FBUTtZQUMzQixJQUFJLEVBQUUsVUFBdUIsR0FBTTs7b0JBQ2pDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtnQkFDN0MsQ0FBQzthQUFBO1lBQ0QsT0FBTyxFQUFFLFVBQXVCLFFBQTBCOztvQkFDeEQscUJBQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBQTtnQkFDbkUsQ0FBQzthQUFBO1NBQ0YsQ0FBQTtRQUVELElBQUksV0FBNkIsQ0FBQTtRQUNqQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsV0FBVyxHQUFHLElBQUksaUJBQVcsQ0FBQyxFQUEwQixFQUN0RCxlQUFlLEVBQUU7Z0JBQ2YsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUs7Z0JBQ3pCLE1BQU0sRUFBRSxJQUFJLDJCQUFNLENBQUMsU0FBUyxDQUFDO2FBQ3ZCLEVBQ1Isa0JBQWtCLENBQUMsQ0FBQTtRQUN2QixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFTLEVBQUU7WUFDMUMsV0FBVyxHQUFHLENBQUMsR0FBZSxFQUFFLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBRSxLQUFLLEVBQUUsT0FBTyxDQUFFLEdBQUcsR0FBRyxDQUFBO2dCQUM5QixNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLE9BQU8sQ0FBQTtnQkFDdkUsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzlDLGFBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ2hELGFBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzFDLGFBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7Z0JBQy9ELGFBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3pDLGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7WUFDckQsQ0FBQyxDQUFBO1lBRUQsTUFBTSxNQUFNLEdBQWdCLElBQUksaUJBQU0sQ0FBQyxXQUFXLEVBQUUsRUFBMEIsQ0FBQyxDQUFBO1lBQy9FLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzdELENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBUyxFQUFFO1lBQ3RFLFdBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNwQixNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtnQkFDeEIsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQTtnQkFDeEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtnQkFDekQsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDMUMsYUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQ3RCLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUN0QixhQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzQixDQUFDLENBQUE7WUFFRCxNQUFNLGVBQWUsR0FBeUIsSUFBSSwwQkFBZSxDQUFDLFdBQVcsRUFBRSxFQUEwQixDQUFDLENBQUE7WUFDMUcsTUFBTSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2RSxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNEQUFzRCxFQUFFLEdBQVMsRUFBRTtZQUNwRSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDcEIsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7Z0JBQ3hCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUE7Z0JBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHVCQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUE7Z0JBQ3pELGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFDMUMsYUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQ3RCLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUN0QixhQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzQixDQUFDLENBQUE7WUFFRCxNQUFNLGVBQWUsR0FBeUIsSUFBSSwwQkFBZSxDQUFDLFdBQVcsRUFBRSxFQUEwQixDQUFDLENBQUE7WUFDMUcsTUFBTSxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMvRCxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQVMsRUFBRTtZQUN4QyxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDcEIsYUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsdUJBQUcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQ3JELGFBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQy9ELENBQUMsQ0FBQTtZQUVELFdBQVcsQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLEdBQVMsRUFBRSxnREFBQyxPQUFBLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQSxHQUFBLENBQUE7WUFDL0UsTUFBTSxZQUFZLEdBQXNCLElBQUksdUJBQVksQ0FBQyxXQUFXLEVBQUUsRUFBMEIsQ0FBQyxDQUFBO1lBQ2pHLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3ZFLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBUyxFQUFFO1lBQzFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNwQixhQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyx1QkFBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUN4RCxhQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUN0QyxDQUFDLElBQUksZUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDckUsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1lBRUQsTUFBTSxjQUFjLEdBQXdCLElBQUkseUJBQWMsQ0FBQyxXQUFXLEVBQUUsRUFBMEIsQ0FBQyxDQUFBO1lBQ3ZHLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQztnQkFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUN0QyxJQUFJLGVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDL0MsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG1vY2hhICovXG5cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgJ21vY2hhJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSdcbmltcG9ydCB7IEV0aFByb3RvY29sIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoJ1xuaW1wb3J0IHsgRVRIIH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5cbmltcG9ydCB7XG4gIElQZWVyRGVzY3JpcHRvcixcbiAgSU5ldHdvcmssXG4gIElFbmNvZGVyLFxuICBOb2RlXG59IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQnXG5cbmltcG9ydCB7XG4gIEdldEJsb2NrSGVhZGVycyxcbiAgQmxvY2tIZWFkZXJzLFxuICBOZXdCbG9ja0hhc2hlcyxcbiAgU3RhdHVzXG59IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2V0aC9oYW5kbGVycydcblxuaW1wb3J0ICogYXMganNvbkJsb2NrIGZyb20gJy4uLy4uLy4uL2ZpeHR1cmVzL2Jsb2NrLmpzb24nXG5pbXBvcnQgZnJvbVJwYyA9IHJlcXVpcmUoJ2V0aGVyZXVtanMtYmxvY2svZnJvbS1ycGMnKVxuY29uc3QgYmxvY2s6IEJsb2NrID0gbmV3IEJsb2NrKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKSlcblxuY29uc3QgcGFzc3Rocm91Z2hFbmNvZGVyOiBJRW5jb2RlciA9IHtcbiAgZW5jb2RlOiBhc3luYyBmdW5jdGlvbiogPFQsIFU+KG1zZykgeyB5aWVsZCBtc2cgfSxcbiAgZGVjb2RlOiBhc3luYyBmdW5jdGlvbiogPFQsIFU+KG1zZykgeyB5aWVsZCBtc2cgfVxufVxuXG5kZXNjcmliZSgnRXRoIHByb3RvY29sJywgKCkgPT4ge1xuICBkZXNjcmliZSgnc2V0dXAnLCAoKSA9PiB7XG4gICAgbGV0IGV0aFByb3RvY29sXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBldGhQcm90b2NvbCA9IG5ldyBFdGhQcm90b2NvbCh7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFRSgpIGFzIHVua25vd24gYXMgTm9kZTxhbnk+LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBCdWZmZXIuZnJvbShbMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRCZXN0QmxvY2s6ICgpID0+IGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb246IG5ldyBDb21tb24oJ21haW5uZXQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzdGhyb3VnaEVuY29kZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHByb3RvY29sIGlkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV0aFByb3RvY29sLmlkKS50by5lcWwoJ2V0aCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHByb3RvY29sIHZlcnNpb25zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV0aFByb3RvY29sLnZlcnNpb25zKS50by5lcWwoWyc2MicsICc2MyddKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2hhbmRsZXJzIC0gaGFuZGxlJywgKCkgPT4ge1xuICAgIGxldCBldGhQcm90b2NvbDogRXRoUHJvdG9jb2w8YW55PlxuICAgIGxldCBwcm92aWRlcjogYW55ID0gbmV3IEVFKClcbiAgICBwcm92aWRlci5zZW5kID0gKCkgPT4gW11cblxuICAgIGNvbnN0IGNoYWluOiBhbnkgPSB7XG4gICAgICBnZXRCbG9ja3NURDogKCkgPT4gQnVmZmVyLmZyb20oWzBdKSxcbiAgICAgIGdldEJlc3RCbG9jazogKCkgPT4gYmxvY2ssXG4gICAgICBjb21tb246IG5ldyBDb21tb24oJ21haW5uZXQnKVxuICAgIH1cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZXRoUHJvdG9jb2wgPSBuZXcgRXRoUHJvdG9jb2woe30gYXMgSVBlZXJEZXNjcmlwdG9yPGFueT4sIHByb3ZpZGVyLCBjaGFpbiwgcGFzc3Rocm91Z2hFbmNvZGVyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBTdGF0dXMgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIHlpZWxkIFtFVEguTUVTU0FHRV9DT0RFUy5TVEFUVVMsIDAsIDAsIG5ldyBCTigwKSwgQnVmZmVyLmZyb20oWzBdKSwgJzB4MCcsIG5ldyBCTigwKV1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgXyBvZiBldGhQcm90b2NvbC5yZWNlaXZlKHNvdXJjZSkpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0ge1xuICAgICAgICAgIHByb3RvY29sVmVyc2lvbjogMCxcbiAgICAgICAgICBuZXR3b3JrSWQ6IDAsXG4gICAgICAgICAgdGQ6IG5ldyBCTigwKSxcbiAgICAgICAgICBiZXN0SGFzaDogQnVmZmVyLmZyb20oWzBdKSxcbiAgICAgICAgICBnZW5lc2lzSGFzaDogJzB4MCcsXG4gICAgICAgICAgbnVtYmVyOiBuZXcgQk4oMClcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdChhd2FpdCBldGhQcm90b2NvbC5nZXRTdGF0dXMoKSkudG8uZXFsKHN0YXR1cylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYmxvY2sgaGVhZGVycyByZXF1ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgW0VUSC5NRVNTQUdFX0NPREVTLkJMT0NLX0hFQURFUlMsIGJsb2NrLmhlYWRlci5yYXddXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbXNnOiBQcm9taXNlPEJsb2NrLkhlYWRlcltdPiA9IG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIGV0aFByb3RvY29sLmdldEhlYWRlcnMoMSwgMSkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShtc2cpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBfIG9mIGV0aFByb3RvY29sLnJlY2VpdmUoc291cmNlKSkge1xuICAgICAgICByZXR1cm4gbXNnLnRoZW4oKGhlYWRlcjogQmxvY2suSGVhZGVyW10pID0+IHtcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLmJsb29tKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5ibG9vbSlcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLmNvaW5iYXNlKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5jb2luYmFzZSlcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLmRpZmZpY3VsdHkpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmRpZmZpY3VsdHkpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5leHRyYURhdGEpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmV4dHJhRGF0YSlcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLmdhc0xpbWl0KS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5nYXNMaW1pdClcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLmdhc1VzZWQpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmdhc1VzZWQpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5taXhIYXNoKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5taXhIYXNoKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0ubm9uY2UpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLm5vbmNlKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0ubnVtYmVyKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5udW1iZXIpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5wYXJlbnRIYXNoKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5wYXJlbnRIYXNoKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0ucmF3KS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5yYXcpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5yZWNlaXB0VHJpZSkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIucmVjZWlwdFRyaWUpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5zdGF0ZVJvb3QpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLnN0YXRlUm9vdClcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLnRpbWVzdGFtcCkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIudGltZXN0YW1wKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBHZXRCbG9ja0hlYWRlcnMgcmVxdWVzdCB1c2luZyBibG9jayBudW1iZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2U6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICB5aWVsZCBbXG4gICAgICAgICAgICBFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSUyxcbiAgICAgICAgICAgIG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKS50b0FycmF5TGlrZShCdWZmZXIpLCAyMCwgMCwgMFxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBldGhQcm90b2NvbC5oYW5kbGVyc1tFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSU10gPSB7XG4gICAgICAgIGhhbmRsZTogKC4uLm1zZykgPT4gZXhwZWN0KG1zZykudG8uZXFsKFtcbiAgICAgICAgICAobmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpKS50b0FycmF5TGlrZShCdWZmZXIpLCAyMCwgMCwgMFxuICAgICAgICBdKVxuICAgICAgfSBhcyBhbnlcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IF8gb2YgZXRoUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEdldEJsb2NrSGVhZGVycyByZXF1ZXN0IHVzaW5nIGJsb2NrIGhhc2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2U6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICB5aWVsZCBbXG4gICAgICAgICAgICBFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSUyxcbiAgICAgICAgICAgIGJsb2NrLmhlYWRlci5oYXNoKCksIDIwLCAwLCAwXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV0aFByb3RvY29sLmhhbmRsZXJzW0VUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19IRUFERVJTXSA9IHtcbiAgICAgICAgaGFuZGxlOiAoLi4ubXNnKSA9PiBleHBlY3QobXNnKS50by5lcWwoW1xuICAgICAgICAgIGJsb2NrLmhlYWRlci5oYXNoKCksIDIwLCAwLCAwXG4gICAgICAgIF0pXG4gICAgICB9IGFzIGFueVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgXyBvZiBldGhQcm90b2NvbC5yZWNlaXZlKHNvdXJjZSkpIHtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgTmV3QmxvY2tIYXNoZXMgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIHlpZWxkIFtcbiAgICAgICAgICAgIEVUSC5NRVNTQUdFX0NPREVTLk5FV19CTE9DS19IQVNIRVMsIFtibG9jay5oZWFkZXIuaGFzaCgpLCBibG9jay5oZWFkZXIubnVtYmVyXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBldGhQcm90b2NvbC5vbignbmV3LWJsb2NrLWhhc2hlcycsIChuZXdCbG9ja3MpID0+IHtcbiAgICAgICAgZXhwZWN0KG5ld0Jsb2Nrc1swXSkudG8uZXFsKFtibG9jay5oZWFkZXIuaGFzaCgpLCBuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcildKVxuICAgICAgfSlcblxuICAgICAgZm9yIGF3YWl0IChjb25zdCBtc2cgb2YgZXRoUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpIGFzIGFueSkge1xuICAgICAgICBleHBlY3QobXNnWzBdKS50by5lcWwoW2Jsb2NrLmhlYWRlci5oYXNoKCksIG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKV0pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnaGFuZGxlcyAtIHJlcXVlc3QnLCAoKSA9PiB7XG4gICAgbGV0IHNlbmRIYW5kbGVyOiBGdW5jdGlvbiB8IHVuZGVmaW5lZFxuICAgIGxldCByZWNlaXZlSGFuZGxlcjogKG1zZzogYW55KSA9PiBBc3luY0l0ZXJhYmxlPGFueT4gfCB1bmRlZmluZWRcbiAgICBjb25zdCBuZXR3b3JrUHJvdmlkZXI6IGFueSA9IHtcbiAgICAgIHNlbmQ6IGFzeW5jIGZ1bmN0aW9uIDxULCBVPiAobXNnOiBUKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHNlbmRIYW5kbGVyID8gc2VuZEhhbmRsZXIobXNnKSA6IG1zZ1xuICAgICAgfSxcbiAgICAgIHJlY2VpdmU6IGFzeW5jIGZ1bmN0aW9uKiA8VCwgVT4ocmVhZGFibGU6IEFzeW5jSXRlcmFibGU8VD4pOiBBc3luY0l0ZXJhYmxlPFUgfCBVW10+IHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVIYW5kbGVyID8gcmVjZWl2ZUhhbmRsZXIocmVhZGFibGUpIDogcmVjZWl2ZUhhbmRsZXJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZXRoUHJvdG9jb2w6IEV0aFByb3RvY29sPGFueT5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGV0aFByb3RvY29sID0gbmV3IEV0aFByb3RvY29sKHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+LFxuICAgICAgICBuZXR3b3JrUHJvdmlkZXIsIHtcbiAgICAgICAgICBnZXRCbG9ja3NURDogKCkgPT4gQnVmZmVyLmZyb20oWzBdKSxcbiAgICAgICAgICBnZXRCZXN0QmxvY2s6ICgpID0+IGJsb2NrLFxuICAgICAgICAgIGNvbW1vbjogbmV3IENvbW1vbignbWFpbm5ldCcpXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgICBwYXNzdGhyb3VnaEVuY29kZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2VuZCBTdGF0dXMgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZzogW2FueSwgYW55XSkgPT4ge1xuICAgICAgICBjb25zdCBbIG1zZ0lkLCByZXF1ZXN0IF0gPSBtc2dcbiAgICAgICAgY29uc3QgW3Byb3RvY29sVmVyc2lvbiwgbmV0d29ya0lkLCB0ZCwgYmVzdEhhc2gsIGdlbmVzaXNIYXNoXSA9IHJlcXVlc3RcbiAgICAgICAgZXhwZWN0KG1zZ0lkKS50by5lcWwoRVRILk1FU1NBR0VfQ09ERVMuU1RBVFVTKVxuICAgICAgICBleHBlY3QocHJvdG9jb2xWZXJzaW9uKS50by5lcWwoQnVmZmVyLmZyb20oWzBdKSlcbiAgICAgICAgZXhwZWN0KG5ldHdvcmtJZCkudG8uZXFsKEJ1ZmZlci5mcm9tKFswXSkpXG4gICAgICAgIGV4cGVjdCh0ZCkudG8uZXFsKG5ldyBCTihCdWZmZXIuZnJvbShbMF0pKS50b0FycmF5TGlrZShCdWZmZXIpKVxuICAgICAgICBleHBlY3QoYmVzdEhhc2gpLnRvLmVxbChCdWZmZXIuZnJvbShbMF0pKVxuICAgICAgICBleHBlY3QoZ2VuZXNpc0hhc2gpLnRvLmVxbChCdWZmZXIuZnJvbSgnMCcsICdoZXgnKSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhdHVzOiBTdGF0dXM8YW55PiA9IG5ldyBTdGF0dXMoZXRoUHJvdG9jb2wsIHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+KVxuICAgICAgYXdhaXQgc3RhdHVzLnNlbmQoMCwgMCwgbmV3IEJOKDApLCBCdWZmZXIuZnJvbShbMF0pLCAnMHgwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIEdldEJsb2NrSGVhZGVycyByZXF1ZXN0IHVzaW5nIGJsb2NrIG51bWJlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBjb25zdCBbbXNnSWQsIHJlcV0gPSBtc2dcbiAgICAgICAgY29uc3QgW19ibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSA9IHJlcVxuICAgICAgICBleHBlY3QobXNnSWQpLnRvLmVxbChFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSUylcbiAgICAgICAgZXhwZWN0KF9ibG9jaykudG8uZXFsKGJsb2NrLmhlYWRlci5udW1iZXIpXG4gICAgICAgIGV4cGVjdChtYXgpLnRvLmVxbCgyMClcbiAgICAgICAgZXhwZWN0KHNraXApLnRvLmVxbCgwKVxuICAgICAgICBleHBlY3QocmV2ZXJzZSkudG8uZXFsKDApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldEJsb2NrSGVhZGVyczogR2V0QmxvY2tIZWFkZXJzPGFueT4gPSBuZXcgR2V0QmxvY2tIZWFkZXJzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IGdldEJsb2NrSGVhZGVycy5zZW5kKG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKSwgMjAsIDAsIGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgR2V0QmxvY2tIZWFkZXJzIHJlcXVlc3QgdXNpbmcgYmxvY2sgaGFzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBjb25zdCBbbXNnSWQsIHJlc10gPSBtc2dcbiAgICAgICAgY29uc3QgW19ibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSA9IHJlc1xuICAgICAgICBleHBlY3QobXNnSWQpLnRvLmVxbChFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSUylcbiAgICAgICAgZXhwZWN0KF9ibG9jaykudG8uZXFsKGJsb2NrLmhlYWRlci5oYXNoKCkpXG4gICAgICAgIGV4cGVjdChtYXgpLnRvLmVxbCgyMClcbiAgICAgICAgZXhwZWN0KHNraXApLnRvLmVxbCgwKVxuICAgICAgICBleHBlY3QocmV2ZXJzZSkudG8uZXFsKDApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldEJsb2NrSGVhZGVyczogR2V0QmxvY2tIZWFkZXJzPGFueT4gPSBuZXcgR2V0QmxvY2tIZWFkZXJzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IGdldEJsb2NrSGVhZGVycy5zZW5kKGJsb2NrLmhlYWRlci5oYXNoKCksIDIwLCAwLCBmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIEJsb2NrSGVhZGVycycsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBleHBlY3QobXNnWzBdKS50by5lcShFVEguTUVTU0FHRV9DT0RFUy5CTE9DS19IRUFERVJTKVxuICAgICAgICBleHBlY3QobXNnWzFdWzBdKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5yYXcpXG4gICAgICB9XG5cbiAgICAgIGV0aFByb3RvY29sLmV0aENoYWluLmdldEhlYWRlcnMgPSBhc3luYyAoKSA9PiBbZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlcl1cbiAgICAgIGNvbnN0IGJsb2NrSGVhZGVyczogQmxvY2tIZWFkZXJzPGFueT4gPSBuZXcgQmxvY2tIZWFkZXJzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IGJsb2NrSGVhZGVycy5zZW5kKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIsIDAsIDEsIGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgTmV3QmxvY2tIYXNoZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBzZW5kSGFuZGxlciA9IChtc2cpID0+IHtcbiAgICAgICAgZXhwZWN0KG1zZ1swXSkudG8uZXEoRVRILk1FU1NBR0VfQ09ERVMuTkVXX0JMT0NLX0hBU0hFUylcbiAgICAgICAgZXhwZWN0KG1zZ1sxXVswXSkudG8uZXFsKFtcbiAgICAgICAgICBmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLmhhc2goKSxcbiAgICAgICAgICAobmV3IEJOKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIubnVtYmVyKSkudG9BcnJheUxpa2UoQnVmZmVyKVxuICAgICAgICBdKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdCbG9ja0hhc2hlczogTmV3QmxvY2tIYXNoZXM8YW55PiA9IG5ldyBOZXdCbG9ja0hhc2hlcyhldGhQcm90b2NvbCwge30gYXMgSVBlZXJEZXNjcmlwdG9yPGFueT4pXG4gICAgICBhd2FpdCBuZXdCbG9ja0hhc2hlcy5zZW5kKFtcbiAgICAgICAgZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5oYXNoKCksXG4gICAgICAgIG5ldyBCTihmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLm51bWJlcilcbiAgICAgIF0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=