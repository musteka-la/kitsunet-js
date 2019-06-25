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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peer_info_1 = __importDefault(require("peer-info"));
const opium_decorators_1 = require("opium-decorators");
const peer_1 = require("../../peer");
let Libp2pPeer = class Libp2pPeer extends peer_1.NetworkPeer {
    constructor(peer) {
        super();
        this.peer = peer;
    }
    get id() {
        return this.peer.id.toB58String();
    }
    get addrs() {
        return this.peer.multiaddrs.toArray().map((a) => a.toString());
    }
};
Libp2pPeer = __decorate([
    opium_decorators_1.register(),
    __metadata("design:paramtypes", [peer_info_1.default])
], Libp2pPeer);
exports.Libp2pPeer = Libp2pPeer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUVaLDBEQUFnQztBQUNoQyx1REFBMkM7QUFDM0MscUNBQXdDO0FBR3hDLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxrQkFBaUM7SUFVL0QsWUFBYSxJQUFjO1FBQ3pCLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQVhELElBQUksRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDbkMsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUNoRSxDQUFDO0NBTUYsQ0FBQTtBQWRZLFVBQVU7SUFEdEIsMkJBQVEsRUFBRTtxQ0FXVSxtQkFBUTtHQVZoQixVQUFVLENBY3RCO0FBZFksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi4vLi4vcGVlcidcblxuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBMaWJwMnBQZWVyIGV4dGVuZHMgTmV0d29ya1BlZXI8UGVlckluZm8sIExpYnAycFBlZXI+IHtcbiAgcGVlcjogUGVlckluZm9cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBlZXIuaWQudG9CNThTdHJpbmcoKVxuICB9XG5cbiAgZ2V0IGFkZHJzICgpOiBTZXQ8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMucGVlci5tdWx0aWFkZHJzLnRvQXJyYXkoKS5tYXAoKGEpID0+IGEudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQZWVySW5mbykge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnBlZXIgPSBwZWVyXG4gIH1cbn1cbiJdfQ==