'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const node_1 = require("../../node");
const opium_decorators_1 = require("opium-decorators");
let Devp2pPeer = class Devp2pPeer extends network_peer_1.NetworkPeer {
    constructor(peer, node) {
        super();
        this.addrs = new Set(); // use multiaddr for internal representation
        this._id = '';
        this.node = node;
        this.peer = peer;
        this.peerInfo = {
            id: peer.getId(),
            tcpPort: peer._socket.remotePort,
            address: peer._socket.remoteAddress
        };
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
            return this.node.disconnectPeer(this, reason);
        });
    }
    ban(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
};
Devp2pPeer = __decorate([
    opium_decorators_1.register(),
    __metadata("design:paramtypes", [ethereumjs_devp2p_1.Peer, node_1.Node])
], Devp2pPeer);
exports.Devp2pPeer = Devp2pPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVoseURBQWtEO0FBQ2xELHFEQUFnRDtBQUNoRCxxQ0FBaUM7QUFDakMsdURBQTJDO0FBRzNDLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSwwQkFBNkI7SUFXM0QsWUFBYSxJQUFVLEVBQUUsSUFBc0I7UUFDN0MsS0FBSyxFQUFFLENBQUE7UUFUVCxVQUFLLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUEsQ0FBQyw0Q0FBNEM7UUFFbkUsUUFBRyxHQUFXLEVBQUUsQ0FBQTtRQVN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUc7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1NBQ3BDLENBQUE7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDNUM7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1NBQzdFO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtTQUM3RTtJQUNILENBQUM7SUEzQkQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO0lBQ2pCLENBQUM7SUEyQkssVUFBVSxDQUFLLE1BQVU7O1lBQzdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQy9DLENBQUM7S0FBQTtJQUVLLEdBQUcsQ0FBaUIsTUFBVTs7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBQzVDLENBQUM7S0FBQTtDQUNGLENBQUE7QUExQ1ksVUFBVTtJQUR0QiwyQkFBUSxFQUFFO3FDQVlVLHdCQUFJLEVBQVEsV0FBSTtHQVh4QixVQUFVLENBMEN0QjtBQTFDWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBQZWVySW5mbywgUGVlciB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuLi8uLi9uZXR3b3JrLXBlZXInXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbm9kZSdcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBEZXZwMnBQZWVyIGV4dGVuZHMgTmV0d29ya1BlZXI8UGVlciwgRGV2cDJwUGVlcj4ge1xuICBub2RlOiBOb2RlPERldnAycFBlZXI+XG4gIHBlZXI6IFBlZXJcbiAgYWRkcnM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpIC8vIHVzZSBtdWx0aWFkZHIgZm9yIGludGVybmFsIHJlcHJlc2VudGF0aW9uXG5cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9ICcnXG4gIGdldCBpZCAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWRcbiAgfVxuXG4gIHBlZXJJbmZvOiBQZWVySW5mb1xuICBjb25zdHJ1Y3RvciAocGVlcjogUGVlciwgbm9kZTogTm9kZTxEZXZwMnBQZWVyPikge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMubm9kZSA9IG5vZGVcbiAgICB0aGlzLnBlZXIgPSBwZWVyXG4gICAgdGhpcy5wZWVySW5mbyA9IHtcbiAgICAgIGlkOiBwZWVyLmdldElkKCkhLFxuICAgICAgdGNwUG9ydDogcGVlci5fc29ja2V0LnJlbW90ZVBvcnQsXG4gICAgICBhZGRyZXNzOiBwZWVyLl9zb2NrZXQucmVtb3RlQWRkcmVzc1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBlZXJJbmZvICYmIHRoaXMucGVlckluZm8uaWQpIHtcbiAgICAgIHRoaXMuX2lkID0gdGhpcy5wZWVySW5mby5pZC50b1N0cmluZygnaGV4JylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wZWVySW5mby50Y3BQb3J0KSB7XG4gICAgICB0aGlzLmFkZHJzLmFkZChgL2lwNC8ke3RoaXMucGVlckluZm8uYWRkcmVzc30vdGNwLyR7dGhpcy5wZWVySW5mby50Y3BQb3J0fWApXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVlckluZm8udWRwUG9ydCkge1xuICAgICAgdGhpcy5hZGRycy5hZGQoYC9pcDQvJHt0aGlzLnBlZXJJbmZvLmFkZHJlc3N9L3VkcC8ke3RoaXMucGVlckluZm8udGNwUG9ydH1gKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpc2Nvbm5lY3Q8Uj4gKHJlYXNvbj86IFIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ub2RlLmRpc2Nvbm5lY3RQZWVyKHRoaXMsIHJlYXNvbilcbiAgfVxuXG4gIGFzeW5jIGJhbjxSIGV4dGVuZHMgYW55PiAocmVhc29uPzogUik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKVxuICB9XG59XG4iXX0=