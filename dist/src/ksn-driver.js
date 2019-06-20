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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLWRyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rc24tZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUF1QjtBQUN2QixrREFBeUI7QUFFekIsMkNBQXlDO0FBQ3pDLGlEQUFrRDtBQUNsRCx1REFBMkM7QUFFM0Msb0ZBQXlEO0FBR3pELCtCQUljO0FBRWQsNkNBQW9EO0FBQ3BELDZDQUE4QztBQUU5QyxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUUvQywwQ0FBMEM7QUFFMUMsSUFBYSxTQUFTLEdBQXRCLE1BQWEsU0FBMkMsU0FBUSxnQkFBRTtJQUtoRSxZQUNvQixRQUFhLEVBQ2IsU0FBb0IsRUFFcEIsV0FBMkIsRUFFM0IsZUFBZ0MsRUFDaEMsWUFBa0MsRUFFbEMsS0FBa0IsRUFDbEIsVUFBc0I7UUFDeEMsS0FBSyxFQUFFLENBQUE7UUFWVyxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQ2IsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUVwQixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFFM0Isb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtRQUVsQyxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFHeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUFXLENBQUMsSUFB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QUFDLFFBQVEsRUFBRSxDQUFBO0lBQy9CLENBQUM7Q0FDRixDQUFBO0FBdkxZLFNBQVM7SUFEckIsMkJBQVEsRUFBRTtJQU1LLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUduQixXQUFBLDJCQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFeEIsV0FBQSwyQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFHNUIsV0FBQSwyQkFBUSxDQUFDLHFCQUFRLENBQUMsQ0FBQTs2Q0FORCxnQkFBUztRQUVQLGlCQUFXO1FBRVAsNEJBQWU7UUFDbEIsZ0NBQW9CLFVBR3RCLGdCQUFVO0dBZi9CLFNBQVMsQ0F1THJCO0FBdkxZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBFRSBmcm9tICdldmVudHMnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCB7IEtzbk5vZGVUeXBlIH0gZnJvbSAnLi9jb25zdGFudHMnXG5pbXBvcnQgeyBEaXNjb3ZlcnkgfSBmcm9tICcuL3NsaWNlL2Rpc2NvdmVyeS9iYXNlJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgU2xpY2UgfSBmcm9tICcuL3NsaWNlJ1xuaW1wb3J0IEtpc3R1bmV0QmxvY2tUcmFja2VyIGZyb20gJ2tpdHN1bmV0LWJsb2NrLXRyYWNrZXInXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcblxuaW1wb3J0IHtcbiAgTm9kZU1hbmFnZXIsXG4gIExpYnAycFBlZXIsXG4gIE5ldHdvcmtQZWVyXG59IGZyb20gJy4vbmV0J1xuXG5pbXBvcnQgeyBFdGhDaGFpbiwgSUJsb2NrY2hhaW4gfSBmcm9tICcuL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBEb3dubG9hZE1hbmFnZXIgfSBmcm9tICcuL2Rvd25sb2FkZXInXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmtpdHN1bmV0LWRyaXZlcicpXG5cbi8vIFRPRE86IFBsdWdpbiBibG9ja2NoYWluIGFuZCBoZWFkZXIgc3luY1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBLc25Ecml2ZXI8VCBleHRlbmRzIE5ldHdvcmtQZWVyPGFueSwgYW55Pj4gZXh0ZW5kcyBFRSB7XG4gIG5vZGVUeXBlOiBLc25Ob2RlVHlwZVxuICBwZWVyczogTWFwPHN0cmluZywgVD5cbiAgX3N0YXRzOiBhbnlcblxuICBjb25zdHJ1Y3RvciAoQHJlZ2lzdGVyKCdvcHRpb25zJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBpc0JyaWRnZTogYW55LFxuICAgICAgICAgICAgICAgcHVibGljIGRpc2NvdmVyeTogRGlzY292ZXJ5LFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdub2RlLW1hbmFnZXInKVxuICAgICAgICAgICAgICAgcHVibGljIG5vZGVNYW5hZ2VyOiBOb2RlTWFuYWdlcjxUPixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZG93bmxvYWQtbWFuYWdlcicpXG4gICAgICAgICAgICAgICBwdWJsaWMgZG93bmxvYWRNYW5hZ2VyOiBEb3dubG9hZE1hbmFnZXIsXG4gICAgICAgICAgICAgICBwdWJsaWMgYmxvY2tUcmFja2VyOiBLaXN0dW5ldEJsb2NrVHJhY2tlcixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBwdWJsaWMgbGlicDJwUGVlcjogTGlicDJwUGVlcikge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuaXNCcmlkZ2UgPSBCb29sZWFuKGlzQnJpZGdlLmJyaWRnZSlcbiAgICB0aGlzLmRpc2NvdmVyeSA9IGRpc2NvdmVyeVxuICAgIHRoaXMuYmxvY2tUcmFja2VyID0gYmxvY2tUcmFja2VyXG4gICAgdGhpcy5ub2RlVHlwZSA9IHRoaXMuaXNCcmlkZ2UgPyBLc25Ob2RlVHlwZS5CUklER0UgOiBLc25Ob2RlVHlwZS5OT0RFXG5cbiAgICAvLyBwZWVyc1xuICAgIHRoaXMucGVlcnMgPSBuZXcgTWFwKClcbiAgfVxuXG4gIGdldCBjbGllbnRQZWVycyAoKTogVFtdIHtcbiAgICByZXR1cm4gW3RoaXMubGlicDJwUGVlcl0gYXMgVFtdXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsYXRlc3QgYmxvY2tcbiAgICovXG4gIGFzeW5jIGdldExhdGVzdEJsb2NrICgpOiBQcm9taXNlPEJsb2NrIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhaW4uZ2V0TGF0ZXN0QmxvY2soKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGJsb2NrIGJ5IG51bWJlclxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGJsb2NrSWQgLSB0aGUgbnVtYmVyL3RhZyBvZiB0aGUgYmxvY2sgdG8gcmV0cmlldmVcbiAgICovXG4gIGFzeW5jIGdldEJsb2NrQnlOdW1iZXIgKGJsb2NrSWQ6IG51bWJlcik6IFByb21pc2U8QmxvY2sgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBibG9jazogQmxvY2tbXSB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0QmxvY2tzKGJsb2NrSWQsIDEpXG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBibG9ja1swXVxuICAgIH1cbiAgfVxuXG4gIGdldEhlYWRlcnMgKGJsb2NrSWQ6IEJ1ZmZlciB8IG51bWJlcixcbiAgICAgICAgICAgICAgbWF4QmxvY2tzOiBudW1iZXIgPSAyNSxcbiAgICAgICAgICAgICAgc2tpcDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhaW4uZ2V0SGVhZGVycyhibG9ja0lkLCBtYXhCbG9ja3MsIHNraXAsIHJldmVyc2UpXG4gIH1cblxuICAvKipcbiAgICogRGlzY292ZXIgcGVlcnMgdHJhY2tpbmcgdGhpcyBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fFNsaWNlSWR9IHNsaWNlIC0gdGhlIHNsaWNlcyB0byBmaW5kIHRoZSBwZWVycyBmb3JcbiAgICogQHJldHVybnMge0FycmF5PFBlZXI+fSBwZWVycyAtIGFuIGFycmF5IG9mIHBlZXJzIHRyYWNraW5nIHRoZSBzbGljZVxuICAgKi9cbiAgYXN5bmMgZmluZFBlZXJzIChzbGljZSkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyeS5maW5kUGVlcnMoc2xpY2UpXG4gIH1cblxuICAvKipcbiAgICogRGlzY292ZXIgYW5kIGNvbm5lY3QgdG8gcGVlcnMgdHJhY2tpbmcgdGhpcyBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fSBzbGljZXMgLSB0aGUgc2xpY2VzIHRvIGZpbmQgdGhlIHBlZXJzIGZvclxuICAgKi9cbiAgYXN5bmMgZmluZFNsaWNlUGVlcnMgKHNsaWNlcykge1xuICAgIGNvbnN0IHBlZXJzID0gYXdhaXQgdGhpcy5maW5kUGVlcnMoc2xpY2VzKVxuICAgIGlmIChwZWVycyAmJiBwZWVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IF9wZWVycyA9IGF3YWl0IFByb21pc2UuYWxsKHBlZXJzLm1hcCgocGVlcikgPT4ge1xuICAgICAgICBpZiAocGVlci5pZC50b0I1OFN0cmluZygpID09PSB0aGlzLmxpYnAycFBlZXIuaWQpIHtcbiAgICAgICAgICBkZWJ1ZygnY2FudCBkaWFsIHRvIHNlbGYsIHNraXBwaW5nJylcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICByZXR1cm4gX3BlZXJzLmZpbHRlcihCb29sZWFuKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHNsaWNlcyBmcm9tIHJlbW90ZXNcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzbGljZXM+fSBzbGljZXMgLSBzbGljZXMgdG8gcmVzb2x2ZSBmcm9tIHBlZXJzXG4gICAqIEBwYXJhbSB7QXJyYXk8UnBjUGVlcj59IHBlZXJzIC0gcGVlcnMgdG8gcXVlcnlcbiAgICovXG4gIGFzeW5jIF9ycGNSZXNvbHZlIChzbGljZXM6IFNsaWNlW10sIHBlZXJzOiBOZXR3b3JrUGVlcjxhbnksIGFueT5bXSk6IFByb21pc2U8YW55W10gfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCByZXNvbHZlID0gYXN5bmMgKHBlZXIpOiBQcm9taXNlPGFueVtdIHwgdW5kZWZpbmVkPiA9PiB7XG4gICAgICAvLyBmaXJzdCBjaGVjayBpZiB0aGUgcGVlciBoYXMgYWxyZWFkeSByZXBvcnRlZFxuICAgICAgLy8gdHJhY2tpbmcgdGhlIHNsaWNlXG4gICAgICBjb25zdCBfcGVlcnMgPSBzbGljZXMubWFwKChzbGljZSkgPT4ge1xuICAgICAgICBpZiAocGVlci5zbGljZUlkcy5oYXMoYCR7c2xpY2UucGF0aH0tJHtzbGljZS5kZXB0aH1gKSB8fFxuICAgICAgICAgIHBlZXIubm9kZVR5cGUgPT09IEtzbk5vZGVUeXBlLkJSSURHRSB8fFxuICAgICAgICAgIHBlZXIubm9kZVR5cGUgPT09IEtzbk5vZGVUeXBlLk5PREUpIHtcbiAgICAgICAgICByZXR1cm4gcGVlclxuICAgICAgICB9XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbilcblxuICAgICAgaWYgKF9wZWVycyAmJiBfcGVlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoX3BlZXJzLm1hcChwID0+IHAuZ2V0U2xpY2VzKHNsaWNlcykpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcCBvZiBwZWVycykge1xuICAgICAgbGV0IHJlc29sdmVkID0gYXdhaXQgcmVzb2x2ZShwKVxuICAgICAgaWYgKHJlc29sdmVkICYmIHJlc29sdmVkLmxlbmd0aCkgcmV0dXJuIHJlc29sdmVkXG4gICAgICBhd2FpdCBwLnByb3RvY29sc1sna3NuJ10uZ2V0U2xpY2VJZHMoKSAvLyByZWZyZXNoIHRoZSBpZHNcbiAgICAgIHJlc29sdmVkID0gYXdhaXQgcmVzb2x2ZShwKVxuICAgICAgaWYgKHJlc29sdmVkICYmIHJlc29sdmVkLmxlbmd0aCkgcmV0dXJuIHJlc29sdmVkXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIHJlcXVlc3RlZCBzbGljZXMsIGJ5IHRyeWluZyBkaWZmZXJlbnRcbiAgICogdW5kZXJseWluZyBtZWNoYW5pc21zXG4gICAqXG4gICAqIDEpIFJQQyAtIGFzayBlYWNoIHBlZXIgZm9yIHRoZSBzbGljZSwgaWYgdGhhdCBmYWlsc1xuICAgKiAyKSBEaXNjb3ZlcnkgLSBhc2sgZGlmZmVyZW50IGRpc2NvdmVyeSBtZWNoYW5pc21zIHRvXG4gICAqIGZpbmQgcGVlcnMgdHJhY2tpbmcgdGhlIHJlcXVlc3RlZCBzbGljZXNcbiAgICogMykgUlBDIC0gcmVwZWF0IDFzdCBzdGVwIHdpdGggdGhlIG5ldyBwZWVyc1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fSBzbGljZXNcbiAgICovXG4gIGFzeW5jIHJlc29sdmVTbGljZXMgKHNsaWNlcykge1xuICAgIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgdGhpcy5fcnBjUmVzb2x2ZShzbGljZXMsIFsuLi50aGlzLnBlZXJzLnZhbHVlcygpXSlcbiAgICBpZiAocmVzb2x2ZWQgJiYgcmVzb2x2ZWQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZWRcbiAgICB9XG5cbiAgICBjb25zdCBwZWVycyA9IGF3YWl0IHRoaXMuZmluZFNsaWNlUGVlcnMoc2xpY2VzKVxuICAgIGlmIChwZWVycyAmJiBwZWVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ycGNSZXNvbHZlKHNsaWNlcywgcGVlcnMgYXMgTmV0d29ya1BlZXI8YW55LCBhbnk+W10pXG4gICAgfVxuICAgIHJldHVybiB7fSBhcyBTbGljZVxuICB9XG5cbiAgLyoqXG4gICAqIEFubm91bmNlcyBzbGljZSB0byB0aGUgbmV0d29yayB1c2luZyB3aGF0ZXZlciBtZWNoYW5pc21zXG4gICAqIGFyZSBhdmFpbGFibGUsIGUuZyBESFQsIFJQQywgZXRjLi4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8U2xpY2VJZD59IHNsaWNlcyAtIHRoZSBzbGljZXMgdG8gYW5ub3VuY2UgdG8gdGhlIG5ldHdvcmtcbiAgICovXG4gIGFzeW5jIGFubm91bmNlIChzbGljZXMpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb3ZlcnkuYW5ub3VuY2Uoc2xpY2VzKVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBkcml2ZXJcbiAgICovXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICB0aGlzLm5vZGVNYW5hZ2VyLm9uKCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIChwZWVyOiBUKSA9PiB7XG4gICAgICB0aGlzLnBlZXJzLnNldChwZWVyLmlkLCBwZWVyKVxuICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIHBlZXIpXG4gICAgfSlcblxuICAgIHRoaXMubm9kZU1hbmFnZXIub24oJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgKHBlZXI6IFQpID0+IHtcbiAgICAgIHRoaXMucGVlcnMuZGVsZXRlKHBlZXIuaWQpXG4gICAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgcGVlcilcbiAgICB9KVxuXG4gICAgYXdhaXQgdGhpcy5ub2RlTWFuYWdlci5zdGFydCgpXG4gICAgYXdhaXQgdGhpcy5ibG9ja1RyYWNrZXIuc3RhcnQoKVxuICAgIGF3YWl0IHRoaXMuZG93bmxvYWRNYW5hZ2VyLnN0YXJ0KClcbiAgICBhd2FpdCB0aGlzLmNoYWluLnN0YXJ0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBkcml2ZXJcbiAgICovXG4gIGFzeW5jIHN0b3AgKCkge1xuICAgIGF3YWl0IHRoaXMuZG93bmxvYWRNYW5hZ2VyLnN0b3AoKVxuICAgIGF3YWl0IHRoaXMubm9kZU1hbmFnZXIuc3RvcCgpXG4gICAgYXdhaXQgdGhpcy5ibG9ja1RyYWNrZXIuc3RvcCgpXG4gICAgYXdhaXQgdGhpcy5jaGFpbi5zdG9wKClcbiAgfVxuXG4gIGdldFN0YXRlICgpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXRzKSByZXR1cm4ge31cbiAgICByZXR1cm4gdGhpcy5fc3RhdHMuZ2V0U3RhdGUoKVxuICB9XG59XG4iXX0=