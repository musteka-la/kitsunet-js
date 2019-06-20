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
        this.used = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7OztBQUVaLHlEQUFrRDtBQUNsRCxxQ0FBd0M7QUFDeEMsdURBQTJDO0FBRzNDLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxrQkFBNkI7SUFXM0QsWUFBYSxJQUFVO1FBQ3JCLEtBQUssRUFBRSxDQUFBO1FBWFQsU0FBSSxHQUFZLEtBQUssQ0FBQTtRQUVyQixVQUFLLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUEsQ0FBQyw0Q0FBNEM7UUFFbkUsUUFBRyxHQUFXLEVBQUUsQ0FBQTtRQVF0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUc7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1NBQ3BDLENBQUE7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDNUM7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1NBQzdFO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtTQUM3RTtJQUNILENBQUM7SUF6QkQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO0lBQ2pCLENBQUM7Q0F3QkYsQ0FBQTtBQWhDWSxVQUFVO0lBRHRCLDJCQUFRLEVBQUU7cUNBWVUsd0JBQUk7R0FYWixVQUFVLENBZ0N0QjtBQWhDWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBQZWVySW5mbywgUGVlciB9IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuLi8uLi9wZWVyJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIERldnAycFBlZXIgZXh0ZW5kcyBOZXR3b3JrUGVlcjxQZWVyLCBEZXZwMnBQZWVyPiB7XG4gIHVzZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwZWVyOiBQZWVyXG4gIGFkZHJzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKSAvLyB1c2UgbXVsdGlhZGRyIGZvciBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuXG4gIHByaXZhdGUgX2lkOiBzdHJpbmcgPSAnJ1xuICBnZXQgaWQgKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkXG4gIH1cblxuICBwZWVySW5mbzogUGVlckluZm9cbiAgY29uc3RydWN0b3IgKHBlZXI6IFBlZXIpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5wZWVyID0gcGVlclxuICAgIHRoaXMucGVlckluZm8gPSB7XG4gICAgICBpZDogcGVlci5nZXRJZCgpISxcbiAgICAgIHRjcFBvcnQ6IHBlZXIuX3NvY2tldC5yZW1vdGVQb3J0LFxuICAgICAgYWRkcmVzczogcGVlci5fc29ja2V0LnJlbW90ZUFkZHJlc3NcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wZWVySW5mbyAmJiB0aGlzLnBlZXJJbmZvLmlkKSB7XG4gICAgICB0aGlzLl9pZCA9IHRoaXMucGVlckluZm8uaWQudG9TdHJpbmcoJ2hleCcpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVlckluZm8udGNwUG9ydCkge1xuICAgICAgdGhpcy5hZGRycy5hZGQoYC9pcDQvJHt0aGlzLnBlZXJJbmZvLmFkZHJlc3N9L3RjcC8ke3RoaXMucGVlckluZm8udGNwUG9ydH1gKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBlZXJJbmZvLnVkcFBvcnQpIHtcbiAgICAgIHRoaXMuYWRkcnMuYWRkKGAvaXA0LyR7dGhpcy5wZWVySW5mby5hZGRyZXNzfS91ZHAvJHt0aGlzLnBlZXJJbmZvLnRjcFBvcnR9YClcbiAgICB9XG4gIH1cbn1cbiJdfQ==