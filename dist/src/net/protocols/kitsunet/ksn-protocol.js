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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Handlers = __importStar(require("./handlers"));
const debug_1 = __importDefault(require("debug"));
const base_protocol_1 = require("../../base-protocol");
const ksn_encoder_1 = require("./ksn-encoder");
const interfaces_1 = require("./interfaces");
const slice_1 = require("../../../slice");
const debug = debug_1.default('kitsunet:kitsunet-proto');
const VERSION = '1.0.0';
class KsnProtocol extends base_protocol_1.BaseProtocol {
    constructor(peer, networkProvider, ethChain) {
        super(peer, networkProvider, new ksn_encoder_1.KsnEncoder());
        this.peer = peer;
        this.networkProvider = networkProvider;
        this.ethChain = ethChain;
        this.versions = [VERSION];
        this.userAgent = 'ksn-client';
        this.latestBlock = null;
        this.sliceIds = new Set();
        this.type = interfaces_1.NodeType.NODE;
        this.handlers = {};
        Object.keys(Handlers).forEach((handler) => {
            const h = Reflect.construct(Handlers[handler], [this, this.peer]);
            this.handlers[h.id] = h;
        });
    }
    get id() {
        return 'ksn';
    }
    receive(readable) {
        const _super = Object.create(null, {
            receive: { get: () => super.receive }
        });
        return __asyncGenerator(this, arguments, function* receive_1() {
            var e_1, _a, e_2, _b;
            try {
                for (var _c = __asyncValues(_super.receive.call(this, readable)), _d; _d = yield __await(_c.next()), !_d.done;) {
                    const msg = _d.value;
                    if (msg && msg.type !== interfaces_1.MsgType.UNKNOWN_MSG) {
                        const res = yield __await(this.handlers[msg.type].handle(msg));
                        if (!res)
                            return yield __await(null);
                        try {
                            for (var _e = __asyncValues(this.encoder.encode(res)), _f; _f = yield __await(_e.next()), !_f.done;) {
                                const encoded = _f.value;
                                if (!encoded)
                                    return yield __await(null);
                                yield yield __await(encoded);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) yield __await(_b.call(_e));
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield __await(_a.call(_c));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    send(msg) {
        const _super = Object.create(null, {
            send: { get: () => super.send }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.send.call(this, msg, this);
        });
    }
    /**
     * initiate the identify flow
     */
    handshake() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.handlers[interfaces_1.MsgType.IDENTIFY].send();
            if (!res)
                throw new Error('empty identify message!');
            this.versions = res.versions;
            this.userAgent = res.userAgent;
            this.sliceIds = res.sliceIds
                ? new Set(res.sliceIds.map((s) => new slice_1.SliceId(s.toString())))
                : new Set();
            this.latestBlock = res.latestBlock;
            this.type = res.nodeType;
        });
    }
}
exports.KsnProtocol = KsnProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLXByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMva2l0c3VuZXQva3NuLXByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVoscURBQXNDO0FBQ3RDLGtEQUF5QjtBQUN6Qix1REFBa0Q7QUFHbEQsK0NBQTBDO0FBRzFDLDZDQU1xQjtBQUNyQiwwQ0FBd0M7QUFFeEMsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFFOUMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBRXZCLE1BQWEsV0FBNEMsU0FBUSw0QkFBZTtJQVk5RSxZQUFvQixJQUFPLEVBQ1AsZUFBd0IsRUFDeEIsUUFBa0I7UUFDcEMsS0FBSyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSx3QkFBVSxFQUFFLENBQUMsQ0FBQTtRQUg1QixTQUFJLEdBQUosSUFBSSxDQUFHO1FBQ1Asb0JBQWUsR0FBZixlQUFlLENBQVM7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVZ0QyxhQUFRLEdBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM5QixjQUFTLEdBQVcsWUFBWSxDQUFBO1FBQ2hDLGdCQUFXLEdBQWtCLElBQUksQ0FBQTtRQVUvQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBUSxDQUFDLElBQUksQ0FBQTtRQUV6QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3hDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFoQkQsSUFBSSxFQUFFO1FBQ0osT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBZ0JNLE9BQU8sQ0FBUSxRQUEwQjs7Ozs7OztnQkFDOUMsS0FBd0IsSUFBQSxLQUFBLGNBQUEsT0FBTSxPQUFPLFlBQWEsUUFBUSxDQUEyQixDQUFBLElBQUE7b0JBQTFFLE1BQU0sR0FBRyxXQUFBLENBQUE7b0JBQ2xCLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssb0JBQU8sQ0FBQyxXQUFXLEVBQUU7d0JBQzNDLE1BQU0sR0FBRyxHQUFHLGNBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUE7d0JBQ3JELElBQUksQ0FBQyxHQUFHOzRCQUFFLHFCQUFPLElBQUksRUFBQTs7NEJBQ3JCLEtBQTRCLElBQUEsS0FBQSxjQUFBLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUE7Z0NBQTFDLE1BQU0sT0FBTyxXQUFBLENBQUE7Z0NBQ3RCLElBQUksQ0FBQyxPQUFPO29DQUFFLHFCQUFPLElBQUksRUFBQTtnQ0FDekIsb0JBQU0sT0FBTyxDQUFBLENBQUE7NkJBQ2Q7Ozs7Ozs7OztxQkFDRjtpQkFDRjs7Ozs7Ozs7O1FBQ0gsQ0FBQztLQUFBO0lBRUssSUFBSSxDQUFRLEdBQU07Ozs7O1lBQ3RCLE9BQU8sT0FBTSxJQUFJLFlBQUMsR0FBRyxFQUFFLElBQUksRUFBQztRQUM5QixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLFNBQVM7O1lBQ2IsTUFBTSxHQUFHLEdBQWEsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDbEUsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBRXBELElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQTtZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUE7WUFFOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUTtnQkFDMUIsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGVBQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtZQUViLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQTtZQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7UUFDMUIsQ0FBQztLQUFBO0NBMENGO0FBckdELGtDQXFHQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgKiBhcyBIYW5kbGVycyBmcm9tICcuL2hhbmRsZXJzJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgQmFzZVByb3RvY29sIH0gZnJvbSAnLi4vLi4vYmFzZS1wcm90b2NvbCdcbmltcG9ydCB7IE5vZGUsIElQZWVyRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uJ1xuaW1wb3J0IHsgS2l0c3VuZXRIYW5kbGVyIH0gZnJvbSAnLi9raXRzdW5ldC1oYW5kbGVyJ1xuaW1wb3J0IHsgS3NuRW5jb2RlciB9IGZyb20gJy4va3NuLWVuY29kZXInXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uLy4uL2Jsb2NrY2hhaW4nXG5cbmltcG9ydCB7XG4gIE1lc3NhZ2UsXG4gIE1zZ1R5cGUsXG4gIElLc25Qcm90b2NvbCxcbiAgSWRlbnRpZnksXG4gIE5vZGVUeXBlXG59IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IFNsaWNlSWQgfSBmcm9tICcuLi8uLi8uLi9zbGljZSdcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6a2l0c3VuZXQtcHJvdG8nKVxuXG5jb25zdCBWRVJTSU9OID0gJzEuMC4wJ1xuXG5leHBvcnQgY2xhc3MgS3NuUHJvdG9jb2w8UCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEJhc2VQcm90b2NvbDxQPiBpbXBsZW1lbnRzIElLc25Qcm90b2NvbCB7XG4gIHNsaWNlSWRzOiBTZXQ8YW55PlxuICB0eXBlOiBOb2RlVHlwZVxuICBoYW5kbGVyczogeyBba2V5OiBudW1iZXJdOiBLaXRzdW5ldEhhbmRsZXI8UD4gfVxuICB2ZXJzaW9uczogc3RyaW5nW10gPSBbVkVSU0lPTl1cbiAgdXNlckFnZW50OiBzdHJpbmcgPSAna3NuLWNsaWVudCdcbiAgbGF0ZXN0QmxvY2s6IG51bWJlciB8IG51bGwgPSBudWxsXG5cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiAna3NuJ1xuICB9XG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBwZWVyOiBQLFxuICAgICAgICAgICAgICAgcHVibGljIG5ldHdvcmtQcm92aWRlcjogTm9kZTxQPixcbiAgICAgICAgICAgICAgIHB1YmxpYyBldGhDaGFpbjogRXRoQ2hhaW4pIHtcbiAgICBzdXBlcihwZWVyLCBuZXR3b3JrUHJvdmlkZXIsIG5ldyBLc25FbmNvZGVyKCkpXG4gICAgdGhpcy5zbGljZUlkcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMudHlwZSA9IE5vZGVUeXBlLk5PREVcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fVxuICAgIE9iamVjdC5rZXlzKEhhbmRsZXJzKS5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICBjb25zdCBoID0gUmVmbGVjdC5jb25zdHJ1Y3QoSGFuZGxlcnNbaGFuZGxlcl0sIFt0aGlzLCB0aGlzLnBlZXJdKVxuICAgICAgdGhpcy5oYW5kbGVyc1toLmlkXSA9IGhcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgKnJlY2VpdmU8VCwgVT4gKHJlYWRhYmxlOiBBc3luY0l0ZXJhYmxlPFQ+KTogQXN5bmNJdGVyYWJsZTxVIHwgVVtdIHwgbnVsbD4ge1xuICAgIGZvciBhd2FpdCAoY29uc3QgbXNnIG9mIHN1cGVyLnJlY2VpdmU8VCwgTWVzc2FnZT4ocmVhZGFibGUpIGFzIEFzeW5jSXRlcmFibGU8TWVzc2FnZT4pIHtcbiAgICAgIGlmIChtc2cgJiYgbXNnLnR5cGUgIT09IE1zZ1R5cGUuVU5LTk9XTl9NU0cpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5oYW5kbGVyc1ttc2cudHlwZV0uaGFuZGxlKG1zZylcbiAgICAgICAgaWYgKCFyZXMpIHJldHVybiBudWxsXG4gICAgICAgIGZvciBhd2FpdCAoY29uc3QgZW5jb2RlZCBvZiB0aGlzLmVuY29kZXIhLmVuY29kZShyZXMpKSB7XG4gICAgICAgICAgaWYgKCFlbmNvZGVkKSByZXR1cm4gbnVsbFxuICAgICAgICAgIHlpZWxkIGVuY29kZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VCwgVT4gKG1zZzogVCk6IFByb21pc2UgPFUgfCBVW10gfCB2b2lkIHwgbnVsbD4ge1xuICAgIHJldHVybiBzdXBlci5zZW5kKG1zZywgdGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBpbml0aWF0ZSB0aGUgaWRlbnRpZnkgZmxvd1xuICAgKi9cbiAgYXN5bmMgaGFuZHNoYWtlICgpOiBQcm9taXNlIDx2b2lkPiB7XG4gICAgY29uc3QgcmVzOiBJZGVudGlmeSA9IGF3YWl0IHRoaXMuaGFuZGxlcnNbTXNnVHlwZS5JREVOVElGWV0uc2VuZCgpXG4gICAgaWYgKCFyZXMpIHRocm93IG5ldyBFcnJvcignZW1wdHkgaWRlbnRpZnkgbWVzc2FnZSEnKVxuXG4gICAgdGhpcy52ZXJzaW9ucyA9IHJlcy52ZXJzaW9uc1xuICAgIHRoaXMudXNlckFnZW50ID0gcmVzLnVzZXJBZ2VudFxuXG4gICAgdGhpcy5zbGljZUlkcyA9IHJlcy5zbGljZUlkc1xuICAgICAgPyBuZXcgU2V0KHJlcy5zbGljZUlkcy5tYXAoKHMpID0+IG5ldyBTbGljZUlkKHMudG9TdHJpbmcoKSkpKVxuICAgICAgOiBuZXcgU2V0KClcblxuICAgIHRoaXMubGF0ZXN0QmxvY2sgPSByZXMubGF0ZXN0QmxvY2tcbiAgICB0aGlzLnR5cGUgPSByZXMubm9kZVR5cGVcbiAgfVxuXG4gIC8vIC8qKlxuICAvLyAgKiBHZXQgYWxsIHNsaWNlIGlkcyBmb3IgdGhlIHBlZXJcbiAgLy8gICovXG4gIC8vIGFzeW5jIGdldFNsaWNlSWRzICgpIHtcbiAgLy8gICB0aGlzLnNsaWNlSWRzID0gYXdhaXQgdGhpcy5oYW5kbGVyc1tNc2dUeXBlLlNMSUNFX0lEXS5yZXF1ZXN0KClcbiAgLy8gICByZXR1cm4gdGhpcy5zbGljZUlkc1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIEdldCBzbGljZXMgZm9yIHRoZSBwcm92aWRlZCBpZHMgb3IgYWxsIHRoZVxuICAvLyAgKiBzbGljZXMgdGhlIHBlZXIgaXMgaG9sZGluZ1xuICAvLyAgKlxuICAvLyAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fSBzbGljZXMgLSBvcHRpb25hbFxuICAvLyAgKi9cblxuICAvLyBnZXRTbGljZXNCeUlkIChzbGljZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxTbGljZVtdPiB7XG4gIC8vICAgcmV0dXJuIHRoaXMuaGFuZGxlcnNbTXNnVHlwZS5TTElDRVNdLnJlcXVlc3Qoc2xpY2VzKVxuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIEdldCBhbGwgaGVhZGVyc1xuICAvLyAgKi9cbiAgLy8gYXN5bmMgaGVhZGVycyAoKTogUHJvbWlzZTxCbG9ja0hlYWRlcltdPiB7XG4gIC8vICAgcmV0dXJuIHRoaXMuaGFuZGxlcnNbTXNnVHlwZS5IRUFERVJTXS5yZXF1ZXN0KClcbiAgLy8gfVxuXG4gIC8vIC8qKlxuICAvLyAgKiBHZXQgTm9kZSB0eXBlIC0gYnJpZGdlLCBlZGdlLCBub2RlXG4gIC8vICAqL1xuICAvLyBhc3luYyBub2RlVHlwZSAoKSB7XG4gIC8vICAgdGhpcy50eXBlID0gYXdhaXQgdGhpcy5oYW5kbGVyc1tNc2dUeXBlLk5PREVfVFlQRV0ucmVxdWVzdCgpXG4gIC8vICAgcmV0dXJuIHRoaXMudHlwZVxuICAvLyB9XG5cbiAgLyoqXG4gICAqIFBpbmcgcGVlclxuICAgKi9cbiAgLy8gYXN5bmMgcGluZyAoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIC8vICAgcmV0dXJuIHRoaXMuaGFuZGxlcnNbTXNnVHlwZS5QSU5HXS5yZXF1ZXN0KClcbiAgLy8gfVxufVxuIl19