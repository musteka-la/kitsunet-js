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
            this.protocol.emit('message', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2hhbmRsZXJzL3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsZ0RBQTJDO0FBRzNDLHlEQUFtRDtBQUVuRCxNQUFhLE1BQXVDLFNBQVEsd0JBQWE7SUFDdkUsWUFBYSxRQUF3QixFQUN4QixJQUF3QjtRQUNuQyxLQUFLLENBQUMsUUFBUSxFQUFFLHVCQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUF5RDs7WUFDekYsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFBO1lBQzVFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDNUIsZUFBZSxFQUFFLDhCQUFVLENBQUMsZUFBZSxDQUFDO2dCQUM1QyxTQUFTLEVBQUUsOEJBQVUsQ0FBQyxTQUFTLENBQUM7Z0JBQ2hDLEVBQUUsRUFBRSxJQUFJLGVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFdBQVcsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDeEMsTUFBTSxFQUFFLElBQUksZUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7YUFDN0IsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUFBO0lBRUssSUFBSSxDQUFtQixHQUFHLEdBQTZDOztZQUMzRSxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtZQUNuRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLGVBQWU7Z0JBQ2YsU0FBUztnQkFDVCxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsUUFBUTtnQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO2FBQzFDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FBQTtDQUNGO0FBNUJELHdCQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgeyBFdGhIYW5kbGVyIH0gZnJvbSAnLi4vZXRoLWhhbmRsZXInXG5pbXBvcnQgeyBFdGhQcm90b2NvbCB9IGZyb20gJy4uL2V0aC1wcm90b2NvbCdcbmltcG9ydCB7IElQZWVyRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBFVEgsIGJ1ZmZlcjJpbnQgfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcblxuZXhwb3J0IGNsYXNzIFN0YXR1czxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgRXRoSGFuZGxlcjxQPiB7XG4gIGNvbnN0cnVjdG9yIChwcm90b2NvbDogRXRoUHJvdG9jb2w8UD4sXG4gICAgICAgICAgICAgICBwZWVyOiBJUGVlckRlc2NyaXB0b3I8UD4pIHtcbiAgICBzdXBlcignU3RhdHVzJywgRVRILk1FU1NBR0VfQ09ERVMuU1RBVFVTLCBwcm90b2NvbCwgcGVlcilcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZTxVIGV4dGVuZHMgYW55W10+ICguLi5tc2c6IFUgJiBbQnVmZmVyLCBCdWZmZXIsIEJ1ZmZlciwgQnVmZmVyLCBCdWZmZXIsIEJ1ZmZlcl0pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IFtwcm90b2NvbFZlcnNpb24sIG5ldHdvcmtJZCwgdGQsIGJlc3RIYXNoLCBnZW5lc2lzSGFzaCwgX251bWJlcl0gPSBtc2dcbiAgICB0aGlzLnByb3RvY29sLmVtaXQoJ21lc3NhZ2UnLCB7XG4gICAgICBwcm90b2NvbFZlcnNpb246IGJ1ZmZlcjJpbnQocHJvdG9jb2xWZXJzaW9uKSxcbiAgICAgIG5ldHdvcmtJZDogYnVmZmVyMmludChuZXR3b3JrSWQpLFxuICAgICAgdGQ6IG5ldyBCTih0ZCksXG4gICAgICBiZXN0SGFzaDogYmVzdEhhc2gsXG4gICAgICBnZW5lc2lzSGFzaDogZ2VuZXNpc0hhc2gudG9TdHJpbmcoJ2hleCcpLFxuICAgICAgbnVtYmVyOiBuZXcgQk4oX251bWJlciB8fCAwKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBzZW5kPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSAmIFtudW1iZXIsIG51bWJlciwgQk4sIEJ1ZmZlciwgc3RyaW5nXSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgW3Byb3RvY29sVmVyc2lvbiwgbmV0d29ya0lkLCB0ZCwgYmVzdEhhc2gsIGdlbmVzaXNIYXNoXSA9IG1zZ1xuICAgIHJldHVybiB0aGlzLl9zZW5kKFtcbiAgICAgIHByb3RvY29sVmVyc2lvbixcbiAgICAgIG5ldHdvcmtJZCxcbiAgICAgIHRkLnRvQXJyYXlMaWtlKEJ1ZmZlciksXG4gICAgICBiZXN0SGFzaCxcbiAgICAgIEJ1ZmZlci5mcm9tKGdlbmVzaXNIYXNoLnN1YnN0cigyKSwgJ2hleCcpXG4gICAgXSlcbiAgfVxufVxuIl19