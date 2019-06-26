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
const assert_1 = __importDefault(require("assert"));
const kitsunet_block_tracker_1 = __importDefault(require("kitsunet-block-tracker"));
const slice_1 = require("./slice");
const async_1 = require("async");
const opium_decorators_1 = require("opium-decorators");
const slice_store_1 = require("./stores/slice-store");
const ksn_driver_1 = require("./ksn-driver");
const trackers_1 = require("./slice/trackers");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsches:kitsunet-slice-manager');
let SliceManager = class SliceManager extends trackers_1.BaseTracker {
    constructor(pubsubTracker, options, bridgeTracker, slicesStore, blockTracker, ksnDriver) {
        super();
        assert_1.default(blockTracker, 'blockTracker should be supplied');
        assert_1.default(slicesStore, 'slicesStore should be supplied');
        assert_1.default(ksnDriver, 'driver should be supplied');
        options.bridge && assert_1.default(bridgeTracker, 'bridgeTracker should be supplied in bridge mode');
        this.blockTracker = blockTracker;
        this.bridgeTracker = bridgeTracker;
        this.pubsubTracker = pubsubTracker;
        this.slicesStore = slicesStore;
        this.ksnDriver = ksnDriver;
        this.isBridge = Boolean(options.bridge);
        this._setUp();
    }
    _setUp() {
        if (this.isBridge) {
            this.bridgeTracker.on('slice', (slice) => {
                return this.pubsubTracker.publish(slice);
            });
        }
        this.pubsubTracker.on('slice', (slice) => __awaiter(this, void 0, void 0, function* () {
            yield this.slicesStore.put(slice);
            this.emit('slice', slice);
        }));
    }
    /**
     * Stop tracking the provided slices
     *
     * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
     */
    untrack(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBridge) {
                yield this.bridgeTracker.untrack(slices);
            }
            return this.pubsubTracker.untrack(slices);
        });
    }
    /**
     * This will discover, connect and start tracking
     * the requested slices from the network.
     *
     * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
     */
    track(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBridge) {
                yield this.bridgeTracker.track(slices);
            }
            yield this.pubsubTracker.track(slices);
            // if we're tracking a slice, make it discoverable
            return this.ksnDriver.announce(slices);
        });
    }
    /**
     * Check wether the slice is already being tracked
     *
     * @param {SliceId} slice - the slice id
     * @returns {Boolean}
     */
    isTracking(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            let tracking = this.isBridge ? yield this.bridgeTracker.isTracking(slice) : true;
            if (tracking)
                return this.pubsubTracker.isTracking(slice);
            return false;
        });
    }
    /**
     * Publish the slice
     *
     * @param {Slice} slice - the slice to be published
     */
    publish(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            // bridge doesn't implement publishSlice
            return this.pubsubTracker.publish(slice);
        });
    }
    /**
     * Get all slice ids currently being tracker
     * @returns {Array<SliceId>}
     */
    getSliceIds() {
        // dedup
        return [...new Set([
                ...this.pubsubTracker.slices,
                ...this.bridgeTracker.slices
            ])];
    }
    /**
     * Get a slice
     *
     * @param {SliceId} sliceId - the slice to return
     * @return {Slice}
     */
    getSlice(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let slice;
            try {
                slice = yield this.slicesStore.getById(sliceId);
                if (slice)
                    return slice;
            }
            catch (e) {
                debug(e);
                if (this.isBridge) {
                    yield this.track(new Set([sliceId]));
                    return this.bridgeTracker.getSlice(sliceId);
                }
            }
            return this._resolveSlice(sliceId);
        });
    }
    /**
     * Get all slices
     *
     * @returns {Array<Slice>} - an array of slice objects
     */
    getSlices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.slicesStore.getSlices();
            }
            catch (e) {
                debug(e);
            }
        });
    }
    /**
     * Get the slice for a block
     *
     * @param {number|string} tag
     * @param {SliceId} slice
     */
    getSliceForBlock(tag, slice) {
        return __awaiter(this, void 0, void 0, function* () {
            let _slice = new slice_1.SliceId(slice.path, slice.depth);
            const block = yield this.ksnDriver.getBlockByNumber(tag);
            if (block) {
                _slice.root = block.header.stateRoot.toString('hex');
                return this.getSlice(_slice);
            }
        });
    }
    _resolveSlice(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            // track the slice if not tracking already
            if (!(yield this.isTracking(slice))) {
                // track slice, we might already be subscribed to it
                yield this.track(new Set([slice]));
            }
            // if in bridge mode, just get it from the bridge
            if (this.isBridge) {
                return this.bridgeTracker.getSlice(slice);
            }
            let times = 0;
            return new Promise((resolve, reject) => {
                async_1.retry({
                    times: 10,
                    interval: 3000
                }, () => __awaiter(this, void 0, void 0, function* () {
                    const _slice = yield this.ksnDriver.resolveSlices([slice]);
                    if (_slice)
                        return _slice;
                    throw new Error(`no slice retrieved, retrying ${++times}!`);
                }), (err, res) => {
                    if (err)
                        return reject(err);
                    resolve(res);
                });
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBridge) {
                yield this.bridgeTracker.start();
            }
            yield this.pubsubTracker.start();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBridge) {
                yield this.bridgeTracker.stop();
            }
            yield this.pubsubTracker.stop();
        });
    }
};
SliceManager = __decorate([
    opium_decorators_1.register(),
    __param(1, opium_decorators_1.register('options')),
    __metadata("design:paramtypes", [trackers_1.KitsunetPubSub, Object, trackers_1.KitsunetBridge,
        slice_store_1.SliceStore,
        kitsunet_block_tracker_1.default,
        ksn_driver_1.KsnDriver])
], SliceManager);
exports.SliceManager = SliceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zbGljZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUEyQjtBQUMzQixvRkFBaUQ7QUFDakQsbUNBQXdDO0FBQ3hDLGlDQUE2QjtBQUM3Qix1REFBMkM7QUFDM0Msc0RBQWlEO0FBQ2pELDZDQUF3QztBQUd4QywrQ0FJeUI7QUFFekIsa0RBQXlCO0FBRXpCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0FBR3RELElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQThDLFNBQVEsc0JBQVc7SUFRNUUsWUFBYSxhQUE2QixFQUNSLE9BQU8sRUFDNUIsYUFBNkIsRUFDN0IsV0FBdUIsRUFDdkIsWUFBMEIsRUFDMUIsU0FBdUI7UUFDbEMsS0FBSyxFQUFFLENBQUE7UUFFUCxnQkFBTSxDQUFDLFlBQVksRUFBRSxpQ0FBaUMsQ0FBQyxDQUFBO1FBQ3ZELGdCQUFNLENBQUMsV0FBVyxFQUFFLGdDQUFnQyxDQUFDLENBQUE7UUFDckQsZ0JBQU0sQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtRQUM5QyxPQUFPLENBQUMsTUFBTSxJQUFJLGdCQUFNLENBQUMsYUFBYSxFQUFFLGlEQUFpRCxDQUFDLENBQUE7UUFFMUYsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7UUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FB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S0FBQTtDQUNGLENBQUE7QUExTVksWUFBWTtJQUR4QiwyQkFBUSxFQUFFO0lBVUssV0FBQSwyQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO3FDQURMLHlCQUFjLFVBRWQseUJBQWM7UUFDaEIsd0JBQVU7UUFDVCxnQ0FBWTtRQUNmLHNCQUFTO0dBYnRCLFlBQVksQ0EwTXhCO0FBMU1ZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xuaW1wb3J0IEJsb2NrVHJhY2tlciBmcm9tICdraXRzdW5ldC1ibG9jay10cmFja2VyJ1xuaW1wb3J0IHsgU2xpY2VJZCwgU2xpY2UgfSBmcm9tICcuL3NsaWNlJ1xuaW1wb3J0IHsgcmV0cnkgfSBmcm9tICdhc3luYydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IFNsaWNlU3RvcmUgfSBmcm9tICcuL3N0b3Jlcy9zbGljZS1zdG9yZSdcbmltcG9ydCB7IEtzbkRyaXZlciB9IGZyb20gJy4va3NuLWRyaXZlcidcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuXG5pbXBvcnQge1xuICBCYXNlVHJhY2tlcixcbiAgS2l0c3VuZXRQdWJTdWIsXG4gIEtpdHN1bmV0QnJpZGdlXG59IGZyb20gJy4vc2xpY2UvdHJhY2tlcnMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi9uZXQvbmV0d29yay1wZWVyJ1xuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c2NoZXM6a2l0c3VuZXQtc2xpY2UtbWFuYWdlcicpXG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgU2xpY2VNYW5hZ2VyPFQgZXh0ZW5kcyBOZXR3b3JrUGVlcjxhbnksIGFueT4+IGV4dGVuZHMgQmFzZVRyYWNrZXIge1xuICBibG9ja1RyYWNrZXI6IEJsb2NrVHJhY2tlclxuICBicmlkZ2VUcmFja2VyOiBLaXRzdW5ldEJyaWRnZVxuICBwdWJzdWJUcmFja2VyOiBLaXRzdW5ldFB1YlN1YlxuICBzbGljZXNTdG9yZTogU2xpY2VTdG9yZVxuICBrc25Ecml2ZXI6IEtzbkRyaXZlcjxUPlxuICBpc0JyaWRnZTogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yIChwdWJzdWJUcmFja2VyOiBLaXRzdW5ldFB1YlN1YixcbiAgICAgICAgICAgICAgIEByZWdpc3Rlcignb3B0aW9ucycpIG9wdGlvbnMsXG4gICAgICAgICAgICAgICBicmlkZ2VUcmFja2VyOiBLaXRzdW5ldEJyaWRnZSxcbiAgICAgICAgICAgICAgIHNsaWNlc1N0b3JlOiBTbGljZVN0b3JlLFxuICAgICAgICAgICAgICAgYmxvY2tUcmFja2VyOiBCbG9ja1RyYWNrZXIsXG4gICAgICAgICAgICAgICBrc25Ecml2ZXI6IEtzbkRyaXZlcjxUPikge1xuICAgIHN1cGVyKClcblxuICAgIGFzc2VydChibG9ja1RyYWNrZXIsICdibG9ja1RyYWNrZXIgc2hvdWxkIGJlIHN1cHBsaWVkJylcbiAgICBhc3NlcnQoc2xpY2VzU3RvcmUsICdzbGljZXNTdG9yZSBzaG91bGQgYmUgc3VwcGxpZWQnKVxuICAgIGFzc2VydChrc25Ecml2ZXIsICdkcml2ZXIgc2hvdWxkIGJlIHN1cHBsaWVkJylcbiAgICBvcHRpb25zLmJyaWRnZSAmJiBhc3NlcnQoYnJpZGdlVHJhY2tlciwgJ2JyaWRnZVRyYWNrZXIgc2hvdWxkIGJlIHN1cHBsaWVkIGluIGJyaWRnZSBtb2RlJylcblxuICAgIHRoaXMuYmxvY2tUcmFja2VyID0gYmxvY2tUcmFja2VyXG4gICAgdGhpcy5icmlkZ2VUcmFja2VyID0gYnJpZGdlVHJhY2tlclxuICAgIHRoaXMucHVic3ViVHJhY2tlciA9IHB1YnN1YlRyYWNrZXJcbiAgICB0aGlzLnNsaWNlc1N0b3JlID0gc2xpY2VzU3RvcmVcbiAgICB0aGlzLmtzbkRyaXZlciA9IGtzbkRyaXZlclxuICAgIHRoaXMuaXNCcmlkZ2UgPSBCb29sZWFuKG9wdGlvbnMuYnJpZGdlKVxuXG4gICAgdGhpcy5fc2V0VXAoKVxuICB9XG5cbiAgX3NldFVwICgpIHtcbiAgICBpZiAodGhpcy5pc0JyaWRnZSkge1xuICAgICAgdGhpcy5icmlkZ2VUcmFja2VyLm9uKCdzbGljZScsIChzbGljZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1YnN1YlRyYWNrZXIucHVibGlzaChzbGljZSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5wdWJzdWJUcmFja2VyLm9uKCdzbGljZScsIGFzeW5jIChzbGljZTogYW55KSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnNsaWNlc1N0b3JlLnB1dChzbGljZSlcbiAgICAgIHRoaXMuZW1pdCgnc2xpY2UnLCBzbGljZSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdHJhY2tpbmcgdGhlIHByb3ZpZGVkIHNsaWNlc1xuICAgKlxuICAgKiBAcGFyYW0ge1NldDxTbGljZUlkPnxTbGljZUlkfSBzbGljZXMgLSB0aGUgc2xpY2VzIHRvIHN0b3AgdHJhY2tpbmdcbiAgICovXG4gIGFzeW5jIHVudHJhY2sgKHNsaWNlczogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNCcmlkZ2UpIHtcbiAgICAgIGF3YWl0IHRoaXMuYnJpZGdlVHJhY2tlci51bnRyYWNrKHNsaWNlcylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wdWJzdWJUcmFja2VyLnVudHJhY2soc2xpY2VzKVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgd2lsbCBkaXNjb3ZlciwgY29ubmVjdCBhbmQgc3RhcnQgdHJhY2tpbmdcbiAgICogdGhlIHJlcXVlc3RlZCBzbGljZXMgZnJvbSB0aGUgbmV0d29yay5cbiAgICpcbiAgICogQHBhcmFtIHtTZXQ8U2xpY2VJZD58U2xpY2VJZH0gc2xpY2VzIC0gYSBzbGljZSBvciBhbiBTZXQgb2Ygc2xpY2VzIHRvIHRyYWNrXG4gICAqL1xuICBhc3luYyB0cmFjayAoc2xpY2VzOiBTZXQ8U2xpY2VJZD4pIHtcbiAgICBpZiAodGhpcy5pc0JyaWRnZSkge1xuICAgICAgYXdhaXQgdGhpcy5icmlkZ2VUcmFja2VyLnRyYWNrKHNsaWNlcylcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5wdWJzdWJUcmFja2VyLnRyYWNrKHNsaWNlcylcblxuICAgIC8vIGlmIHdlJ3JlIHRyYWNraW5nIGEgc2xpY2UsIG1ha2UgaXQgZGlzY292ZXJhYmxlXG4gICAgcmV0dXJuIHRoaXMua3NuRHJpdmVyLmFubm91bmNlKHNsaWNlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3ZXRoZXIgdGhlIHNsaWNlIGlzIGFscmVhZHkgYmVpbmcgdHJhY2tlZFxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlIC0gdGhlIHNsaWNlIGlkXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgYXN5bmMgaXNUcmFja2luZyAoc2xpY2U6IFNsaWNlSWQpIHtcbiAgICBsZXQgdHJhY2tpbmcgPSB0aGlzLmlzQnJpZGdlID8gYXdhaXQgdGhpcy5icmlkZ2VUcmFja2VyLmlzVHJhY2tpbmcoc2xpY2UpIDogdHJ1ZVxuICAgIGlmICh0cmFja2luZykgcmV0dXJuIHRoaXMucHVic3ViVHJhY2tlci5pc1RyYWNraW5nKHNsaWNlKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggdGhlIHNsaWNlXG4gICAqXG4gICAqIEBwYXJhbSB7U2xpY2V9IHNsaWNlIC0gdGhlIHNsaWNlIHRvIGJlIHB1Ymxpc2hlZFxuICAgKi9cbiAgYXN5bmMgcHVibGlzaCAoc2xpY2U6IFNsaWNlKSB7XG4gICAgLy8gYnJpZGdlIGRvZXNuJ3QgaW1wbGVtZW50IHB1Ymxpc2hTbGljZVxuICAgIHJldHVybiB0aGlzLnB1YnN1YlRyYWNrZXIucHVibGlzaChzbGljZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIHNsaWNlIGlkcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlclxuICAgKiBAcmV0dXJucyB7QXJyYXk8U2xpY2VJZD59XG4gICAqL1xuICBnZXRTbGljZUlkcyAoKSB7XG4gICAgLy8gZGVkdXBcbiAgICByZXR1cm4gWy4uLm5ldyBTZXQoW1xuICAgICAgLi4udGhpcy5wdWJzdWJUcmFja2VyLnNsaWNlcyxcbiAgICAgIC4uLnRoaXMuYnJpZGdlVHJhY2tlci5zbGljZXNcbiAgICBdKV1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlSWQgLSB0aGUgc2xpY2UgdG8gcmV0dXJuXG4gICAqIEByZXR1cm4ge1NsaWNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0U2xpY2UgKHNsaWNlSWQ6IFNsaWNlSWQpOiBQcm9taXNlPFNsaWNlPiB7XG4gICAgbGV0IHNsaWNlXG4gICAgdHJ5IHtcbiAgICAgIHNsaWNlID0gYXdhaXQgdGhpcy5zbGljZXNTdG9yZS5nZXRCeUlkKHNsaWNlSWQpXG4gICAgICBpZiAoc2xpY2UpIHJldHVybiBzbGljZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgICBpZiAodGhpcy5pc0JyaWRnZSkge1xuICAgICAgICBhd2FpdCB0aGlzLnRyYWNrKG5ldyBTZXQoW3NsaWNlSWRdKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJpZGdlVHJhY2tlci5nZXRTbGljZShzbGljZUlkKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlU2xpY2Uoc2xpY2VJZClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIHNsaWNlc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXk8U2xpY2U+fSAtIGFuIGFycmF5IG9mIHNsaWNlIG9iamVjdHNcbiAgICovXG4gIGFzeW5jIGdldFNsaWNlcyAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLnNsaWNlc1N0b3JlLmdldFNsaWNlcygpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzbGljZSBmb3IgYSBibG9ja1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IHRhZ1xuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlXG4gICAqL1xuICBhc3luYyBnZXRTbGljZUZvckJsb2NrICh0YWc6IG51bWJlciB8IHN0cmluZywgc2xpY2U6IHsgcGF0aDogYW55OyBkZXB0aDogYW55OyB9KSB7XG4gICAgbGV0IF9zbGljZSA9IG5ldyBTbGljZUlkKHNsaWNlLnBhdGgsIHNsaWNlLmRlcHRoKVxuICAgIGNvbnN0IGJsb2NrOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMua3NuRHJpdmVyLmdldEJsb2NrQnlOdW1iZXIodGFnIGFzIG51bWJlcilcbiAgICBpZiAoYmxvY2spIHtcbiAgICAgIF9zbGljZS5yb290ID0gYmxvY2suaGVhZGVyLnN0YXRlUm9vdC50b1N0cmluZygnaGV4JylcbiAgICAgIHJldHVybiB0aGlzLmdldFNsaWNlKF9zbGljZSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBfcmVzb2x2ZVNsaWNlIChzbGljZTogU2xpY2VJZCk6IFByb21pc2U8U2xpY2U+IHtcbiAgICAvLyB0cmFjayB0aGUgc2xpY2UgaWYgbm90IHRyYWNraW5nIGFscmVhZHlcbiAgICBpZiAoIWF3YWl0IHRoaXMuaXNUcmFja2luZyhzbGljZSkpIHtcbiAgICAgIC8vIHRyYWNrIHNsaWNlLCB3ZSBtaWdodCBhbHJlYWR5IGJlIHN1YnNjcmliZWQgdG8gaXRcbiAgICAgIGF3YWl0IHRoaXMudHJhY2sobmV3IFNldChbc2xpY2VdKSlcbiAgICB9XG5cbiAgICAvLyBpZiBpbiBicmlkZ2UgbW9kZSwganVzdCBnZXQgaXQgZnJvbSB0aGUgYnJpZGdlXG4gICAgaWYgKHRoaXMuaXNCcmlkZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmJyaWRnZVRyYWNrZXIuZ2V0U2xpY2Uoc2xpY2UpXG4gICAgfVxuXG4gICAgbGV0IHRpbWVzID0gMFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXRyeSh7XG4gICAgICAgIHRpbWVzOiAxMCxcbiAgICAgICAgaW50ZXJ2YWw6IDMwMDBcbiAgICAgIH0sXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IF9zbGljZSA9IGF3YWl0IHRoaXMua3NuRHJpdmVyLnJlc29sdmVTbGljZXMoW3NsaWNlXSlcbiAgICAgICAgaWYgKF9zbGljZSkgcmV0dXJuIF9zbGljZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIHNsaWNlIHJldHJpZXZlZCwgcmV0cnlpbmcgJHsrK3RpbWVzfSFgKVxuICAgICAgfSxcbiAgICAgIChlcnIsIHJlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZShyZXMpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBzdGFydCAoKSB7XG4gICAgaWYgKHRoaXMuaXNCcmlkZ2UpIHtcbiAgICAgIGF3YWl0IHRoaXMuYnJpZGdlVHJhY2tlci5zdGFydCgpXG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5wdWJzdWJUcmFja2VyLnN0YXJ0KClcbiAgfVxuXG4gIGFzeW5jIHN0b3AgKCkge1xuICAgIGlmICh0aGlzLmlzQnJpZGdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmJyaWRnZVRyYWNrZXIuc3RvcCgpXG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5wdWJzdWJUcmFja2VyLnN0b3AoKVxuICB9XG59XG4iXX0=