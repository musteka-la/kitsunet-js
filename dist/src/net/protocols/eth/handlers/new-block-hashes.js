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
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const eth_handler_1 = require("../eth-handler");
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
class NewBlockHashes extends eth_handler_1.EthHandler {
    constructor(protocol, peer) {
        super('NewBlockHashes', ethereumjs_devp2p_1.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, protocol, peer);
    }
    handle(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            // emit on the provider
            const announced = msg.map(hn => [hn[0], new bn_js_1.default(hn[1])]);
            this.protocol.emit('new-block-hashes', announced);
        });
    }
    send(...hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._send(hashes.map(hn => {
                return [hn[0], hn[1].toArrayLike(Buffer)];
            }));
        });
    }
}
exports.NewBlockHashes = NewBlockHashes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LWJsb2NrLWhhc2hlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2V0aC9oYW5kbGVycy9uZXctYmxvY2staGFzaGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUFzQjtBQUN0QixnREFBMkM7QUFHM0MseURBQXVDO0FBRXZDLE1BQWEsY0FBK0MsU0FBUSx3QkFBYTtJQUMvRSxZQUFhLFFBQXdCLEVBQ3hCLElBQXdCO1FBQ25DLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDN0UsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUFNOztZQUN0Qyx1QkFBdUI7WUFDdkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUNuRCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQW1CLEdBQUcsTUFBNEI7O1lBQzFELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUMzQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztLQUFBO0NBQ0Y7QUFqQkQsd0NBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCTiBmcm9tICdibi5qcydcbmltcG9ydCB7IEV0aEhhbmRsZXIgfSBmcm9tICcuLi9ldGgtaGFuZGxlcidcbmltcG9ydCB7IEV0aFByb3RvY29sIH0gZnJvbSAnLi4vZXRoLXByb3RvY29sJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7IEVUSCB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuXG5leHBvcnQgY2xhc3MgTmV3QmxvY2tIYXNoZXM8UCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEV0aEhhbmRsZXI8UD4ge1xuICBjb25zdHJ1Y3RvciAocHJvdG9jb2w6IEV0aFByb3RvY29sPFA+LFxuICAgICAgICAgICAgICAgcGVlcjogSVBlZXJEZXNjcmlwdG9yPFA+KSB7XG4gICAgc3VwZXIoJ05ld0Jsb2NrSGFzaGVzJywgRVRILk1FU1NBR0VfQ09ERVMuTkVXX0JMT0NLX0hBU0hFUywgcHJvdG9jb2wsIHBlZXIpXG4gIH1cblxuICBhc3luYyBoYW5kbGU8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVKTogUHJvbWlzZTxhbnk+IHtcbiAgICAvLyBlbWl0IG9uIHRoZSBwcm92aWRlclxuICAgIGNvbnN0IGFubm91bmNlZCA9IG1zZy5tYXAoaG4gPT4gW2huWzBdLCBuZXcgQk4oaG5bMV0pXSlcbiAgICB0aGlzLnByb3RvY29sLmVtaXQoJ25ldy1ibG9jay1oYXNoZXMnLCBhbm5vdW5jZWQpXG4gIH1cblxuICBhc3luYyBzZW5kPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLmhhc2hlczogVSAmIFtbQnVmZmVyLCBCTl1bXV0pOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9zZW5kKGhhc2hlcy5tYXAoaG4gPT4ge1xuICAgICAgcmV0dXJuIFtoblswXSwgaG5bMV0udG9BcnJheUxpa2UoQnVmZmVyKV1cbiAgICB9KSlcbiAgfVxufVxuIl19