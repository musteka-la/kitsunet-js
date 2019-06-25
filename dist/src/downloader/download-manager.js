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
const constants_1 = require("../constants");
const debug = debug_1.default('kitsunet:downloader:download-manager');
const DEFAULT_DOWNLOAD_INTERVAL = 1000 * 20;
let DownloadManager = class DownloadManager extends events_1.EventEmitter {
    constructor(chain, peerManager, options, downloader) {
        super();
        this.chain = chain;
        this.peerManager = peerManager;
        this.downloader = downloader;
        this.peers = new lru_cache_1.default({ max: constants_1.MAX_PEERS, maxAge: 1000 * 60 });
        this.maxPeers = constants_1.MAX_PEERS;
        this.downloadInterval = DEFAULT_DOWNLOAD_INTERVAL;
        this.syncMode = 'fast';
        this.syncMode = options.syncMode;
    }
    static createDownloader(chain, peerManager, options) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (options.syncMode) {
                case 'fast': {
                    return new downloaders_1.FastSyncDownloader(chain, peerManager);
                }
                default:
                    throw new Error(`unknown sync mode ${options.syncMode}`);
            }
        });
    }
    download(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.peers.has(peer.id) && this.peers.length <= this.maxPeers) {
                this.peers.set(peer.id, peer);
                try {
                    this.peerManager.reserve([peer]);
                    return this.downloader.download(peer);
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
            this.syncInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const bestPeer = yield this.downloader.best();
                if (bestPeer) {
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
__decorate([
    opium_decorators_1.register('downloader'),
    __param(1, opium_decorators_1.register('peer-manager')),
    __param(2, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [eth_chain_1.EthChain,
        net_1.PeerManager, Object]),
    __metadata("design:returntype", Promise)
], DownloadManager, "createDownloader", null);
DownloadManager = __decorate([
    opium_decorators_1.register('download-manager'),
    __param(1, opium_decorators_1.register('peer-manager')),
    __param(2, opium_decorators_1.register('options')),
    __param(3, opium_decorators_1.register('downloader')),
    __metadata("design:paramtypes", [eth_chain_1.EthChain,
        net_1.PeerManager, Object, Object])
], DownloadManager);
exports.DownloadManager = DownloadManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosdURBQTJDO0FBQzNDLHVEQUFrRDtBQUNsRCxtQ0FBMkM7QUFDM0MsZ0NBQTBDO0FBQzFDLCtDQUFrRDtBQUVsRCwwREFBZ0M7QUFFaEMsa0RBQXlCO0FBQ3pCLDRDQUF3QztBQUN4QyxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtBQUUzRCxNQUFNLHlCQUF5QixHQUFXLElBQUksR0FBRyxFQUFFLENBQUE7QUFHbkQsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZ0IsU0FBUSxxQkFBRTtJQXVCckMsWUFBb0IsS0FBZSxFQUVmLFdBQXdCLEVBRS9CLE9BQVksRUFFTCxVQUF1QjtRQUN6QyxLQUFLLEVBQUUsQ0FBQTtRQVBXLFVBQUssR0FBTCxLQUFLLENBQVU7UUFFZixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUl4QixlQUFVLEdBQVYsVUFBVSxDQUFhO1FBNUIzQyxVQUFLLEdBQTJCLElBQUksbUJBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxxQkFBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVuRixhQUFRLEdBQVcscUJBQVMsQ0FBQTtRQUM1QixxQkFBZ0IsR0FBVyx5QkFBeUIsQ0FBQTtRQUNwRCxhQUFRLEdBQVcsTUFBTSxDQUFBO1FBMEJ2QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7SUFDbEMsQ0FBQztJQXhCRCxNQUFNLENBQU8sZ0JBQWdCLENBQUUsS0FBZSxFQUVmLFdBQXdCLEVBRXhCLE9BQVk7O1lBQ3pDLFFBQVEsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDdEIsS0FBSyxNQUFNLENBQUMsQ0FBQztvQkFDWCxPQUFPLElBQUksZ0NBQWtCLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO2lCQUNsRDtnQkFFRDtvQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUM3RDtRQUNILENBQUM7S0FBQTtJQWFhLFFBQVEsQ0FBRSxJQUFVOztZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQzdCLElBQUk7b0JBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO29CQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUN0QztnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ1Q7d0JBQVM7b0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7aUJBQ3RDO2FBQ0Y7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLEtBQUs7O1lBQ1QsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsR0FBUyxFQUFFO2dCQUN6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQzdDLElBQUksUUFBUSxFQUFFO29CQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3hCO1lBQ0gsQ0FBQyxDQUFBLEVBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDeEIsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxJQUFJOztZQUNSLElBQUksSUFBSSxDQUFDLFlBQVk7Z0JBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN6RCxDQUFDO0tBQUE7Q0FDRixDQUFBO0FBNURDO0lBREMsMkJBQVEsQ0FBQyxZQUFZLENBQUM7SUFFUyxXQUFBLDJCQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFeEIsV0FBQSwyQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztxQ0FIYixvQkFBUTtRQUVGLGlCQUFXOzs2Q0FXdEQ7QUFyQlUsZUFBZTtJQUQzQiwyQkFBUSxDQUFDLGtCQUFrQixDQUFDO0lBeUJiLFdBQUEsMkJBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUV4QixXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFFbkIsV0FBQSwyQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFBO3FDQUxULG9CQUFRO1FBRUYsaUJBQVc7R0F6QmpDLGVBQWUsQ0FvRTNCO0FBcEVZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vYmxvY2tjaGFpbi9ldGgtY2hhaW4nXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgYXMgRUUgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBQZWVyTWFuYWdlciwgUGVlciB9IGZyb20gJy4uL25ldCdcbmltcG9ydCB7IEZhc3RTeW5jRG93bmxvYWRlciB9IGZyb20gJy4vZG93bmxvYWRlcnMnXG5pbXBvcnQgeyBJRG93bmxvYWRlciB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCBMUlVDYWNoZSBmcm9tICdscnUtY2FjaGUnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IE1BWF9QRUVSUyB9IGZyb20gJy4uL2NvbnN0YW50cydcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmRvd25sb2FkZXI6ZG93bmxvYWQtbWFuYWdlcicpXG5cbmNvbnN0IERFRkFVTFRfRE9XTkxPQURfSU5URVJWQUw6IG51bWJlciA9IDEwMDAgKiAyMFxuXG5AcmVnaXN0ZXIoJ2Rvd25sb2FkLW1hbmFnZXInKVxuZXhwb3J0IGNsYXNzIERvd25sb2FkTWFuYWdlciBleHRlbmRzIEVFIHtcbiAgcGVlcnM6IExSVUNhY2hlPHN0cmluZywgUGVlcj4gPSBuZXcgTFJVQ2FjaGUoeyBtYXg6IE1BWF9QRUVSUywgbWF4QWdlOiAxMDAwICogNjAgfSlcbiAgc3luY0ludGVydmFsOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZFxuICBtYXhQZWVyczogbnVtYmVyID0gTUFYX1BFRVJTXG4gIGRvd25sb2FkSW50ZXJ2YWw6IG51bWJlciA9IERFRkFVTFRfRE9XTkxPQURfSU5URVJWQUxcbiAgc3luY01vZGU6IHN0cmluZyA9ICdmYXN0J1xuXG4gIEByZWdpc3RlcignZG93bmxvYWRlcicpXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVEb3dubG9hZGVyIChjaGFpbjogRXRoQ2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3BlZXItbWFuYWdlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ29wdGlvbnMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogYW55KTogUHJvbWlzZTxJRG93bmxvYWRlciB8IHVuZGVmaW5lZD4ge1xuICAgIHN3aXRjaCAob3B0aW9ucy5zeW5jTW9kZSkge1xuICAgICAgICBjYXNlICdmYXN0Jzoge1xuICAgICAgICAgIHJldHVybiBuZXcgRmFzdFN5bmNEb3dubG9hZGVyKGNoYWluLCBwZWVyTWFuYWdlcilcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHN5bmMgbW9kZSAke29wdGlvbnMuc3luY01vZGV9YClcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHVibGljIGNoYWluOiBFdGhDaGFpbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcigncGVlci1tYW5hZ2VyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIsXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ29wdGlvbnMnKVxuICAgICAgICAgICAgICAgb3B0aW9uczogYW55LFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdkb3dubG9hZGVyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBkb3dubG9hZGVyOiBJRG93bmxvYWRlcikge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN5bmNNb2RlID0gb3B0aW9ucy5zeW5jTW9kZVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBkb3dubG9hZCAocGVlcjogUGVlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5wZWVycy5oYXMocGVlci5pZCkgJiYgdGhpcy5wZWVycy5sZW5ndGggPD0gdGhpcy5tYXhQZWVycykge1xuICAgICAgdGhpcy5wZWVycy5zZXQocGVlci5pZCwgcGVlcilcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMucGVlck1hbmFnZXIucmVzZXJ2ZShbcGVlcl0pXG4gICAgICAgIHJldHVybiB0aGlzLmRvd25sb2FkZXIuZG93bmxvYWQocGVlcilcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVidWcoZSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMucGVlcnMuZGVsKHBlZXIuaWQpXG4gICAgICAgIHRoaXMucGVlck1hbmFnZXIucmVsZWFzZVBlZXJzKFtwZWVyXSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgc3luY1xuICAgKi9cbiAgYXN5bmMgc3RhcnQgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc3luY0ludGVydmFsID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYmVzdFBlZXIgPSBhd2FpdCB0aGlzLmRvd25sb2FkZXIuYmVzdCgpXG4gICAgICBpZiAoYmVzdFBlZXIpIHtcbiAgICAgICAgdGhpcy5kb3dubG9hZChiZXN0UGVlcilcbiAgICAgIH1cbiAgICB9LFxuICAgIHRoaXMuZG93bmxvYWRJbnRlcnZhbClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHN5bmNcbiAgICovXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnN5bmNJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN5bmNJbnRlcnZhbClcbiAgfVxufVxuIl19