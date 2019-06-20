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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const proto_1 = __importDefault(require("./proto"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:kitsunet-encoder');
const { Kitsunet } = proto_1.default;
class KsnEncoder {
    encode(msg) {
        return __asyncGenerator(this, arguments, function* encode_1() {
            try {
                yield yield __await(Kitsunet.encode(msg));
            }
            catch (e) {
                debug('an error occurred encoding msg', e);
            }
        });
    }
    decode(msg) {
        return __asyncGenerator(this, arguments, function* decode_1() {
            try {
                yield yield __await(Kitsunet.decode(msg));
            }
            catch (e) {
                debug('an error occurred decoding msg', e);
            }
        });
    }
}
exports.KsnEncoder = KsnEncoder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLWVuY29kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9raXRzdW5ldC9rc24tZW5jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR1osb0RBQTJCO0FBQzNCLGtEQUF5QjtBQUV6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtBQUVoRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFBO0FBQzFCLE1BQWEsVUFBVTtJQUNkLE1BQU0sQ0FBUSxHQUFNOztZQUN6QixJQUFJO2dCQUNGLG9CQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQTthQUMzQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUMzQztRQUNILENBQUM7S0FBQTtJQUVNLE1BQU0sQ0FBUSxHQUFNOztZQUN6QixJQUFJO2dCQUNGLG9CQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQTthQUMzQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUMzQztRQUNILENBQUM7S0FBQTtDQUNGO0FBaEJELGdDQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBJRW5jb2RlciB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgcHJvdG8gZnJvbSAnLi9wcm90bydcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6a2l0c3VuZXQtZW5jb2RlcicpXG5cbmNvbnN0IHsgS2l0c3VuZXQgfSA9IHByb3RvXG5leHBvcnQgY2xhc3MgS3NuRW5jb2RlciBpbXBsZW1lbnRzIElFbmNvZGVyIHtcbiAgYXN5bmMgKmVuY29kZTxULCBVPiAobXNnOiBUKTogQXN5bmNJdGVyYWJsZTxVPiB7XG4gICAgdHJ5IHtcbiAgICAgIHlpZWxkIEtpdHN1bmV0LmVuY29kZShtc2cpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoJ2FuIGVycm9yIG9jY3VycmVkIGVuY29kaW5nIG1zZycsIGUpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgKmRlY29kZTxULCBVPiAobXNnOiBUKTogQXN5bmNJdGVyYWJsZTxVPiB7XG4gICAgdHJ5IHtcbiAgICAgIHlpZWxkIEtpdHN1bmV0LmRlY29kZShtc2cpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoJ2FuIGVycm9yIG9jY3VycmVkIGRlY29kaW5nIG1zZycsIGUpXG4gICAgfVxuICB9XG59XG4iXX0=