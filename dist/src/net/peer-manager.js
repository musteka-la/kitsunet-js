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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const node_manager_1 = require("./node-manager");
const opium_decorators_1 = require("opium-decorators");
const lru_cache_1 = __importDefault(require("lru-cache"));
const constants_1 = require("../constants");
let PeerManager = class PeerManager extends events_1.EventEmitter {
    constructor(nodeManager) {
        super();
        this.nodeManager = nodeManager;
        this.peers = new lru_cache_1.default({ max: constants_1.MAX_PEERS, maxAge: 1000 * 30 });
        this.nodeManager.on('kitsunet:peer:connected', (peer) => {
            this.peers.set(peer.id, { peer });
        });
        this.nodeManager.on('kitsunet:peer:disconnected', (peer) => {
            this.peers.del(peer.id);
        });
    }
    getById(id) {
        const peer = this.peers.get(id);
        if (peer)
            return peer.peer;
    }
    getByCapability(cap) {
        return [...this.peers.values()].filter((p) => {
            return !p.used && !p.banned &&
                p.peer.protocols.has(cap.id) &&
                cap.versions.length > 0 &&
                p.peer.protocols.get(cap.id)
                    .versions.some(v => cap.versions.indexOf(v) > -1);
        }).map(p => p.peer);
    }
    getRandomByCapability(cap) {
        const peers = this.getByCapability(cap);
        const i = Math.floor(Math.random() * peers.length);
        return peers[i];
    }
    getUnusedPeers() {
        return [...this.peers.values()]
            .filter((p) => !p.used)
            .map(p => p.peer);
    }
    getRandomPeer() {
        const peers = this.getUnusedPeers();
        const i = Math.floor(Math.random() * peers.length);
        return peers[i];
    }
    releasePeers(peers) {
        peers.forEach(p => { p && (this.peers.get(p.id).used = false); });
    }
    reserve(peers) {
        peers.forEach(p => { p && (this.peers.get(p.id).used = true); });
    }
    ban(peers) {
        peers.forEach(p => { p && (this.peers.get(p.id).banned = true); });
    }
    unBan(peers) {
        peers.forEach(p => { p && (this.peers.get(p.id).banned = false); });
    }
    isUsed(peer) {
        if (!this.peers.has(peer.id)) {
            throw new Error(`Peer with id ${peer.id} not found`);
        }
        return this.peers.get(peer.id).used;
    }
    isBanned(peer) {
        if (!this.peers.has(peer.id)) {
            throw new Error(`Peer with id ${peer.id} not found`);
        }
        return this.peers.get(peer.id).banned;
    }
};
PeerManager = __decorate([
    opium_decorators_1.register('peer-manager'),
    __param(0, opium_decorators_1.register('node-manager')),
    __metadata("design:paramtypes", [node_manager_1.NodeManager])
], PeerManager);
exports.PeerManager = PeerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVlci1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25ldC9wZWVyLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG1DQUEyQztBQUMzQyxpREFBNEM7QUFHNUMsdURBQTJDO0FBQzNDLDBEQUFnQztBQUNoQyw0Q0FBd0M7QUFTeEMsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBWSxTQUFRLHFCQUFFO0lBRWpDLFlBQ29CLFdBQThCO1FBQ2hELEtBQUssRUFBRSxDQUFBO1FBRFcsZ0JBQVcsR0FBWCxXQUFXLENBQW1CO1FBRmxELFVBQUssR0FBaUMsSUFBSSxtQkFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLHFCQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBSXZGLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxPQUFPLENBQUUsRUFBVTtRQUNqQixNQUFNLElBQUksR0FBMkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDdkQsSUFBSSxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBO0lBQzVCLENBQUM7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QUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNyRSxDQUFDO0lBRUQsTUFBTSxDQUFFLElBQVU7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTtTQUNyRDtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDLElBQUksQ0FBQTtJQUN0QyxDQUFDO0lBRUQsUUFBUSxDQUFFLElBQVU7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTtTQUNyRDtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDLE1BQU0sQ0FBQTtJQUN4QyxDQUFDO0NBQ0YsQ0FBQTtBQTlFWSxXQUFXO0lBRHZCLDJCQUFRLENBQUMsY0FBYyxDQUFDO0lBR1QsV0FBQSwyQkFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3FDQUNMLDBCQUFXO0dBSGpDLFdBQVcsQ0E4RXZCO0FBOUVZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBFRSB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IE5vZGVNYW5hZ2VyIH0gZnJvbSAnLi9ub2RlLW1hbmFnZXInXG5pbXBvcnQgeyBJQ2FwYWJpbGl0eSB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IFBlZXIgfSBmcm9tICcuL2hlbHBlci10eXBlcydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCBMUlVDYWNoZSBmcm9tICdscnUtY2FjaGUnXG5pbXBvcnQgeyBNQVhfUEVFUlMgfSBmcm9tICcuLi9jb25zdGFudHMnXG5cbmludGVyZmFjZSBQZWVySG9sZGVyIHtcbiAgcGVlcjogUGVlclxuICB1c2VkPzogYm9vbGVhblxuICBiYW5uZWQ/OiBib29sZWFuXG59XG5cbkByZWdpc3RlcigncGVlci1tYW5hZ2VyJylcbmV4cG9ydCBjbGFzcyBQZWVyTWFuYWdlciBleHRlbmRzIEVFIHtcbiAgcGVlcnM6IExSVUNhY2hlPHN0cmluZywgUGVlckhvbGRlcj4gPSBuZXcgTFJVQ2FjaGUoeyBtYXg6IE1BWF9QRUVSUywgbWF4QWdlOiAxMDAwICogMzAgfSlcbiAgY29uc3RydWN0b3IgKEByZWdpc3Rlcignbm9kZS1tYW5hZ2VyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBub2RlTWFuYWdlcjogTm9kZU1hbmFnZXI8UGVlcj4pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5ub2RlTWFuYWdlci5vbigna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCAocGVlcjogUGVlcikgPT4ge1xuICAgICAgdGhpcy5wZWVycy5zZXQocGVlci5pZCwgeyBwZWVyIH0pXG4gICAgfSlcblxuICAgIHRoaXMubm9kZU1hbmFnZXIub24oJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgKHBlZXI6IFBlZXIpID0+IHtcbiAgICAgIHRoaXMucGVlcnMuZGVsKHBlZXIuaWQpXG4gICAgfSlcbiAgfVxuXG4gIGdldEJ5SWQgKGlkOiBzdHJpbmcpOiBQZWVyIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwZWVyOiBQZWVySG9sZGVyIHwgdW5kZWZpbmVkID0gdGhpcy5wZWVycy5nZXQoaWQpXG4gICAgaWYgKHBlZXIpIHJldHVybiBwZWVyLnBlZXJcbiAgfVxuXG4gIGdldEJ5Q2FwYWJpbGl0eSAoY2FwOiBJQ2FwYWJpbGl0eSk6IFBlZXJbXSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLnBlZXJzLnZhbHVlcygpXS5maWx0ZXIoKHApID0+IHtcbiAgICAgIHJldHVybiAhcC51c2VkICYmICFwLmJhbm5lZCAmJlxuICAgICAgcC5wZWVyLnByb3RvY29scy5oYXMoY2FwLmlkKSAmJlxuICAgICAgY2FwLnZlcnNpb25zLmxlbmd0aCA+IDAgJiZcbiAgICAgIHAucGVlci5wcm90b2NvbHMuZ2V0KGNhcC5pZCkhXG4gICAgICAgIC52ZXJzaW9ucy5zb21lKHYgPT4gY2FwLnZlcnNpb25zLmluZGV4T2YodikgPiAtMSlcbiAgICB9KS5tYXAocCA9PiBwLnBlZXIpXG4gIH1cblxuICBnZXRSYW5kb21CeUNhcGFiaWxpdHkgKGNhcDogSUNhcGFiaWxpdHkpOiBQZWVyIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwZWVycyA9IHRoaXMuZ2V0QnlDYXBhYmlsaXR5KGNhcClcbiAgICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGVlcnMubGVuZ3RoKVxuICAgIHJldHVybiBwZWVyc1tpXVxuICB9XG5cbiAgZ2V0VW51c2VkUGVlcnMgKCk6IFBlZXJbXSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLnBlZXJzLnZhbHVlcygpXVxuICAgICAgLmZpbHRlcigocCkgPT4gIXAudXNlZClcbiAgICAgIC5tYXAocCA9PiBwLnBlZXIpXG4gIH1cblxuICBnZXRSYW5kb21QZWVyICgpOiBQZWVyIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwZWVycyA9IHRoaXMuZ2V0VW51c2VkUGVlcnMoKVxuICAgIGNvbnN0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZWVycy5sZW5ndGgpXG4gICAgcmV0dXJuIHBlZXJzW2ldXG4gIH1cblxuICByZWxlYXNlUGVlcnMgKHBlZXJzOiBQZWVyW10pIHtcbiAgICBwZWVycy5mb3JFYWNoKHAgPT4geyBwICYmICh0aGlzLnBlZXJzLmdldChwLmlkKSEudXNlZCA9IGZhbHNlKSB9KVxuICB9XG5cbiAgcmVzZXJ2ZSAocGVlcnM6IFBlZXJbXSkge1xuICAgIHBlZXJzLmZvckVhY2gocCA9PiB7IHAgJiYgKHRoaXMucGVlcnMuZ2V0KHAuaWQpIS51c2VkID0gdHJ1ZSkgfSlcbiAgfVxuXG4gIGJhbiAocGVlcnM6IFBlZXJbXSkge1xuICAgIHBlZXJzLmZvckVhY2gocCA9PiB7IHAgJiYgKHRoaXMucGVlcnMuZ2V0KHAuaWQpIS5iYW5uZWQgPSB0cnVlKSB9KVxuICB9XG5cbiAgdW5CYW4gKHBlZXJzOiBQZWVyW10pIHtcbiAgICBwZWVycy5mb3JFYWNoKHAgPT4geyBwICYmICh0aGlzLnBlZXJzLmdldChwLmlkKSEuYmFubmVkID0gZmFsc2UpIH0pXG4gIH1cblxuICBpc1VzZWQgKHBlZXI6IFBlZXIpIHtcbiAgICBpZiAoIXRoaXMucGVlcnMuaGFzKHBlZXIuaWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBlZXIgd2l0aCBpZCAke3BlZXIuaWR9IG5vdCBmb3VuZGApXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGVlcnMuZ2V0KHBlZXIuaWQpIS51c2VkXG4gIH1cblxuICBpc0Jhbm5lZCAocGVlcjogUGVlcikge1xuICAgIGlmICghdGhpcy5wZWVycy5oYXMocGVlci5pZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGVlciB3aXRoIGlkICR7cGVlci5pZH0gbm90IGZvdW5kYClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wZWVycy5nZXQocGVlci5pZCkhLmJhbm5lZFxuICB9XG59XG4iXX0=