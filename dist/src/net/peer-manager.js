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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const node_manager_1 = require("./node-manager");
const opium_decorators_1 = require("opium-decorators");
let PeerManager = class PeerManager extends events_1.EventEmitter {
    constructor(nodeManager) {
        super();
        this.nodeManager = nodeManager;
        this.peers = new Map();
        this.nodeManager.on('kitsunet:peer:connected', (peer) => {
            this.peers.set(peer.id, peer);
        });
        this.nodeManager.on('kitsunet:peer:disconnected', (peer) => {
            this.peers.delete(peer.id);
        });
    }
    getById(id) {
        const peer = this.peers.get(id);
        if (peer)
            peer.used = true;
        return peer;
    }
    getByCapability(cap) {
        return [...this.peers.values()].filter((p) => !p.used &&
            p.protocols.has(cap.id) &&
            cap.versions.length > 0 &&
            p.protocols.get(cap.id).versions.some(v => cap.versions.indexOf(v) > -1) && (p.used = true));
    }
    getRandomByCapability(cap) {
        const peers = this.getByCapability(cap);
        const i = Math.floor(Math.random() * peers.length);
        return peers[i];
    }
    getUnusedPeers() {
        return [...this.peers.values()].filter((p) => !p.used);
    }
    getRandomPeer() {
        const peers = this.getUnusedPeers();
        const i = Math.floor(Math.random() * peers.length);
        return peers[i];
    }
    releasePeers(peers) {
        peers.forEach(p => { p.used = false; });
    }
};
PeerManager = __decorate([
    opium_decorators_1.register('peer-manager'),
    __param(0, opium_decorators_1.register('node-manager')),
    __metadata("design:paramtypes", [node_manager_1.NodeManager])
], PeerManager);
exports.PeerManager = PeerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVlci1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25ldC9wZWVyLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUVaLG1DQUEyQztBQUMzQyxpREFBNEM7QUFHNUMsdURBQTJDO0FBRzNDLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVksU0FBUSxxQkFBRTtJQUVqQyxZQUNvQixXQUE4QjtRQUNoRCxLQUFLLEVBQUUsQ0FBQTtRQURXLGdCQUFXLEdBQVgsV0FBVyxDQUFtQjtRQUZsRCxVQUFLLEdBQXNCLElBQUksR0FBRyxFQUFFLENBQUE7UUFJbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsT0FBTyxDQUFFLEVBQVU7UUFDakIsTUFBTSxJQUFJLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELElBQUksSUFBSTtZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQzFCLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELGVBQWUsQ0FBRSxHQUFnQjtRQUMvQixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ25ELENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUN2QixDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDakcsQ0FBQztJQUVELHFCQUFxQixDQUFFLEdBQWdCO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xELE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xELE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7SUFFRCxZQUFZLENBQUUsS0FBYTtRQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0NBQ0YsQ0FBQTtBQTlDWSxXQUFXO0lBRHZCLDJCQUFRLENBQUMsY0FBYyxDQUFDO0lBR1QsV0FBQSwyQkFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3FDQUNMLDBCQUFXO0dBSGpDLFdBQVcsQ0E4Q3ZCO0FBOUNZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBFRSB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IE5vZGVNYW5hZ2VyIH0gZnJvbSAnLi9ub2RlLW1hbmFnZXInXG5pbXBvcnQgeyBJQ2FwYWJpbGl0eSB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IFBlZXIgfSBmcm9tICcuL2hlbHBlci10eXBlcydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuQHJlZ2lzdGVyKCdwZWVyLW1hbmFnZXInKVxuZXhwb3J0IGNsYXNzIFBlZXJNYW5hZ2VyIGV4dGVuZHMgRUUge1xuICBwZWVyczogTWFwPHN0cmluZywgUGVlcj4gPSBuZXcgTWFwKClcbiAgY29uc3RydWN0b3IgKEByZWdpc3Rlcignbm9kZS1tYW5hZ2VyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBub2RlTWFuYWdlcjogTm9kZU1hbmFnZXI8UGVlcj4pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5ub2RlTWFuYWdlci5vbigna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCAocGVlcjogUGVlcikgPT4ge1xuICAgICAgdGhpcy5wZWVycy5zZXQocGVlci5pZCwgcGVlcilcbiAgICB9KVxuXG4gICAgdGhpcy5ub2RlTWFuYWdlci5vbigna2l0c3VuZXQ6cGVlcjpkaXNjb25uZWN0ZWQnLCAocGVlcjogUGVlcikgPT4ge1xuICAgICAgdGhpcy5wZWVycy5kZWxldGUocGVlci5pZClcbiAgICB9KVxuICB9XG5cbiAgZ2V0QnlJZCAoaWQ6IHN0cmluZyk6IFBlZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBlZXI6IFBlZXIgfCB1bmRlZmluZWQgPSB0aGlzLnBlZXJzLmdldChpZClcbiAgICBpZiAocGVlcikgcGVlci51c2VkID0gdHJ1ZVxuICAgIHJldHVybiBwZWVyXG4gIH1cblxuICBnZXRCeUNhcGFiaWxpdHkgKGNhcDogSUNhcGFiaWxpdHkpOiBQZWVyW10ge1xuICAgIHJldHVybiBbLi4udGhpcy5wZWVycy52YWx1ZXMoKV0uZmlsdGVyKChwKSA9PiAhcC51c2VkICYmXG4gICAgICBwLnByb3RvY29scy5oYXMoY2FwLmlkKSAmJlxuICAgICAgY2FwLnZlcnNpb25zLmxlbmd0aCA+IDAgJiZcbiAgICAgIHAucHJvdG9jb2xzLmdldChjYXAuaWQpIS52ZXJzaW9ucy5zb21lKHYgPT4gY2FwLnZlcnNpb25zLmluZGV4T2YodikgPiAtMSkgJiYgKHAudXNlZCA9IHRydWUpKVxuICB9XG5cbiAgZ2V0UmFuZG9tQnlDYXBhYmlsaXR5IChjYXA6IElDYXBhYmlsaXR5KTogUGVlciB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgcGVlcnMgPSB0aGlzLmdldEJ5Q2FwYWJpbGl0eShjYXApXG4gICAgY29uc3QgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBlZXJzLmxlbmd0aClcbiAgICByZXR1cm4gcGVlcnNbaV1cbiAgfVxuXG4gIGdldFVudXNlZFBlZXJzICgpOiBQZWVyW10ge1xuICAgIHJldHVybiBbLi4udGhpcy5wZWVycy52YWx1ZXMoKV0uZmlsdGVyKChwKSA9PiAhcC51c2VkKVxuICB9XG5cbiAgZ2V0UmFuZG9tUGVlciAoKTogUGVlciB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgcGVlcnMgPSB0aGlzLmdldFVudXNlZFBlZXJzKClcbiAgICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGVlcnMubGVuZ3RoKVxuICAgIHJldHVybiBwZWVyc1tpXVxuICB9XG5cbiAgcmVsZWFzZVBlZXJzIChwZWVyczogUGVlcltdKSB7XG4gICAgcGVlcnMuZm9yRWFjaChwID0+IHsgcC51c2VkID0gZmFsc2UgfSlcbiAgfVxufVxuIl19