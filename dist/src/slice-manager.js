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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zbGljZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUEyQjtBQUMzQixvRkFBaUQ7QUFDakQsbUNBQXdDO0FBQ3hDLGlDQUE2QjtBQUM3Qix1REFBMkM7QUFDM0Msc0RBQWlEO0FBQ2pELDZDQUF3QztBQUd4QywrQ0FJeUI7QUFFekIsa0RBQXlCO0FBRXpCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0FBR3RELElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQThDLFNBQVEsc0JBQVc7SUFRNUUsWUFBYSxhQUE2QixFQUNSLE9BQU8sRUFDNUIsYUFBNkIsRUFDN0IsV0FBdUIsRUFDdkIsWUFBMEIsRUFDMUIsU0FBdUI7UUFDbEMsS0FBSyxFQUFFLENBQUE7UUFFUCxnQkFBTSxDQUFDLFlBQVksRUFBRSxpQ0FBaUMsQ0FBQyxDQUFBO1FBQ3ZELGdCQUFNLENBQUMsV0FBVyxFQUFFLGdDQUFnQyxDQUFDLENBQUE7UUFDckQsZ0JBQU0sQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtRQUM5QyxPQUFPLENBQUMsTUFBTSxJQUFJLGdCQUFNLENBQUMsYUFBYSxFQUFFLGlEQUFpRCxDQUFDLENBQUE7UUFFMUYsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7UUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FB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S0FBQTtDQUNGLENBQUE7QUExTVksWUFBWTtJQUR4QiwyQkFBUSxFQUFFO0lBVUssV0FBQSwyQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO3FDQURMLHlCQUFjLFVBRWQseUJBQWM7UUFDaEIsd0JBQVU7UUFDVCxnQ0FBWTtRQUNmLHNCQUFTO0dBYnRCLFlBQVksQ0EwTXhCO0FBMU1ZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xuaW1wb3J0IEJsb2NrVHJhY2tlciBmcm9tICdraXRzdW5ldC1ibG9jay10cmFja2VyJ1xuaW1wb3J0IHsgU2xpY2VJZCwgU2xpY2UgfSBmcm9tICcuL3NsaWNlJ1xuaW1wb3J0IHsgcmV0cnkgfSBmcm9tICdhc3luYydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IFNsaWNlU3RvcmUgfSBmcm9tICcuL3N0b3Jlcy9zbGljZS1zdG9yZSdcbmltcG9ydCB7IEtzbkRyaXZlciB9IGZyb20gJy4va3NuLWRyaXZlcidcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuXG5pbXBvcnQge1xuICBCYXNlVHJhY2tlcixcbiAgS2l0c3VuZXRQdWJTdWIsXG4gIEtpdHN1bmV0QnJpZGdlXG59IGZyb20gJy4vc2xpY2UvdHJhY2tlcnMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IE5ldHdvcmtQZWVyIH0gZnJvbSAnLi9uZXQvcGVlcidcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHNjaGVzOmtpdHN1bmV0LXNsaWNlLW1hbmFnZXInKVxuXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIFNsaWNlTWFuYWdlcjxUIGV4dGVuZHMgTmV0d29ya1BlZXI8YW55LCBhbnk+PiBleHRlbmRzIEJhc2VUcmFja2VyIHtcbiAgYmxvY2tUcmFja2VyOiBCbG9ja1RyYWNrZXJcbiAgYnJpZGdlVHJhY2tlcjogS2l0c3VuZXRCcmlkZ2VcbiAgcHVic3ViVHJhY2tlcjogS2l0c3VuZXRQdWJTdWJcbiAgc2xpY2VzU3RvcmU6IFNsaWNlU3RvcmVcbiAga3NuRHJpdmVyOiBLc25Ecml2ZXI8VD5cbiAgaXNCcmlkZ2U6IGJvb2xlYW5cblxuICBjb25zdHJ1Y3RvciAocHVic3ViVHJhY2tlcjogS2l0c3VuZXRQdWJTdWIsXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ29wdGlvbnMnKSBvcHRpb25zLFxuICAgICAgICAgICAgICAgYnJpZGdlVHJhY2tlcjogS2l0c3VuZXRCcmlkZ2UsXG4gICAgICAgICAgICAgICBzbGljZXNTdG9yZTogU2xpY2VTdG9yZSxcbiAgICAgICAgICAgICAgIGJsb2NrVHJhY2tlcjogQmxvY2tUcmFja2VyLFxuICAgICAgICAgICAgICAga3NuRHJpdmVyOiBLc25Ecml2ZXI8VD4pIHtcbiAgICBzdXBlcigpXG5cbiAgICBhc3NlcnQoYmxvY2tUcmFja2VyLCAnYmxvY2tUcmFja2VyIHNob3VsZCBiZSBzdXBwbGllZCcpXG4gICAgYXNzZXJ0KHNsaWNlc1N0b3JlLCAnc2xpY2VzU3RvcmUgc2hvdWxkIGJlIHN1cHBsaWVkJylcbiAgICBhc3NlcnQoa3NuRHJpdmVyLCAnZHJpdmVyIHNob3VsZCBiZSBzdXBwbGllZCcpXG4gICAgb3B0aW9ucy5icmlkZ2UgJiYgYXNzZXJ0KGJyaWRnZVRyYWNrZXIsICdicmlkZ2VUcmFja2VyIHNob3VsZCBiZSBzdXBwbGllZCBpbiBicmlkZ2UgbW9kZScpXG5cbiAgICB0aGlzLmJsb2NrVHJhY2tlciA9IGJsb2NrVHJhY2tlclxuICAgIHRoaXMuYnJpZGdlVHJhY2tlciA9IGJyaWRnZVRyYWNrZXJcbiAgICB0aGlzLnB1YnN1YlRyYWNrZXIgPSBwdWJzdWJUcmFja2VyXG4gICAgdGhpcy5zbGljZXNTdG9yZSA9IHNsaWNlc1N0b3JlXG4gICAgdGhpcy5rc25Ecml2ZXIgPSBrc25Ecml2ZXJcbiAgICB0aGlzLmlzQnJpZGdlID0gQm9vbGVhbihvcHRpb25zLmJyaWRnZSlcblxuICAgIHRoaXMuX3NldFVwKClcbiAgfVxuXG4gIF9zZXRVcCAoKSB7XG4gICAgaWYgKHRoaXMuaXNCcmlkZ2UpIHtcbiAgICAgIHRoaXMuYnJpZGdlVHJhY2tlci5vbignc2xpY2UnLCAoc2xpY2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJzdWJUcmFja2VyLnB1Ymxpc2goc2xpY2UpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMucHVic3ViVHJhY2tlci5vbignc2xpY2UnLCBhc3luYyAoc2xpY2U6IGFueSkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zbGljZXNTdG9yZS5wdXQoc2xpY2UpXG4gICAgICB0aGlzLmVtaXQoJ3NsaWNlJywgc2xpY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRyYWNraW5nIHRoZSBwcm92aWRlZCBzbGljZXNcbiAgICpcbiAgICogQHBhcmFtIHtTZXQ8U2xpY2VJZD58U2xpY2VJZH0gc2xpY2VzIC0gdGhlIHNsaWNlcyB0byBzdG9wIHRyYWNraW5nXG4gICAqL1xuICBhc3luYyB1bnRyYWNrIChzbGljZXM6IGFueSkge1xuICAgIGlmICh0aGlzLmlzQnJpZGdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmJyaWRnZVRyYWNrZXIudW50cmFjayhzbGljZXMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHVic3ViVHJhY2tlci51bnRyYWNrKHNsaWNlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIHdpbGwgZGlzY292ZXIsIGNvbm5lY3QgYW5kIHN0YXJ0IHRyYWNraW5nXG4gICAqIHRoZSByZXF1ZXN0ZWQgc2xpY2VzIGZyb20gdGhlIG5ldHdvcmsuXG4gICAqXG4gICAqIEBwYXJhbSB7U2V0PFNsaWNlSWQ+fFNsaWNlSWR9IHNsaWNlcyAtIGEgc2xpY2Ugb3IgYW4gU2V0IG9mIHNsaWNlcyB0byB0cmFja1xuICAgKi9cbiAgYXN5bmMgdHJhY2sgKHNsaWNlczogU2V0PFNsaWNlSWQ+KSB7XG4gICAgaWYgKHRoaXMuaXNCcmlkZ2UpIHtcbiAgICAgIGF3YWl0IHRoaXMuYnJpZGdlVHJhY2tlci50cmFjayhzbGljZXMpXG4gICAgfVxuICAgIGF3YWl0IHRoaXMucHVic3ViVHJhY2tlci50cmFjayhzbGljZXMpXG5cbiAgICAvLyBpZiB3ZSdyZSB0cmFja2luZyBhIHNsaWNlLCBtYWtlIGl0IGRpc2NvdmVyYWJsZVxuICAgIHJldHVybiB0aGlzLmtzbkRyaXZlci5hbm5vdW5jZShzbGljZXMpXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2V0aGVyIHRoZSBzbGljZSBpcyBhbHJlYWR5IGJlaW5nIHRyYWNrZWRcbiAgICpcbiAgICogQHBhcmFtIHtTbGljZUlkfSBzbGljZSAtIHRoZSBzbGljZSBpZFxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGFzeW5jIGlzVHJhY2tpbmcgKHNsaWNlOiBTbGljZUlkKSB7XG4gICAgbGV0IHRyYWNraW5nID0gdGhpcy5pc0JyaWRnZSA/IGF3YWl0IHRoaXMuYnJpZGdlVHJhY2tlci5pc1RyYWNraW5nKHNsaWNlKSA6IHRydWVcbiAgICBpZiAodHJhY2tpbmcpIHJldHVybiB0aGlzLnB1YnN1YlRyYWNrZXIuaXNUcmFja2luZyhzbGljZSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHRoZSBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlfSBzbGljZSAtIHRoZSBzbGljZSB0byBiZSBwdWJsaXNoZWRcbiAgICovXG4gIGFzeW5jIHB1Ymxpc2ggKHNsaWNlOiBTbGljZSkge1xuICAgIC8vIGJyaWRnZSBkb2Vzbid0IGltcGxlbWVudCBwdWJsaXNoU2xpY2VcbiAgICByZXR1cm4gdGhpcy5wdWJzdWJUcmFja2VyLnB1Ymxpc2goc2xpY2UpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBzbGljZSBpZHMgY3VycmVudGx5IGJlaW5nIHRyYWNrZXJcbiAgICogQHJldHVybnMge0FycmF5PFNsaWNlSWQ+fVxuICAgKi9cbiAgZ2V0U2xpY2VJZHMgKCkge1xuICAgIC8vIGRlZHVwXG4gICAgcmV0dXJuIFsuLi5uZXcgU2V0KFtcbiAgICAgIC4uLnRoaXMucHVic3ViVHJhY2tlci5zbGljZXMsXG4gICAgICAuLi50aGlzLmJyaWRnZVRyYWNrZXIuc2xpY2VzXG4gICAgXSldXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgc2xpY2VcbiAgICpcbiAgICogQHBhcmFtIHtTbGljZUlkfSBzbGljZUlkIC0gdGhlIHNsaWNlIHRvIHJldHVyblxuICAgKiBAcmV0dXJuIHtTbGljZX1cbiAgICovXG4gIGFzeW5jIGdldFNsaWNlIChzbGljZUlkOiBTbGljZUlkKTogUHJvbWlzZTxTbGljZT4ge1xuICAgIGxldCBzbGljZVxuICAgIHRyeSB7XG4gICAgICBzbGljZSA9IGF3YWl0IHRoaXMuc2xpY2VzU3RvcmUuZ2V0QnlJZChzbGljZUlkKVxuICAgICAgaWYgKHNsaWNlKSByZXR1cm4gc2xpY2VcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgICAgaWYgKHRoaXMuaXNCcmlkZ2UpIHtcbiAgICAgICAgYXdhaXQgdGhpcy50cmFjayhuZXcgU2V0KFtzbGljZUlkXSkpXG4gICAgICAgIHJldHVybiB0aGlzLmJyaWRnZVRyYWNrZXIuZ2V0U2xpY2Uoc2xpY2VJZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVNsaWNlKHNsaWNlSWQpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBzbGljZXNcbiAgICpcbiAgICogQHJldHVybnMge0FycmF5PFNsaWNlPn0gLSBhbiBhcnJheSBvZiBzbGljZSBvYmplY3RzXG4gICAqL1xuICBhc3luYyBnZXRTbGljZXMgKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZXNTdG9yZS5nZXRTbGljZXMoKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc2xpY2UgZm9yIGEgYmxvY2tcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSB0YWdcbiAgICogQHBhcmFtIHtTbGljZUlkfSBzbGljZVxuICAgKi9cbiAgYXN5bmMgZ2V0U2xpY2VGb3JCbG9jayAodGFnOiBudW1iZXIgfCBzdHJpbmcsIHNsaWNlOiB7IHBhdGg6IGFueTsgZGVwdGg6IGFueTsgfSkge1xuICAgIGxldCBfc2xpY2UgPSBuZXcgU2xpY2VJZChzbGljZS5wYXRoLCBzbGljZS5kZXB0aClcbiAgICBjb25zdCBibG9jazogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmtzbkRyaXZlci5nZXRCbG9ja0J5TnVtYmVyKHRhZyBhcyBudW1iZXIpXG4gICAgaWYgKGJsb2NrKSB7XG4gICAgICBfc2xpY2Uucm9vdCA9IGJsb2NrLmhlYWRlci5zdGF0ZVJvb3QudG9TdHJpbmcoJ2hleCcpXG4gICAgICByZXR1cm4gdGhpcy5nZXRTbGljZShfc2xpY2UpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX3Jlc29sdmVTbGljZSAoc2xpY2U6IFNsaWNlSWQpOiBQcm9taXNlPFNsaWNlPiB7XG4gICAgLy8gdHJhY2sgdGhlIHNsaWNlIGlmIG5vdCB0cmFja2luZyBhbHJlYWR5XG4gICAgaWYgKCFhd2FpdCB0aGlzLmlzVHJhY2tpbmcoc2xpY2UpKSB7XG4gICAgICAvLyB0cmFjayBzbGljZSwgd2UgbWlnaHQgYWxyZWFkeSBiZSBzdWJzY3JpYmVkIHRvIGl0XG4gICAgICBhd2FpdCB0aGlzLnRyYWNrKG5ldyBTZXQoW3NsaWNlXSkpXG4gICAgfVxuXG4gICAgLy8gaWYgaW4gYnJpZGdlIG1vZGUsIGp1c3QgZ2V0IGl0IGZyb20gdGhlIGJyaWRnZVxuICAgIGlmICh0aGlzLmlzQnJpZGdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5icmlkZ2VUcmFja2VyLmdldFNsaWNlKHNsaWNlKVxuICAgIH1cblxuICAgIGxldCB0aW1lcyA9IDBcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmV0cnkoe1xuICAgICAgICB0aW1lczogMTAsXG4gICAgICAgIGludGVydmFsOiAzMDAwXG4gICAgICB9LFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBfc2xpY2UgPSBhd2FpdCB0aGlzLmtzbkRyaXZlci5yZXNvbHZlU2xpY2VzKFtzbGljZV0pXG4gICAgICAgIGlmIChfc2xpY2UpIHJldHVybiBfc2xpY2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBubyBzbGljZSByZXRyaWV2ZWQsIHJldHJ5aW5nICR7Kyt0aW1lc30hYClcbiAgICAgIH0sXG4gICAgICAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCkge1xuICAgIGlmICh0aGlzLmlzQnJpZGdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmJyaWRnZVRyYWNrZXIuc3RhcnQoKVxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMucHVic3ViVHJhY2tlci5zdGFydCgpXG4gIH1cblxuICBhc3luYyBzdG9wICgpIHtcbiAgICBpZiAodGhpcy5pc0JyaWRnZSkge1xuICAgICAgYXdhaXQgdGhpcy5icmlkZ2VUcmFja2VyLnN0b3AoKVxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMucHVic3ViVHJhY2tlci5zdG9wKClcbiAgfVxufVxuIl19