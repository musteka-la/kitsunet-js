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
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:downloader:download-manager');
const MAX_PEERS = 25;
const DEFAULT_DOWNLOAD_INTERVAL = 1000 * 5;
let DownloadManager = class DownloadManager extends events_1.EventEmitter {
    constructor(peerManager, chain, options) {
        super();
        this.peerManager = peerManager;
        this.chain = chain;
        this.peers = new Map();
        this.maxPeers = MAX_PEERS;
        this.downloadInterval = DEFAULT_DOWNLOAD_INTERVAL;
        this.syncMode = 'fast';
        this.syncMode = options.syncMode;
    }
    download(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.peers.has(peer.id) && this.peers.size <= this.maxPeers) {
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
                    this.peers.delete(peer.id);
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
            this.syncInterval = setInterval(() => {
                const peer = this.peerManager.getRandomByCapability({
                    id: 'eth',
                    versions: ['63']
                });
                if (peer) {
                    return this.download(peer);
                }
            }, this.downloadInterval);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb3dubG9hZGVyL2Rvd25sb2FkLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosdURBQTJDO0FBQzNDLHVEQUFrRDtBQUNsRCxtQ0FBMkM7QUFDM0MsZ0NBQXVEO0FBQ3ZELCtDQUFrRDtBQUVsRCxrREFBeUI7QUFDekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7QUFFM0QsTUFBTSxTQUFTLEdBQVcsRUFBRSxDQUFBO0FBQzVCLE1BQU0seUJBQXlCLEdBQVcsSUFBSSxHQUFHLENBQUMsQ0FBQTtBQUdsRCxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFnQixTQUFRLHFCQUFFO0lBT3JDLFlBQ29CLFdBQXdCLEVBQ3hCLEtBQWUsRUFFdEIsT0FBWTtRQUN2QixLQUFLLEVBQUUsQ0FBQTtRQUpXLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQVU7UUFSbkMsVUFBSyxHQUFzQixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBRXBDLGFBQVEsR0FBVyxTQUFTLENBQUE7UUFDNUIscUJBQWdCLEdBQVcseUJBQXlCLENBQUE7UUFDcEQsYUFBUSxHQUFXLE1BQU0sQ0FBQTtRQVF2QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7SUFDbEMsQ0FBQztJQUVLLFFBQVEsQ0FBRSxJQUFVOztZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQzdCLElBQUk7b0JBQ0YsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNuQixLQUFLLE1BQU0sQ0FBQyxDQUFDOzRCQUNYLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBcUIsQ0FBQTs0QkFDOUQsSUFBSSxRQUFRLEVBQUU7Z0NBQ1osTUFBTSxVQUFVLEdBQUcsSUFBSSxnQ0FBa0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQ0FDckUsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUE7NkJBQzVCOzRCQUNELE1BQUs7eUJBQ047cUJBQ0o7aUJBQ0Y7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUNUO3dCQUFTO29CQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2lCQUN0QzthQUNGO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxLQUFLOztZQUNULElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDbEQsRUFBRSxFQUFFLEtBQUs7b0JBQ1QsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDO2lCQUNqQixDQUFDLENBQUE7Z0JBRUYsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUMzQjtZQUNILENBQUMsRUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLElBQUk7O1lBQ1IsSUFBSSxJQUFJLENBQUMsWUFBWTtnQkFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3pELENBQUM7S0FBQTtDQUNGLENBQUE7QUE5RFksZUFBZTtJQUQzQiwyQkFBUSxDQUFDLGtCQUFrQixDQUFDO0lBUWIsV0FBQSwyQkFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBR3hCLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtxQ0FGQSxpQkFBVztRQUNqQixvQkFBUTtHQVR4QixlQUFlLENBOEQzQjtBQTlEWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uL2Jsb2NrY2hhaW4vZXRoLWNoYWluJ1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHsgUGVlck1hbmFnZXIsIFBlZXIsIEV0aFByb3RvY29sIH0gZnJvbSAnLi4vbmV0J1xuaW1wb3J0IHsgRmFzdFN5bmNEb3dubG9hZGVyIH0gZnJvbSAnLi9kb3dubG9hZGVycydcblxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6ZG93bmxvYWRlcjpkb3dubG9hZC1tYW5hZ2VyJylcblxuY29uc3QgTUFYX1BFRVJTOiBudW1iZXIgPSAyNVxuY29uc3QgREVGQVVMVF9ET1dOTE9BRF9JTlRFUlZBTDogbnVtYmVyID0gMTAwMCAqIDVcblxuQHJlZ2lzdGVyKCdkb3dubG9hZC1tYW5hZ2VyJylcbmV4cG9ydCBjbGFzcyBEb3dubG9hZE1hbmFnZXIgZXh0ZW5kcyBFRSB7XG4gIHBlZXJzOiBNYXA8c3RyaW5nLCBQZWVyPiA9IG5ldyBNYXAoKVxuICBzeW5jSW50ZXJ2YWw6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkXG4gIG1heFBlZXJzOiBudW1iZXIgPSBNQVhfUEVFUlNcbiAgZG93bmxvYWRJbnRlcnZhbDogbnVtYmVyID0gREVGQVVMVF9ET1dOTE9BRF9JTlRFUlZBTFxuICBzeW5jTW9kZTogc3RyaW5nID0gJ2Zhc3QnXG5cbiAgY29uc3RydWN0b3IgKEByZWdpc3RlcigncGVlci1tYW5hZ2VyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIsXG4gICAgICAgICAgICAgICBwdWJsaWMgY2hhaW46IEV0aENoYWluLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdvcHRpb25zJylcbiAgICAgICAgICAgICAgIG9wdGlvbnM6IGFueSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN5bmNNb2RlID0gb3B0aW9ucy5zeW5jTW9kZVxuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQgKHBlZXI6IFBlZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMucGVlcnMuaGFzKHBlZXIuaWQpICYmIHRoaXMucGVlcnMuc2l6ZSA8PSB0aGlzLm1heFBlZXJzKSB7XG4gICAgICB0aGlzLnBlZXJzLnNldChwZWVyLmlkLCBwZWVyKVxuICAgICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnN5bmNNb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdmYXN0Jzoge1xuICAgICAgICAgICAgICBjb25zdCBwcm90b2NvbCA9IHBlZXIucHJvdG9jb2xzLmdldCgnZXRoJykgYXMgRXRoUHJvdG9jb2w8YW55PlxuICAgICAgICAgICAgICBpZiAocHJvdG9jb2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkb3dubG9hZGVyID0gbmV3IEZhc3RTeW5jRG93bmxvYWRlcihwcm90b2NvbCwgcGVlciwgdGhpcy5jaGFpbilcbiAgICAgICAgICAgICAgICBhd2FpdCBkb3dubG9hZGVyLmRvd25sb2FkKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlYnVnKGUpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnBlZXJzLmRlbGV0ZShwZWVyLmlkKVxuICAgICAgICB0aGlzLnBlZXJNYW5hZ2VyLnJlbGVhc2VQZWVycyhbcGVlcl0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHN5bmNcbiAgICovXG4gIGFzeW5jIHN0YXJ0ICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnN5bmNJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnN0IHBlZXIgPSB0aGlzLnBlZXJNYW5hZ2VyLmdldFJhbmRvbUJ5Q2FwYWJpbGl0eSh7XG4gICAgICAgIGlkOiAnZXRoJyxcbiAgICAgICAgdmVyc2lvbnM6IFsnNjMnXVxuICAgICAgfSlcblxuICAgICAgaWYgKHBlZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG93bmxvYWQocGVlcilcbiAgICAgIH1cbiAgICB9LFxuICAgIHRoaXMuZG93bmxvYWRJbnRlcnZhbClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHN5bmNcbiAgICovXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnN5bmNJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN5bmNJbnRlcnZhbClcbiAgfVxufVxuIl19