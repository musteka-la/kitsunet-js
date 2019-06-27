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
const downloader_1 = require("../../src/downloader");
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const bn_js_1 = __importDefault(require("bn.js"));
const jsonBlock = __importStar(require("../fixtures/block.json"));
const async_1 = require("async");
const fromRpc = require("ethereumjs-block/from-rpc");
const block = new ethereumjs_block_1.default(fromRpc(jsonBlock.block));
describe('fast sync', () => {
    let ethProtocol;
    let peer;
    let chain;
    let peerManager;
    let putHandler = null;
    beforeEach(() => {
        ethProtocol = {
            getStatus: () => {
                return { td: new bn_js_1.default(10) };
            },
            getHeaders: function () {
                return __asyncGenerator(this, arguments, function* () {
                    const block = new ethereumjs_block_1.default();
                    block.header.number = new bn_js_1.default(2);
                    block.header.difficulty = new bn_js_1.default(2);
                    yield yield __await([block]);
                });
            }
        };
        peer = {
            id: '12345',
            addrs: ['/ip4/127.0.0.1/tcp/5000'],
            protocols: new Map([['eth', ethProtocol]])
        };
        chain = {
            getBlocksTD: () => new bn_js_1.default(9),
            putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
            getLatestBlock: () => {
                const block = new ethereumjs_block_1.default();
                block.setGenesisParams();
                return block;
            }
        };
        peerManager = {
            getByCapability: () => {
                return [{
                        id: '12345',
                        addrs: ['/ip4/127.0.0.1/tcp/5000'],
                        protocols: new Map([['eth', ethProtocol]])
                    }];
            },
            reserve: () => true
        };
    });
    it('should select best peer', () => __awaiter(this, void 0, void 0, function* () {
        ethProtocol = {
            getStatus: () => {
                return { td: new bn_js_1.default(10) };
            },
            getHeaders: function () {
                return __asyncGenerator(this, arguments, function* () {
                    const block = new ethereumjs_block_1.default();
                    block.header.number = new bn_js_1.default(2);
                    block.header.difficulty = new bn_js_1.default(2);
                    yield yield __await([block]);
                });
            }
        };
        peer = {
            id: '12345',
            addrs: ['/ip4/127.0.0.1/tcp/5000'],
            protocols: new Map([['eth', ethProtocol]])
        };
        chain = {
            getBlocksTD: () => new bn_js_1.default(9),
            putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
            getLatestBlock: () => {
                const block = new ethereumjs_block_1.default();
                block.setGenesisParams();
                return block;
            }
        };
        peerManager = {
            getByCapability: () => {
                return [{
                        id: '12345',
                        addrs: ['/ip4/127.0.0.1/tcp/5000'],
                        protocols: new Map([['eth', ethProtocol]])
                    }];
            },
            reserve: () => true
        };
        let fastDownloader = new downloader_1.FastSyncDownloader(chain, peerManager);
        const bestPeer = yield fastDownloader.best();
        chai_1.expect(bestPeer).to.eql(peer);
    }));
    it('should return latest block from remote peer', () => __awaiter(this, void 0, void 0, function* () {
        ethProtocol = {
            getStatus: () => {
                return { td: new bn_js_1.default(10) };
            },
            getHeaders: function () {
                return __asyncGenerator(this, arguments, function* () {
                    yield yield __await([block]);
                });
            }
        };
        peer = {
            id: '12345',
            addrs: ['/ip4/127.0.0.1/tcp/5000'],
            protocols: new Map([['eth', ethProtocol]])
        };
        chain = {
            getBlocksTD: () => new bn_js_1.default(9),
            putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks
        };
        peerManager = {
            getByCapability: () => {
                return [{
                        id: '12345',
                        addrs: ['/ip4/127.0.0.1/tcp/5000'],
                        protocols: new Map([['eth', ethProtocol]])
                    }];
            },
            reserve: () => true
        };
        let fastDownloader = new downloader_1.FastSyncDownloader(chain, peerManager);
        const latestBlock = yield fastDownloader.latest(ethProtocol, peer);
        chai_1.expect(latestBlock.header.raw).to.eql(block.header.raw);
    }));
    it('should download from peer', (done) => {
        ethProtocol = {
            getStatus: () => {
                return { td: new bn_js_1.default(10) };
            }
        };
        peer = {
            id: '12345',
            addrs: ['/ip4/127.0.0.1/tcp/5000'],
            protocols: new Map([['eth', ethProtocol]])
        };
        chain = {
            getBlocksTD: () => new bn_js_1.default(9),
            putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
            getLatestBlock: () => {
                const block = new ethereumjs_block_1.default();
                block.setGenesisParams();
                return block;
            }
        };
        peerManager = {
            getByCapability: () => {
                return [{
                        id: '12345',
                        addrs: ['/ip4/127.0.0.1/tcp/5000'],
                        protocols: new Map([['eth', ethProtocol]])
                    }];
            },
            reserve: () => true
        };
        let fastDownloader = new class extends downloader_1.FastSyncDownloader {
            constructor() {
                super(chain, peerManager);
            }
            task({ from, protocol, to }) {
                return __awaiter(this, void 0, void 0, function* () {
                    chai_1.expect(from).to.eql(new bn_js_1.default(1));
                    chai_1.expect(to).to.eql(new bn_js_1.default(2));
                    chai_1.expect(protocol).to.eql(ethProtocol);
                    done();
                });
            }
            latest() {
                return __awaiter(this, void 0, void 0, function* () {
                    const block = new ethereumjs_block_1.default();
                    block.header.number = new bn_js_1.default(2);
                    block.header.difficulty = new bn_js_1.default(2);
                    return block;
                });
            }
        }();
        async_1.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            yield fastDownloader.download(peer);
        }));
    });
    it('should execute task correctly', () => {
        ethProtocol = {
            getStatus: () => {
                return { td: new bn_js_1.default(10) };
            },
            getBlockHeaders: () => [block.header.raw],
            getBlockBodies: () => []
        };
        peer = {
            id: '12345',
            addrs: ['/ip4/127.0.0.1/tcp/5000'],
            protocols: new Map([['eth', ethProtocol]])
        };
        chain = {
            getBlocksTD: () => new bn_js_1.default(9),
            putBlocks: (blocks) => putHandler ? putHandler(blocks) : blocks,
            getLatestBlock: () => {
                const block = new ethereumjs_block_1.default();
                block.setGenesisParams();
                return block;
            }
        };
        peerManager = {
            getByCapability: () => {
                return [{
                        id: '12345',
                        addrs: ['/ip4/127.0.0.1/tcp/5000'],
                        protocols: new Map([['eth', ethProtocol]])
                    }];
            },
            reserve: () => true
        };
        let fastDownloader = new downloader_1.FastSyncDownloader(chain, peerManager);
        fastDownloader.download(peer);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9kb3dubG9hZGVycy9mYXN0LXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0JBQXNCO0FBRXRCLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixpQkFBYztBQUNkLCtCQUE2QjtBQUM3QixxREFBeUQ7QUFDekQsd0VBQW9DO0FBQ3BDLGtEQUFzQjtBQUV0QixrRUFBbUQ7QUFDbkQsaUNBQWdDO0FBQ2hDLHFEQUFxRDtBQUNyRCxNQUFNLEtBQUssR0FBVSxJQUFJLDBCQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBRXhELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksV0FBVyxDQUFBO0lBQ2YsSUFBSSxJQUFJLENBQUE7SUFDUixJQUFJLEtBQUssQ0FBQTtJQUNULElBQUksV0FBVyxDQUFBO0lBQ2YsSUFBSSxVQUFVLEdBQW9CLElBQUksQ0FBQTtJQUV0QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBVyxHQUFHO1lBQ1osU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDZCxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUE7WUFDM0IsQ0FBQztZQUNELFVBQVUsRUFBRTs7b0JBQ1YsTUFBTSxLQUFLLEdBQUcsSUFBSSwwQkFBSyxFQUFFLENBQUE7b0JBQ3pCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDbkMsb0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFBO2dCQUNmLENBQUM7YUFBQTtTQUNG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QUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07WUFDL0QsY0FBYyxFQUFFLEdBQUcsRUFBRTtnQkFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSwwQkFBSyxFQUFFLENBQUE7Z0JBQ3pCLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUN4QixPQUFPLEtBQUssQ0FBQTtZQUNkLENBQUM7U0FDRixDQUFBO1FBRUQsV0FBVyxHQUFHO1lBQ1osZUFBZSxFQUFFLEdBQUcsRUFBRTtnQkFDcEIsT0FBTyxDQUFDO3dCQUNOLEVBQUUsRUFBRSxPQUFPO3dCQUNYLEtBQUssRUFBRSxDQUFDLHlCQUF5QixDQUFDO3dCQUNsQyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO3FCQUMzQyxDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDcEIsQ0FBQTtRQUVELElBQUksY0FBYyxHQUFHLElBQUksK0JBQWtCLENBQUMsS0FBWSxFQUFFLFdBQWtCLENBQUMsQ0FBQTtRQUM3RSxjQUFjLENBQUMsUUFBUSxDQUFDLElBQVcsQ0FBQyxDQUFBO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG1vY2hhICovXG5cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgJ21vY2hhJ1xuaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSdcbmltcG9ydCB7IEZhc3RTeW5jRG93bmxvYWRlciB9IGZyb20gJy4uLy4uL3NyYy9kb3dubG9hZGVyJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5cbmltcG9ydCAqIGFzIGpzb25CbG9jayBmcm9tICcuLi9maXh0dXJlcy9ibG9jay5qc29uJ1xuaW1wb3J0IHsgbmV4dFRpY2sgfSBmcm9tICdhc3luYydcbmltcG9ydCBmcm9tUnBjID0gcmVxdWlyZSgnZXRoZXJldW1qcy1ibG9jay9mcm9tLXJwYycpXG5jb25zdCBibG9jazogQmxvY2sgPSBuZXcgQmxvY2soZnJvbVJwYyhqc29uQmxvY2suYmxvY2spKVxuXG5kZXNjcmliZSgnZmFzdCBzeW5jJywgKCkgPT4ge1xuICBsZXQgZXRoUHJvdG9jb2xcbiAgbGV0IHBlZXJcbiAgbGV0IGNoYWluXG4gIGxldCBwZWVyTWFuYWdlclxuICBsZXQgcHV0SGFuZGxlcjogRnVuY3Rpb24gfCBudWxsID0gbnVsbFxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGV0aFByb3RvY29sID0ge1xuICAgICAgZ2V0U3RhdHVzOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7IHRkOiBuZXcgQk4oMTApIH1cbiAgICAgIH0sXG4gICAgICBnZXRIZWFkZXJzOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBibG9jayA9IG5ldyBCbG9jaygpXG4gICAgICAgIGJsb2NrLmhlYWRlci5udW1iZXIgPSBuZXcgQk4oMilcbiAgICAgICAgYmxvY2suaGVhZGVyLmRpZmZpY3VsdHkgPSBuZXcgQk4oMilcbiAgICAgICAgeWllbGQgW2Jsb2NrXVxuICAgICAgfVxuICAgIH1cblxuICAgIHBlZXIgPSB7XG4gICAgICBpZDogJzEyMzQ1JyxcbiAgICAgIGFkZHJzOiBbJy9pcDQvMTI3LjAuMC4xL3RjcC81MDAwJ10sXG4gICAgICBwcm90b2NvbHM6IG5ldyBNYXAoW1snZXRoJywgZXRoUHJvdG9jb2xdXSlcbiAgICB9XG5cbiAgICBjaGFpbiA9IHtcbiAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBuZXcgQk4oOSksXG4gICAgICBwdXRCbG9ja3M6IChibG9ja3MpID0+IHB1dEhhbmRsZXIgPyBwdXRIYW5kbGVyKGJsb2NrcykgOiBibG9ja3MsXG4gICAgICBnZXRMYXRlc3RCbG9jazogKCkgPT4ge1xuICAgICAgICBjb25zdCBibG9jayA9IG5ldyBCbG9jaygpXG4gICAgICAgIGJsb2NrLnNldEdlbmVzaXNQYXJhbXMoKVxuICAgICAgICByZXR1cm4gYmxvY2tcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwZWVyTWFuYWdlciA9IHtcbiAgICAgIGdldEJ5Q2FwYWJpbGl0eTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBpZDogJzEyMzQ1JyxcbiAgICAgICAgICBhZGRyczogWycvaXA0LzEyNy4wLjAuMS90Y3AvNTAwMCddLFxuICAgICAgICAgIHByb3RvY29sczogbmV3IE1hcChbWydldGgnLCBldGhQcm90b2NvbF1dKVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHJlc2VydmU6ICgpID0+IHRydWVcbiAgICB9XG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBzZWxlY3QgYmVzdCBwZWVyJywgYXN5bmMgKCkgPT4ge1xuICAgIGV0aFByb3RvY29sID0ge1xuICAgICAgZ2V0U3RhdHVzOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7IHRkOiBuZXcgQk4oMTApIH1cbiAgICAgIH0sXG4gICAgICBnZXRIZWFkZXJzOiBhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBibG9jayA9IG5ldyBCbG9jaygpXG4gICAgICAgIGJsb2NrLmhlYWRlci5udW1iZXIgPSBuZXcgQk4oMilcbiAgICAgICAgYmxvY2suaGVhZGVyLmRpZmZpY3VsdHkgPSBuZXcgQk4oMilcbiAgICAgICAgeWllbGQgW2Jsb2NrXVxuICAgICAgfVxuICAgIH1cblxuICAgIHBlZXIgPSB7XG4gICAgICBpZDogJzEyMzQ1JyxcbiAgICAgIGFkZHJzOiBbJy9pcDQvMTI3LjAuMC4xL3RjcC81MDAwJ10sXG4gICAgICBwcm90b2NvbHM6IG5ldyBNYXAoW1snZXRoJywgZXRoUHJvdG9jb2xdXSlcbiAgICB9XG5cbiAgICBjaGFpbiA9IHtcbiAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBuZXcgQk4oOSksXG4gICAgICBwdXRCbG9ja3M6IChibG9ja3MpID0+IHB1dEhhbmRsZXIgPyBwdXRIYW5kbGVyKGJsb2NrcykgOiBibG9ja3MsXG4gICAgICBnZXRMYXRlc3RCbG9jazogKCkgPT4ge1xuICAgICAgICBjb25zdCBibG9jayA9IG5ldyBCbG9jaygpXG4gICAgICAgIGJsb2NrLnNldEdlbmVzaXNQYXJhbXMoKVxuICAgICAgICByZXR1cm4gYmxvY2tcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwZWVyTWFuYWdlciA9IHtcbiAgICAgIGdldEJ5Q2FwYWJpbGl0eTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBpZDogJzEyMzQ1JyxcbiAgICAgICAgICBhZGRyczogWycvaXA0LzEyNy4wLjAuMS90Y3AvNTAwMCddLFxuICAgICAgICAgIHByb3RvY29sczogbmV3IE1hcChbWydldGgnLCBldGhQcm90b2NvbF1dKVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHJlc2VydmU6ICgpID0+IHRydWVcbiAgICB9XG5cbiAgICBsZXQgZmFzdERvd25sb2FkZXIgPSBuZXcgRmFzdFN5bmNEb3dubG9hZGVyKGNoYWluIGFzIGFueSwgcGVlck1hbmFnZXIgYXMgYW55KVxuICAgIGNvbnN0IGJlc3RQZWVyID0gYXdhaXQgZmFzdERvd25sb2FkZXIuYmVzdCgpXG4gICAgZXhwZWN0KGJlc3RQZWVyKS50by5lcWwocGVlcilcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiBsYXRlc3QgYmxvY2sgZnJvbSByZW1vdGUgcGVlcicsIGFzeW5jICgpID0+IHtcbiAgICBldGhQcm90b2NvbCA9IHtcbiAgICAgIGdldFN0YXR1czogKCkgPT4ge1xuICAgICAgICByZXR1cm4geyB0ZDogbmV3IEJOKDEwKSB9XG4gICAgICB9LFxuICAgICAgZ2V0SGVhZGVyczogYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgeWllbGQgW2Jsb2NrXVxuICAgICAgfVxuICAgIH1cblxuICAgIHBlZXIgPSB7XG4gICAgICBpZDogJzEyMzQ1JyxcbiAgICAgIGFkZHJzOiBbJy9pcDQvMTI3LjAuMC4xL3RjcC81MDAwJ10sXG4gICAgICBwcm90b2NvbHM6IG5ldyBNYXAoW1snZXRoJywgZXRoUHJvdG9jb2xdXSlcbiAgICB9XG5cbiAgICBjaGFpbiA9IHtcbiAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBuZXcgQk4oOSksXG4gICAgICBwdXRCbG9ja3M6IChibG9ja3MpID0+IHB1dEhhbmRsZXIgPyBwdXRIYW5kbGVyKGJsb2NrcykgOiBibG9ja3NcbiAgICB9XG5cbiAgICBwZWVyTWFuYWdlciA9IHtcbiAgICAgIGdldEJ5Q2FwYWJpbGl0eTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBpZDogJzEyMzQ1JyxcbiAgICAgICAgICBhZGRyczogWycvaXA0LzEyNy4wLjAuMS90Y3AvNTAwMCddLFxuICAgICAgICAgIHByb3RvY29sczogbmV3IE1hcChbWydldGgnLCBldGhQcm90b2NvbF1dKVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHJlc2VydmU6ICgpID0+IHRydWVcbiAgICB9XG5cbiAgICBsZXQgZmFzdERvd25sb2FkZXIgPSBuZXcgRmFzdFN5bmNEb3dubG9hZGVyKGNoYWluIGFzIGFueSwgcGVlck1hbmFnZXIgYXMgYW55KVxuICAgIGNvbnN0IGxhdGVzdEJsb2NrID0gYXdhaXQgZmFzdERvd25sb2FkZXIubGF0ZXN0KGV0aFByb3RvY29sIGFzIGFueSwgcGVlciBhcyBhbnkpXG4gICAgZXhwZWN0KGxhdGVzdEJsb2NrIS5oZWFkZXIucmF3KS50by5lcWwoYmxvY2suaGVhZGVyLnJhdylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGRvd25sb2FkIGZyb20gcGVlcicsIChkb25lKSA9PiB7XG4gICAgZXRoUHJvdG9jb2wgPSB7XG4gICAgICBnZXRTdGF0dXM6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgdGQ6IG5ldyBCTigxMCkgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHBlZXIgPSB7XG4gICAgICBpZDogJzEyMzQ1JyxcbiAgICAgIGFkZHJzOiBbJy9pcDQvMTI3LjAuMC4xL3RjcC81MDAwJ10sXG4gICAgICBwcm90b2NvbHM6IG5ldyBNYXAoW1snZXRoJywgZXRoUHJvdG9jb2xdXSlcbiAgICB9XG5cbiAgICBjaGFpbiA9IHtcbiAgICAgIGdldEJsb2Nrc1REOiAoKSA9PiBuZXcgQk4oOSksXG4gICAgICBwdXRCbG9ja3M6IChibG9ja3MpID0+IHB1dEhhbmRsZXIgPyBwdXRIYW5kbGVyKGJsb2NrcykgOiBibG9ja3MsXG4gICAgICBnZXRMYXRlc3RCbG9jazogKCkgPT4ge1xuICAgICAgICBjb25zdCBibG9jayA9IG5ldyBCbG9jaygpXG4gICAgICAgIGJsb2NrLnNldEdlbmVzaXNQYXJhbXMoKVxuICAgICAgICByZXR1cm4gYmxvY2tcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwZWVyTWFuYWdlciA9IHtcbiAgICAgIGdldEJ5Q2FwYWJpbGl0eTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBpZDogJzEyMzQ1JyxcbiAgICAgICAgICBhZGRyczogWycvaXA0LzEyNy4wLjAuMS90Y3AvNTAwMCddLFxuICAgICAgICAgIHByb3RvY29sczogbmV3IE1hcChbWydldGgnLCBldGhQcm90b2NvbF1dKVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHJlc2VydmU6ICgpID0+IHRydWVcbiAgICB9XG5cbiAgICBsZXQgZmFzdERvd25sb2FkZXIgPSBuZXcgY2xhc3MgZXh0ZW5kcyBGYXN0U3luY0Rvd25sb2FkZXIge1xuICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihjaGFpbiwgcGVlck1hbmFnZXIpXG4gICAgICB9XG5cbiAgICAgIHByb3RlY3RlZCBhc3luYyB0YXNrICh7IGZyb20sIHByb3RvY29sLCB0byB9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGV4cGVjdChmcm9tKS50by5lcWwobmV3IEJOKDEpKVxuICAgICAgICBleHBlY3QodG8pLnRvLmVxbChuZXcgQk4oMikpXG4gICAgICAgIGV4cGVjdChwcm90b2NvbCkudG8uZXFsKGV0aFByb3RvY29sKVxuICAgICAgICBkb25lKClcbiAgICAgIH1cblxuICAgICAgYXN5bmMgbGF0ZXN0ICgpIHtcbiAgICAgICAgY29uc3QgYmxvY2sgPSBuZXcgQmxvY2soKVxuICAgICAgICBibG9jay5oZWFkZXIubnVtYmVyID0gbmV3IEJOKDIpXG4gICAgICAgIGJsb2NrLmhlYWRlci5kaWZmaWN1bHR5ID0gbmV3IEJOKDIpXG4gICAgICAgIHJldHVybiBibG9ja1xuICAgICAgfVxuICAgIH0oKVxuXG4gICAgbmV4dFRpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgZmFzdERvd25sb2FkZXIuZG93bmxvYWQocGVlciBhcyBhbnkpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGV4ZWN1dGUgdGFzayBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgZXRoUHJvdG9jb2wgPSB7XG4gICAgICBnZXRTdGF0dXM6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgdGQ6IG5ldyBCTigxMCkgfVxuICAgICAgfSxcbiAgICAgIGdldEJsb2NrSGVhZGVyczogKCkgPT4gW2Jsb2NrLmhlYWRlci5yYXddLFxuICAgICAgZ2V0QmxvY2tCb2RpZXM6ICgpID0+IFtdXG4gICAgfVxuXG4gICAgcGVlciA9IHtcbiAgICAgIGlkOiAnMTIzNDUnLFxuICAgICAgYWRkcnM6IFsnL2lwNC8xMjcuMC4wLjEvdGNwLzUwMDAnXSxcbiAgICAgIHByb3RvY29sczogbmV3IE1hcChbWydldGgnLCBldGhQcm90b2NvbF1dKVxuICAgIH1cblxuICAgIGNoYWluID0ge1xuICAgICAgZ2V0QmxvY2tzVEQ6ICgpID0+IG5ldyBCTig5KSxcbiAgICAgIHB1dEJsb2NrczogKGJsb2NrcykgPT4gcHV0SGFuZGxlciA/IHB1dEhhbmRsZXIoYmxvY2tzKSA6IGJsb2NrcyxcbiAgICAgIGdldExhdGVzdEJsb2NrOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gbmV3IEJsb2NrKClcbiAgICAgICAgYmxvY2suc2V0R2VuZXNpc1BhcmFtcygpXG4gICAgICAgIHJldHVybiBibG9ja1xuICAgICAgfVxuICAgIH1cblxuICAgIHBlZXJNYW5hZ2VyID0ge1xuICAgICAgZ2V0QnlDYXBhYmlsaXR5OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGlkOiAnMTIzNDUnLFxuICAgICAgICAgIGFkZHJzOiBbJy9pcDQvMTI3LjAuMC4xL3RjcC81MDAwJ10sXG4gICAgICAgICAgcHJvdG9jb2xzOiBuZXcgTWFwKFtbJ2V0aCcsIGV0aFByb3RvY29sXV0pXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgcmVzZXJ2ZTogKCkgPT4gdHJ1ZVxuICAgIH1cblxuICAgIGxldCBmYXN0RG93bmxvYWRlciA9IG5ldyBGYXN0U3luY0Rvd25sb2FkZXIoY2hhaW4gYXMgYW55LCBwZWVyTWFuYWdlciBhcyBhbnkpXG4gICAgZmFzdERvd25sb2FkZXIuZG93bmxvYWQocGVlciBhcyBhbnkpXG4gIH0pXG59KVxuIl19