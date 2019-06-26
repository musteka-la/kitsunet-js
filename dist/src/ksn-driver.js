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
const events_1 = __importDefault(require("events"));
const debug_1 = __importDefault(require("debug"));
const constants_1 = require("./constants");
const base_1 = require("./slice/discovery/base");
const opium_decorators_1 = require("opium-decorators");
const kitsunet_block_tracker_1 = __importDefault(require("kitsunet-block-tracker"));
const net_1 = require("./net");
const blockchain_1 = require("./blockchain");
const downloader_1 = require("./downloader");
const debug = debug_1.default('kitsunet:kitsunet-driver');
// TODO: Plugin blockchain and header sync
let KsnDriver = class KsnDriver extends events_1.default {
    constructor(isBridge, discovery, nodeManager, downloadManager, blockTracker, chain, libp2pPeer) {
        super();
        this.isBridge = isBridge;
        this.discovery = discovery;
        this.nodeManager = nodeManager;
        this.downloadManager = downloadManager;
        this.blockTracker = blockTracker;
        this.chain = chain;
        this.libp2pPeer = libp2pPeer;
        this.isBridge = Boolean(isBridge.bridge);
        this.discovery = discovery;
        this.blockTracker = blockTracker;
        this.nodeType = this.isBridge ? constants_1.KsnNodeType.BRIDGE : constants_1.KsnNodeType.NODE;
        // peers
        this.peers = new Map();
    }
    get clientPeers() {
        return [this.libp2pPeer];
    }
    /**
     * Get the latest block
     */
    getLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chain.getLatestBlock();
        });
    }
    /**
     * Get a block by number
     * @param {String|Number} blockId - the number/tag of the block to retrieve
     */
    getBlockByNumber(blockId) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = yield this.chain.getBlocks(blockId, 1);
            if (block && block.length > 0) {
                return block[0];
            }
        });
    }
    getHeaders(blockId, maxBlocks = 25, skip = 0, reverse = false) {
        return this.chain.getHeaders(blockId, maxBlocks, skip, reverse);
    }
    /**
     * Discover peers tracking this slice
     *
     * @param {Array<SliceId>|SliceId} slice - the slices to find the peers for
     * @returns {Array<Peer>} peers - an array of peers tracking the slice
     */
    findPeers(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.discovery.findPeers(slice);
        });
    }
    /**
     * Discover and connect to peers tracking this slice
     *
     * @param {Array<SliceId>} slices - the slices to find the peers for
     */
    findSlicePeers(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            const peers = yield this.findPeers(slices);
            if (peers && peers.length) {
                const _peers = yield Promise.all(peers.map((peer) => {
                    if (peer.id.toB58String() === this.libp2pPeer.id) {
                        debug('cant dial to self, skipping');
                    }
                }));
                return _peers.filter(Boolean);
            }
        });
    }
    /**
     * Resolve slices from remotes
     *
     * @param {Array<slices>} slices - slices to resolve from peers
     * @param {Array<RpcPeer>} peers - peers to query
     */
    _rpcResolve(slices, peers) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolve = (peer) => __awaiter(this, void 0, void 0, function* () {
                // first check if the peer has already reported
                // tracking the slice
                const _peers = slices.map((slice) => {
                    if (peer.sliceIds.has(`${slice.path}-${slice.depth}`) ||
                        peer.nodeType === constants_1.KsnNodeType.BRIDGE ||
                        peer.nodeType === constants_1.KsnNodeType.NODE) {
                        return peer;
                    }
                }).filter(Boolean);
                if (_peers && _peers.length) {
                    return Promise.race(_peers.map(p => p.getSlices(slices)));
                }
            });
            for (const p of peers) {
                let resolved = yield resolve(p);
                if (resolved && resolved.length)
                    return resolved;
                yield p.protocols['ksn'].getSliceIds(); // refresh the ids
                resolved = yield resolve(p);
                if (resolved && resolved.length)
                    return resolved;
            }
        });
    }
    /**
     * Find the requested slices, by trying different
     * underlying mechanisms
     *
     * 1) RPC - ask each peer for the slice, if that fails
     * 2) Discovery - ask different discovery mechanisms to
     * find peers tracking the requested slices
     * 3) RPC - repeat 1st step with the new peers
     *
     * @param {Array<SliceId>} slices
     */
    resolveSlices(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolved = yield this._rpcResolve(slices, [...this.peers.values()]);
            if (resolved && resolved.length) {
                return resolved;
            }
            const peers = yield this.findSlicePeers(slices);
            if (peers && peers.length) {
                return this._rpcResolve(slices, peers);
            }
            return {};
        });
    }
    /**
     * Announces slice to the network using whatever mechanisms
     * are available, e.g DHT, RPC, etc...
     *
     * @param {Array<SliceId>} slices - the slices to announce to the network
     */
    announce(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.discovery.announce(slices);
        });
    }
    /**
     * Start the driver
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.nodeManager.on('kitsunet:peer:connected', (peer) => {
                this.peers.set(peer.id, peer);
                this.emit('kitsunet:peer:connected', peer);
            });
            this.nodeManager.on('kitsunet:peer:disconnected', (peer) => {
                this.peers.delete(peer.id);
                this.emit('kitsunet:peer:disconnected', peer);
            });
            yield this.nodeManager.start();
            yield this.blockTracker.start();
            yield this.downloadManager.start();
            yield this.chain.start();
        });
    }
    /**
     * Stop the driver
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.downloadManager.stop();
            yield this.nodeManager.stop();
            yield this.blockTracker.stop();
            yield this.chain.stop();
        });
    }
    getState() {
        if (!this._stats)
            return {};
        return this._stats.getState();
    }
};
KsnDriver = __decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('options')),
    __param(2, opium_decorators_1.register('node-manager')),
    __param(3, opium_decorators_1.register('download-manager')),
    __param(5, opium_decorators_1.register(blockchain_1.EthChain)),
    __metadata("design:paramtypes", [Object, base_1.Discovery,
        net_1.NodeManager,
        downloader_1.DownloadManager,
        kitsunet_block_tracker_1.default, Object, net_1.Libp2pPeer])
], KsnDriver);
exports.KsnDriver = KsnDriver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLWRyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rc24tZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUF1QjtBQUN2QixrREFBeUI7QUFFekIsMkNBQXlDO0FBQ3pDLGlEQUFrRDtBQUNsRCx1REFBMkM7QUFFM0Msb0ZBQXlEO0FBR3pELCtCQUljO0FBRWQsNkNBQW9EO0FBQ3BELDZDQUE4QztBQUU5QyxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUUvQywwQ0FBMEM7QUFFMUMsSUFBYSxTQUFTLEdBQXRCLE1BQWEsU0FBMkMsU0FBUSxnQkFBRTtJQUtoRSxZQUNvQixRQUFhLEVBQ2IsU0FBb0IsRUFFcEIsV0FBMkIsRUFFM0IsZUFBZ0MsRUFDaEMsWUFBa0MsRUFFbEMsS0FBa0IsRUFDbEIsVUFBc0I7UUFDeEMsS0FBSyxFQUFFLENBQUE7UUFWVyxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQ2IsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUVwQixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFFM0Isb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtRQUVsQyxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFHeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUFXLENBQUMsSUFB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Q0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUMvQixDQUFDO0NBQ0YsQ0FBQTtBQXZMWSxTQUFTO0lBRHJCLDJCQUFRLEVBQUU7SUFNSyxXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFHbkIsV0FBQSwyQkFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRXhCLFdBQUEsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBRzVCLFdBQUEsMkJBQVEsQ0FBQyxxQkFBUSxDQUFDLENBQUE7NkNBTkQsZ0JBQVM7UUFFUCxpQkFBVztRQUVQLDRCQUFlO1FBQ2xCLGdDQUFvQixVQUd0QixnQkFBVTtHQWYvQixTQUFTLENBdUxyQjtBQXZMWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRUUgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuXG5pbXBvcnQgeyBLc25Ob2RlVHlwZSB9IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgRGlzY292ZXJ5IH0gZnJvbSAnLi9zbGljZS9kaXNjb3ZlcnkvYmFzZSdcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IFNsaWNlIH0gZnJvbSAnLi9zbGljZSdcbmltcG9ydCBLaXN0dW5ldEJsb2NrVHJhY2tlciBmcm9tICdraXRzdW5ldC1ibG9jay10cmFja2VyJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5cbmltcG9ydCB7XG4gIE5vZGVNYW5hZ2VyLFxuICBMaWJwMnBQZWVyLFxuICBOZXR3b3JrUGVlclxufSBmcm9tICcuL25ldCdcblxuaW1wb3J0IHsgRXRoQ2hhaW4sIElCbG9ja2NoYWluIH0gZnJvbSAnLi9ibG9ja2NoYWluJ1xuaW1wb3J0IHsgRG93bmxvYWRNYW5hZ2VyIH0gZnJvbSAnLi9kb3dubG9hZGVyJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpraXRzdW5ldC1kcml2ZXInKVxuXG4vLyBUT0RPOiBQbHVnaW4gYmxvY2tjaGFpbiBhbmQgaGVhZGVyIHN5bmNcbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgS3NuRHJpdmVyPFQgZXh0ZW5kcyBOZXR3b3JrUGVlcjxhbnksIGFueT4+IGV4dGVuZHMgRUUge1xuICBub2RlVHlwZTogS3NuTm9kZVR5cGVcbiAgcGVlcnM6IE1hcDxzdHJpbmcsIFQ+XG4gIF9zdGF0czogYW55XG5cbiAgY29uc3RydWN0b3IgKEByZWdpc3Rlcignb3B0aW9ucycpXG4gICAgICAgICAgICAgICBwdWJsaWMgaXNCcmlkZ2U6IGFueSxcbiAgICAgICAgICAgICAgIHB1YmxpYyBkaXNjb3Zlcnk6IERpc2NvdmVyeSxcbiAgICAgICAgICAgICAgIEByZWdpc3Rlcignbm9kZS1tYW5hZ2VyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBub2RlTWFuYWdlcjogTm9kZU1hbmFnZXI8VD4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2Rvd25sb2FkLW1hbmFnZXInKVxuICAgICAgICAgICAgICAgcHVibGljIGRvd25sb2FkTWFuYWdlcjogRG93bmxvYWRNYW5hZ2VyLFxuICAgICAgICAgICAgICAgcHVibGljIGJsb2NrVHJhY2tlcjogS2lzdHVuZXRCbG9ja1RyYWNrZXIsXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoRXRoQ2hhaW4pXG4gICAgICAgICAgICAgICBwdWJsaWMgY2hhaW46IElCbG9ja2NoYWluLFxuICAgICAgICAgICAgICAgcHVibGljIGxpYnAycFBlZXI6IExpYnAycFBlZXIpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLmlzQnJpZGdlID0gQm9vbGVhbihpc0JyaWRnZS5icmlkZ2UpXG4gICAgdGhpcy5kaXNjb3ZlcnkgPSBkaXNjb3ZlcnlcbiAgICB0aGlzLmJsb2NrVHJhY2tlciA9IGJsb2NrVHJhY2tlclxuICAgIHRoaXMubm9kZVR5cGUgPSB0aGlzLmlzQnJpZGdlID8gS3NuTm9kZVR5cGUuQlJJREdFIDogS3NuTm9kZVR5cGUuTk9ERVxuXG4gICAgLy8gcGVlcnNcbiAgICB0aGlzLnBlZXJzID0gbmV3IE1hcCgpXG4gIH1cblxuICBnZXQgY2xpZW50UGVlcnMgKCk6IFRbXSB7XG4gICAgcmV0dXJuIFt0aGlzLmxpYnAycFBlZXJdIGFzIHVua25vd24gYXMgVFtdXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsYXRlc3QgYmxvY2tcbiAgICovXG4gIGFzeW5jIGdldExhdGVzdEJsb2NrICgpOiBQcm9taXNlPEJsb2NrIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhaW4uZ2V0TGF0ZXN0QmxvY2soKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGJsb2NrIGJ5IG51bWJlclxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGJsb2NrSWQgLSB0aGUgbnVtYmVyL3RhZyBvZiB0aGUgYmxvY2sgdG8gcmV0cmlldmVcbiAgICovXG4gIGFzeW5jIGdldEJsb2NrQnlOdW1iZXIgKGJsb2NrSWQ6IG51bWJlcik6IFByb21pc2U8QmxvY2sgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBibG9jazogQmxvY2tbXSB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0QmxvY2tzKGJsb2NrSWQsIDEpXG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBibG9ja1swXVxuICAgIH1cbiAgfVxuXG4gIGdldEhlYWRlcnMgKGJsb2NrSWQ6IEJ1ZmZlciB8IG51bWJlcixcbiAgICAgICAgICAgICAgbWF4QmxvY2tzOiBudW1iZXIgPSAyNSxcbiAgICAgICAgICAgICAgc2tpcDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhaW4uZ2V0SGVhZGVycyhibG9ja0lkLCBtYXhCbG9ja3MsIHNraXAsIHJldmVyc2UpXG4gIH1cblxuICAvKipcbiAgICogRGlzY292ZXIgcGVlcnMgdHJhY2tpbmcgdGhpcyBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fFNsaWNlSWR9IHNsaWNlIC0gdGhlIHNsaWNlcyB0byBmaW5kIHRoZSBwZWVycyBmb3JcbiAgICogQHJldHVybnMge0FycmF5PFBlZXI+fSBwZWVycyAtIGFuIGFycmF5IG9mIHBlZXJzIHRyYWNraW5nIHRoZSBzbGljZVxuICAgKi9cbiAgYXN5bmMgZmluZFBlZXJzIChzbGljZSkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyeS5maW5kUGVlcnMoc2xpY2UpXG4gIH1cblxuICAvKipcbiAgICogRGlzY292ZXIgYW5kIGNvbm5lY3QgdG8gcGVlcnMgdHJhY2tpbmcgdGhpcyBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fSBzbGljZXMgLSB0aGUgc2xpY2VzIHRvIGZpbmQgdGhlIHBlZXJzIGZvclxuICAgKi9cbiAgYXN5bmMgZmluZFNsaWNlUGVlcnMgKHNsaWNlcykge1xuICAgIGNvbnN0IHBlZXJzID0gYXdhaXQgdGhpcy5maW5kUGVlcnMoc2xpY2VzKVxuICAgIGlmIChwZWVycyAmJiBwZWVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IF9wZWVycyA9IGF3YWl0IFByb21pc2UuYWxsKHBlZXJzLm1hcCgocGVlcikgPT4ge1xuICAgICAgICBpZiAocGVlci5pZC50b0I1OFN0cmluZygpID09PSB0aGlzLmxpYnAycFBlZXIuaWQpIHtcbiAgICAgICAgICBkZWJ1ZygnY2FudCBkaWFsIHRvIHNlbGYsIHNraXBwaW5nJylcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICByZXR1cm4gX3BlZXJzLmZpbHRlcihCb29sZWFuKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHNsaWNlcyBmcm9tIHJlbW90ZXNcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzbGljZXM+fSBzbGljZXMgLSBzbGljZXMgdG8gcmVzb2x2ZSBmcm9tIHBlZXJzXG4gICAqIEBwYXJhbSB7QXJyYXk8UnBjUGVlcj59IHBlZXJzIC0gcGVlcnMgdG8gcXVlcnlcbiAgICovXG4gIGFzeW5jIF9ycGNSZXNvbHZlIChzbGljZXM6IFNsaWNlW10sIHBlZXJzOiBOZXR3b3JrUGVlcjxhbnksIGFueT5bXSk6IFByb21pc2U8YW55W10gfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCByZXNvbHZlID0gYXN5bmMgKHBlZXIpOiBQcm9taXNlPGFueVtdIHwgdW5kZWZpbmVkPiA9PiB7XG4gICAgICAvLyBmaXJzdCBjaGVjayBpZiB0aGUgcGVlciBoYXMgYWxyZWFkeSByZXBvcnRlZFxuICAgICAgLy8gdHJhY2tpbmcgdGhlIHNsaWNlXG4gICAgICBjb25zdCBfcGVlcnMgPSBzbGljZXMubWFwKChzbGljZSkgPT4ge1xuICAgICAgICBpZiAocGVlci5zbGljZUlkcy5oYXMoYCR7c2xpY2UucGF0aH0tJHtzbGljZS5kZXB0aH1gKSB8fFxuICAgICAgICAgIHBlZXIubm9kZVR5cGUgPT09IEtzbk5vZGVUeXBlLkJSSURHRSB8fFxuICAgICAgICAgIHBlZXIubm9kZVR5cGUgPT09IEtzbk5vZGVUeXBlLk5PREUpIHtcbiAgICAgICAgICByZXR1cm4gcGVlclxuICAgICAgICB9XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbilcblxuICAgICAgaWYgKF9wZWVycyAmJiBfcGVlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoX3BlZXJzLm1hcChwID0+IHAuZ2V0U2xpY2VzKHNsaWNlcykpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcCBvZiBwZWVycykge1xuICAgICAgbGV0IHJlc29sdmVkID0gYXdhaXQgcmVzb2x2ZShwKVxuICAgICAgaWYgKHJlc29sdmVkICYmIHJlc29sdmVkLmxlbmd0aCkgcmV0dXJuIHJlc29sdmVkXG4gICAgICBhd2FpdCBwLnByb3RvY29sc1sna3NuJ10uZ2V0U2xpY2VJZHMoKSAvLyByZWZyZXNoIHRoZSBpZHNcbiAgICAgIHJlc29sdmVkID0gYXdhaXQgcmVzb2x2ZShwKVxuICAgICAgaWYgKHJlc29sdmVkICYmIHJlc29sdmVkLmxlbmd0aCkgcmV0dXJuIHJlc29sdmVkXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIHJlcXVlc3RlZCBzbGljZXMsIGJ5IHRyeWluZyBkaWZmZXJlbnRcbiAgICogdW5kZXJseWluZyBtZWNoYW5pc21zXG4gICAqXG4gICAqIDEpIFJQQyAtIGFzayBlYWNoIHBlZXIgZm9yIHRoZSBzbGljZSwgaWYgdGhhdCBmYWlsc1xuICAgKiAyKSBEaXNjb3ZlcnkgLSBhc2sgZGlmZmVyZW50IGRpc2NvdmVyeSBtZWNoYW5pc21zIHRvXG4gICAqIGZpbmQgcGVlcnMgdHJhY2tpbmcgdGhlIHJlcXVlc3RlZCBzbGljZXNcbiAgICogMykgUlBDIC0gcmVwZWF0IDFzdCBzdGVwIHdpdGggdGhlIG5ldyBwZWVyc1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fSBzbGljZXNcbiAgICovXG4gIGFzeW5jIHJlc29sdmVTbGljZXMgKHNsaWNlcykge1xuICAgIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgdGhpcy5fcnBjUmVzb2x2ZShzbGljZXMsIFsuLi50aGlzLnBlZXJzLnZhbHVlcygpXSlcbiAgICBpZiAocmVzb2x2ZWQgJiYgcmVzb2x2ZWQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZWRcbiAgICB9XG5cbiAgICBjb25zdCBwZWVycyA9IGF3YWl0IHRoaXMuZmluZFNsaWNlUGVlcnMoc2xpY2VzKVxuICAgIGlmIChwZWVycyAmJiBwZWVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ycGNSZXNvbHZlKHNsaWNlcywgcGVlcnMgYXMgTmV0d29ya1BlZXI8YW55LCBhbnk+W10pXG4gICAgfVxuICAgIHJldHVybiB7fSBhcyBTbGljZVxuICB9XG5cbiAgLyoqXG4gICAqIEFubm91bmNlcyBzbGljZSB0byB0aGUgbmV0d29yayB1c2luZyB3aGF0ZXZlciBtZWNoYW5pc21zXG4gICAqIGFyZSBhdmFpbGFibGUsIGUuZyBESFQsIFJQQywgZXRjLi4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8U2xpY2VJZD59IHNsaWNlcyAtIHRoZSBzbGljZXMgdG8gYW5ub3VuY2UgdG8gdGhlIG5ldHdvcmtcbiAgICovXG4gIGFzeW5jIGFubm91bmNlIChzbGljZXMpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb3ZlcnkuYW5ub3VuY2Uoc2xpY2VzKVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBkcml2ZXJcbiAgICovXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICB0aGlzLm5vZGVNYW5hZ2VyLm9uKCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIChwZWVyOiBUKSA9PiB7XG4gICAgICB0aGlzLnBlZXJzLnNldChwZWVyLmlkLCBwZWVyKVxuICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIHBlZXIpXG4gICAgfSlcblxuICAgIHRoaXMubm9kZU1hbmFnZXIub24oJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgKHBlZXI6IFQpID0+IHtcbiAgICAgIHRoaXMucGVlcnMuZGVsZXRlKHBlZXIuaWQpXG4gICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgcGVlcilcbiAgICB9KVxuXG4gICAgYXdhaXQgdGhpcy5ub2RlTWFuYWdlci5zdGFydCgpXG4gICAgYXdhaXQgdGhpcy5ibG9ja1RyYWNrZXIuc3RhcnQoKVxuICAgIGF3YWl0IHRoaXMuZG93bmxvYWRNYW5hZ2VyLnN0YXJ0KClcbiAgICBhd2FpdCB0aGlzLmNoYWluLnN0YXJ0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBkcml2ZXJcbiAgICovXG4gIGFzeW5jIHN0b3AgKCkge1xuICAgIGF3YWl0IHRoaXMuZG93bmxvYWRNYW5hZ2VyLnN0b3AoKVxuICAgIGF3YWl0IHRoaXMubm9kZU1hbmFnZXIuc3RvcCgpXG4gICAgYXdhaXQgdGhpcy5ibG9ja1RyYWNrZXIuc3RvcCgpXG4gICAgYXdhaXQgdGhpcy5jaGFpbi5zdG9wKClcbiAgfVxuXG4gIGdldFN0YXRlICgpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXRzKSByZXR1cm4ge31cbiAgICByZXR1cm4gdGhpcy5fc3RhdHMuZ2V0U3RhdGUoKVxuICB9XG59XG4iXX0=