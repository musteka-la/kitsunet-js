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
let PeerManager = class PeerManager extends events_1.EventEmitter {
    constructor(nodeManager) {
        super();
        this.nodeManager = nodeManager;
        this.peers = new lru_cache_1.default({ max: 5, maxAge: 1000 * 30 });
        this.nodeManager.on('kitsunet:peer:connected', (peer) => {
            this.peers.set(peer.id, peer);
        });
        this.nodeManager.on('kitsunet:peer:disconnected', (peer) => {
            this.peers.del(peer.id);
        });
    }
    getById(id) {
        const peer = this.peers.get(id);
        return peer;
    }
    getByCapability(cap) {
        return [...this.peers.values()].filter((p) => !p.used &&
            p.protocols.has(cap.id) &&
            cap.versions.length > 0 &&
            p.protocols.get(cap.id).versions.some(v => cap.versions.indexOf(v) > -1));
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
        peers.forEach(p => { p && (p.used = false); });
    }
    reserve(peers) {
        peers.forEach(p => { p && (p.used = true); });
    }
};
PeerManager = __decorate([
    opium_decorators_1.register('peer-manager'),
    __param(0, opium_decorators_1.register('node-manager')),
    __metadata("design:paramtypes", [node_manager_1.NodeManager])
], PeerManager);
exports.PeerManager = PeerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVlci1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25ldC9wZWVyLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG1DQUEyQztBQUMzQyxpREFBNEM7QUFHNUMsdURBQTJDO0FBQzNDLDBEQUFnQztBQUdoQyxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFZLFNBQVEscUJBQUU7SUFFakMsWUFDb0IsV0FBOEI7UUFDaEQsS0FBSyxFQUFFLENBQUE7UUFEVyxnQkFBVyxHQUFYLFdBQVcsQ0FBbUI7UUFGbEQsVUFBSyxHQUEyQixJQUFJLG1CQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUl6RSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDL0IsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxPQUFPLENBQUUsRUFBVTtRQUNqQixNQUFNLElBQUksR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsZUFBZSxDQUFFLEdBQWdCO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDbkQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN2QixHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzlFLENBQUM7SUFFRCxxQkFBcUIsQ0FBRSxHQUFnQjtRQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNsRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqQixDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRCxhQUFhO1FBQ1gsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNsRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqQixDQUFDO0lBRUQsWUFBWSxDQUFFLEtBQWE7UUFDekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBRUQsT0FBTyxDQUFFLEtBQWE7UUFDcEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QyxDQUFDO0NBQ0YsQ0FBQTtBQWpEWSxXQUFXO0lBRHZCLDJCQUFRLENBQUMsY0FBYyxDQUFDO0lBR1QsV0FBQSwyQkFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3FDQUNMLDBCQUFXO0dBSGpDLFdBQVcsQ0FpRHZCO0FBakRZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBFRSB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IE5vZGVNYW5hZ2VyIH0gZnJvbSAnLi9ub2RlLW1hbmFnZXInXG5pbXBvcnQgeyBJQ2FwYWJpbGl0eSB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IFBlZXIgfSBmcm9tICcuL2hlbHBlci10eXBlcydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCBMUlVDYWNoZSBmcm9tICdscnUtY2FjaGUnXG5cbkByZWdpc3RlcigncGVlci1tYW5hZ2VyJylcbmV4cG9ydCBjbGFzcyBQZWVyTWFuYWdlciBleHRlbmRzIEVFIHtcbiAgcGVlcnM6IExSVUNhY2hlPHN0cmluZywgUGVlcj4gPSBuZXcgTFJVQ2FjaGUoeyBtYXg6IDUsIG1heEFnZTogMTAwMCAqIDMwIH0pXG4gIGNvbnN0cnVjdG9yIChAcmVnaXN0ZXIoJ25vZGUtbWFuYWdlcicpXG4gICAgICAgICAgICAgICBwdWJsaWMgbm9kZU1hbmFnZXI6IE5vZGVNYW5hZ2VyPFBlZXI+KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubm9kZU1hbmFnZXIub24oJ2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkJywgKHBlZXI6IFBlZXIpID0+IHtcbiAgICAgIHRoaXMucGVlcnMuc2V0KHBlZXIuaWQsIHBlZXIpXG4gICAgfSlcblxuICAgIHRoaXMubm9kZU1hbmFnZXIub24oJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgKHBlZXI6IFBlZXIpID0+IHtcbiAgICAgIHRoaXMucGVlcnMuZGVsKHBlZXIuaWQpXG4gICAgfSlcbiAgfVxuXG4gIGdldEJ5SWQgKGlkOiBzdHJpbmcpOiBQZWVyIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwZWVyOiBQZWVyIHwgdW5kZWZpbmVkID0gdGhpcy5wZWVycy5nZXQoaWQpXG4gICAgcmV0dXJuIHBlZXJcbiAgfVxuXG4gIGdldEJ5Q2FwYWJpbGl0eSAoY2FwOiBJQ2FwYWJpbGl0eSk6IFBlZXJbXSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLnBlZXJzLnZhbHVlcygpXS5maWx0ZXIoKHApID0+ICFwLnVzZWQgJiZcbiAgICAgIHAucHJvdG9jb2xzLmhhcyhjYXAuaWQpICYmXG4gICAgICBjYXAudmVyc2lvbnMubGVuZ3RoID4gMCAmJlxuICAgICAgcC5wcm90b2NvbHMuZ2V0KGNhcC5pZCkhLnZlcnNpb25zLnNvbWUodiA9PiBjYXAudmVyc2lvbnMuaW5kZXhPZih2KSA+IC0xKSlcbiAgfVxuXG4gIGdldFJhbmRvbUJ5Q2FwYWJpbGl0eSAoY2FwOiBJQ2FwYWJpbGl0eSk6IFBlZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBlZXJzID0gdGhpcy5nZXRCeUNhcGFiaWxpdHkoY2FwKVxuICAgIGNvbnN0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZWVycy5sZW5ndGgpXG4gICAgcmV0dXJuIHBlZXJzW2ldXG4gIH1cblxuICBnZXRVbnVzZWRQZWVycyAoKTogUGVlcltdIHtcbiAgICByZXR1cm4gWy4uLnRoaXMucGVlcnMudmFsdWVzKCldLmZpbHRlcigocCkgPT4gIXAudXNlZClcbiAgfVxuXG4gIGdldFJhbmRvbVBlZXIgKCk6IFBlZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBlZXJzID0gdGhpcy5nZXRVbnVzZWRQZWVycygpXG4gICAgY29uc3QgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBlZXJzLmxlbmd0aClcbiAgICByZXR1cm4gcGVlcnNbaV1cbiAgfVxuXG4gIHJlbGVhc2VQZWVycyAocGVlcnM6IFBlZXJbXSkge1xuICAgIHBlZXJzLmZvckVhY2gocCA9PiB7IHAgJiYgKHAudXNlZCA9IGZhbHNlKSB9KVxuICB9XG5cbiAgcmVzZXJ2ZSAocGVlcnM6IFBlZXJbXSkge1xuICAgIHBlZXJzLmZvckVhY2gocCA9PiB7IHAgJiYgKHAudXNlZCA9IHRydWUpIH0pXG4gIH1cbn1cbiJdfQ==