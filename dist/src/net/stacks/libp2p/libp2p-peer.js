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
        this.used = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLXBlZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLXBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUVaLDBEQUFnQztBQUNoQyx1REFBMkM7QUFDM0MscUNBQXdDO0FBR3hDLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxrQkFBaUM7SUFXL0QsWUFBYSxJQUFjO1FBQ3pCLEtBQUssRUFBRSxDQUFBO1FBWFQsU0FBSSxHQUFZLEtBQUssQ0FBQTtRQVluQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNsQixDQUFDO0lBWEQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ2hFLENBQUM7Q0FNRixDQUFBO0FBZlksVUFBVTtJQUR0QiwyQkFBUSxFQUFFO3FDQVlVLG1CQUFRO0dBWGhCLFVBQVUsQ0FldEI7QUFmWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgUGVlckluZm8gZnJvbSAncGVlci1pbmZvJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuLi8uLi9wZWVyJ1xuXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIExpYnAycFBlZXIgZXh0ZW5kcyBOZXR3b3JrUGVlcjxQZWVySW5mbywgTGlicDJwUGVlcj4ge1xuICB1c2VkOiBib29sZWFuID0gZmFsc2VcbiAgcGVlcjogUGVlckluZm9cbiAgZ2V0IGlkICgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBlZXIuaWQudG9CNThTdHJpbmcoKVxuICB9XG5cbiAgZ2V0IGFkZHJzICgpOiBTZXQ8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMucGVlci5tdWx0aWFkZHJzLnRvQXJyYXkoKS5tYXAoKGEpID0+IGEudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwZWVyOiBQZWVySW5mbykge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnBlZXIgPSBwZWVyXG4gIH1cbn1cbiJdfQ==