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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peer_info_1 = __importDefault(require("peer-info"));
const opium_decorators_1 = require("opium-decorators");
const network_peer_1 = require("../../network-peer");
const node_1 = require("../../node");
let Libp2pPeer = class Libp2pPeer extends network_peer_1.NetworkPeer {
    constructor(peer, node) {
        super();
        this.peer = peer;
        this.node = node;
    }
    get id() {
        return this.peer.id.toB58String();
    }
    get addrs() {
        return this.peer.multiaddrs.toArray().map((a) => a.toString());
    }
    disconnect(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.node.disconnectPeer(this, reason);
        });
    }
    ban(reason, maxAge) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.node.banPeer(this, maxAge, reason);
        });
    }
};
Libp2pPeer = __decorate([
    opium_decorators_1.register(),
    __metadata("design:paramtypes", [peer_info_1.default, node_1.Node])
], Libp2pPeer);
exports.Libp2pPeer = Libp2pPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosMERBQWdDO0FBQ2hDLHVEQUEyQztBQUMzQyxxREFBZ0Q7QUFDaEQscUNBQWlDO0FBR2pDLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSwwQkFBaUM7SUFXL0QsWUFBYSxJQUFjLEVBQUUsSUFBc0I7UUFDakQsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNsQixDQUFDO0lBWkQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ2hFLENBQUM7SUFRSyxVQUFVLENBQWlCLE1BQVU7O1lBQ3pDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQy9DLENBQUM7S0FBQTtJQUVLLEdBQUcsQ0FBaUIsTUFBVSxFQUFFLE1BQWU7O1lBQ25ELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNoRCxDQUFDO0tBQUE7Q0FDRixDQUFBO0FBeEJZLFVBQVU7SUFEdEIsMkJBQVEsRUFBRTtxQ0FZVSxtQkFBUSxFQUFRLFdBQUk7R0FYNUIsVUFBVSxDQXdCdEI7QUF4QlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi4vLi4vbmV0d29yay1wZWVyJ1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL25vZGUnXG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgTGlicDJwUGVlciBleHRlbmRzIE5ldHdvcmtQZWVyPFBlZXJJbmZvLCBMaWJwMnBQZWVyPiB7XG4gIG5vZGU6IE5vZGU8TGlicDJwUGVlcj5cbiAgcGVlcjogUGVlckluZm9cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBlZXIuaWQudG9CNThTdHJpbmcoKVxuICB9XG5cbiAgZ2V0IGFkZHJzICgpOiBTZXQ8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMucGVlci5tdWx0aWFkZHJzLnRvQXJyYXkoKS5tYXAoKGEpID0+IGEudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQZWVySW5mbywgbm9kZTogTm9kZTxMaWJwMnBQZWVyPikge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnBlZXIgPSBwZWVyXG4gICAgdGhpcy5ub2RlID0gbm9kZVxuICB9XG5cbiAgYXN5bmMgZGlzY29ubmVjdDxSIGV4dGVuZHMgYW55PiAocmVhc29uPzogUik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLm5vZGUuZGlzY29ubmVjdFBlZXIodGhpcywgcmVhc29uKVxuICB9XG5cbiAgYXN5bmMgYmFuPFIgZXh0ZW5kcyBhbnk+IChyZWFzb24/OiBSLCBtYXhBZ2U/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ub2RlLmJhblBlZXIodGhpcywgbWF4QWdlLCByZWFzb24pXG4gIH1cbn1cbiJdfQ==