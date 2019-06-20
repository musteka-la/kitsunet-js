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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const ethUtils = __importStar(require("ethereumjs-util"));
require("./dependencies");
const blockFromRpc = require("ethereumjs-block/from-rpc");
const base_1 = require("./base");
const __1 = require("../");
const promisify_this_1 = require("promisify-this");
const async_1 = require("async");
const opium_decorators_1 = require("opium-decorators");
const kitsunet_block_tracker_1 = __importDefault(require("kitsunet-block-tracker"));
const eth_block_tracker_1 = __importDefault(require("eth-block-tracker"));
const ksn_eth_query_1 = require("../../ksn-eth-query");
const log = debug_1.default('kitsunet:kitsunet-bridge-tracker');
let KitsunetBridge = class KitsunetBridge extends base_1.BaseTracker {
    constructor(options, blockTracker, rpcBlockTracker, ethQuery, slices) {
        super(slices);
        this.rpcUrl = options.rpcUrl;
        this.blockTracker = blockTracker;
        this.rpcBlockTracker = rpcBlockTracker;
        this.ethQuery = promisify_this_1.promisify(ethQuery);
        this._blockHandler = this._blockHandler.bind(this);
    }
    publish(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('slice', slice);
        });
    }
    /**
     * Handle blocks via the `latest` event
     *
     * @param {string|number} blockId - an rpc (JSON) block
     */
    _blockHandler(blockId) {
        async_1.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            const block = yield this.ethQuery.getBlockByNumber(blockId, true);
            this.blockTracker.publish(blockFromRpc(block));
            this.slices.forEach((slice) => __awaiter(this, void 0, void 0, function* () {
                slice.root = block.stateRoot;
                const fetched = new __1.Slice(yield this._fetchSlice(slice));
                return this.publish(fetched);
            }));
        }));
    }
    /**
     * Stop tracking the provided slices
     *
     * @param {Set<SliceId>} slices - the slices to stop tracking
     */
    untrack(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            slices.forEach((slice) => this.slices.delete(slice));
        });
    }
    /**
     * This will discover, connect and start tracking
     * the requested slices from the network.
     *
     * @param {Set<SliceId>} slices - a slice or an Set of slices to track
     */
    track(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            this.slices = new Set([...this.slices, ...slices]);
        });
    }
    /**
     * Fetch a slice from the Ethereum RPC
     *
     * @param {SliceId} sliceId - the slice id to fetch
     */
    _fetchSlice(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, depth, root, isStorage } = sliceId;
            log('fetching slice %s, %d, %s, %d', path, depth, root, isStorage);
            return this.ethQuery.getSlice(String(path), depth, ethUtils.addHexPrefix(root), isStorage);
        });
    }
    /**
     * Check wether the slice is already being tracked
     *
     * @param {SliceId} sliceId - the slice id
     * @returns {Boolean}
     */
    isTracking(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.slices.has(sliceId);
        });
    }
    /**
     * Get the requested slice
     *
     * @param {SliceId} slice
     */
    getSlice(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            return new __1.Slice(yield this._fetchSlice(slice));
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockTracker.start();
            this.rpcBlockTracker.on('latest', this._blockHandler);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockTracker.stop();
            this.rpcBlockTracker.removeListener('latest', this._blockHandler);
        });
    }
};
KitsunetBridge = __decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('options')),
    __param(4, opium_decorators_1.register('default-slices')),
    __metadata("design:paramtypes", [Object, kitsunet_block_tracker_1.default,
        eth_block_tracker_1.default,
        ksn_eth_query_1.KsnEthQuery,
        Set])
], KitsunetBridge);
exports.KitsunetBridge = KitsunetBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NsaWNlL3RyYWNrZXJzL2JyaWRnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosa0RBQXlCO0FBQ3pCLDBEQUEyQztBQUUzQywwQkFBdUI7QUFDdkIsMERBQTBEO0FBQzFELGlDQUFvQztBQUNwQywyQkFBb0M7QUFDcEMsbURBQTBDO0FBQzFDLGlDQUFnQztBQUNoQyx1REFBMkM7QUFFM0Msb0ZBQXlEO0FBQ3pELDBFQUFtRDtBQUNuRCx1REFBaUQ7QUFFakQsTUFBTSxHQUFHLEdBQUcsZUFBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUE7QUFHckQsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLGtCQUFXO0lBTTdDLFlBQ2EsT0FBWSxFQUNaLFlBQWtDLEVBQ2xDLGVBQW9DLEVBQ3BDLFFBQXFCLEVBRXJCLE1BQW1CO1FBQzlCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTtRQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTtRQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQTtRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBRUssT0FBTyxDQUFFLEtBQVk7O1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzNCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUUsT0FBd0I7UUFDckMsZ0JBQVEsQ0FB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IHN0cmljdCdcblxuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0ICogYXMgZXRoVXRpbHMgZnJvbSAnZXRoZXJldW1qcy11dGlsJ1xuXG5pbXBvcnQgJy4vZGVwZW5kZW5jaWVzJ1xuaW1wb3J0IGJsb2NrRnJvbVJwYyA9IHJlcXVpcmUoJ2V0aGVyZXVtanMtYmxvY2svZnJvbS1ycGMnKVxuaW1wb3J0IHsgQmFzZVRyYWNrZXIgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyBTbGljZSwgU2xpY2VJZCB9IGZyb20gJy4uLydcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3Byb21pc2lmeS10aGlzJ1xuaW1wb3J0IHsgbmV4dFRpY2sgfSBmcm9tICdhc3luYydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuaW1wb3J0IEtpdHN1bmV0QmxvY2tUcmFja2VyIGZyb20gJ2tpdHN1bmV0LWJsb2NrLXRyYWNrZXInXG5pbXBvcnQgUG9sbGluZ0Jsb2NrVHJhY2tlciBmcm9tICdldGgtYmxvY2stdHJhY2tlcidcbmltcG9ydCB7IEtzbkV0aFF1ZXJ5IH0gZnJvbSAnLi4vLi4va3NuLWV0aC1xdWVyeSdcblxuY29uc3QgbG9nID0gZGVidWcoJ2tpdHN1bmV0OmtpdHN1bmV0LWJyaWRnZS10cmFja2VyJylcblxuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBLaXRzdW5ldEJyaWRnZSBleHRlbmRzIEJhc2VUcmFja2VyIHtcbiAgcnBjVXJsOiBzdHJpbmdcbiAgYmxvY2tUcmFja2VyOiBLaXRzdW5ldEJsb2NrVHJhY2tlclxuICBycGNCbG9ja1RyYWNrZXI6IFBvbGxpbmdCbG9ja1RyYWNrZXJcbiAgZXRoUXVlcnk6IGFueVxuXG4gIGNvbnN0cnVjdG9yIChAcmVnaXN0ZXIoJ29wdGlvbnMnKVxuICAgICAgICAgICAgICAgb3B0aW9uczogYW55LFxuICAgICAgICAgICAgICAgYmxvY2tUcmFja2VyOiBLaXRzdW5ldEJsb2NrVHJhY2tlcixcbiAgICAgICAgICAgICAgIHJwY0Jsb2NrVHJhY2tlcjogUG9sbGluZ0Jsb2NrVHJhY2tlcixcbiAgICAgICAgICAgICAgIGV0aFF1ZXJ5OiBLc25FdGhRdWVyeSxcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZGVmYXVsdC1zbGljZXMnKVxuICAgICAgICAgICAgICAgc2xpY2VzPzogU2V0PFNsaWNlPikge1xuICAgIHN1cGVyKHNsaWNlcylcbiAgICB0aGlzLnJwY1VybCA9IG9wdGlvbnMucnBjVXJsXG4gICAgdGhpcy5ibG9ja1RyYWNrZXIgPSBibG9ja1RyYWNrZXJcbiAgICB0aGlzLnJwY0Jsb2NrVHJhY2tlciA9IHJwY0Jsb2NrVHJhY2tlclxuICAgIHRoaXMuZXRoUXVlcnkgPSBwcm9taXNpZnkoZXRoUXVlcnkpXG4gICAgdGhpcy5fYmxvY2tIYW5kbGVyID0gdGhpcy5fYmxvY2tIYW5kbGVyLmJpbmQodGhpcylcbiAgfVxuXG4gIGFzeW5jIHB1Ymxpc2ggKHNsaWNlOiBTbGljZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZW1pdCgnc2xpY2UnLCBzbGljZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYmxvY2tzIHZpYSB0aGUgYGxhdGVzdGAgZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBibG9ja0lkIC0gYW4gcnBjIChKU09OKSBibG9ja1xuICAgKi9cbiAgX2Jsb2NrSGFuZGxlciAoYmxvY2tJZDogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgbmV4dFRpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYmxvY2sgPSBhd2FpdCB0aGlzLmV0aFF1ZXJ5LmdldEJsb2NrQnlOdW1iZXIoYmxvY2tJZCwgdHJ1ZSlcbiAgICAgIHRoaXMuYmxvY2tUcmFja2VyLnB1Ymxpc2goYmxvY2tGcm9tUnBjKGJsb2NrKSlcbiAgICAgIHRoaXMuc2xpY2VzLmZvckVhY2goYXN5bmMgKHNsaWNlKSA9PiB7XG4gICAgICAgIHNsaWNlLnJvb3QgPSBibG9jay5zdGF0ZVJvb3RcbiAgICAgICAgY29uc3QgZmV0Y2hlZCA9IG5ldyBTbGljZShhd2FpdCB0aGlzLl9mZXRjaFNsaWNlKHNsaWNlKSlcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGlzaChmZXRjaGVkKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdHJhY2tpbmcgdGhlIHByb3ZpZGVkIHNsaWNlc1xuICAgKlxuICAgKiBAcGFyYW0ge1NldDxTbGljZUlkPn0gc2xpY2VzIC0gdGhlIHNsaWNlcyB0byBzdG9wIHRyYWNraW5nXG4gICAqL1xuICBhc3luYyB1bnRyYWNrIChzbGljZXMpIHtcbiAgICBzbGljZXMuZm9yRWFjaCgoc2xpY2UpID0+IHRoaXMuc2xpY2VzLmRlbGV0ZShzbGljZSkpXG4gIH1cblxuICAvKipcbiAgICogVGhpcyB3aWxsIGRpc2NvdmVyLCBjb25uZWN0IGFuZCBzdGFydCB0cmFja2luZ1xuICAgKiB0aGUgcmVxdWVzdGVkIHNsaWNlcyBmcm9tIHRoZSBuZXR3b3JrLlxuICAgKlxuICAgKiBAcGFyYW0ge1NldDxTbGljZUlkPn0gc2xpY2VzIC0gYSBzbGljZSBvciBhbiBTZXQgb2Ygc2xpY2VzIHRvIHRyYWNrXG4gICAqL1xuICBhc3luYyB0cmFjayAoc2xpY2VzKSB7XG4gICAgdGhpcy5zbGljZXMgPSBuZXcgU2V0KFsuLi50aGlzLnNsaWNlcywgLi4uc2xpY2VzXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBhIHNsaWNlIGZyb20gdGhlIEV0aGVyZXVtIFJQQ1xuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlSWQgLSB0aGUgc2xpY2UgaWQgdG8gZmV0Y2hcbiAgICovXG4gIGFzeW5jIF9mZXRjaFNsaWNlIChzbGljZUlkKSB7XG4gICAgY29uc3QgeyBwYXRoLCBkZXB0aCwgcm9vdCwgaXNTdG9yYWdlIH0gPSBzbGljZUlkXG4gICAgbG9nKCdmZXRjaGluZyBzbGljZSAlcywgJWQsICVzLCAlZCcsIHBhdGgsIGRlcHRoLCByb290LCBpc1N0b3JhZ2UpXG4gICAgcmV0dXJuIHRoaXMuZXRoUXVlcnkuZ2V0U2xpY2UoU3RyaW5nKHBhdGgpLCBkZXB0aCwgZXRoVXRpbHMuYWRkSGV4UHJlZml4KHJvb3QpLCBpc1N0b3JhZ2UpXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2V0aGVyIHRoZSBzbGljZSBpcyBhbHJlYWR5IGJlaW5nIHRyYWNrZWRcbiAgICpcbiAgICogQHBhcmFtIHtTbGljZUlkfSBzbGljZUlkIC0gdGhlIHNsaWNlIGlkXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgYXN5bmMgaXNUcmFja2luZyAoc2xpY2VJZCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlcy5oYXMoc2xpY2VJZClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlcXVlc3RlZCBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlXG4gICAqL1xuICBhc3luYyBnZXRTbGljZSAoc2xpY2U6IFNsaWNlSWQpOiBQcm9taXNlPFNsaWNlPiB7XG4gICAgcmV0dXJuIG5ldyBTbGljZShhd2FpdCB0aGlzLl9mZXRjaFNsaWNlKHNsaWNlKSlcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICBhd2FpdCB0aGlzLmJsb2NrVHJhY2tlci5zdGFydCgpXG4gICAgdGhpcy5ycGNCbG9ja1RyYWNrZXIub24oJ2xhdGVzdCcsIHRoaXMuX2Jsb2NrSGFuZGxlcilcbiAgfVxuXG4gIGFzeW5jIHN0b3AgKCkge1xuICAgIGF3YWl0IHRoaXMuYmxvY2tUcmFja2VyLnN0b3AoKVxuICAgIHRoaXMucnBjQmxvY2tUcmFja2VyLnJlbW92ZUxpc3RlbmVyKCdsYXRlc3QnLCB0aGlzLl9ibG9ja0hhbmRsZXIpXG4gIH1cbn1cbiJdfQ==