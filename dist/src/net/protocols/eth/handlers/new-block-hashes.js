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
            this.protocol.emit('message', announced);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LWJsb2NrLWhhc2hlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2V0aC9oYW5kbGVycy9uZXctYmxvY2staGFzaGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7OztBQUVaLGtEQUFzQjtBQUN0QixnREFBMkM7QUFHM0MseURBQXVDO0FBRXZDLE1BQWEsY0FBK0MsU0FBUSx3QkFBYTtJQUMvRSxZQUFhLFFBQXdCLEVBQ3hCLElBQXdCO1FBQ25DLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDN0UsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUFNOztZQUN0Qyx1QkFBdUI7WUFDdkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDMUMsQ0FBQztLQUFBO0lBRUssSUFBSSxDQUFtQixHQUFHLE1BQTRCOztZQUMxRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDM0MsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNMLENBQUM7S0FBQTtDQUNGO0FBakJELHdDQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgeyBFdGhIYW5kbGVyIH0gZnJvbSAnLi4vZXRoLWhhbmRsZXInXG5pbXBvcnQgeyBFdGhQcm90b2NvbCB9IGZyb20gJy4uL2V0aC1wcm90b2NvbCdcbmltcG9ydCB7IElQZWVyRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBFVEggfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcblxuZXhwb3J0IGNsYXNzIE5ld0Jsb2NrSGFzaGVzPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFdGhIYW5kbGVyPFA+IHtcbiAgY29uc3RydWN0b3IgKHByb3RvY29sOiBFdGhQcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHBlZXI6IElQZWVyRGVzY3JpcHRvcjxQPikge1xuICAgIHN1cGVyKCdOZXdCbG9ja0hhc2hlcycsIEVUSC5NRVNTQUdFX0NPREVTLk5FV19CTE9DS19IQVNIRVMsIHByb3RvY29sLCBwZWVyKVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSk6IFByb21pc2U8YW55PiB7XG4gICAgLy8gZW1pdCBvbiB0aGUgcHJvdmlkZXJcbiAgICBjb25zdCBhbm5vdW5jZWQgPSBtc2cubWFwKGhuID0+IFtoblswXSwgbmV3IEJOKGhuWzFdKV0pXG4gICAgdGhpcy5wcm90b2NvbC5lbWl0KCdtZXNzYWdlJywgYW5ub3VuY2VkKVxuICB9XG5cbiAgYXN5bmMgc2VuZDxVIGV4dGVuZHMgYW55W10+ICguLi5oYXNoZXM6IFUgJiBbW0J1ZmZlciwgQk5dW11dKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fc2VuZChoYXNoZXMubWFwKGhuID0+IHtcbiAgICAgIHJldHVybiBbaG5bMF0sIGhuWzFdLnRvQXJyYXlMaWtlKEJ1ZmZlcildXG4gICAgfSkpXG4gIH1cbn1cbiJdfQ==