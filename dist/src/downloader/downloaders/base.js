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
            const status = yield protocol.getStatus();
            const header = yield this.getHeaders(protocol, status.bestHash, 1);
            if (header.length) {
                debug(`got peers ${peer.id} latest header - ${(header[0]).hash().toString('hex')}`);
            }
            else {
                debug(`got empty header from ${peer.id}!`);
                return;
            }
            return new ethereumjs_block_1.default(header[0], { common: this.chain.common });
        });
    }
    getHeaders(protocol, block, max, skip = 0, reverse = false) {
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
            }
            return headers;
        });
    }
    getBodies(protocol, hashes) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkZXJzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHdFQUFvQztBQVVwQyxrREFBeUI7QUFFekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7QUFFM0QsTUFBc0IsY0FBYztJQUtsQyxZQUFhLEtBQWUsRUFBRSxXQUF3QjtRQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtJQUNoQyxDQUFDO0lBRUssTUFBTSxDQUFFLFFBQXNCLEVBQUUsSUFBVTs7WUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ2xFLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDakIsS0FBSyxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTthQUNwRjtpQkFBTTtnQkFDTCxLQUFLLENBQUMseUJBQXlCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2dCQUMxQyxPQUFNO2FBQ1A7WUFDRCxPQUFPLElBQUksMEJBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQzVELENBQUM7S0FBQTtJQUVlLFVBQVUsQ0FBRSxRQUFzQixFQUN0QixLQUEyQixFQUMzQixHQUFXLEVBQ1gsT0FBZSxDQUFDLEVBQ2hCLFVBQW1CLEtBQUs7OztZQUNsRCxJQUFJLE9BQU8sR0FBbUIsRUFBRSxDQUFBO1lBQ2hDLElBQUk7O29CQUNGLEtBQXNCLElBQUEsS0FBQSxjQUFBLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUEsSUFBQTt3QkFBekQsTUFBTSxDQUFDLFdBQUEsQ0FBQTt3QkFDaEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQzVCOzs7Ozs7Ozs7YUFDRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNUO1lBQ0QsT0FBTyxPQUFPLENBQUE7O0tBQ2Y7SUFFZSxTQUFTLENBQUUsUUFBc0IsRUFBRSxNQUFnQjs7O1lBQ2pFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUE7WUFDNUIsSUFBSTs7b0JBQ0YsS0FBc0IsSUFBQSxLQUFBLGNBQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQSxJQUFBO3dCQUExQyxNQUFNLENBQUMsV0FBQSxDQUFBO3dCQUNoQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFVLENBQUMsQ0FBQTtxQkFDbkM7Ozs7Ozs7OzthQUNGO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ1Q7WUFDRCxPQUFPLE1BQU0sQ0FBQTs7S0FDZDtJQUVLLEtBQUssQ0FBRSxNQUFlOztZQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JDLENBQUM7S0FBQTtDQUlGO0FBeERELHdDQXdEQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcbmltcG9ydCB7IElEb3dubG9hZGVyLCBEb3dubG9hZGVyVHlwZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQge1xuICBCbG9ja0JvZHksXG4gIElFdGhQcm90b2NvbCxcbiAgUGVlcixcbiAgUGVlck1hbmFnZXJcbn0gZnJvbSAnLi4vLi4vbmV0J1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uL2Jsb2NrY2hhaW4nXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyOmRvd25sb2FkLW1hbmFnZXInKVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZURvd25sb2FkZXIgaW1wbGVtZW50cyBJRG93bmxvYWRlciB7XG4gIHB1YmxpYyBjaGFpbjogRXRoQ2hhaW5cbiAgcHVibGljIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlclxuICBhYnN0cmFjdCB0eXBlOiBEb3dubG9hZGVyVHlwZVxuXG4gIGNvbnN0cnVjdG9yIChjaGFpbjogRXRoQ2hhaW4sIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlcikge1xuICAgIHRoaXMuY2hhaW4gPSBjaGFpblxuICAgIHRoaXMucGVlck1hbmFnZXIgPSBwZWVyTWFuYWdlclxuICB9XG5cbiAgYXN5bmMgbGF0ZXN0IChwcm90b2NvbDogSUV0aFByb3RvY29sLCBwZWVyOiBQZWVyKTogUHJvbWlzZTxCbG9jayB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHByb3RvY29sLmdldFN0YXR1cygpXG4gICAgY29uc3QgaGVhZGVyID0gYXdhaXQgdGhpcy5nZXRIZWFkZXJzKHByb3RvY29sLCBzdGF0dXMuYmVzdEhhc2gsIDEpXG4gICAgaWYgKGhlYWRlci5sZW5ndGgpIHtcbiAgICAgIGRlYnVnKGBnb3QgcGVlcnMgJHtwZWVyLmlkfSBsYXRlc3QgaGVhZGVyIC0gJHsoaGVhZGVyWzBdKS5oYXNoKCkudG9TdHJpbmcoJ2hleCcpfWApXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnKGBnb3QgZW1wdHkgaGVhZGVyIGZyb20gJHtwZWVyLmlkfSFgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJldHVybiBuZXcgQmxvY2soaGVhZGVyWzBdLCB7IGNvbW1vbjogdGhpcy5jaGFpbi5jb21tb24gfSlcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBnZXRIZWFkZXJzIChwcm90b2NvbDogSUV0aFByb3RvY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IEJOIHwgQnVmZmVyIHwgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBza2lwOiBudW1iZXIgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxCbG9jay5IZWFkZXJbXT4ge1xuICAgIGxldCBoZWFkZXJzOiBCbG9jay5IZWFkZXJbXSA9IFtdXG4gICAgdHJ5IHtcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgaCBvZiBwcm90b2NvbC5nZXRIZWFkZXJzKGJsb2NrLCBtYXgsIHNraXAsIHJldmVyc2UpKSB7XG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmNvbmNhdChoKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgZ2V0Qm9kaWVzIChwcm90b2NvbDogSUV0aFByb3RvY29sLCBoYXNoZXM6IEJ1ZmZlcltdKTogUHJvbWlzZTxCbG9ja0JvZHlbXT4ge1xuICAgIGxldCBib2RpZXM6IEJsb2NrQm9keVtdID0gW11cbiAgICB0cnkge1xuICAgICAgZm9yIGF3YWl0IChjb25zdCBiIG9mIHByb3RvY29sLmdldEJsb2NrQm9kaWVzKGhhc2hlcykpIHtcbiAgICAgICAgYm9kaWVzID0gYm9kaWVzLmNvbmNhdChiIGFzIGFueVtdKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICAgIHJldHVybiBib2RpZXNcbiAgfVxuXG4gIGFzeW5jIHN0b3JlIChibG9ja3M6IEJsb2NrW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5jaGFpbi5wdXRCbG9ja3MoYmxvY2tzKVxuICB9XG5cbiAgYWJzdHJhY3QgYXN5bmMgZG93bmxvYWQocGVlcjogUGVlcik6IFByb21pc2U8dm9pZD5cbiAgYWJzdHJhY3QgYXN5bmMgYmVzdCgpOiBQcm9taXNlPFBlZXIgfCB1bmRlZmluZWQ+XG59XG4iXX0=