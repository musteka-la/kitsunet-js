'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../../interfaces");
const rlp_1 = require("rlp");
const utils = __importStar(require("ethereumjs-util"));
class RlpEncoder {
    constructor(type) {
        this.type = type;
    }
    encode(msg) {
        return __asyncGenerator(this, arguments, function* encode_1() {
            if (this.type === interfaces_1.NetworkType.LIBP2P) {
                yield yield __await(rlp_1.encode(msg));
            }
            else {
                yield yield __await([msg.shift(), rlp_1.encode(msg)]);
            }
        });
    }
    decode(msg) {
        return __asyncGenerator(this, arguments, function* decode_1() {
            if (this.type === interfaces_1.NetworkType.LIBP2P) {
                const decoded = rlp_1.decode(msg);
                yield yield __await([utils.bufferToInt(decoded.shift()), ...decoded]);
            }
            else {
                // rlpx already decodes it, so we skip on receive
                yield yield __await(msg);
            }
        });
    }
}
exports.RlpEncoder = RlpEncoder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmxwLWVuY29kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9ldGgvcmxwLWVuY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixpREFBd0Q7QUFDeEQsNkJBQW9DO0FBQ3BDLHVEQUF3QztBQUV4QyxNQUFhLFVBQVU7SUFFckIsWUFBYSxJQUFpQjtRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNsQixDQUFDO0lBRU0sTUFBTSxDQUFRLEdBQVk7O1lBQy9CLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyx3QkFBVyxDQUFDLE1BQU0sRUFBRTtnQkFDcEMsb0JBQU0sWUFBTSxDQUFDLEdBQVUsQ0FBUSxDQUFBLENBQUE7YUFDaEM7aUJBQU07Z0JBQ0wsb0JBQU0sQ0FBRSxHQUFXLENBQUMsS0FBSyxFQUFFLEVBQUUsWUFBTSxDQUFDLEdBQVUsQ0FBQyxDQUFRLENBQUEsQ0FBQTthQUN4RDtRQUNILENBQUM7S0FBQTtJQUVNLE1BQU0sQ0FBUSxHQUFZOztZQUMvQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssd0JBQVcsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BDLE1BQU0sT0FBTyxHQUFVLFlBQU0sQ0FBQyxHQUFZLENBQVUsQ0FBQTtnQkFDcEQsb0JBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFRLENBQUEsQ0FBQTthQUM5RDtpQkFBTTtnQkFDTCxpREFBaUQ7Z0JBQ2pELG9CQUFNLEdBQVUsQ0FBQSxDQUFBO2FBQ2pCO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUF2QkQsZ0NBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IElFbmNvZGVyLCBOZXR3b3JrVHlwZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBlbmNvZGUsIGRlY29kZSB9IGZyb20gJ3JscCdcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJ2V0aGVyZXVtanMtdXRpbCdcblxuZXhwb3J0IGNsYXNzIFJscEVuY29kZXIgaW1wbGVtZW50cyBJRW5jb2RlciB7XG4gIHR5cGU6IE5ldHdvcmtUeXBlXG4gIGNvbnN0cnVjdG9yICh0eXBlOiBOZXR3b3JrVHlwZSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgfVxuXG4gIGFzeW5jICplbmNvZGU8VCwgVT4gKG1zZzogVFtdIHwgVCk6IEFzeW5jSXRlcmFibGU8VT4ge1xuICAgIGlmICh0aGlzLnR5cGUgPT09IE5ldHdvcmtUeXBlLkxJQlAyUCkge1xuICAgICAgeWllbGQgZW5jb2RlKG1zZyBhcyBhbnkpIGFzIGFueVxuICAgIH0gZWxzZSB7XG4gICAgICB5aWVsZCBbKG1zZyBhcyBUW10pLnNoaWZ0KCksIGVuY29kZShtc2cgYXMgYW55KV0gYXMgYW55XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgKmRlY29kZTxULCBVPiAobXNnOiBUW10gfCBUKTogQXN5bmNJdGVyYWJsZTxVPiB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gTmV0d29ya1R5cGUuTElCUDJQKSB7XG4gICAgICBjb25zdCBkZWNvZGVkOiBhbnlbXSA9IGRlY29kZShtc2cgYXMgYW55W10pIGFzIGFueVtdXG4gICAgICB5aWVsZCBbdXRpbHMuYnVmZmVyVG9JbnQoZGVjb2RlZC5zaGlmdCgpKSwgLi4uZGVjb2RlZF0gYXMgYW55XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJscHggYWxyZWFkeSBkZWNvZGVzIGl0LCBzbyB3ZSBza2lwIG9uIHJlY2VpdmVcbiAgICAgIHlpZWxkIG1zZyBhcyBhbnlcbiAgICB9XG4gIH1cbn1cbiJdfQ==