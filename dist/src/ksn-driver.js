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
    __param(6, opium_decorators_1.register('libp2p-peer')),
    __metadata("design:paramtypes", [Object, base_1.Discovery,
        net_1.NodeManager,
        downloader_1.DownloadManager,
        kitsunet_block_tracker_1.default, Object, net_1.Libp2pPeer])
], KsnDriver);
exports.KsnDriver = KsnDriver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLWRyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rc24tZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUF1QjtBQUN2QixrREFBeUI7QUFFekIsMkNBQXlDO0FBQ3pDLGlEQUFrRDtBQUNsRCx1REFBMkM7QUFFM0Msb0ZBQXlEO0FBR3pELCtCQUljO0FBRWQsNkNBQW9EO0FBQ3BELDZDQUE4QztBQUU5QyxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUUvQywwQ0FBMEM7QUFFMUMsSUFBYSxTQUFTLEdBQXRCLE1BQWEsU0FBMkMsU0FBUSxnQkFBRTtJQUtoRSxZQUNvQixRQUFhLEVBQ2IsU0FBb0IsRUFFcEIsV0FBMkIsRUFFM0IsZUFBZ0MsRUFDaEMsWUFBa0MsRUFFbEMsS0FBa0IsRUFFbEIsVUFBc0I7UUFDeEMsS0FBSyxFQUFFLENBQUE7UUFYVyxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQ2IsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUVwQixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFFM0Isb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtRQUVsQyxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBRWxCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFHeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUFXLENBQUMsSUFBSSxDQUFBO1FBRXJFLFFBQVE7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7SUFDeEIsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFtQixDQUFBO0lBQzVDLENBQUM7SUFFRDs7T0FFRztJQUNHLGNBQWM7O1lBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTtRQUNwQyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxnQkFBZ0IsQ0FBRSxPQUFlOztZQUNyQyxNQUFNLEtBQUssR0FBd0IsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDekUsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2hCO1FBQ0gsQ0FBQztLQUFBO0lBRUQsVUFBVSxDQUFFLE9BQXdCLEVBQ3hCLFlBQW9CLEVBQUUsRUFDdEIsT0FBZSxDQUFDLEVBQ2hCLFVBQW1CLEtBQUs7UUFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNqRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDRyxTQUFTLENBQUUsS0FBSzs7WUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4QyxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0csY0FBYyxDQUFFLE1BQU07O1lBQzFCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUMxQyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29CQUNsRCxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2hELEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO3FCQUNyQztnQkFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUM5QjtRQUNILENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ0csV0FBVyxDQUFFLE1BQWUsRUFBRSxLQUE4Qjs7WUFDaEUsTUFBTSxPQUFPLEdBQUcsQ0FBTyxJQUFJLEVBQThCLEVBQUU7Z0JBQ3pELCtDQUErQztnQkFDL0MscUJBQXFCO2dCQUNyQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ2xDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDbkQsSUFBSSxDQUFDLFFBQVEsS0FBSyx1QkFBVyxDQUFDLE1BQU07d0JBQ3BDLElBQUksQ0FBQyxRQUFRLEtBQUssdUJBQVcsQ0FBQyxJQUFJLEVBQUU7d0JBQ3BDLE9BQU8sSUFBSSxDQUFBO3FCQUNaO2dCQUNILENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFFbEIsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtvQkFDM0IsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDMUQ7WUFDSCxDQUFDLENBQUEsQ0FBQTtZQUVELEtBQUssTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFO2dCQUNyQixJQUFJLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDL0IsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU07b0JBQUUsT0FBTyxRQUFRLENBQUE7Z0JBQ2hELE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQSxDQUFDLGtCQUFrQjtnQkFDekQsUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMzQixJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTTtvQkFBRSxPQUFPLFFBQVEsQ0FBQTthQUNqRDtRQUNILENBQUM7S0FBQTtJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDRyxhQUFhLENBQUUsTUFBTTs7WUFDekIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDekUsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDL0IsT0FBTyxRQUFRLENBQUE7YUFDaEI7WUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDL0MsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDekIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFnQyxDQUFDLENBQUE7YUFDbEU7WUFDRCxPQUFPLEVBQVcsQ0FBQTtRQUNwQixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNHLFFBQVEsQ0FBRSxNQUFNOztZQUNwQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csS0FBSzs7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLElBQU8sRUFBRSxFQUFFO2dCQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO1lBQzVDLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxJQUFPLEVBQUUsRUFBRTtnQkFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFBO1lBQy9DLENBQUMsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUMvQixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDbEMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQzFCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csSUFBSTs7WUFDUixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDakMsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQzdCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUM5QixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDekIsQ0FBQztLQUFBO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sRUFBRSxDQUFBO1FBQzNCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUMvQixDQUFDO0NBQ0YsQ0FBQTtBQXhMWSxTQUFTO0lBRHJCLDJCQUFRLEVBQUU7SUFNSyxXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFHbkIsV0FBQSwyQkFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRXhCLFdBQUEsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBRzVCLFdBQUEsMkJBQVEsQ0FBQyxxQkFBUSxDQUFDLENBQUE7SUFFbEIsV0FBQSwyQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBOzZDQVJOLGdCQUFTO1FBRVAsaUJBQVc7UUFFUCw0QkFBZTtRQUNsQixnQ0FBb0IsVUFJdEIsZ0JBQVU7R0FoQi9CLFNBQVMsQ0F3THJCO0FBeExZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBFRSBmcm9tICdldmVudHMnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCB7IEtzbk5vZGVUeXBlIH0gZnJvbSAnLi9jb25zdGFudHMnXG5pbXBvcnQgeyBEaXNjb3ZlcnkgfSBmcm9tICcuL3NsaWNlL2Rpc2NvdmVyeS9iYXNlJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgU2xpY2UgfSBmcm9tICcuL3NsaWNlJ1xuaW1wb3J0IEtpc3R1bmV0QmxvY2tUcmFja2VyIGZyb20gJ2tpdHN1bmV0LWJsb2NrLXRyYWNrZXInXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcblxuaW1wb3J0IHtcbiAgTm9kZU1hbmFnZXIsXG4gIExpYnAycFBlZXIsXG4gIE5ldHdvcmtQZWVyXG59IGZyb20gJy4vbmV0J1xuXG5pbXBvcnQgeyBFdGhDaGFpbiwgSUJsb2NrY2hhaW4gfSBmcm9tICcuL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBEb3dubG9hZE1hbmFnZXIgfSBmcm9tICcuL2Rvd25sb2FkZXInXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmtpdHN1bmV0LWRyaXZlcicpXG5cbi8vIFRPRE86IFBsdWdpbiBibG9ja2NoYWluIGFuZCBoZWFkZXIgc3luY1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBLc25Ecml2ZXI8VCBleHRlbmRzIE5ldHdvcmtQZWVyPGFueSwgYW55Pj4gZXh0ZW5kcyBFRSB7XG4gIG5vZGVUeXBlOiBLc25Ob2RlVHlwZVxuICBwZWVyczogTWFwPHN0cmluZywgVD5cbiAgX3N0YXRzOiBhbnlcblxuICBjb25zdHJ1Y3RvciAoQHJlZ2lzdGVyKCdvcHRpb25zJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBpc0JyaWRnZTogYW55LFxuICAgICAgICAgICAgICAgcHVibGljIGRpc2NvdmVyeTogRGlzY292ZXJ5LFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdub2RlLW1hbmFnZXInKVxuICAgICAgICAgICAgICAgcHVibGljIG5vZGVNYW5hZ2VyOiBOb2RlTWFuYWdlcjxUPixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZG93bmxvYWQtbWFuYWdlcicpXG4gICAgICAgICAgICAgICBwdWJsaWMgZG93bmxvYWRNYW5hZ2VyOiBEb3dubG9hZE1hbmFnZXIsXG4gICAgICAgICAgICAgICBwdWJsaWMgYmxvY2tUcmFja2VyOiBLaXN0dW5ldEJsb2NrVHJhY2tlcixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcihFdGhDaGFpbilcbiAgICAgICAgICAgICAgIHB1YmxpYyBjaGFpbjogSUJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2xpYnAycC1wZWVyJylcbiAgICAgICAgICAgICAgIHB1YmxpYyBsaWJwMnBQZWVyOiBMaWJwMnBQZWVyKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5pc0JyaWRnZSA9IEJvb2xlYW4oaXNCcmlkZ2UuYnJpZGdlKVxuICAgIHRoaXMuZGlzY292ZXJ5ID0gZGlzY292ZXJ5XG4gICAgdGhpcy5ibG9ja1RyYWNrZXIgPSBibG9ja1RyYWNrZXJcbiAgICB0aGlzLm5vZGVUeXBlID0gdGhpcy5pc0JyaWRnZSA/IEtzbk5vZGVUeXBlLkJSSURHRSA6IEtzbk5vZGVUeXBlLk5PREVcblxuICAgIC8vIHBlZXJzXG4gICAgdGhpcy5wZWVycyA9IG5ldyBNYXAoKVxuICB9XG5cbiAgZ2V0IGNsaWVudFBlZXJzICgpOiBUW10ge1xuICAgIHJldHVybiBbdGhpcy5saWJwMnBQZWVyXSBhcyB1bmtub3duIGFzIFRbXVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbGF0ZXN0IGJsb2NrXG4gICAqL1xuICBhc3luYyBnZXRMYXRlc3RCbG9jayAoKTogUHJvbWlzZTxCbG9jayB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmNoYWluLmdldExhdGVzdEJsb2NrKClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBibG9jayBieSBudW1iZXJcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBibG9ja0lkIC0gdGhlIG51bWJlci90YWcgb2YgdGhlIGJsb2NrIHRvIHJldHJpZXZlXG4gICAqL1xuICBhc3luYyBnZXRCbG9ja0J5TnVtYmVyIChibG9ja0lkOiBudW1iZXIpOiBQcm9taXNlPEJsb2NrIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgYmxvY2s6IEJsb2NrW10gfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmNoYWluLmdldEJsb2NrcyhibG9ja0lkLCAxKVxuICAgIGlmIChibG9jayAmJiBibG9jay5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYmxvY2tbMF1cbiAgICB9XG4gIH1cblxuICBnZXRIZWFkZXJzIChibG9ja0lkOiBCdWZmZXIgfCBudW1iZXIsXG4gICAgICAgICAgICAgIG1heEJsb2NrczogbnVtYmVyID0gMjUsXG4gICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgIHJldmVyc2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHJldHVybiB0aGlzLmNoYWluLmdldEhlYWRlcnMoYmxvY2tJZCwgbWF4QmxvY2tzLCBza2lwLCByZXZlcnNlKVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2NvdmVyIHBlZXJzIHRyYWNraW5nIHRoaXMgc2xpY2VcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxTbGljZUlkPnxTbGljZUlkfSBzbGljZSAtIHRoZSBzbGljZXMgdG8gZmluZCB0aGUgcGVlcnMgZm9yXG4gICAqIEByZXR1cm5zIHtBcnJheTxQZWVyPn0gcGVlcnMgLSBhbiBhcnJheSBvZiBwZWVycyB0cmFja2luZyB0aGUgc2xpY2VcbiAgICovXG4gIGFzeW5jIGZpbmRQZWVycyAoc2xpY2UpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb3ZlcnkuZmluZFBlZXJzKHNsaWNlKVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2NvdmVyIGFuZCBjb25uZWN0IHRvIHBlZXJzIHRyYWNraW5nIHRoaXMgc2xpY2VcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxTbGljZUlkPn0gc2xpY2VzIC0gdGhlIHNsaWNlcyB0byBmaW5kIHRoZSBwZWVycyBmb3JcbiAgICovXG4gIGFzeW5jIGZpbmRTbGljZVBlZXJzIChzbGljZXMpIHtcbiAgICBjb25zdCBwZWVycyA9IGF3YWl0IHRoaXMuZmluZFBlZXJzKHNsaWNlcylcbiAgICBpZiAocGVlcnMgJiYgcGVlcnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBfcGVlcnMgPSBhd2FpdCBQcm9taXNlLmFsbChwZWVycy5tYXAoKHBlZXIpID0+IHtcbiAgICAgICAgaWYgKHBlZXIuaWQudG9CNThTdHJpbmcoKSA9PT0gdGhpcy5saWJwMnBQZWVyLmlkKSB7XG4gICAgICAgICAgZGVidWcoJ2NhbnQgZGlhbCB0byBzZWxmLCBza2lwcGluZycpXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgICAgcmV0dXJuIF9wZWVycy5maWx0ZXIoQm9vbGVhbilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSBzbGljZXMgZnJvbSByZW1vdGVzXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8c2xpY2VzPn0gc2xpY2VzIC0gc2xpY2VzIHRvIHJlc29sdmUgZnJvbSBwZWVyc1xuICAgKiBAcGFyYW0ge0FycmF5PFJwY1BlZXI+fSBwZWVycyAtIHBlZXJzIHRvIHF1ZXJ5XG4gICAqL1xuICBhc3luYyBfcnBjUmVzb2x2ZSAoc2xpY2VzOiBTbGljZVtdLCBwZWVyczogTmV0d29ya1BlZXI8YW55LCBhbnk+W10pOiBQcm9taXNlPGFueVtdIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgcmVzb2x2ZSA9IGFzeW5jIChwZWVyKTogUHJvbWlzZTxhbnlbXSB8IHVuZGVmaW5lZD4gPT4ge1xuICAgICAgLy8gZmlyc3QgY2hlY2sgaWYgdGhlIHBlZXIgaGFzIGFscmVhZHkgcmVwb3J0ZWRcbiAgICAgIC8vIHRyYWNraW5nIHRoZSBzbGljZVxuICAgICAgY29uc3QgX3BlZXJzID0gc2xpY2VzLm1hcCgoc2xpY2UpID0+IHtcbiAgICAgICAgaWYgKHBlZXIuc2xpY2VJZHMuaGFzKGAke3NsaWNlLnBhdGh9LSR7c2xpY2UuZGVwdGh9YCkgfHxcbiAgICAgICAgICBwZWVyLm5vZGVUeXBlID09PSBLc25Ob2RlVHlwZS5CUklER0UgfHxcbiAgICAgICAgICBwZWVyLm5vZGVUeXBlID09PSBLc25Ob2RlVHlwZS5OT0RFKSB7XG4gICAgICAgICAgcmV0dXJuIHBlZXJcbiAgICAgICAgfVxuICAgICAgfSkuZmlsdGVyKEJvb2xlYW4pXG5cbiAgICAgIGlmIChfcGVlcnMgJiYgX3BlZXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yYWNlKF9wZWVycy5tYXAocCA9PiBwLmdldFNsaWNlcyhzbGljZXMpKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHAgb2YgcGVlcnMpIHtcbiAgICAgIGxldCByZXNvbHZlZCA9IGF3YWl0IHJlc29sdmUocClcbiAgICAgIGlmIChyZXNvbHZlZCAmJiByZXNvbHZlZC5sZW5ndGgpIHJldHVybiByZXNvbHZlZFxuICAgICAgYXdhaXQgcC5wcm90b2NvbHNbJ2tzbiddLmdldFNsaWNlSWRzKCkgLy8gcmVmcmVzaCB0aGUgaWRzXG4gICAgICByZXNvbHZlZCA9IGF3YWl0IHJlc29sdmUocClcbiAgICAgIGlmIChyZXNvbHZlZCAmJiByZXNvbHZlZC5sZW5ndGgpIHJldHVybiByZXNvbHZlZFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSByZXF1ZXN0ZWQgc2xpY2VzLCBieSB0cnlpbmcgZGlmZmVyZW50XG4gICAqIHVuZGVybHlpbmcgbWVjaGFuaXNtc1xuICAgKlxuICAgKiAxKSBSUEMgLSBhc2sgZWFjaCBwZWVyIGZvciB0aGUgc2xpY2UsIGlmIHRoYXQgZmFpbHNcbiAgICogMikgRGlzY292ZXJ5IC0gYXNrIGRpZmZlcmVudCBkaXNjb3ZlcnkgbWVjaGFuaXNtcyB0b1xuICAgKiBmaW5kIHBlZXJzIHRyYWNraW5nIHRoZSByZXF1ZXN0ZWQgc2xpY2VzXG4gICAqIDMpIFJQQyAtIHJlcGVhdCAxc3Qgc3RlcCB3aXRoIHRoZSBuZXcgcGVlcnNcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxTbGljZUlkPn0gc2xpY2VzXG4gICAqL1xuICBhc3luYyByZXNvbHZlU2xpY2VzIChzbGljZXMpIHtcbiAgICBjb25zdCByZXNvbHZlZCA9IGF3YWl0IHRoaXMuX3JwY1Jlc29sdmUoc2xpY2VzLCBbLi4udGhpcy5wZWVycy52YWx1ZXMoKV0pXG4gICAgaWYgKHJlc29sdmVkICYmIHJlc29sdmVkLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVkXG4gICAgfVxuXG4gICAgY29uc3QgcGVlcnMgPSBhd2FpdCB0aGlzLmZpbmRTbGljZVBlZXJzKHNsaWNlcylcbiAgICBpZiAocGVlcnMgJiYgcGVlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnBjUmVzb2x2ZShzbGljZXMsIHBlZXJzIGFzIE5ldHdvcmtQZWVyPGFueSwgYW55PltdKVxuICAgIH1cbiAgICByZXR1cm4ge30gYXMgU2xpY2VcbiAgfVxuXG4gIC8qKlxuICAgKiBBbm5vdW5jZXMgc2xpY2UgdG8gdGhlIG5ldHdvcmsgdXNpbmcgd2hhdGV2ZXIgbWVjaGFuaXNtc1xuICAgKiBhcmUgYXZhaWxhYmxlLCBlLmcgREhULCBSUEMsIGV0Yy4uLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fSBzbGljZXMgLSB0aGUgc2xpY2VzIHRvIGFubm91bmNlIHRvIHRoZSBuZXR3b3JrXG4gICAqL1xuICBhc3luYyBhbm5vdW5jZSAoc2xpY2VzKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY292ZXJ5LmFubm91bmNlKHNsaWNlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgZHJpdmVyXG4gICAqL1xuICBhc3luYyBzdGFydCAoKSB7XG4gICAgdGhpcy5ub2RlTWFuYWdlci5vbigna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCAocGVlcjogVCkgPT4ge1xuICAgICAgdGhpcy5wZWVycy5zZXQocGVlci5pZCwgcGVlcilcbiAgICAgIHRoaXMuZW1pdCgna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCBwZWVyKVxuICAgIH0pXG5cbiAgICB0aGlzLm5vZGVNYW5hZ2VyLm9uKCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIChwZWVyOiBUKSA9PiB7XG4gICAgICB0aGlzLnBlZXJzLmRlbGV0ZShwZWVyLmlkKVxuICAgICAgdGhpcy5lbWl0KCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIHBlZXIpXG4gICAgfSlcblxuICAgIGF3YWl0IHRoaXMubm9kZU1hbmFnZXIuc3RhcnQoKVxuICAgIGF3YWl0IHRoaXMuYmxvY2tUcmFja2VyLnN0YXJ0KClcbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkTWFuYWdlci5zdGFydCgpXG4gICAgYXdhaXQgdGhpcy5jaGFpbi5zdGFydCgpXG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgZHJpdmVyXG4gICAqL1xuICBhc3luYyBzdG9wICgpIHtcbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkTWFuYWdlci5zdG9wKClcbiAgICBhd2FpdCB0aGlzLm5vZGVNYW5hZ2VyLnN0b3AoKVxuICAgIGF3YWl0IHRoaXMuYmxvY2tUcmFja2VyLnN0b3AoKVxuICAgIGF3YWl0IHRoaXMuY2hhaW4uc3RvcCgpXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgaWYgKCF0aGlzLl9zdGF0cykgcmV0dXJuIHt9XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRzLmdldFN0YXRlKClcbiAgfVxufVxuIl19