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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const debug_1 = __importDefault(require("debug"));
const async_1 = require("async");
const debug = debug_1.default('kitsunet:downloader:download-manager');
exports.MAX_PER_REQUEST = 128;
exports.CONCCURENT_REQUESTS = 15;
exports.MAX_REQUEST = 128 * 16;
exports.MAX_LOOKBACK = 16;
class BaseDownloader {
    constructor(chain, peerManager) {
        this.chain = chain;
        this.peerManager = peerManager;
    }
    findAncestor(protocol, peer, local, max = exports.MAX_LOOKBACK) {
        return __awaiter(this, void 0, void 0, function* () {
            const remote = local.subn(max);
            if (remote.lten(0)) {
                return this.chain.getBestBlock();
            }
            const headers = yield this.getHeaders(protocol, peer, remote, max);
            const found = headers.find((h) => __awaiter(this, void 0, void 0, function* () {
                return this.chain.getHeaders(h.hash(), 1);
            }));
            if (found)
                return new ethereumjs_block_1.default([found, [], []], { common: this.chain.common });
        });
    }
    latest(protocol, peer) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield protocol.getStatus();
            const header = yield this.getHeaders(protocol, peer, status.bestHash, 1);
            if (header.length) {
                debug(`got peers ${peer.id} latest header - ${(header[0]).hash().toString('hex')}`);
                return new ethereumjs_block_1.default([header[0], [], []], { common: this.chain.common });
            }
            else {
                debug(`got empty header from ${peer.id}!`);
                this.peerManager.ban([peer]);
            }
        });
    }
    getHeaders(protocol, peer, block, max, skip = 0, reverse = false) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let headers = [];
            try {
                try {
                    for (var _b = __asyncValues(protocol.getHeaders(block, max, skip, reverse)), _c; _c = yield _b.next(), !_c.done;) {
                        const h = _c.value;
                        headers = headers.concat(h);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                debug(e);
                this.peerManager.ban([peer]);
            }
            return headers;
        });
    }
    getBodies(protocol, peer, hashes) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let bodies = [];
            try {
                try {
                    for (var _b = __asyncValues(protocol.getBlockBodies(hashes)), _c; _c = yield _b.next(), !_c.done;) {
                        const b = _c.value;
                        bodies = bodies.concat(b);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            catch (e) {
                debug(e);
                this.peerManager.ban([peer]);
            }
            return bodies;
        });
    }
    store(blocks) {
        return __awaiter(this, void 0, void 0, function* () {
            return async_1.nextTick(() => this.chain.putBlocks(blocks));
        });
    }
}
exports.BaseDownloader = BaseDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkZXJzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHdFQUFvQztBQVVwQyxrREFBeUI7QUFFekIsaUNBQWdDO0FBQ2hDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFBO0FBRTlDLFFBQUEsZUFBZSxHQUFXLEdBQUcsQ0FBQTtBQUM3QixRQUFBLG1CQUFtQixHQUFXLEVBQUUsQ0FBQTtBQUNoQyxRQUFBLFdBQVcsR0FBVyxHQUFHLEdBQUcsRUFBRSxDQUFBO0FBQzlCLFFBQUEsWUFBWSxHQUFXLEVBQUUsQ0FBQTtBQUV0QyxNQUFzQixjQUFjO0lBS2xDLFlBQWEsS0FBZSxFQUFFLFdBQXdCO1FBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0lBQ2hDLENBQUM7SUFFSyxZQUFZLENBQUUsUUFBc0IsRUFDdEIsSUFBVSxFQUNWLEtBQVMsRUFDVCxNQUFjLG9CQUFZOztZQUM1QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzlCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFBO2FBQ2pDO1lBRUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ2xFLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBTyxDQUFDLEVBQUUsRUFBRTtnQkFDckMsT0FBTyxJQUFJLENBQUMs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QUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDckQsQ0FBQztLQUFBO0NBSUY7QUE5RUQsd0NBOEVDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IHsgSURvd25sb2FkZXIsIERvd25sb2FkZXJUeXBlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7XG4gIEJsb2NrQm9keSxcbiAgSUV0aFByb3RvY29sLFxuICBQZWVyLFxuICBQZWVyTWFuYWdlclxufSBmcm9tICcuLi8uLi9uZXQnXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IG5leHRUaWNrIH0gZnJvbSAnYXN5bmMnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyOmRvd25sb2FkLW1hbmFnZXInKVxuXG5leHBvcnQgY29uc3QgTUFYX1BFUl9SRVFVRVNUOiBudW1iZXIgPSAxMjhcbmV4cG9ydCBjb25zdCBDT05DQ1VSRU5UX1JFUVVFU1RTOiBudW1iZXIgPSAxNVxuZXhwb3J0IGNvbnN0IE1BWF9SRVFVRVNUOiBudW1iZXIgPSAxMjggKiAxNlxuZXhwb3J0IGNvbnN0IE1BWF9MT09LQkFDSzogbnVtYmVyID0gMTZcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VEb3dubG9hZGVyIGltcGxlbWVudHMgSURvd25sb2FkZXIge1xuICBwdWJsaWMgY2hhaW46IEV0aENoYWluXG4gIHB1YmxpYyBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXJcbiAgYWJzdHJhY3QgdHlwZTogRG93bmxvYWRlclR5cGVcblxuICBjb25zdHJ1Y3RvciAoY2hhaW46IEV0aENoYWluLCBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIpIHtcbiAgICB0aGlzLmNoYWluID0gY2hhaW5cbiAgICB0aGlzLnBlZXJNYW5hZ2VyID0gcGVlck1hbmFnZXJcbiAgfVxuXG4gIGFzeW5jIGZpbmRBbmNlc3RvciAocHJvdG9jb2w6IElFdGhQcm90b2NvbCxcbiAgICAgICAgICAgICAgICAgICAgICBwZWVyOiBQZWVyLFxuICAgICAgICAgICAgICAgICAgICAgIGxvY2FsOiBCTixcbiAgICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlciA9IE1BWF9MT09LQkFDSyk6IFByb21pc2U8QmxvY2sgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCByZW1vdGUgPSBsb2NhbC5zdWJuKG1heClcbiAgICBpZiAocmVtb3RlLmx0ZW4oMCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYWluLmdldEJlc3RCbG9jaygpXG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IHRoaXMuZ2V0SGVhZGVycyhwcm90b2NvbCwgcGVlciwgcmVtb3RlLCBtYXgpXG4gICAgY29uc3QgZm91bmQgPSBoZWFkZXJzLmZpbmQoYXN5bmMgKGgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYWluLmdldEhlYWRlcnMoaC5oYXNoKCksIDEpXG4gICAgfSlcblxuICAgIGlmIChmb3VuZCkgcmV0dXJuIG5ldyBCbG9jayhbZm91bmQsIFtdLCBbXV0sIHsgY29tbW9uOiB0aGlzLmNoYWluLmNvbW1vbiB9KVxuICB9XG5cbiAgYXN5bmMgbGF0ZXN0IChwcm90b2NvbDogSUV0aFByb3RvY29sLCBwZWVyOiBQZWVyKTogUHJvbWlzZTxCbG9jayB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHByb3RvY29sLmdldFN0YXR1cygpXG4gICAgY29uc3QgaGVhZGVyID0gYXdhaXQgdGhpcy5nZXRIZWFkZXJzKHByb3RvY29sLCBwZWVyLCBzdGF0dXMuYmVzdEhhc2gsIDEpXG4gICAgaWYgKGhlYWRlci5sZW5ndGgpIHtcbiAgICAgIGRlYnVnKGBnb3QgcGVlcnMgJHtwZWVyLmlkfSBsYXRlc3QgaGVhZGVyIC0gJHsoaGVhZGVyWzBdKS5oYXNoKCkudG9TdHJpbmcoJ2hleCcpfWApXG4gICAgICByZXR1cm4gbmV3IEJsb2NrKFtoZWFkZXJbMF0sIFtdLCBbXV0sIHsgY29tbW9uOiB0aGlzLmNoYWluLmNvbW1vbiB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1ZyhgZ290IGVtcHR5IGhlYWRlciBmcm9tICR7cGVlci5pZH0hYClcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgZ2V0SGVhZGVycyAocHJvdG9jb2w6IElFdGhQcm90b2NvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXI6IFBlZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jazogQk4gfCBCdWZmZXIgfCBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPEJsb2NrLkhlYWRlcltdPiB7XG4gICAgbGV0IGhlYWRlcnM6IEJsb2NrLkhlYWRlcltdID0gW11cbiAgICB0cnkge1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBoIG9mIHByb3RvY29sLmdldEhlYWRlcnMoYmxvY2ssIG1heCwgc2tpcCwgcmV2ZXJzZSkpIHtcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuY29uY2F0KGgpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBnZXRCb2RpZXMgKHByb3RvY29sOiBJRXRoUHJvdG9jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXI6IFBlZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hlczogQnVmZmVyW10pOiBQcm9taXNlPEJsb2NrQm9keVtdPiB7XG4gICAgbGV0IGJvZGllczogQmxvY2tCb2R5W10gPSBbXVxuICAgIHRyeSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGIgb2YgcHJvdG9jb2wuZ2V0QmxvY2tCb2RpZXMoaGFzaGVzKSkge1xuICAgICAgICBib2RpZXMgPSBib2RpZXMuY29uY2F0KGIgYXMgYW55W10pXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICB9XG4gICAgcmV0dXJuIGJvZGllc1xuICB9XG5cbiAgYXN5bmMgc3RvcmUgKGJsb2NrczogQmxvY2tbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXh0VGljaygoKSA9PiB0aGlzLmNoYWluLnB1dEJsb2NrcyhibG9ja3MpKVxuICB9XG5cbiAgYWJzdHJhY3QgYXN5bmMgZG93bmxvYWQocGVlcjogUGVlcik6IFByb21pc2U8dm9pZD5cbiAgYWJzdHJhY3QgYXN5bmMgYmVzdCgpOiBQcm9taXNlPFBlZXIgfCB1bmRlZmluZWQ+XG59XG4iXX0=