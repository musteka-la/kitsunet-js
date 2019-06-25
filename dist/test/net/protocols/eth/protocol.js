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
const async_1 = require("async");
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
        it('should handle NewBlockHashes request', (done) => {
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
                done();
            });
            async_1.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                var e_6, _a;
                try {
                    // eslint-disable-next-line no-unused-vars
                    for (var _b = __asyncValues(ethProtocol.receive(source)), _c; _c = yield _b.next(), !_c.done;) {
                        const _ = _c.value;
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }));
        });
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
            yield blockHeaders.send(fromRpc(jsonBlock.block).header.hash(), 0, 1, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZXN0L25ldC9wcm90b2NvbHMvZXRoL3Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUV0QixZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLGlCQUFjO0FBQ2Qsd0VBQW9DO0FBQ3BDLDBFQUFzQztBQUN0QyxrREFBc0I7QUFDdEIsbUNBQTJDO0FBQzNDLCtCQUE2QjtBQUM3QiwyREFBK0Q7QUFDL0QseURBQXVDO0FBUXZDLHlFQUttRDtBQUVuRCx3RUFBeUQ7QUFDekQsaUNBQWdDO0FBQ2hDLHFEQUFxRDtBQUNyRCxNQUFNLEtBQUssR0FBVSxJQUFJLDBCQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBRXhELE1BQU0sa0JBQWtCLEdBQWE7SUFDbkMsTUFBTSxFQUFFLFVBQXVCLEdBQUcsNERBQUksb0JBQU0sR0FBRyxDQUFBLENBQUEsQ0FBQyxDQUFDLElBQUE7SUFDakQsTUFBTSxFQUFFLFVBQXVCLEdBQUcsNERBQUksb0JBQU0sR0FBRyxDQUFBLENBQUEsQ0FBQyxDQUFDLElBQUE7Q0FDbEQsQ0FBQTtBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLElBQUksV0FBVyxDQUFBO1FBQ2YsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLFdBQVcsR0FBRyxJQUFJLGlCQUFXLENBQUMsRUFBMEIsRUFDMUIsSUFBSSxxQkFBRSxFQUEwQixFQUFFO2dCQUNoQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSztnQkFD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QyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO3dCQUM3RSxhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7d0JBQzNFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTt3QkFDekUsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO3dCQUN6RSxhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7d0JBQ3JFLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3QkFDdkUsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxD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QyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7aUJBQ3JFLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQTtZQUVELE1BQU0sY0FBYyxHQUF3QixJQUFJLHlCQUFjLENBQUMsV0FBVyxFQUFFLEVBQTBCLENBQUMsQ0FBQTtZQUN2RyxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDdEMsSUFBSSxlQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQy9DLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBtb2NoYSAqL1xuXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0ICdtb2NoYSdcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IENvbW1vbiBmcm9tICdldGhlcmV1bWpzLWNvbW1vbidcbmltcG9ydCBCTiBmcm9tICdibi5qcydcbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBFRSB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknXG5pbXBvcnQgeyBFdGhQcm90b2NvbCB9IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2V0aCdcbmltcG9ydCB7IEVUSCB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuXG5pbXBvcnQge1xuICBJUGVlckRlc2NyaXB0b3IsXG4gIElFbmNvZGVyLFxuICBOb2RlXG59IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQnXG5cbmltcG9ydCB7XG4gIEdldEJsb2NrSGVhZGVycyxcbiAgQmxvY2tIZWFkZXJzLFxuICBOZXdCbG9ja0hhc2hlcyxcbiAgU3RhdHVzXG59IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2V0aC9oYW5kbGVycydcblxuaW1wb3J0ICogYXMganNvbkJsb2NrIGZyb20gJy4uLy4uLy4uL2ZpeHR1cmVzL2Jsb2NrLmpzb24nXG5pbXBvcnQgeyBuZXh0VGljayB9IGZyb20gJ2FzeW5jJ1xuaW1wb3J0IGZyb21ScGMgPSByZXF1aXJlKCdldGhlcmV1bWpzLWJsb2NrL2Zyb20tcnBjJylcbmNvbnN0IGJsb2NrOiBCbG9jayA9IG5ldyBCbG9jayhmcm9tUnBjKGpzb25CbG9jay5ibG9jaykpXG5cbmNvbnN0IHBhc3N0aHJvdWdoRW5jb2RlcjogSUVuY29kZXIgPSB7XG4gIGVuY29kZTogYXN5bmMgZnVuY3Rpb24qIDxULCBVPihtc2cpIHsgeWllbGQgbXNnIH0sXG4gIGRlY29kZTogYXN5bmMgZnVuY3Rpb24qIDxULCBVPihtc2cpIHsgeWllbGQgbXNnIH1cbn1cblxuZGVzY3JpYmUoJ0V0aCBwcm90b2NvbCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3NldHVwJywgKCkgPT4ge1xuICAgIGxldCBldGhQcm90b2NvbFxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZXRoUHJvdG9jb2wgPSBuZXcgRXRoUHJvdG9jb2woe30gYXMgSVBlZXJEZXNjcmlwdG9yPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRUUoKSBhcyB1bmtub3duIGFzIE5vZGU8YW55Piwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRCbG9ja3NURDogKCkgPT4gQnVmZmVyLmZyb20oWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmVzdEJsb2NrOiAoKSA9PiBibG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uOiBuZXcgQ29tbW9uKCdtYWlubmV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3Rocm91Z2hFbmNvZGVyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBwcm90b2NvbCBpZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChldGhQcm90b2NvbC5pZCkudG8uZXFsKCdldGgnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBwcm90b2NvbCB2ZXJzaW9ucycsICgpID0+IHtcbiAgICAgIGV4cGVjdChldGhQcm90b2NvbC52ZXJzaW9ucykudG8uZXFsKFsnNjInLCAnNjMnXSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdoYW5kbGVycyAtIGhhbmRsZScsICgpID0+IHtcbiAgICBsZXQgZXRoUHJvdG9jb2w6IEV0aFByb3RvY29sPGFueT5cbiAgICBsZXQgcHJvdmlkZXI6IGFueSA9IG5ldyBFRSgpXG4gICAgcHJvdmlkZXIuc2VuZCA9ICgpID0+IFtdXG5cbiAgICBjb25zdCBjaGFpbjogYW55ID0ge1xuICAgICAgZ2V0QmxvY2tzVEQ6ICgpID0+IEJ1ZmZlci5mcm9tKFswXSksXG4gICAgICBnZXRCZXN0QmxvY2s6ICgpID0+IGJsb2NrLFxuICAgICAgY29tbW9uOiBuZXcgQ29tbW9uKCdtYWlubmV0JylcbiAgICB9XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGV0aFByb3RvY29sID0gbmV3IEV0aFByb3RvY29sKHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+LCBwcm92aWRlciwgY2hhaW4sIHBhc3N0aHJvdWdoRW5jb2RlcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgU3RhdHVzIHJlcXVlc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2U6IEFzeW5jSXRlcmFibGU8YW55PiA9IHtcbiAgICAgICAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICB5aWVsZCBbRVRILk1FU1NBR0VfQ09ERVMuU1RBVFVTLCAwLCAwLCBuZXcgQk4oMCksIEJ1ZmZlci5mcm9tKFswXSksICcweDAnLCBuZXcgQk4oMCldXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IF8gb2YgZXRoUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHtcbiAgICAgICAgICBwcm90b2NvbFZlcnNpb246IDAsXG4gICAgICAgICAgbmV0d29ya0lkOiAwLFxuICAgICAgICAgIHRkOiBuZXcgQk4oMCksXG4gICAgICAgICAgYmVzdEhhc2g6IEJ1ZmZlci5mcm9tKFswXSksXG4gICAgICAgICAgZ2VuZXNpc0hhc2g6ICcweDAnLFxuICAgICAgICAgIG51bWJlcjogbmV3IEJOKDApXG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoYXdhaXQgZXRoUHJvdG9jb2wuZ2V0U3RhdHVzKCkpLnRvLmVxbChzdGF0dXMpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJsb2NrIGhlYWRlcnMgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZTogQXN5bmNJdGVyYWJsZTxhbnk+ID0ge1xuICAgICAgICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIHlpZWxkIFtFVEguTUVTU0FHRV9DT0RFUy5CTE9DS19IRUFERVJTLCBibG9jay5oZWFkZXIucmF3XVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1zZzogUHJvbWlzZTxCbG9jay5IZWFkZXJbXT4gPSBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1zZyBvZiBldGhQcm90b2NvbC5nZXRIZWFkZXJzKDEsIDEpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUobXNnKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgXyBvZiBldGhQcm90b2NvbC5yZWNlaXZlKHNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIG1zZy50aGVuKChoZWFkZXI6IEJsb2NrLkhlYWRlcltdKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5ibG9vbSkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuYmxvb20pXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5jb2luYmFzZSkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuY29pbmJhc2UpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5kaWZmaWN1bHR5KS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5kaWZmaWN1bHR5KVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uZXh0cmFEYXRhKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5leHRyYURhdGEpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5nYXNMaW1pdCkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuZ2FzTGltaXQpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS5nYXNVc2VkKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5nYXNVc2VkKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0ubWl4SGFzaCkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIubWl4SGFzaClcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLm5vbmNlKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5ub25jZSlcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLm51bWJlcikudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIubnVtYmVyKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0ucGFyZW50SGFzaCkudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIucGFyZW50SGFzaClcbiAgICAgICAgICBleHBlY3QoaGVhZGVyWzBdLnJhdykudG8uZXFsKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIucmF3KVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0ucmVjZWlwdFRyaWUpLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLnJlY2VpcHRUcmllKVxuICAgICAgICAgIGV4cGVjdChoZWFkZXJbMF0uc3RhdGVSb290KS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5zdGF0ZVJvb3QpXG4gICAgICAgICAgZXhwZWN0KGhlYWRlclswXS50aW1lc3RhbXApLnRvLmVxbChmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLnRpbWVzdGFtcClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgR2V0QmxvY2tIZWFkZXJzIHJlcXVlc3QgdXNpbmcgYmxvY2sgbnVtYmVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgW1xuICAgICAgICAgICAgRVRILk1FU1NBR0VfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlMsXG4gICAgICAgICAgICBuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcikudG9BcnJheUxpa2UoQnVmZmVyKSwgMjAsIDAsIDBcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXRoUHJvdG9jb2wuaGFuZGxlcnNbRVRILk1FU1NBR0VfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlNdID0ge1xuICAgICAgICBoYW5kbGU6ICguLi5tc2cpID0+IGV4cGVjdChtc2cpLnRvLmVxbChbXG4gICAgICAgICAgKG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKSkudG9BcnJheUxpa2UoQnVmZmVyKSwgMjAsIDAsIDBcbiAgICAgICAgXSlcbiAgICAgIH0gYXMgYW55XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBfIG9mIGV0aFByb3RvY29sLnJlY2VpdmUoc291cmNlKSkge1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBHZXRCbG9ja0hlYWRlcnMgcmVxdWVzdCB1c2luZyBibG9jayBoYXNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgW1xuICAgICAgICAgICAgRVRILk1FU1NBR0VfQ09ERVMuR0VUX0JMT0NLX0hFQURFUlMsXG4gICAgICAgICAgICBibG9jay5oZWFkZXIuaGFzaCgpLCAyMCwgMCwgMFxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBldGhQcm90b2NvbC5oYW5kbGVyc1tFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSU10gPSB7XG4gICAgICAgIGhhbmRsZTogKC4uLm1zZykgPT4gZXhwZWN0KG1zZykudG8uZXFsKFtcbiAgICAgICAgICBibG9jay5oZWFkZXIuaGFzaCgpLCAyMCwgMCwgMFxuICAgICAgICBdKVxuICAgICAgfSBhcyBhbnlcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IF8gb2YgZXRoUHJvdG9jb2wucmVjZWl2ZShzb3VyY2UpKSB7XG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIE5ld0Jsb2NrSGFzaGVzIHJlcXVlc3QnLCAoZG9uZSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlOiBBc3luY0l0ZXJhYmxlPGFueT4gPSB7XG4gICAgICAgIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl06IGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgeWllbGQgW1xuICAgICAgICAgICAgRVRILk1FU1NBR0VfQ09ERVMuTkVXX0JMT0NLX0hBU0hFUywgW2Jsb2NrLmhlYWRlci5oYXNoKCksIGJsb2NrLmhlYWRlci5udW1iZXJdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV0aFByb3RvY29sLm9uKCduZXctYmxvY2staGFzaGVzJywgKG5ld0Jsb2NrcykgPT4ge1xuICAgICAgICBleHBlY3QobmV3QmxvY2tzWzBdKS50by5lcWwoW2Jsb2NrLmhlYWRlci5oYXNoKCksIG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKV0pXG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcblxuICAgICAgbmV4dFRpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgXyBvZiBldGhQcm90b2NvbC5yZWNlaXZlKHNvdXJjZSkgYXMgYW55KSB7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnaGFuZGxlcyAtIHJlcXVlc3QnLCAoKSA9PiB7XG4gICAgbGV0IHNlbmRIYW5kbGVyOiBGdW5jdGlvbiB8IHVuZGVmaW5lZFxuICAgIGxldCByZWNlaXZlSGFuZGxlcjogKG1zZzogYW55KSA9PiBBc3luY0l0ZXJhYmxlPGFueT4gfCB1bmRlZmluZWRcbiAgICBjb25zdCBuZXR3b3JrUHJvdmlkZXI6IGFueSA9IHtcbiAgICAgIHNlbmQ6IGFzeW5jIGZ1bmN0aW9uIDxULCBVPiAobXNnOiBUKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHNlbmRIYW5kbGVyID8gc2VuZEhhbmRsZXIobXNnKSA6IG1zZ1xuICAgICAgfSxcbiAgICAgIHJlY2VpdmU6IGFzeW5jIGZ1bmN0aW9uKiA8VCwgVT4ocmVhZGFibGU6IEFzeW5jSXRlcmFibGU8VD4pOiBBc3luY0l0ZXJhYmxlPFUgfCBVW10+IHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVIYW5kbGVyID8gcmVjZWl2ZUhhbmRsZXIocmVhZGFibGUpIDogcmVjZWl2ZUhhbmRsZXJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZXRoUHJvdG9jb2w6IEV0aFByb3RvY29sPGFueT5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGV0aFByb3RvY29sID0gbmV3IEV0aFByb3RvY29sKHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+LFxuICAgICAgICBuZXR3b3JrUHJvdmlkZXIsIHtcbiAgICAgICAgICBnZXRCbG9ja3NURDogKCkgPT4gQnVmZmVyLmZyb20oWzBdKSxcbiAgICAgICAgICBnZXRCZXN0QmxvY2s6ICgpID0+IGJsb2NrLFxuICAgICAgICAgIGNvbW1vbjogbmV3IENvbW1vbignbWFpbm5ldCcpXG4gICAgICAgIH0gYXMgYW55LFxuICAgICAgICBwYXNzdGhyb3VnaEVuY29kZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2VuZCBTdGF0dXMgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZzogW2FueSwgYW55XSkgPT4ge1xuICAgICAgICBjb25zdCBbIG1zZ0lkLCByZXF1ZXN0IF0gPSBtc2dcbiAgICAgICAgY29uc3QgW3Byb3RvY29sVmVyc2lvbiwgbmV0d29ya0lkLCB0ZCwgYmVzdEhhc2gsIGdlbmVzaXNIYXNoXSA9IHJlcXVlc3RcbiAgICAgICAgZXhwZWN0KG1zZ0lkKS50by5lcWwoRVRILk1FU1NBR0VfQ09ERVMuU1RBVFVTKVxuICAgICAgICBleHBlY3QocHJvdG9jb2xWZXJzaW9uKS50by5lcWwoQnVmZmVyLmZyb20oWzBdKSlcbiAgICAgICAgZXhwZWN0KG5ldHdvcmtJZCkudG8uZXFsKEJ1ZmZlci5mcm9tKFswXSkpXG4gICAgICAgIGV4cGVjdCh0ZCkudG8uZXFsKG5ldyBCTihCdWZmZXIuZnJvbShbMF0pKS50b0FycmF5TGlrZShCdWZmZXIpKVxuICAgICAgICBleHBlY3QoYmVzdEhhc2gpLnRvLmVxbChCdWZmZXIuZnJvbShbMF0pKVxuICAgICAgICBleHBlY3QoZ2VuZXNpc0hhc2gpLnRvLmVxbChCdWZmZXIuZnJvbSgnMCcsICdoZXgnKSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhdHVzOiBTdGF0dXM8YW55PiA9IG5ldyBTdGF0dXMoZXRoUHJvdG9jb2wsIHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+KVxuICAgICAgYXdhaXQgc3RhdHVzLnNlbmQoMCwgMCwgbmV3IEJOKDApLCBCdWZmZXIuZnJvbShbMF0pLCAnMHgwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIEdldEJsb2NrSGVhZGVycyByZXF1ZXN0IHVzaW5nIGJsb2NrIG51bWJlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBjb25zdCBbbXNnSWQsIHJlcV0gPSBtc2dcbiAgICAgICAgY29uc3QgW19ibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSA9IHJlcVxuICAgICAgICBleHBlY3QobXNnSWQpLnRvLmVxbChFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSUylcbiAgICAgICAgZXhwZWN0KF9ibG9jaykudG8uZXFsKGJsb2NrLmhlYWRlci5udW1iZXIpXG4gICAgICAgIGV4cGVjdChtYXgpLnRvLmVxbCgyMClcbiAgICAgICAgZXhwZWN0KHNraXApLnRvLmVxbCgwKVxuICAgICAgICBleHBlY3QocmV2ZXJzZSkudG8uZXFsKDApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldEJsb2NrSGVhZGVyczogR2V0QmxvY2tIZWFkZXJzPGFueT4gPSBuZXcgR2V0QmxvY2tIZWFkZXJzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IGdldEJsb2NrSGVhZGVycy5zZW5kKG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKSwgMjAsIDAsIGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgR2V0QmxvY2tIZWFkZXJzIHJlcXVlc3QgdXNpbmcgYmxvY2sgaGFzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBjb25zdCBbbXNnSWQsIHJlc10gPSBtc2dcbiAgICAgICAgY29uc3QgW19ibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSA9IHJlc1xuICAgICAgICBleHBlY3QobXNnSWQpLnRvLmVxbChFVEguTUVTU0FHRV9DT0RFUy5HRVRfQkxPQ0tfSEVBREVSUylcbiAgICAgICAgZXhwZWN0KF9ibG9jaykudG8uZXFsKGJsb2NrLmhlYWRlci5oYXNoKCkpXG4gICAgICAgIGV4cGVjdChtYXgpLnRvLmVxbCgyMClcbiAgICAgICAgZXhwZWN0KHNraXApLnRvLmVxbCgwKVxuICAgICAgICBleHBlY3QocmV2ZXJzZSkudG8uZXFsKDApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldEJsb2NrSGVhZGVyczogR2V0QmxvY2tIZWFkZXJzPGFueT4gPSBuZXcgR2V0QmxvY2tIZWFkZXJzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IGdldEJsb2NrSGVhZGVycy5zZW5kKGJsb2NrLmhlYWRlci5oYXNoKCksIDIwLCAwLCBmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIEJsb2NrSGVhZGVycycsIGFzeW5jICgpID0+IHtcbiAgICAgIHNlbmRIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgICBleHBlY3QobXNnWzBdKS50by5lcShFVEguTUVTU0FHRV9DT0RFUy5CTE9DS19IRUFERVJTKVxuICAgICAgICBleHBlY3QobXNnWzFdWzBdKS50by5lcWwoZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5yYXcpXG4gICAgICB9XG5cbiAgICAgIGV0aFByb3RvY29sLmV0aENoYWluLmdldEhlYWRlcnMgPSBhc3luYyAoKSA9PiBbZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlcl1cbiAgICAgIGNvbnN0IGJsb2NrSGVhZGVyczogQmxvY2tIZWFkZXJzPGFueT4gPSBuZXcgQmxvY2tIZWFkZXJzKGV0aFByb3RvY29sLCB7fSBhcyBJUGVlckRlc2NyaXB0b3I8YW55PilcbiAgICAgIGF3YWl0IGJsb2NrSGVhZGVycy5zZW5kKGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuaGFzaCgpLCAwLCAxLCBmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIE5ld0Jsb2NrSGFzaGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2VuZEhhbmRsZXIgPSAobXNnKSA9PiB7XG4gICAgICAgIGV4cGVjdChtc2dbMF0pLnRvLmVxKEVUSC5NRVNTQUdFX0NPREVTLk5FV19CTE9DS19IQVNIRVMpXG4gICAgICAgIGV4cGVjdChtc2dbMV1bMF0pLnRvLmVxbChbXG4gICAgICAgICAgZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5oYXNoKCksXG4gICAgICAgICAgKG5ldyBCTihmcm9tUnBjKGpzb25CbG9jay5ibG9jaykuaGVhZGVyLm51bWJlcikpLnRvQXJyYXlMaWtlKEJ1ZmZlcilcbiAgICAgICAgXSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3QmxvY2tIYXNoZXM6IE5ld0Jsb2NrSGFzaGVzPGFueT4gPSBuZXcgTmV3QmxvY2tIYXNoZXMoZXRoUHJvdG9jb2wsIHt9IGFzIElQZWVyRGVzY3JpcHRvcjxhbnk+KVxuICAgICAgYXdhaXQgbmV3QmxvY2tIYXNoZXMuc2VuZChbXG4gICAgICAgIGZyb21ScGMoanNvbkJsb2NrLmJsb2NrKS5oZWFkZXIuaGFzaCgpLFxuICAgICAgICBuZXcgQk4oZnJvbVJwYyhqc29uQmxvY2suYmxvY2spLmhlYWRlci5udW1iZXIpXG4gICAgICBdKVxuICAgIH0pXG4gIH0pXG59KVxuIl19