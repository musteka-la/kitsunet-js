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
class BaseDownloader {
    constructor(chain, peerManager) {
        this.chain = chain;
        this.peerManager = peerManager;
    }
    latest(protocol, peer) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                const status = yield protocol.getStatus();
                try {
                    for (var _b = __asyncValues(protocol.getHeaders(status.bestHash, 1)), _c; _c = yield _b.next(), !_c.done;) {
                        const header = _c.value;
                        if (header[0]) {
                            debug(`got peers ${peer.id} latest header - ${(header[0]).hash().toString('hex')}`);
                        }
                        else {
                            debug(`got empty header from ${peer.id}!`);
                        }
                        return resolve(new ethereumjs_block_1.default(header[0], { common: this.chain.common }));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return reject(new Error('no header resolved'));
            }));
        });
    }
    getHeaders(protocol, block, max, skip = 0, reverse = false) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let headers = [];
            try {
                for (var _b = __asyncValues(protocol.getHeaders(block, max, skip, reverse)), _c; _c = yield _b.next(), !_c.done;) {
                    const h = _c.value;
                    headers = headers.concat(h);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return headers;
        });
    }
    getBodies(protocol, hashes) {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let bodies = [];
            try {
                for (var _b = __asyncValues(protocol.getBlockBodies(hashes)), _c; _c = yield _b.next(), !_c.done;) {
                    const b = _c.value;
                    bodies = bodies.concat(b);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkZXJzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHdFQUFvQztBQVVwQyxrREFBeUI7QUFFekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7QUFFM0QsTUFBc0IsY0FBYztJQUtsQyxZQUFhLEtBQWUsRUFBRSxXQUF3QjtRQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtJQUNoQyxDQUFDO0lBRUssTUFBTSxDQUFFLFFBQXNCLEVBQUUsSUFBVTs7WUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTs7Z0JBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBOztvQkFDekMsS0FBMkIsSUFBQSxLQUFBLGNBQUEsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBLElBQUE7d0JBQXZELE1BQU0sTUFBTSxXQUFBLENBQUE7d0JBQ3JCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNiLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxFQUFFLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7eUJBQ3BGOzZCQUFNOzRCQUNMLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7eUJBQzNDO3dCQUNELE9BQU8sT0FBTyxDQUFDLElBQUksMEJBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7cUJBQ3BFOzs7Ozs7Ozs7Z0JBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO1lBQ2hELENBQUMsQ0FBQSxDQUFDLENBQUE7UUFDSixDQUFDO0tBQUE7SUFFZSxVQUFVLENBQUUsUUFBc0IsRUFDdEIsS0FBMkIsRUFDM0IsR0FBVyxFQUNYLE9BQWUsQ0FBQyxFQUNoQixVQUFtQixLQUFLOzs7WUFDbEQsSUFBSSxPQUFPLEdBQW1CLEVBQUUsQ0FBQTs7Z0JBQ2hDLEtBQXNCLElBQUEsS0FBQSxjQUFBLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUEsSUFBQTtvQkFBekQsTUFBTSxDQUFDLFdBQUEsQ0FBQTtvQkFDaEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQzVCOzs7Ozs7Ozs7WUFDRCxPQUFPLE9BQU8sQ0FBQTs7S0FDZjtJQUVlLFNBQVMsQ0FBRSxRQUFzQixFQUFFLE1BQWdCOzs7WUFDakUsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQTs7Z0JBQzVCLEtBQXNCLElBQUEsS0FBQSxjQUFBLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUEsSUFBQTtvQkFBMUMsTUFBTSxDQUFDLFdBQUEsQ0FBQTtvQkFDaEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBVSxDQUFDLENBQUE7aUJBQ25DOzs7Ozs7Ozs7WUFDRCxPQUFPLE1BQU0sQ0FBQTs7S0FDZDtJQUVLLEtBQUssQ0FBRSxNQUFlOztZQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JDLENBQUM7S0FBQTtDQUlGO0FBbkRELHdDQW1EQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcbmltcG9ydCB7IElEb3dubG9hZGVyLCBEb3dubG9hZGVyVHlwZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQge1xuICBCbG9ja0JvZHksXG4gIElFdGhQcm90b2NvbCxcbiAgUGVlcixcbiAgUGVlck1hbmFnZXJcbn0gZnJvbSAnLi4vLi4vbmV0J1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uL2Jsb2NrY2hhaW4nXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyOmRvd25sb2FkLW1hbmFnZXInKVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZURvd25sb2FkZXIgaW1wbGVtZW50cyBJRG93bmxvYWRlciB7XG4gIHB1YmxpYyBjaGFpbjogRXRoQ2hhaW5cbiAgcHVibGljIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlclxuICBhYnN0cmFjdCB0eXBlOiBEb3dubG9hZGVyVHlwZVxuXG4gIGNvbnN0cnVjdG9yIChjaGFpbjogRXRoQ2hhaW4sIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlcikge1xuICAgIHRoaXMuY2hhaW4gPSBjaGFpblxuICAgIHRoaXMucGVlck1hbmFnZXIgPSBwZWVyTWFuYWdlclxuICB9XG5cbiAgYXN5bmMgbGF0ZXN0IChwcm90b2NvbDogSUV0aFByb3RvY29sLCBwZWVyOiBQZWVyKTogUHJvbWlzZTxCbG9jayB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBwcm90b2NvbC5nZXRTdGF0dXMoKVxuICAgICAgZm9yIGF3YWl0IChjb25zdCBoZWFkZXIgb2YgcHJvdG9jb2wuZ2V0SGVhZGVycyhzdGF0dXMuYmVzdEhhc2gsIDEpKSB7XG4gICAgICAgIGlmIChoZWFkZXJbMF0pIHtcbiAgICAgICAgICBkZWJ1ZyhgZ290IHBlZXJzICR7cGVlci5pZH0gbGF0ZXN0IGhlYWRlciAtICR7KGhlYWRlclswXSkuaGFzaCgpLnRvU3RyaW5nKCdoZXgnKX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlYnVnKGBnb3QgZW1wdHkgaGVhZGVyIGZyb20gJHtwZWVyLmlkfSFgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKG5ldyBCbG9jayhoZWFkZXJbMF0sIHsgY29tbW9uOiB0aGlzLmNoYWluLmNvbW1vbiB9KSlcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdubyBoZWFkZXIgcmVzb2x2ZWQnKSlcbiAgICB9KVxuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGdldEhlYWRlcnMgKHByb3RvY29sOiBJRXRoUHJvdG9jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jazogQk4gfCBCdWZmZXIgfCBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPEJsb2NrLkhlYWRlcltdPiB7XG4gICAgbGV0IGhlYWRlcnM6IEJsb2NrLkhlYWRlcltdID0gW11cbiAgICBmb3IgYXdhaXQgKGNvbnN0IGggb2YgcHJvdG9jb2wuZ2V0SGVhZGVycyhibG9jaywgbWF4LCBza2lwLCByZXZlcnNlKSkge1xuICAgICAgaGVhZGVycyA9IGhlYWRlcnMuY29uY2F0KGgpXG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgZ2V0Qm9kaWVzIChwcm90b2NvbDogSUV0aFByb3RvY29sLCBoYXNoZXM6IEJ1ZmZlcltdKTogUHJvbWlzZTxCbG9ja0JvZHlbXT4ge1xuICAgIGxldCBib2RpZXM6IEJsb2NrQm9keVtdID0gW11cbiAgICBmb3IgYXdhaXQgKGNvbnN0IGIgb2YgcHJvdG9jb2wuZ2V0QmxvY2tCb2RpZXMoaGFzaGVzKSkge1xuICAgICAgYm9kaWVzID0gYm9kaWVzLmNvbmNhdChiIGFzIGFueVtdKVxuICAgIH1cbiAgICByZXR1cm4gYm9kaWVzXG4gIH1cblxuICBhc3luYyBzdG9yZSAoYmxvY2tzOiBCbG9ja1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhaW4ucHV0QmxvY2tzKGJsb2NrcylcbiAgfVxuXG4gIGFic3RyYWN0IGFzeW5jIGRvd25sb2FkKHBlZXI6IFBlZXIpOiBQcm9taXNlPHZvaWQ+XG4gIGFic3RyYWN0IGFzeW5jIGJlc3QoKTogUHJvbWlzZTxQZWVyIHwgdW5kZWZpbmVkPlxufVxuIl19