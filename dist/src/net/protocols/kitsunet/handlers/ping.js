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
const kitsunet_handler_1 = require("../kitsunet-handler");
const interfaces_1 = require("../interfaces");
class Ping extends kitsunet_handler_1.KitsunetHandler {
    constructor(networkProvider, peer) {
        super('ping', interfaces_1.MsgType.PING, networkProvider, peer);
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                type: interfaces_1.MsgType.PING,
                status: interfaces_1.ResponseStatus.OK
            };
        });
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._send({ type: interfaces_1.MsgType.PING });
        });
    }
}
exports.Ping = Ping;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2tpdHN1bmV0L2hhbmRsZXJzL3BpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7O0FBRVosMERBQXFEO0FBRXJELDhDQUF1RDtBQUl2RCxNQUFhLElBQXFDLFNBQVEsa0NBQWtCO0lBQzFFLFlBQWEsZUFBK0IsRUFBRSxJQUFPO1FBQ25ELEtBQUssQ0FBQyxNQUFNLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFSyxNQUFNOztZQUNWLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLG9CQUFPLENBQUMsSUFBSTtnQkFDbEIsTUFBTSxFQUFFLDJCQUFjLENBQUMsRUFBRTthQUMxQixDQUFBO1FBQ0gsQ0FBQztLQUFBO0lBRUssSUFBSTs7WUFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLENBQUM7S0FBQTtDQUNGO0FBZkQsb0JBZUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgS2l0c3VuZXRIYW5kbGVyIH0gZnJvbSAnLi4va2l0c3VuZXQtaGFuZGxlcidcblxuaW1wb3J0IHsgTXNnVHlwZSwgUmVzcG9uc2VTdGF0dXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7IEtzblByb3RvY29sIH0gZnJvbSAnLi4va3NuLXByb3RvY29sJ1xuXG5leHBvcnQgY2xhc3MgUGluZzxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgS2l0c3VuZXRIYW5kbGVyPFA+IHtcbiAgY29uc3RydWN0b3IgKG5ldHdvcmtQcm92aWRlcjogS3NuUHJvdG9jb2w8UD4sIHBlZXI6IFApIHtcbiAgICBzdXBlcigncGluZycsIE1zZ1R5cGUuUElORywgbmV0d29ya1Byb3ZpZGVyLCBwZWVyKVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlICgpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBNc2dUeXBlLlBJTkcsXG4gICAgICBzdGF0dXM6IFJlc3BvbnNlU3RhdHVzLk9LXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2VuZCAoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fc2VuZCh7IHR5cGU6IE1zZ1R5cGUuUElORyB9KVxuICB9XG59XG4iXX0=