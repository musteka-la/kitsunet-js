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
            const status = {
                protocolVersion: ethereumjs_devp2p_1.buffer2int(protocolVersion),
                networkId: ethereumjs_devp2p_1.buffer2int(networkId),
                td: new bn_js_1.default(td),
                bestHash: bestHash,
                genesisHash: genesisHash.toString('hex'),
                number: new bn_js_1.default(_number || 0)
            };
            yield this.protocol.setStatus(status);
            this.emit('message', status);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2hhbmRsZXJzL3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsZ0RBQTJDO0FBRzNDLHlEQUFtRDtBQUVuRCxNQUFhLE1BQXVDLFNBQVEsd0JBQWE7SUFDdkUsWUFBYSxRQUF3QixFQUN4QixJQUF3QjtRQUNuQyxLQUFLLENBQUMsUUFBUSxFQUFFLHVCQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUF5RDs7WUFDekYsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFBO1lBQzVFLE1BQU0sTUFBTSxHQUFHO2dCQUNiLGVBQWUsRUFBRSw4QkFBVSxDQUFDLGVBQWUsQ0FBQztnQkFDNUMsU0FBUyxFQUFFLDhCQUFVLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxFQUFFLEVBQUUsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNkLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixXQUFXLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLE1BQU0sRUFBRSxJQUFJLGVBQUUsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO2FBQzdCLENBQUE7WUFDRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzlCLENBQUM7S0FBQTtJQUVLLElBQUksQ0FBbUIsR0FBRyxHQUE2Qzs7WUFDM0UsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxHQUFHLENBQUE7WUFDbkUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNoQixlQUFlO2dCQUNmLFNBQVM7Z0JBQ1QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLFFBQVE7Z0JBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQzthQUMxQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQUE7Q0FDRjtBQTlCRCx3QkE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IHsgRXRoSGFuZGxlciB9IGZyb20gJy4uL2V0aC1oYW5kbGVyJ1xuaW1wb3J0IHsgRXRoUHJvdG9jb2wgfSBmcm9tICcuLi9ldGgtcHJvdG9jb2wnXG5pbXBvcnQgeyBJUGVlckRlc2NyaXB0b3IgfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgRVRILCBidWZmZXIyaW50IH0gZnJvbSAnZXRoZXJldW1qcy1kZXZwMnAnXG5cbmV4cG9ydCBjbGFzcyBTdGF0dXM8UCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEV0aEhhbmRsZXI8UD4ge1xuICBjb25zdHJ1Y3RvciAocHJvdG9jb2w6IEV0aFByb3RvY29sPFA+LFxuICAgICAgICAgICAgICAgcGVlcjogSVBlZXJEZXNjcmlwdG9yPFA+KSB7XG4gICAgc3VwZXIoJ1N0YXR1cycsIEVUSC5NRVNTQUdFX0NPREVTLlNUQVRVUywgcHJvdG9jb2wsIHBlZXIpXG4gIH1cblxuICBhc3luYyBoYW5kbGU8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVICYgW0J1ZmZlciwgQnVmZmVyLCBCdWZmZXIsIEJ1ZmZlciwgQnVmZmVyLCBCdWZmZXJdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBbcHJvdG9jb2xWZXJzaW9uLCBuZXR3b3JrSWQsIHRkLCBiZXN0SGFzaCwgZ2VuZXNpc0hhc2gsIF9udW1iZXJdID0gbXNnXG4gICAgY29uc3Qgc3RhdHVzID0ge1xuICAgICAgcHJvdG9jb2xWZXJzaW9uOiBidWZmZXIyaW50KHByb3RvY29sVmVyc2lvbiksXG4gICAgICBuZXR3b3JrSWQ6IGJ1ZmZlcjJpbnQobmV0d29ya0lkKSxcbiAgICAgIHRkOiBuZXcgQk4odGQpLFxuICAgICAgYmVzdEhhc2g6IGJlc3RIYXNoLFxuICAgICAgZ2VuZXNpc0hhc2g6IGdlbmVzaXNIYXNoLnRvU3RyaW5nKCdoZXgnKSxcbiAgICAgIG51bWJlcjogbmV3IEJOKF9udW1iZXIgfHwgMClcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5wcm90b2NvbC5zZXRTdGF0dXMoc3RhdHVzKVxuICAgIHRoaXMuZW1pdCgnbWVzc2FnZScsIHN0YXR1cylcbiAgfVxuXG4gIGFzeW5jIHNlbmQ8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVICYgW251bWJlciwgbnVtYmVyLCBCTiwgQnVmZmVyLCBzdHJpbmddKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBbcHJvdG9jb2xWZXJzaW9uLCBuZXR3b3JrSWQsIHRkLCBiZXN0SGFzaCwgZ2VuZXNpc0hhc2hdID0gbXNnXG4gICAgcmV0dXJuIHRoaXMuX3NlbmQoW1xuICAgICAgcHJvdG9jb2xWZXJzaW9uLFxuICAgICAgbmV0d29ya0lkLFxuICAgICAgdGQudG9BcnJheUxpa2UoQnVmZmVyKSxcbiAgICAgIGJlc3RIYXNoLFxuICAgICAgQnVmZmVyLmZyb20oZ2VuZXNpc0hhc2guc3Vic3RyKDIpLCAnaGV4JylcbiAgICBdKVxuICB9XG59XG4iXX0=