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
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const peer_1 = require("../../peer");
const opium_decorators_1 = require("opium-decorators");
let Devp2pPeer = class Devp2pPeer extends peer_1.NetworkPeer {
    constructor(peer) {
        super();
        this.addrs = new Set(); // use multiaddr for internal representation
        this._id = '';
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
};
Devp2pPeer = __decorate([
    opium_decorators_1.register(),
    __metadata("design:paramtypes", [ethereumjs_devp2p_1.Peer])
], Devp2pPeer);
exports.Devp2pPeer = Devp2pPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7OztBQUVaLHlEQUFrRDtBQUNsRCxxQ0FBd0M7QUFDeEMsdURBQTJDO0FBRzNDLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxrQkFBNkI7SUFVM0QsWUFBYSxJQUFVO1FBQ3JCLEtBQUssRUFBRSxDQUFBO1FBVFQsVUFBSyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFBLENBQUMsNENBQTRDO1FBRW5FLFFBQUcsR0FBVyxFQUFFLENBQUE7UUFRdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFHO1lBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDaEMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYTtTQUNwQyxDQUFBO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQzVDO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtTQUM3RTtRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7U0FDN0U7SUFDSCxDQUFDO0lBekJELElBQUksRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQTtJQUNqQixDQUFDO0NBd0JGLENBQUE7QUEvQlksVUFBVTtJQUR0QiwyQkFBUSxFQUFFO3FDQVdVLHdCQUFJO0dBVlosVUFBVSxDQStCdEI7QUEvQlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgUGVlckluZm8sIFBlZXIgfSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi4vLi4vcGVlcidcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBEZXZwMnBQZWVyIGV4dGVuZHMgTmV0d29ya1BlZXI8UGVlciwgRGV2cDJwUGVlcj4ge1xuICBwZWVyOiBQZWVyXG4gIGFkZHJzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKSAvLyB1c2UgbXVsdGlhZGRyIGZvciBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuXG4gIHByaXZhdGUgX2lkOiBzdHJpbmcgPSAnJ1xuICBnZXQgaWQgKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkXG4gIH1cblxuICBwZWVySW5mbzogUGVlckluZm9cbiAgY29uc3RydWN0b3IgKHBlZXI6IFBlZXIpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5wZWVyID0gcGVlclxuICAgIHRoaXMucGVlckluZm8gPSB7XG4gICAgICBpZDogcGVlci5nZXRJZCgpISxcbiAgICAgIHRjcFBvcnQ6IHBlZXIuX3NvY2tldC5yZW1vdGVQb3J0LFxuICAgICAgYWRkcmVzczogcGVlci5fc29ja2V0LnJlbW90ZUFkZHJlc3NcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wZWVySW5mbyAmJiB0aGlzLnBlZXJJbmZvLmlkKSB7XG4gICAgICB0aGlzLl9pZCA9IHRoaXMucGVlckluZm8uaWQudG9TdHJpbmcoJ2hleCcpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVlckluZm8udGNwUG9ydCkge1xuICAgICAgdGhpcy5hZGRycy5hZGQoYC9pcDQvJHt0aGlzLnBlZXJJbmZvLmFkZHJlc3N9L3RjcC8ke3RoaXMucGVlckluZm8udGNwUG9ydH1gKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBlZXJJbmZvLnVkcFBvcnQpIHtcbiAgICAgIHRoaXMuYWRkcnMuYWRkKGAvaXA0LyR7dGhpcy5wZWVySW5mby5hZGRyZXNzfS91ZHAvJHt0aGlzLnBlZXJJbmZvLnRjcFBvcnR9YClcbiAgICB9XG4gIH1cbn1cbiJdfQ==