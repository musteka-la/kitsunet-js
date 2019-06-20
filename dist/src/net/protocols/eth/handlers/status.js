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
class Status extends eth_handler_1.EthHandler {
    constructor(protocol, peer) {
        super('Status', ethereumjs_devp2p_1.ETH.MESSAGE_CODES.STATUS, protocol, peer);
    }
    handle(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const [protocolVersion, networkId, td, bestHash, genesisHash, _number] = msg;
            this.protocol.setStatus({
                protocolVersion: ethereumjs_devp2p_1.buffer2int(protocolVersion),
                networkId: ethereumjs_devp2p_1.buffer2int(networkId),
                td: new bn_js_1.default(td),
                bestHash: bestHash,
                genesisHash: genesisHash.toString('hex'),
                number: new bn_js_1.default(_number || 0)
            });
        });
    }
    send(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const [protocolVersion, networkId, td, bestHash, genesisHash] = msg;
            return this._send([
                protocolVersion,
                networkId,
                td.toArrayLike(Buffer),
                bestHash,
                Buffer.from(genesisHash.substr(2), 'hex')
            ]);
        });
    }
}
exports.Status = Status;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2hhbmRsZXJzL3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsZ0RBQTJDO0FBRzNDLHlEQUFtRDtBQUVuRCxNQUFhLE1BQXVDLFNBQVEsd0JBQWE7SUFDdkUsWUFBYSxRQUF3QixFQUN4QixJQUF3QjtRQUNuQyxLQUFLLENBQUMsUUFBUSxFQUFFLHVCQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUF5RDs7WUFDekYsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFBO1lBQzVFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2dCQUN0QixlQUFlLEVBQUUsOEJBQVUsQ0FBQyxlQUFlLENBQUM7Z0JBQzVDLFNBQVMsRUFBRSw4QkFBVSxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsRUFBRSxFQUFFLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDZCxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUN4QyxNQUFNLEVBQUUsSUFBSSxlQUFFLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQzthQUM3QixDQUFDLENBQUE7UUFDSixDQUFDO0tBQUE7SUFFSyxJQUFJLENBQW1CLEdBQUcsR0FBNkM7O1lBQzNFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLEdBQUcsR0FBRyxDQUFBO1lBQ25FLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDaEIsZUFBZTtnQkFDZixTQUFTO2dCQUNULEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUN0QixRQUFRO2dCQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7YUFDMUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUFBO0NBQ0Y7QUE1QkQsd0JBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCTiBmcm9tICdibi5qcydcbmltcG9ydCB7IEV0aEhhbmRsZXIgfSBmcm9tICcuLi9ldGgtaGFuZGxlcidcbmltcG9ydCB7IEV0aFByb3RvY29sIH0gZnJvbSAnLi4vZXRoLXByb3RvY29sJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7IEVUSCwgYnVmZmVyMmludCB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuXG5leHBvcnQgY2xhc3MgU3RhdHVzPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFdGhIYW5kbGVyPFA+IHtcbiAgY29uc3RydWN0b3IgKHByb3RvY29sOiBFdGhQcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHBlZXI6IElQZWVyRGVzY3JpcHRvcjxQPikge1xuICAgIHN1cGVyKCdTdGF0dXMnLCBFVEguTUVTU0FHRV9DT0RFUy5TVEFUVVMsIHByb3RvY29sLCBwZWVyKVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSAmIFtCdWZmZXIsIEJ1ZmZlciwgQnVmZmVyLCBCdWZmZXIsIEJ1ZmZlciwgQnVmZmVyXSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgW3Byb3RvY29sVmVyc2lvbiwgbmV0d29ya0lkLCB0ZCwgYmVzdEhhc2gsIGdlbmVzaXNIYXNoLCBfbnVtYmVyXSA9IG1zZ1xuICAgIHRoaXMucHJvdG9jb2wuc2V0U3RhdHVzKHtcbiAgICAgIHByb3RvY29sVmVyc2lvbjogYnVmZmVyMmludChwcm90b2NvbFZlcnNpb24pLFxuICAgICAgbmV0d29ya0lkOiBidWZmZXIyaW50KG5ldHdvcmtJZCksXG4gICAgICB0ZDogbmV3IEJOKHRkKSxcbiAgICAgIGJlc3RIYXNoOiBiZXN0SGFzaCxcbiAgICAgIGdlbmVzaXNIYXNoOiBnZW5lc2lzSGFzaC50b1N0cmluZygnaGV4JyksXG4gICAgICBudW1iZXI6IG5ldyBCTihfbnVtYmVyIHx8IDApXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVICYgW251bWJlciwgbnVtYmVyLCBCTiwgQnVmZmVyLCBzdHJpbmddKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBbcHJvdG9jb2xWZXJzaW9uLCBuZXR3b3JrSWQsIHRkLCBiZXN0SGFzaCwgZ2VuZXNpc0hhc2hdID0gbXNnXG4gICAgcmV0dXJuIHRoaXMuX3NlbmQoW1xuICAgICAgcHJvdG9jb2xWZXJzaW9uLFxuICAgICAgbmV0d29ya0lkLFxuICAgICAgdGQudG9BcnJheUxpa2UoQnVmZmVyKSxcbiAgICAgIGJlc3RIYXNoLFxuICAgICAgQnVmZmVyLmZyb20oZ2VuZXNpc0hhc2guc3Vic3RyKDIpLCAnaGV4JylcbiAgICBdKVxuICB9XG59XG4iXX0=