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
const network_peer_1 = require("../../network-peer");
function isPeer(p) {
    return p instanceof ethereumjs_devp2p_1.Peer;
}
class Devp2pPeer extends network_peer_1.NetworkPeer {
    constructor(peer, node) {
        super();
        this.addrs = new Set(); // use multiaddr for internal representation
        this._id = '';
        this.node = node;
        if (!isPeer(peer)) {
            this.peerInfo = peer;
            this.peer = {}; // no peer for self
        }
        else {
            this.peer = peer;
            this.peerInfo = {
                id: peer.getId(),
                tcpPort: peer._socket.remotePort,
                address: peer._socket.remoteAddress
            };
        }
        if (this.peerInfo && this.peerInfo.id) {
            this._id = this.peerInfo.id.toString('hex');
        }
        if (this.peerInfo.tcpPort) {
            this.addrs.add(`/ip4/${this.peerInfo.address}/tcp/${this.peerInfo.tcpPort}`);
        }
        if (this.peerInfo.udpPort) {
            this.addrs.add(`/ip4/${this.peerInfo.address}/udp/${this.peerInfo.tcpPort}`);
        }
    }
    get id() {
        return this._id;
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
exports.Devp2pPeer = Devp2pPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7O0FBRVoseURBQWtEO0FBQ2xELHFEQUFnRDtBQUdoRCxTQUFTLE1BQU0sQ0FBRSxDQUFNO0lBQ3JCLE9BQU8sQ0FBQyxZQUFZLHdCQUFJLENBQUE7QUFDMUIsQ0FBQztBQUVELE1BQWEsVUFBVyxTQUFRLDBCQUE2QjtJQVczRCxZQUFhLElBQXFCLEVBQUUsSUFBNEI7UUFDOUQsS0FBSyxFQUFFLENBQUE7UUFUVCxVQUFLLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUEsQ0FBQyw0Q0FBNEM7UUFHbkUsUUFBRyxHQUFXLEVBQUUsQ0FBQTtRQVF0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1lBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBVSxDQUFBLENBQUMsbUJBQW1CO1NBQzNDO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtZQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHO2dCQUNkLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFHO2dCQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO2FBQ3BDLENBQUE7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUM1QztRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7U0FDN0U7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1NBQzdFO0lBQ0gsQ0FBQztJQS9CRCxJQUFJLEVBQUU7UUFDSixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUE7SUFDakIsQ0FBQztJQStCSyxVQUFVLENBQUssTUFBVTs7WUFDN0IsSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM5RCxDQUFDO0tBQUE7SUFFSyxHQUFHLENBQWlCLE1BQVUsRUFBRSxNQUFlOztZQUNuRCxJQUFJLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUMvRCxDQUFDO0tBQUE7Q0FDRjtBQS9DRCxnQ0ErQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgUGVlckluZm8sIFBlZXIgfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi4vLi4vbmV0d29yay1wZWVyJ1xuaW1wb3J0IHsgRXh0cmFjdEZyb21EZXZwMnBQZWVyIH0gZnJvbSAnLi4vLi4vaGVscGVyLXR5cGVzJ1xuXG5mdW5jdGlvbiBpc1BlZXIgKHA6IGFueSk6IHAgaXMgUGVlciB7XG4gIHJldHVybiBwIGluc3RhbmNlb2YgUGVlclxufVxuXG5leHBvcnQgY2xhc3MgRGV2cDJwUGVlciBleHRlbmRzIE5ldHdvcmtQZWVyPFBlZXIsIERldnAycFBlZXI+IHtcbiAgbm9kZT86IEV4dHJhY3RGcm9tRGV2cDJwUGVlclxuICBwZWVyOiBQZWVyXG4gIGFkZHJzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKSAvLyB1c2UgbXVsdGlhZGRyIGZvciBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuICBwZWVySW5mbzogUGVlckluZm9cblxuICBwcml2YXRlIF9pZDogc3RyaW5nID0gJydcbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pZFxuICB9XG5cbiAgY29uc3RydWN0b3IgKHBlZXI6IFBlZXIgfCBQZWVySW5mbywgbm9kZT86IEV4dHJhY3RGcm9tRGV2cDJwUGVlcikge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMubm9kZSA9IG5vZGVcbiAgICBpZiAoIWlzUGVlcihwZWVyKSkge1xuICAgICAgdGhpcy5wZWVySW5mbyA9IHBlZXJcbiAgICAgIHRoaXMucGVlciA9IHt9IGFzIFBlZXIgLy8gbm8gcGVlciBmb3Igc2VsZlxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBlZXIgPSBwZWVyXG4gICAgICB0aGlzLnBlZXJJbmZvID0ge1xuICAgICAgICBpZDogcGVlci5nZXRJZCgpISxcbiAgICAgICAgdGNwUG9ydDogcGVlci5fc29ja2V0LnJlbW90ZVBvcnQsXG4gICAgICAgIGFkZHJlc3M6IHBlZXIuX3NvY2tldC5yZW1vdGVBZGRyZXNzXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVlckluZm8gJiYgdGhpcy5wZWVySW5mby5pZCkge1xuICAgICAgdGhpcy5faWQgPSB0aGlzLnBlZXJJbmZvLmlkLnRvU3RyaW5nKCdoZXgnKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBlZXJJbmZvLnRjcFBvcnQpIHtcbiAgICAgIHRoaXMuYWRkcnMuYWRkKGAvaXA0LyR7dGhpcy5wZWVySW5mby5hZGRyZXNzfS90Y3AvJHt0aGlzLnBlZXJJbmZvLnRjcFBvcnR9YClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wZWVySW5mby51ZHBQb3J0KSB7XG4gICAgICB0aGlzLmFkZHJzLmFkZChgL2lwNC8ke3RoaXMucGVlckluZm8uYWRkcmVzc30vdWRwLyR7dGhpcy5wZWVySW5mby50Y3BQb3J0fWApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlzY29ubmVjdDxSPiAocmVhc29uPzogUik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLm5vZGUpIHJldHVybiB0aGlzLm5vZGUuZGlzY29ubmVjdFBlZXIodGhpcywgcmVhc29uKVxuICB9XG5cbiAgYXN5bmMgYmFuPFIgZXh0ZW5kcyBhbnk+IChyZWFzb24/OiBSLCBtYXhBZ2U/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5ub2RlKSByZXR1cm4gdGhpcy5ub2RlLmJhblBlZXIodGhpcywgbWF4QWdlLCByZWFzb24pXG4gIH1cbn1cbiJdfQ==