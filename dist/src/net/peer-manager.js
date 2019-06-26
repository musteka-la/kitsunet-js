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
            return (!p.used && !p.banned) &&
                p.peer.protocols.has(cap.id) &&
                cap.versions.length > 0 &&
                p.peer.protocols
                    .get(cap.id)
                    .versions
                    .some(v => cap.versions.indexOf(v) > -1);
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
        peers.forEach(p => {
            p && (this.peers.has(p.id) &&
                (this.peers.get(p.id).used = false));
        });
    }
    reserve(peers) {
        peers.forEach(p => {
            p && (this.peers.has(p.id) &&
                (this.peers.get(p.id).used = true));
        });
    }
    ban(peers) {
        peers.forEach(p => {
            p && (this.peers.has(p.id) &&
                (this.peers.get(p.id).banned = true));
        });
    }
    unBan(peers) {
        peers.forEach(p => {
            p && (this.peers.has(p.id) &&
                (this.peers.get(p.id).banned = false));
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVlci1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25ldC9wZWVyLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG1DQUEyQztBQUMzQyxpREFBNEM7QUFHNUMsdURBQTJDO0FBQzNDLDBEQUFnQztBQUNoQyw0Q0FBd0M7QUFTeEMsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBWSxTQUFRLHFCQUFFO0lBRWpDLFlBQ29CLFdBQThCO1FBQ2hELEtBQUssRUFBRSxDQUFBO1FBRFcsZ0JBQVcsR0FBWCxXQUFXLENBQW1CO1FBRmxELFVBQUssR0FBaUMsSUFBSSxtQkFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLHFCQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBSXZGLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxPQUFPLENBQUUsRUFBVTtRQUNqQixNQUFNLElBQUksR0FBMkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDdkQsSUFBSSxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBO0lBQzVCLENBQUM7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QUNGLENBQUE7QUE1RlksV0FBVztJQUR2QiwyQkFBUSxDQUFDLGNBQWMsQ0FBQztJQUdULFdBQUEsMkJBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtxQ0FDTCwwQkFBVztHQUhqQyxXQUFXLENBNEZ2QjtBQTVGWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgYXMgRUUgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBOb2RlTWFuYWdlciB9IGZyb20gJy4vbm9kZS1tYW5hZ2VyJ1xuaW1wb3J0IHsgSUNhcGFiaWxpdHkgfSBmcm9tICcuL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBQZWVyIH0gZnJvbSAnLi9oZWxwZXItdHlwZXMnXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgTFJVQ2FjaGUgZnJvbSAnbHJ1LWNhY2hlJ1xuaW1wb3J0IHsgTUFYX1BFRVJTIH0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuXG5pbnRlcmZhY2UgUGVlckhvbGRlciB7XG4gIHBlZXI6IFBlZXJcbiAgdXNlZD86IGJvb2xlYW5cbiAgYmFubmVkPzogYm9vbGVhblxufVxuXG5AcmVnaXN0ZXIoJ3BlZXItbWFuYWdlcicpXG5leHBvcnQgY2xhc3MgUGVlck1hbmFnZXIgZXh0ZW5kcyBFRSB7XG4gIHBlZXJzOiBMUlVDYWNoZTxzdHJpbmcsIFBlZXJIb2xkZXI+ID0gbmV3IExSVUNhY2hlKHsgbWF4OiBNQVhfUEVFUlMsIG1heEFnZTogMTAwMCAqIDMwIH0pXG4gIGNvbnN0cnVjdG9yIChAcmVnaXN0ZXIoJ25vZGUtbWFuYWdlcicpXG4gICAgICAgICAgICAgICBwdWJsaWMgbm9kZU1hbmFnZXI6IE5vZGVNYW5hZ2VyPFBlZXI+KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubm9kZU1hbmFnZXIub24oJ2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkJywgKHBlZXI6IFBlZXIpID0+IHtcbiAgICAgIHRoaXMucGVlcnMuc2V0KHBlZXIuaWQsIHsgcGVlciB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm5vZGVNYW5hZ2VyLm9uKCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIChwZWVyOiBQZWVyKSA9PiB7XG4gICAgICB0aGlzLnBlZXJzLmRlbChwZWVyLmlkKVxuICAgIH0pXG4gIH1cblxuICBnZXRCeUlkIChpZDogc3RyaW5nKTogUGVlciB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgcGVlcjogUGVlckhvbGRlciB8IHVuZGVmaW5lZCA9IHRoaXMucGVlcnMuZ2V0KGlkKVxuICAgIGlmIChwZWVyKSByZXR1cm4gcGVlci5wZWVyXG4gIH1cblxuICBnZXRCeUNhcGFiaWxpdHkgKGNhcDogSUNhcGFiaWxpdHkpOiBQZWVyW10ge1xuICAgIHJldHVybiBbLi4udGhpcy5wZWVycy52YWx1ZXMoKV0uZmlsdGVyKChwKSA9PiB7XG4gICAgICByZXR1cm4gKCFwLnVzZWQgJiYgIXAuYmFubmVkKSAmJlxuICAgICAgcC5wZWVyLnByb3RvY29scy5oYXMoY2FwLmlkKSAmJlxuICAgICAgY2FwLnZlcnNpb25zLmxlbmd0aCA+IDAgJiZcbiAgICAgIHAucGVlci5wcm90b2NvbHNcbiAgICAgICAgLmdldChjYXAuaWQpIVxuICAgICAgICAudmVyc2lvbnNcbiAgICAgICAgLnNvbWUodiA9PiBjYXAudmVyc2lvbnMuaW5kZXhPZih2KSA+IC0xKVxuICAgIH0pLm1hcChwID0+IHAucGVlcilcbiAgfVxuXG4gIGdldFJhbmRvbUJ5Q2FwYWJpbGl0eSAoY2FwOiBJQ2FwYWJpbGl0eSk6IFBlZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBlZXJzID0gdGhpcy5nZXRCeUNhcGFiaWxpdHkoY2FwKVxuICAgIGNvbnN0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZWVycy5sZW5ndGgpXG4gICAgcmV0dXJuIHBlZXJzW2ldXG4gIH1cblxuICBnZXRVbnVzZWRQZWVycyAoKTogUGVlcltdIHtcbiAgICByZXR1cm4gWy4uLnRoaXMucGVlcnMudmFsdWVzKCldXG4gICAgICAuZmlsdGVyKChwKSA9PiAhcC51c2VkKVxuICAgICAgLm1hcChwID0+IHAucGVlcilcbiAgfVxuXG4gIGdldFJhbmRvbVBlZXIgKCk6IFBlZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBlZXJzID0gdGhpcy5nZXRVbnVzZWRQZWVycygpXG4gICAgY29uc3QgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBlZXJzLmxlbmd0aClcbiAgICByZXR1cm4gcGVlcnNbaV1cbiAgfVxuXG4gIHJlbGVhc2VQZWVycyAocGVlcnM6IFBlZXJbXSkge1xuICAgIHBlZXJzLmZvckVhY2gocCA9PiB7XG4gICAgICBwICYmICh0aGlzLnBlZXJzLmhhcyhwLmlkKSAmJlxuICAgICAgKHRoaXMucGVlcnMuZ2V0KHAuaWQpIS51c2VkID0gZmFsc2UpKVxuICAgIH0pXG4gIH1cblxuICByZXNlcnZlIChwZWVyczogUGVlcltdKSB7XG4gICAgcGVlcnMuZm9yRWFjaChwID0+IHtcbiAgICAgIHAgJiYgKHRoaXMucGVlcnMuaGFzKHAuaWQpICYmXG4gICAgICAodGhpcy5wZWVycy5nZXQocC5pZCkhLnVzZWQgPSB0cnVlKSlcbiAgICB9KVxuICB9XG5cbiAgYmFuIChwZWVyczogUGVlcltdKSB7XG4gICAgcGVlcnMuZm9yRWFjaChwID0+IHtcbiAgICAgIHAgJiYgKHRoaXMucGVlcnMuaGFzKHAuaWQpICYmXG4gICAgICAodGhpcy5wZWVycy5nZXQocC5pZCkhLmJhbm5lZCA9IHRydWUpKVxuICAgIH0pXG4gIH1cblxuICB1bkJhbiAocGVlcnM6IFBlZXJbXSkge1xuICAgIHBlZXJzLmZvckVhY2gocCA9PiB7XG4gICAgICBwICYmICh0aGlzLnBlZXJzLmhhcyhwLmlkKSAmJlxuICAgICAgKHRoaXMucGVlcnMuZ2V0KHAuaWQpIS5iYW5uZWQgPSBmYWxzZSkpXG4gICAgfSlcbiAgfVxuXG4gIGlzVXNlZCAocGVlcjogUGVlcikge1xuICAgIGlmICghdGhpcy5wZWVycy5oYXMocGVlci5pZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGVlciB3aXRoIGlkICR7cGVlci5pZH0gbm90IGZvdW5kYClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wZWVycy5nZXQocGVlci5pZCkhLnVzZWRcbiAgfVxuXG4gIGlzQmFubmVkIChwZWVyOiBQZWVyKSB7XG4gICAgaWYgKCF0aGlzLnBlZXJzLmhhcyhwZWVyLmlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQZWVyIHdpdGggaWQgJHtwZWVyLmlkfSBub3QgZm91bmRgKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBlZXJzLmdldChwZWVyLmlkKSEuYmFubmVkXG4gIH1cbn1cbiJdfQ==