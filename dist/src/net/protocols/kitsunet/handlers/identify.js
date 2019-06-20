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
const kitsunet_handler_1 = require("../kitsunet-handler");
const interfaces_1 = require("../interfaces");
const bn_js_1 = __importDefault(require("bn.js"));
class Identify extends kitsunet_handler_1.KitsunetHandler {
    constructor(networkProvider, peer) {
        super('identify', interfaces_1.MsgType.IDENTIFY, networkProvider, peer);
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const block = yield this.protocol.ethChain.getBestBlock();
                const td = (yield this.protocol.ethChain.getBlocksTD()).toArrayLike(Buffer);
                return {
                    type: interfaces_1.MsgType.IDENTIFY,
                    status: interfaces_1.ResponseStatus.OK,
                    payload: {
                        identify: {
                            versions: this.protocol.versions,
                            userAgent: this.protocol.userAgent,
                            nodeType: this.protocol.type,
                            networkId: this.protocol.ethChain.common.networkId(),
                            td,
                            bestHash: block.header.hash(),
                            genesisHash: Buffer.from(this.protocol.ethChain.genesis().hash.substring(2), 'hex'),
                            number: new bn_js_1.default(block.header.number).toArrayLike(Buffer)
                        }
                    }
                };
            }
            catch (e) {
                this.log(e);
                return this.errResponse(e);
            }
        });
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._send({ type: interfaces_1.MsgType.IDENTIFY });
            if (res)
                return res.payload.identify;
        });
    }
}
exports.Identify = Identify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9raXRzdW5ldC9oYW5kbGVycy9pZGVudGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFJWiwwREFBcUQ7QUFFckQsOENBR3NCO0FBQ3RCLGtEQUFzQjtBQUd0QixNQUFhLFFBQXlDLFNBQVEsa0NBQWtCO0lBQzlFLFlBQWEsZUFBK0IsRUFBRSxJQUFPO1FBQ25ELEtBQUssQ0FBQyxVQUFVLEVBQUUsb0JBQU8sQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFFSyxNQUFNOztZQUNWLElBQUk7Z0JBQ0YsTUFBTSxLQUFLLEdBQVUsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtnQkFDaEUsTUFBTSxFQUFFLEdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUNuRixPQUFPO29CQUNMLElBQUksRUFBRSxvQkFBTyxDQUFDLFFBQVE7b0JBQ3RCLE1BQU0sRUFBRSwyQkFBYyxDQUFDLEVBQUU7b0JBQ3pCLE9BQU8sRUFBRTt3QkFDUCxRQUFRLEVBQUU7NEJBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUTs0QkFDaEMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUzs0QkFDbEMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTs0QkFDNUIsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7NEJBQ3BELEVBQUU7NEJBQ0YsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzRCQUM3QixXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQzs0QkFDbkYsTUFBTSxFQUFFLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQzt5QkFDeEQ7cUJBQ0Y7aUJBQ0YsQ0FBQTthQUNGO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDM0I7UUFDSCxDQUFDO0tBQUE7SUFFSyxJQUFJOztZQUNSLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDeEQsSUFBSSxHQUFHO2dCQUFFLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUE7UUFDdEMsQ0FBQztLQUFBO0NBQ0Y7QUFuQ0QsNEJBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IEtzblByb3RvY29sIH0gZnJvbSAnLi4va3NuLXByb3RvY29sJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7IEtpdHN1bmV0SGFuZGxlciB9IGZyb20gJy4uL2tpdHN1bmV0LWhhbmRsZXInXG5cbmltcG9ydCB7XG4gIE1zZ1R5cGUsXG4gIFJlc3BvbnNlU3RhdHVzXG59IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcblxuZXhwb3J0IGNsYXNzIElkZW50aWZ5PFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBLaXRzdW5ldEhhbmRsZXI8UD4ge1xuICBjb25zdHJ1Y3RvciAobmV0d29ya1Byb3ZpZGVyOiBLc25Qcm90b2NvbDxQPiwgcGVlcjogUCkge1xuICAgIHN1cGVyKCdpZGVudGlmeScsIE1zZ1R5cGUuSURFTlRJRlksIG5ldHdvcmtQcm92aWRlciwgcGVlcilcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZSAoKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmxvY2s6IEJsb2NrID0gYXdhaXQgdGhpcy5wcm90b2NvbC5ldGhDaGFpbi5nZXRCZXN0QmxvY2soKVxuICAgICAgY29uc3QgdGQ6IEJ1ZmZlciA9IChhd2FpdCB0aGlzLnByb3RvY29sLmV0aENoYWluLmdldEJsb2Nrc1REKCkpLnRvQXJyYXlMaWtlKEJ1ZmZlcilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IE1zZ1R5cGUuSURFTlRJRlksXG4gICAgICAgIHN0YXR1czogUmVzcG9uc2VTdGF0dXMuT0ssXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBpZGVudGlmeToge1xuICAgICAgICAgICAgdmVyc2lvbnM6IHRoaXMucHJvdG9jb2wudmVyc2lvbnMsXG4gICAgICAgICAgICB1c2VyQWdlbnQ6IHRoaXMucHJvdG9jb2wudXNlckFnZW50LFxuICAgICAgICAgICAgbm9kZVR5cGU6IHRoaXMucHJvdG9jb2wudHlwZSxcbiAgICAgICAgICAgIG5ldHdvcmtJZDogdGhpcy5wcm90b2NvbC5ldGhDaGFpbi5jb21tb24ubmV0d29ya0lkKCksXG4gICAgICAgICAgICB0ZCxcbiAgICAgICAgICAgIGJlc3RIYXNoOiBibG9jay5oZWFkZXIuaGFzaCgpLFxuICAgICAgICAgICAgZ2VuZXNpc0hhc2g6IEJ1ZmZlci5mcm9tKHRoaXMucHJvdG9jb2wuZXRoQ2hhaW4uZ2VuZXNpcygpLmhhc2guc3Vic3RyaW5nKDIpLCAnaGV4JyksXG4gICAgICAgICAgICBudW1iZXI6IG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKS50b0FycmF5TGlrZShCdWZmZXIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5sb2coZSlcbiAgICAgIHJldHVybiB0aGlzLmVyclJlc3BvbnNlKGUpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2VuZCAoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9zZW5kKHsgdHlwZTogTXNnVHlwZS5JREVOVElGWSB9KVxuICAgIGlmIChyZXMpIHJldHVybiByZXMucGF5bG9hZC5pZGVudGlmeVxuICB9XG59XG4iXX0=