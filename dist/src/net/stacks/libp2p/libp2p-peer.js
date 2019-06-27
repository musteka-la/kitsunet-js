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
const network_peer_1 = require("../../network-peer");
class Libp2pPeer extends network_peer_1.NetworkPeer {
    get id() {
        return this.peer.id.toB58String();
    }
    get addrs() {
        return this.peer.multiaddrs.toArray().map((a) => a.toString());
    }
    constructor(peer, node) {
        super();
        this.peer = peer;
        this.node = node;
    }
    disconnect(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.node)
                return this.node.disconnectPeer(this, reason);
        });
    }
    ban(reason, maxAge) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.node)
                return this.node.banPeer(this, maxAge, reason);
        });
    }
}
exports.Libp2pPeer = Libp2pPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7O0FBR1oscURBQWdEO0FBR2hELE1BQWEsVUFBVyxTQUFRLDBCQUFpQztJQUcvRCxJQUFJLEVBQUU7UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ25DLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFDaEUsQ0FBQztJQUVELFlBQWEsSUFBYyxFQUFFLElBQTRCO1FBQ3ZELEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUVLLFVBQVUsQ0FBaUIsTUFBVTs7WUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM5RCxDQUFDO0tBQUE7SUFFSyxHQUFHLENBQWlCLE1BQVUsRUFBRSxNQUFlOztZQUNuRCxJQUFJLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUMvRCxDQUFDO0tBQUE7Q0FDRjtBQXhCRCxnQ0F3QkMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi4vLi4vbmV0d29yay1wZWVyJ1xuaW1wb3J0IHsgRXh0cmFjdEZyb21MaWJwMnBQZWVyIH0gZnJvbSAnLi4vLi4vaGVscGVyLXR5cGVzJ1xuXG5leHBvcnQgY2xhc3MgTGlicDJwUGVlciBleHRlbmRzIE5ldHdvcmtQZWVyPFBlZXJJbmZvLCBMaWJwMnBQZWVyPiB7XG4gIG5vZGU/OiBFeHRyYWN0RnJvbUxpYnAycFBlZXJcbiAgcGVlcjogUGVlckluZm9cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBlZXIuaWQudG9CNThTdHJpbmcoKVxuICB9XG5cbiAgZ2V0IGFkZHJzICgpOiBTZXQ8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMucGVlci5tdWx0aWFkZHJzLnRvQXJyYXkoKS5tYXAoKGEpID0+IGEudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQZWVySW5mbywgbm9kZT86IEV4dHJhY3RGcm9tTGlicDJwUGVlcikge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnBlZXIgPSBwZWVyXG4gICAgdGhpcy5ub2RlID0gbm9kZVxuICB9XG5cbiAgYXN5bmMgZGlzY29ubmVjdDxSIGV4dGVuZHMgYW55PiAocmVhc29uPzogUik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLm5vZGUpIHJldHVybiB0aGlzLm5vZGUuZGlzY29ubmVjdFBlZXIodGhpcywgcmVhc29uKVxuICB9XG5cbiAgYXN5bmMgYmFuPFIgZXh0ZW5kcyBhbnk+IChyZWFzb24/OiBSLCBtYXhBZ2U/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5ub2RlKSByZXR1cm4gdGhpcy5ub2RlLmJhblBlZXIodGhpcywgbWF4QWdlLCByZWFzb24pXG4gIH1cbn1cbiJdfQ==