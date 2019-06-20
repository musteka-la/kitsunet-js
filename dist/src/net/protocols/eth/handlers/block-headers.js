'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const bn_js_1 = __importDefault(require("bn.js"));
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const utils = __importStar(require("ethereumjs-util"));
const eth_handler_1 = require("../eth-handler");
const eth_protocol_1 = require("../eth-protocol");
class GetBlockHeaders extends eth_handler_1.EthHandler {
    constructor(protocol, peer) {
        super('GetBlockHeaders', eth_protocol_1.MSG_CODES.GET_BLOCK_HEADERS, protocol, peer);
    }
    handle(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.protocol.handlers[eth_protocol_1.MSG_CODES.BLOCK_HEADERS].send(...msg);
        });
    }
    send(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const [blockId, max, skip, reverse] = msg;
            const block = bn_js_1.default.isBN(blockId) ? blockId.toArrayLike(Buffer) : blockId;
            return this._send([block, max, skip || 0, reverse || 0]);
        });
    }
}
exports.GetBlockHeaders = GetBlockHeaders;
class BlockHeaders extends eth_handler_1.EthHandler {
    constructor(protocol, peer) {
        super('BlockHeaders', eth_protocol_1.MSG_CODES.BLOCK_HEADERS, protocol, peer);
    }
    handle(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('message', msg.map(raw => new ethereumjs_block_1.default.Header(raw)));
        });
    }
    send(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const [block, max, skip, reverse] = msg;
            const headers = yield this
                .protocol
                .ethChain
                .getHeaders(Buffer.isBuffer(block) && block.length === 32 ? block : new bn_js_1.default(block), Buffer.isBuffer(max) ? utils.bufferToInt(max) : max, Buffer.isBuffer(skip) ? utils.bufferToInt(skip) : skip, Buffer.isBuffer(skip) ? Boolean(utils.bufferToInt(skip)) : Boolean(reverse));
            return this._send(headers.map((h) => h.raw));
        });
    }
}
exports.BlockHeaders = BlockHeaders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2staGVhZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2V0aC9oYW5kbGVycy9ibG9jay1oZWFkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBQ3BDLHVEQUF3QztBQUN4QyxnREFBMkM7QUFFM0Msa0RBQXdEO0FBR3hELE1BQWEsZUFBZ0QsU0FBUSx3QkFBYTtJQUNoRixZQUFhLFFBQXdCLEVBQ3hCLElBQXdCO1FBQ25DLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSx3QkFBUyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUN2RSxDQUFDO0lBRUssTUFBTSxDQUFtQixHQUFHLEdBQU07O1lBQ3RDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsd0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUNyRSxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQW1CLEdBQUcsR0FBNEI7O1lBQzFELE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUE7WUFDekMsTUFBTSxLQUFLLEdBQUcsZUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1lBQ3RFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFFLENBQUMsQ0FBQTtRQUM1RCxDQUFDO0tBQUE7Q0FDRjtBQWZELDBDQWVDO0FBR0QsTUFBYSxZQUE2QyxTQUFRLHdCQUFhO0lBQzdFLFlBQWEsUUFBd0IsRUFDeEIsSUFBd0I7UUFDbkMsS0FBSyxDQUFDLGNBQWMsRUFBRSx3QkFBUyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDaEUsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUFNOztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSwwQkFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDN0QsQ0FBQztLQUFBO0lBRUssSUFBSSxDQUFtQixHQUFHLEdBQXFCOztZQUNuRCxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFBO1lBQ3ZDLE1BQU0sT0FBTyxHQUFtQixNQUFNLElBQUk7aUJBQ3ZDLFFBQVE7aUJBQ1IsUUFBUTtpQkFDUixVQUFVLENBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsRUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBbUIsQ0FBQTtZQUNsRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbkQsQ0FBQztLQUFBO0NBQ0Y7QUF0QkQsb0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCTiBmcm9tICdibi5qcydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnZXRoZXJldW1qcy11dGlsJ1xuaW1wb3J0IHsgRXRoSGFuZGxlciB9IGZyb20gJy4uL2V0aC1oYW5kbGVyJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7IEV0aFByb3RvY29sLCBNU0dfQ09ERVMgfSBmcm9tICcuLi9ldGgtcHJvdG9jb2wnXG5cbmV4cG9ydCB0eXBlIEJsb2NrSGVhZGVyc1JlcXVlc3QgPSBbQnVmZmVyIHwgQk4gfCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBib29sZWFuXVxuZXhwb3J0IGNsYXNzIEdldEJsb2NrSGVhZGVyczxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgRXRoSGFuZGxlcjxQPiB7XG4gIGNvbnN0cnVjdG9yIChwcm90b2NvbDogRXRoUHJvdG9jb2w8UD4sXG4gICAgICAgICAgICAgICBwZWVyOiBJUGVlckRlc2NyaXB0b3I8UD4pIHtcbiAgICBzdXBlcignR2V0QmxvY2tIZWFkZXJzJywgTVNHX0NPREVTLkdFVF9CTE9DS19IRUFERVJTLCBwcm90b2NvbCwgcGVlcilcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZTxVIGV4dGVuZHMgYW55W10+ICguLi5tc2c6IFUpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnByb3RvY29sLmhhbmRsZXJzW01TR19DT0RFUy5CTE9DS19IRUFERVJTXS5zZW5kKC4uLm1zZylcbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVICYgQmxvY2tIZWFkZXJzUmVxdWVzdCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgW2Jsb2NrSWQsIG1heCwgc2tpcCwgcmV2ZXJzZV0gPSBtc2dcbiAgICBjb25zdCBibG9jayA9IEJOLmlzQk4oYmxvY2tJZCkgPyBibG9ja0lkLnRvQXJyYXlMaWtlKEJ1ZmZlcikgOiBibG9ja0lkXG4gICAgcmV0dXJuIHRoaXMuX3NlbmQoWyBibG9jaywgbWF4LCBza2lwIHx8IDAsIHJldmVyc2UgfHwgMCBdKVxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEJsb2NrUmVxdWVzdCA9IFtudW1iZXIgfCBCdWZmZXIgfCBCTiwgbnVtYmVyIHwgQnVmZmVyLCBudW1iZXIgfCBCdWZmZXIsIGJvb2xlYW4gfCBCdWZmZXJdXG5leHBvcnQgY2xhc3MgQmxvY2tIZWFkZXJzPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFdGhIYW5kbGVyPFA+IHtcbiAgY29uc3RydWN0b3IgKHByb3RvY29sOiBFdGhQcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHBlZXI6IElQZWVyRGVzY3JpcHRvcjxQPikge1xuICAgIHN1cGVyKCdCbG9ja0hlYWRlcnMnLCBNU0dfQ09ERVMuQkxPQ0tfSEVBREVSUywgcHJvdG9jb2wsIHBlZXIpXG4gIH1cblxuICBhc3luYyBoYW5kbGU8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBtc2cubWFwKHJhdyA9PiBuZXcgQmxvY2suSGVhZGVyKHJhdykpKVxuICB9XG5cbiAgYXN5bmMgc2VuZDxVIGV4dGVuZHMgYW55W10+ICguLi5tc2c6IFUgJiBCbG9ja1JlcXVlc3QpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IFtibG9jaywgbWF4LCBza2lwLCByZXZlcnNlXSA9IG1zZ1xuICAgIGNvbnN0IGhlYWRlcnM6IEJsb2NrLkhlYWRlcltdID0gYXdhaXQgdGhpc1xuICAgICAgLnByb3RvY29sXG4gICAgICAuZXRoQ2hhaW5cbiAgICAgIC5nZXRIZWFkZXJzKFxuICAgICAgICBCdWZmZXIuaXNCdWZmZXIoYmxvY2spICYmIGJsb2NrLmxlbmd0aCA9PT0gMzIgPyBibG9jayA6IG5ldyBCTihibG9jayksXG4gICAgICAgIEJ1ZmZlci5pc0J1ZmZlcihtYXgpID8gdXRpbHMuYnVmZmVyVG9JbnQobWF4KSA6IG1heCxcbiAgICAgICAgQnVmZmVyLmlzQnVmZmVyKHNraXApID8gdXRpbHMuYnVmZmVyVG9JbnQoc2tpcCkgOiBza2lwLFxuICAgICAgICBCdWZmZXIuaXNCdWZmZXIoc2tpcCkgPyBCb29sZWFuKHV0aWxzLmJ1ZmZlclRvSW50KHNraXApKSA6IEJvb2xlYW4ocmV2ZXJzZSkpIGFzIEJsb2NrLkhlYWRlcltdXG4gICAgcmV0dXJuIHRoaXMuX3NlbmQoaGVhZGVycy5tYXAoKGg6IGFueSkgPT4gaC5yYXcpKVxuICB9XG59XG4iXX0=