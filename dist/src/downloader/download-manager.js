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
const opium_decorators_1 = require("opium-decorators");
const eth_chain_1 = require("../blockchain/eth-chain");
const events_1 = require("events");
const net_1 = require("../net");
const downloaders_1 = require("./downloaders");
const lru_cache_1 = __importDefault(require("lru-cache"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:downloader:download-manager');
const MAX_PEERS = 5;
const DEFAULT_DOWNLOAD_INTERVAL = 1000 * 20;
let DownloadManager = class DownloadManager extends events_1.EventEmitter {
    constructor(peerManager, chain, options) {
        super();
        this.peerManager = peerManager;
        this.chain = chain;
        this.peers = new lru_cache_1.default({ max: MAX_PEERS, maxAge: 1000 * 60 });
        this.maxPeers = MAX_PEERS;
        this.downloadInterval = DEFAULT_DOWNLOAD_INTERVAL;
        this.syncMode = 'fast';
        this.syncMode = options.syncMode;
    }
    download(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.peers.has(peer.id) && this.peers.length <= this.maxPeers) {
                this.peers.set(peer.id, peer);
                try {
                    switch (this.syncMode) {
                        case 'fast': {
                            const protocol = peer.protocols.get('eth');
                            if (protocol) {
                                const downloader = new downloaders_1.FastSyncDownloader(protocol, peer, this.chain);
                                yield downloader.download();
                            }
                            break;
                        }
                    }
                }
                catch (e) {
                    debug(e);
                }
                finally {
                    this.peers.del(peer.id);
                    this.peerManager.releasePeers([peer]);
                }
            }
        });
    }
    /**
     * Start sync
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const td = yield this.chain.getBlocksTD();
            this.syncInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const peers = this.peerManager.getByCapability({
                    id: 'eth',
                    versions: ['63']
                });
                if (!peers.length)
                    return;
                const status = yield Promise.all(peers.map((p) => p.protocols.get('eth').getStatus()));
                let bestPeer = td;
                status.forEach((s, i) => {
                    if (s.td.gt(bestPeer))
                        bestPeer = peers[i];
                });
                if (bestPeer) {
                    this.peerManager.reserve([bestPeer]);
                    this.download(bestPeer);
                }
            }), this.downloadInterval);
        });
    }
    /**
     * Stop sync
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.syncInterval)
                clearInterval(this.syncInterval);
        });
    }
};
DownloadManager = __decorate([
    opium_decorators_1.register('download-manager'),
    __param(0, opium_decorators_1.register('peer-manager')),
    __param(2, opium_decorators_1.register('options')),
    __metadata("design:paramtypes", [net_1.PeerManager,
        eth_chain_1.EthChain, Object])
], DownloadManager);
exports.DownloadManager = DownloadManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosdURBQTJDO0FBQzNDLHVEQUFrRDtBQUNsRCxtQ0FBMkM7QUFDM0MsZ0NBQXVEO0FBQ3ZELCtDQUFrRDtBQUNsRCwwREFBZ0M7QUFFaEMsa0RBQXlCO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFBO0FBRTNELE1BQU0sU0FBUyxHQUFXLENBQUMsQ0FBQTtBQUMzQixNQUFNLHlCQUF5QixHQUFXLElBQUksR0FBRyxFQUFFLENBQUE7QUFHbkQsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZ0IsU0FBUSxxQkFBRTtJQU9yQyxZQUNvQixXQUF3QixFQUN4QixLQUFlLEVBRXRCLE9BQVk7UUFDdkIsS0FBSyxFQUFFLENBQUE7UUFKVyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFVO1FBUm5DLFVBQUssR0FBMkIsSUFBSSxtQkFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFbkYsYUFBUSxHQUFXLFNBQVMsQ0FBQTtRQUM1QixxQkFBZ0IsR0FBVyx5QkFBeUIsQ0FBQTtRQUNwRCxhQUFRLEdBQVcsTUFBTSxDQUFBO1FBUXZCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQTtJQUNsQyxDQUFDO0lBRUssUUFBUSxDQUFFLElBQVU7O1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFN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b3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgRXRoQ2hhaW4gfSBmcm9tICcuLi9ibG9ja2NoYWluL2V0aC1jaGFpbidcbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBFRSB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IFBlZXJNYW5hZ2VyLCBQZWVyLCBFdGhQcm90b2NvbCB9IGZyb20gJy4uL25ldCdcbmltcG9ydCB7IEZhc3RTeW5jRG93bmxvYWRlciB9IGZyb20gJy4vZG93bmxvYWRlcnMnXG5pbXBvcnQgTFJVQ2FjaGUgZnJvbSAnbHJ1LWNhY2hlJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyOmRvd25sb2FkLW1hbmFnZXInKVxuXG5jb25zdCBNQVhfUEVFUlM6IG51bWJlciA9IDVcbmNvbnN0IERFRkFVTFRfRE9XTkxPQURfSU5URVJWQUw6IG51bWJlciA9IDEwMDAgKiAyMFxuXG5AcmVnaXN0ZXIoJ2Rvd25sb2FkLW1hbmFnZXInKVxuZXhwb3J0IGNsYXNzIERvd25sb2FkTWFuYWdlciBleHRlbmRzIEVFIHtcbiAgcGVlcnM6IExSVUNhY2hlPHN0cmluZywgUGVlcj4gPSBuZXcgTFJVQ2FjaGUoeyBtYXg6IE1BWF9QRUVSUywgbWF4QWdlOiAxMDAwICogNjAgfSlcbiAgc3luY0ludGVydmFsOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZFxuICBtYXhQZWVyczogbnVtYmVyID0gTUFYX1BFRVJTXG4gIGRvd25sb2FkSW50ZXJ2YWw6IG51bWJlciA9IERFRkFVTFRfRE9XTkxPQURfSU5URVJWQUxcbiAgc3luY01vZGU6IHN0cmluZyA9ICdmYXN0J1xuXG4gIGNvbnN0cnVjdG9yIChAcmVnaXN0ZXIoJ3BlZXItbWFuYWdlcicpXG4gICAgICAgICAgICAgICBwdWJsaWMgcGVlck1hbmFnZXI6IFBlZXJNYW5hZ2VyLFxuICAgICAgICAgICAgICAgcHVibGljIGNoYWluOiBFdGhDaGFpbixcbiAgICAgICAgICAgICAgIEByZWdpc3Rlcignb3B0aW9ucycpXG4gICAgICAgICAgICAgICBvcHRpb25zOiBhbnkpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zeW5jTW9kZSA9IG9wdGlvbnMuc3luY01vZGVcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkIChwZWVyOiBQZWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnBlZXJzLmhhcyhwZWVyLmlkKSAmJiB0aGlzLnBlZXJzLmxlbmd0aCA8PSB0aGlzLm1heFBlZXJzKSB7XG4gICAgICB0aGlzLnBlZXJzLnNldChwZWVyLmlkLCBwZWVyKVxuICAgICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnN5bmNNb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdmYXN0Jzoge1xuICAgICAgICAgICAgICBjb25zdCBwcm90b2NvbCA9IHBlZXIucHJvdG9jb2xzLmdldCgnZXRoJykgYXMgRXRoUHJvdG9jb2w8YW55PlxuICAgICAgICAgICAgICBpZiAocHJvdG9jb2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkb3dubG9hZGVyID0gbmV3IEZhc3RTeW5jRG93bmxvYWRlcihwcm90b2NvbCwgcGVlciwgdGhpcy5jaGFpbilcbiAgICAgICAgICAgICAgICBhd2FpdCBkb3dubG9hZGVyLmRvd25sb2FkKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlYnVnKGUpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnBlZXJzLmRlbChwZWVyLmlkKVxuICAgICAgICB0aGlzLnBlZXJNYW5hZ2VyLnJlbGVhc2VQZWVycyhbcGVlcl0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHN5bmNcbiAgICovXG4gIGFzeW5jIHN0YXJ0ICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB0ZCA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0QmxvY2tzVEQoKVxuICAgIHRoaXMuc3luY0ludGVydmFsID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGVlcnM6IFBlZXJbXSA9IHRoaXMucGVlck1hbmFnZXIuZ2V0QnlDYXBhYmlsaXR5KHtcbiAgICAgICAgaWQ6ICdldGgnLFxuICAgICAgICB2ZXJzaW9uczogWyc2MyddXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXBlZXJzLmxlbmd0aCkgcmV0dXJuXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBQcm9taXNlLmFsbChwZWVycy5tYXAoKHApID0+IChwLnByb3RvY29scy5nZXQoJ2V0aCcpIGFzIEV0aFByb3RvY29sPGFueT4pIS5nZXRTdGF0dXMoKSkpXG4gICAgICBsZXQgYmVzdFBlZXI6IGFueSA9IHRkXG4gICAgICBzdGF0dXMuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgICBpZiAocy50ZC5ndChiZXN0UGVlcikpIGJlc3RQZWVyID0gcGVlcnNbaV1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChiZXN0UGVlcikge1xuICAgICAgICB0aGlzLnBlZXJNYW5hZ2VyLnJlc2VydmUoW2Jlc3RQZWVyXSlcbiAgICAgICAgdGhpcy5kb3dubG9hZChiZXN0UGVlcilcbiAgICAgIH1cbiAgICB9LFxuICAgIHRoaXMuZG93bmxvYWRJbnRlcnZhbClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHN5bmNcbiAgICovXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnN5bmNJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN5bmNJbnRlcnZhbClcbiAgfVxufVxuIl19