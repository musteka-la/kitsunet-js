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
    constructor(protocol, type, chain) {
        this.protocol = protocol;
        this.type = type;
        this.chain = chain;
    }
    latest() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                const status = yield this.protocol.getStatus();
                try {
                    for (var _b = __asyncValues(this.protocol.getHeaders(status.bestHash, 1)), _c; _c = yield _b.next(), !_c.done;) {
                        const header = _c.value;
                        if (header[0]) {
                            debug(`got peers ${this.protocol.peer.id} latest header - ${(header[0]).hash().toString('hex')}`);
                        }
                        else {
                            debug(`got empty header from ${this.protocol.peer.id}!`);
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
    getHeaders(block, max, skip = 0, reverse = false) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let headers = [];
            try {
                for (var _b = __asyncValues(this.protocol.getHeaders(block, max, skip, reverse)), _c; _c = yield _b.next(), !_c.done;) {
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
    getBodies(hashes) {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let bodies = [];
            try {
                for (var _b = __asyncValues(this.protocol.getBlockBodies(hashes)), _c; _c = yield _b.next(), !_c.done;) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkZXJzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHdFQUFvQztBQUtwQyxrREFBeUI7QUFFekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7QUFFM0QsTUFBc0IsY0FBYztJQUtsQyxZQUFhLFFBQXdCLEVBQ3hCLElBQW9CLEVBQ3BCLEtBQWU7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUVLLE1BQU07O1lBQ1YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTs7Z0JBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQTs7b0JBQzlDLEtBQTJCLElBQUEsS0FBQSxjQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUEsSUFBQTt3QkFBNUQsTUFBTSxNQUFNLFdBQUEsQ0FBQTt3QkFDckIsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ2IsS0FBSyxDQUFDLGFBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO3lCQUNsRzs2QkFBTTs0QkFDTCxLQUFLLENBQUMseUJBQXlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7eUJBQ3pEO3dCQUNELE9BQU8sT0FBTyxDQUFDLElBQUksMEJBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7cUJBQ3BFOzs7Ozs7Ozs7Z0JBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO1lBQ2hELENBQUMsQ0FBQSxDQUFDLENBQUE7UUFDSixDQUFDO0tBQUE7SUFFSyxVQUFVLENBQUUsS0FBMkIsRUFDM0IsR0FBVyxFQUNYLE9BQWUsQ0FBQyxFQUNoQixVQUFtQixLQUFLOzs7WUFDeEMsSUFBSSxPQUFPLEdBQW1CLEVBQUUsQ0FBQTs7Z0JBQ2hDLEtBQXNCLElBQUEsS0FBQSxjQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBLElBQUE7b0JBQTlELE1BQU0sQ0FBQyxXQUFBLENBQUE7b0JBQ2hCLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUM1Qjs7Ozs7Ozs7O1lBQ0QsT0FBTyxPQUFPLENBQUE7O0tBQ2Y7SUFFSyxTQUFTLENBQUUsTUFBZ0I7OztZQUMvQixJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFBOztnQkFDNUIsS0FBc0IsSUFBQSxLQUFBLGNBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUEsSUFBQTtvQkFBL0MsTUFBTSxDQUFDLFdBQUEsQ0FBQTtvQkFDaEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBVSxDQUFDLENBQUE7aUJBQ25DOzs7Ozs7Ozs7WUFDRCxPQUFPLE1BQU0sQ0FBQTs7S0FDZDtJQUVLLEtBQUssQ0FBRSxNQUFlOztZQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JDLENBQUM7S0FBQTtDQUdGO0FBcERELHdDQW9EQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcbmltcG9ydCB7IElEb3dubG9hZGVyLCBEb3dubG9hZGVyVHlwZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBFdGhQcm90b2NvbCwgQmxvY2tCb2R5LCBJUGVlckRlc2NyaXB0b3IgfSBmcm9tICcuLi8uLi9uZXQnXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vYmxvY2tjaGFpbidcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmRvd25sb2FkZXI6ZG93bmxvYWQtbWFuYWdlcicpXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlRG93bmxvYWRlcjxUIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGltcGxlbWVudHMgSURvd25sb2FkZXIge1xuICBwdWJsaWMgcHJvdG9jb2w6IEV0aFByb3RvY29sPFQ+XG4gIHB1YmxpYyB0eXBlOiBEb3dubG9hZGVyVHlwZVxuICBwdWJsaWMgY2hhaW46IEV0aENoYWluXG5cbiAgY29uc3RydWN0b3IgKHByb3RvY29sOiBFdGhQcm90b2NvbDxUPixcbiAgICAgICAgICAgICAgIHR5cGU6IERvd25sb2FkZXJUeXBlLFxuICAgICAgICAgICAgICAgY2hhaW46IEV0aENoYWluKSB7XG4gICAgdGhpcy5wcm90b2NvbCA9IHByb3RvY29sXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIHRoaXMuY2hhaW4gPSBjaGFpblxuICB9XG5cbiAgYXN5bmMgbGF0ZXN0ICgpOiBQcm9taXNlPEJsb2NrIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMucHJvdG9jb2wuZ2V0U3RhdHVzKClcbiAgICAgIGZvciBhd2FpdCAoY29uc3QgaGVhZGVyIG9mIHRoaXMucHJvdG9jb2wuZ2V0SGVhZGVycyhzdGF0dXMuYmVzdEhhc2gsIDEpKSB7XG4gICAgICAgIGlmIChoZWFkZXJbMF0pIHtcbiAgICAgICAgICBkZWJ1ZyhgZ290IHBlZXJzICR7dGhpcy5wcm90b2NvbC5wZWVyLmlkfSBsYXRlc3QgaGVhZGVyIC0gJHsoaGVhZGVyWzBdKS5oYXNoKCkudG9TdHJpbmcoJ2hleCcpfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVidWcoYGdvdCBlbXB0eSBoZWFkZXIgZnJvbSAke3RoaXMucHJvdG9jb2wucGVlci5pZH0hYClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzb2x2ZShuZXcgQmxvY2soaGVhZGVyWzBdLCB7IGNvbW1vbjogdGhpcy5jaGFpbi5jb21tb24gfSkpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignbm8gaGVhZGVyIHJlc29sdmVkJykpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldEhlYWRlcnMgKGJsb2NrOiBCTiB8IEJ1ZmZlciB8IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgbWF4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2U6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8QmxvY2suSGVhZGVyW10+IHtcbiAgICBsZXQgaGVhZGVyczogQmxvY2suSGVhZGVyW10gPSBbXVxuICAgIGZvciBhd2FpdCAoY29uc3QgaCBvZiB0aGlzLnByb3RvY29sLmdldEhlYWRlcnMoYmxvY2ssIG1heCwgc2tpcCwgcmV2ZXJzZSkpIHtcbiAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmNvbmNhdChoKVxuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyc1xuICB9XG5cbiAgYXN5bmMgZ2V0Qm9kaWVzIChoYXNoZXM6IEJ1ZmZlcltdKTogUHJvbWlzZTxCbG9ja0JvZHlbXT4ge1xuICAgIGxldCBib2RpZXM6IEJsb2NrQm9keVtdID0gW11cbiAgICBmb3IgYXdhaXQgKGNvbnN0IGIgb2YgdGhpcy5wcm90b2NvbC5nZXRCbG9ja0JvZGllcyhoYXNoZXMpKSB7XG4gICAgICBib2RpZXMgPSBib2RpZXMuY29uY2F0KGIgYXMgYW55W10pXG4gICAgfVxuICAgIHJldHVybiBib2RpZXNcbiAgfVxuXG4gIGFzeW5jIHN0b3JlIChibG9ja3M6IEJsb2NrW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5jaGFpbi5wdXRCbG9ja3MoYmxvY2tzKVxuICB9XG5cbiAgYWJzdHJhY3QgZG93bmxvYWQgKHByb3RvY29sOiBFdGhQcm90b2NvbDxhbnk+KTogUHJvbWlzZTx2b2lkPlxufVxuIl19