'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const eth_handler_1 = require("../eth-handler");
class GetBlockBodies extends eth_handler_1.EthHandler {
    constructor(protocol, peer) {
        super('GetBlockBodies', ethereumjs_devp2p_1.ETH.MESSAGE_CODES.GET_BLOCK_BODIES, protocol, peer);
    }
    handle(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.protocol.handlers[ethereumjs_devp2p_1.ETH.MESSAGE_CODES.BLOCK_BODIES].send(...msg);
        });
    }
    send(...msg) {
        const [hashes] = msg;
        return this._send(hashes);
    }
}
exports.GetBlockBodies = GetBlockBodies;
class BlockBodies extends eth_handler_1.EthHandler {
    constructor(protocol, peer) {
        super('BlockBodies', ethereumjs_devp2p_1.ETH.MESSAGE_CODES.BLOCK_BODIES, protocol, peer);
    }
    handle(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('message', msg);
        });
    }
    send(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let blocks = (yield Promise
                .all(msg.map((hash) => __awaiter(this, void 0, void 0, function* () {
                const b = yield this
                    .protocol
                    .ethChain
                    .getBlocks(hash, 1);
                return b && b.length ? b[0] : null;
            })))).filter(Boolean);
            if (blocks)
                this._send(blocks.map(block => block.raw.slice(1)));
        });
    }
}
exports.BlockBodies = BlockBodies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stYm9kaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL25ldC9wcm90b2NvbHMvZXRoL2hhbmRsZXJzL2Jsb2NrLWJvZGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7QUFHWix5REFBdUM7QUFFdkMsZ0RBQTJDO0FBRzNDLE1BQWEsY0FBK0MsU0FBUSx3QkFBYTtJQUMvRSxZQUFhLFFBQXdCLEVBQ3hCLElBQXdCO1FBQ25DLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDN0UsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUFtQjs7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsdUJBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDckUsQ0FBQztLQUFBO0lBRUQsSUFBSSxDQUFtQixHQUFHLEdBQU07UUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDM0IsQ0FBQztDQUNGO0FBZEQsd0NBY0M7QUFFRCxNQUFhLFdBQTZDLFNBQVEsd0JBQWE7SUFDN0UsWUFBYSxRQUF3QixFQUN4QixJQUF3QjtRQUNuQyxLQUFLLENBQUMsYUFBYSxFQUFFLHVCQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDdEUsQ0FBQztJQUVLLE1BQU0sQ0FBbUIsR0FBRyxHQUFNOztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUMzQixDQUFDO0tBQUE7SUFFSyxJQUFJLENBQW1CLEdBQUcsR0FBbUI7O1lBQ2pELElBQUksTUFBTSxHQUF3QixDQUFDLE1BQU0sT0FBTztpQkFDN0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBTyxJQUFJLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxDQUFDLEdBQXdCLE1BQU0sSUFBSTtxQkFDdEMsUUFBUTtxQkFDUixRQUFRO3FCQUNSLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1lBQ3BDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQXVCLENBQUE7WUFDNUMsSUFBSSxNQUFNO2dCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNqRSxDQUFDO0tBQUE7Q0FDRjtBQXJCRCxrQ0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5pbXBvcnQgeyBFVEggfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcbmltcG9ydCB7IElQZWVyRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBFdGhIYW5kbGVyIH0gZnJvbSAnLi4vZXRoLWhhbmRsZXInXG5pbXBvcnQgeyBFdGhQcm90b2NvbCB9IGZyb20gJy4uL2V0aC1wcm90b2NvbCdcblxuZXhwb3J0IGNsYXNzIEdldEJsb2NrQm9kaWVzPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFdGhIYW5kbGVyPFA+IHtcbiAgY29uc3RydWN0b3IgKHByb3RvY29sOiBFdGhQcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHBlZXI6IElQZWVyRGVzY3JpcHRvcjxQPikge1xuICAgIHN1cGVyKCdHZXRCbG9ja0JvZGllcycsIEVUSC5NRVNTQUdFX0NPREVTLkdFVF9CTE9DS19CT0RJRVMsIHByb3RvY29sLCBwZWVyKVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSAmIFtCdWZmZXJdW10pOiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMucHJvdG9jb2wuaGFuZGxlcnNbRVRILk1FU1NBR0VfQ09ERVMuQkxPQ0tfQk9ESUVTXS5zZW5kKC4uLm1zZylcbiAgfVxuXG4gIHNlbmQ8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBbaGFzaGVzXSA9IG1zZ1xuICAgIHJldHVybiB0aGlzLl9zZW5kKGhhc2hlcylcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmxvY2tCb2RpZXMgPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFdGhIYW5kbGVyPFA+IHtcbiAgY29uc3RydWN0b3IgKHByb3RvY29sOiBFdGhQcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHBlZXI6IElQZWVyRGVzY3JpcHRvcjxQPikge1xuICAgIHN1cGVyKCdCbG9ja0JvZGllcycsIEVUSC5NRVNTQUdFX0NPREVTLkJMT0NLX0JPRElFUywgcHJvdG9jb2wsIHBlZXIpXG4gIH1cblxuICBhc3luYyBoYW5kbGU8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBtc2cpXG4gIH1cblxuICBhc3luYyBzZW5kPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSAmIFtCdWZmZXJdW10pOiBQcm9taXNlPGFueT4ge1xuICAgIGxldCBibG9ja3M6IEJsb2NrW10gfCB1bmRlZmluZWQgPSAoYXdhaXQgUHJvbWlzZVxuICAgICAgLmFsbChtc2cubWFwKGFzeW5jIChoYXNoKSA9PiB7XG4gICAgICAgIGNvbnN0IGI6IEJsb2NrW10gfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzXG4gICAgICAgICAgLnByb3RvY29sXG4gICAgICAgICAgLmV0aENoYWluXG4gICAgICAgICAgLmdldEJsb2NrcyhoYXNoLCAxKVxuICAgICAgICByZXR1cm4gYiAmJiBiLmxlbmd0aCA/IGJbMF0gOiBudWxsXG4gICAgICB9KSkpLmZpbHRlcihCb29sZWFuKSBhcyB1bmtub3duIGFzIEJsb2NrW11cbiAgICBpZiAoYmxvY2tzKSB0aGlzLl9zZW5kKGJsb2Nrcy5tYXAoYmxvY2sgPT4gYmxvY2sucmF3LnNsaWNlKDEpKSlcbiAgfVxufVxuIl19