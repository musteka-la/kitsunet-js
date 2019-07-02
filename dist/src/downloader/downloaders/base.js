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
const debug = debug_1.default('kitsunet:downloader:download-manager');
exports.MAX_PER_REQUEST = 128;
exports.CONCCURENT_REQUESTS = 15;
exports.MAX_REQUEST = 128 * 16;
exports.MAX_LOOK_BACK = 16;
class BaseDownloader {
    constructor(chain, peerManager) {
        this.chain = chain;
        this.peerManager = peerManager;
    }
    findAncestor(protocol, peer, local, max = exports.MAX_LOOK_BACK) {
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
                debug(`got latest block ${(header[0]).number.toString('hex')} for peer ${peer.id}`);
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
            return this.chain.putBlocks(blocks);
        });
    }
}
exports.BaseDownloader = BaseDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkZXJzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHdFQUFvQztBQVVwQyxrREFBeUI7QUFFekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7QUFFOUMsUUFBQSxlQUFlLEdBQVcsR0FBRyxDQUFBO0FBQzdCLFFBQUEsbUJBQW1CLEdBQVcsRUFBRSxDQUFBO0FBQ2hDLFFBQUEsV0FBVyxHQUFXLEdBQUcsR0FBRyxFQUFFLENBQUE7QUFDOUIsUUFBQSxhQUFhLEdBQVcsRUFBRSxDQUFBO0FBRXZDLE1BQXNCLGNBQWM7SUFLbEMsWUFBYSxLQUFlLEVBQUUsV0FBd0I7UUFDcEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7SUFDaEMsQ0FBQztJQUVLLFlBQVksQ0FBRSxRQUFzQixFQUN0QixJQUFVLEVBQ1YsS0FBUyxFQUNULE1BQWMscUJBQWE7O1lBQzdDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDOUIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUE7YUFDakM7WUFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDbEUsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFPLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFB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QUNyQyxDQUFDO0tBQUE7Q0FJRjtBQTlFRCx3Q0E4RUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgeyBJRG93bmxvYWRlciwgRG93bmxvYWRlclR5cGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHtcbiAgQmxvY2tCb2R5LFxuICBJRXRoUHJvdG9jb2wsXG4gIFBlZXIsXG4gIFBlZXJNYW5hZ2VyXG59IGZyb20gJy4uLy4uL25ldCdcbmltcG9ydCBCTiBmcm9tICdibi5qcydcblxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgRXRoQ2hhaW4gfSBmcm9tICcuLi8uLi9ibG9ja2NoYWluJ1xuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6ZG93bmxvYWRlcjpkb3dubG9hZC1tYW5hZ2VyJylcblxuZXhwb3J0IGNvbnN0IE1BWF9QRVJfUkVRVUVTVDogbnVtYmVyID0gMTI4XG5leHBvcnQgY29uc3QgQ09OQ0NVUkVOVF9SRVFVRVNUUzogbnVtYmVyID0gMTVcbmV4cG9ydCBjb25zdCBNQVhfUkVRVUVTVDogbnVtYmVyID0gMTI4ICogMTZcbmV4cG9ydCBjb25zdCBNQVhfTE9PS19CQUNLOiBudW1iZXIgPSAxNlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZURvd25sb2FkZXIgaW1wbGVtZW50cyBJRG93bmxvYWRlciB7XG4gIHB1YmxpYyBjaGFpbjogRXRoQ2hhaW5cbiAgcHVibGljIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlclxuICBhYnN0cmFjdCB0eXBlOiBEb3dubG9hZGVyVHlwZVxuXG4gIGNvbnN0cnVjdG9yIChjaGFpbjogRXRoQ2hhaW4sIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlcikge1xuICAgIHRoaXMuY2hhaW4gPSBjaGFpblxuICAgIHRoaXMucGVlck1hbmFnZXIgPSBwZWVyTWFuYWdlclxuICB9XG5cbiAgYXN5bmMgZmluZEFuY2VzdG9yIChwcm90b2NvbDogSUV0aFByb3RvY29sLFxuICAgICAgICAgICAgICAgICAgICAgIHBlZXI6IFBlZXIsXG4gICAgICAgICAgICAgICAgICAgICAgbG9jYWw6IEJOLFxuICAgICAgICAgICAgICAgICAgICAgIG1heDogbnVtYmVyID0gTUFYX0xPT0tfQkFDSyk6IFByb21pc2U8QmxvY2sgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCByZW1vdGUgPSBsb2NhbC5zdWJuKG1heClcbiAgICBpZiAocmVtb3RlLmx0ZW4oMCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYWluLmdldEJlc3RCbG9jaygpXG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IHRoaXMuZ2V0SGVhZGVycyhwcm90b2NvbCwgcGVlciwgcmVtb3RlLCBtYXgpXG4gICAgY29uc3QgZm91bmQgPSBoZWFkZXJzLmZpbmQoYXN5bmMgKGgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYWluLmdldEhlYWRlcnMoaC5oYXNoKCksIDEpXG4gICAgfSlcblxuICAgIGlmIChmb3VuZCkgcmV0dXJuIG5ldyBCbG9jayhbZm91bmQsIFtdLCBbXV0sIHsgY29tbW9uOiB0aGlzLmNoYWluLmNvbW1vbiB9KVxuICB9XG5cbiAgYXN5bmMgbGF0ZXN0IChwcm90b2NvbDogSUV0aFByb3RvY29sLCBwZWVyOiBQZWVyKTogUHJvbWlzZTxCbG9jayB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHByb3RvY29sLmdldFN0YXR1cygpXG4gICAgY29uc3QgaGVhZGVyID0gYXdhaXQgdGhpcy5nZXRIZWFkZXJzKHByb3RvY29sLCBwZWVyLCBzdGF0dXMuYmVzdEhhc2gsIDEpXG4gICAgaWYgKGhlYWRlci5sZW5ndGgpIHtcbiAgICAgIGRlYnVnKGBnb3QgbGF0ZXN0IGJsb2NrICR7KGhlYWRlclswXSkubnVtYmVyLnRvU3RyaW5nKCdoZXgnKX0gZm9yIHBlZXIgJHtwZWVyLmlkfWApXG4gICAgICByZXR1cm4gbmV3IEJsb2NrKFtoZWFkZXJbMF0sIFtdLCBbXV0sIHsgY29tbW9uOiB0aGlzLmNoYWluLmNvbW1vbiB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1ZyhgZ290IGVtcHR5IGhlYWRlciBmcm9tICR7cGVlci5pZH0hYClcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgZ2V0SGVhZGVycyAocHJvdG9jb2w6IElFdGhQcm90b2NvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXI6IFBlZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jazogQk4gfCBCdWZmZXIgfCBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPEJsb2NrLkhlYWRlcltdPiB7XG4gICAgbGV0IGhlYWRlcnM6IEJsb2NrLkhlYWRlcltdID0gW11cbiAgICB0cnkge1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBoIG9mIHByb3RvY29sLmdldEhlYWRlcnMoYmxvY2ssIG1heCwgc2tpcCwgcmV2ZXJzZSkpIHtcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuY29uY2F0KGgpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBnZXRCb2RpZXMgKHByb3RvY29sOiBJRXRoUHJvdG9jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXI6IFBlZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hlczogQnVmZmVyW10pOiBQcm9taXNlPEJsb2NrQm9keVtdPiB7XG4gICAgbGV0IGJvZGllczogQmxvY2tCb2R5W10gPSBbXVxuICAgIHRyeSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGIgb2YgcHJvdG9jb2wuZ2V0QmxvY2tCb2RpZXMoaGFzaGVzKSkge1xuICAgICAgICBib2RpZXMgPSBib2RpZXMuY29uY2F0KGIgYXMgYW55W10pXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICB9XG4gICAgcmV0dXJuIGJvZGllc1xuICB9XG5cbiAgYXN5bmMgc3RvcmUgKGJsb2NrczogQmxvY2tbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmNoYWluLnB1dEJsb2NrcyhibG9ja3MpXG4gIH1cblxuICBhYnN0cmFjdCBhc3luYyBkb3dubG9hZChwZWVyOiBQZWVyKTogUHJvbWlzZTx2b2lkPlxuICBhYnN0cmFjdCBhc3luYyBiZXN0KCk6IFByb21pc2U8UGVlciB8IHVuZGVmaW5lZD5cbn1cbiJdfQ==