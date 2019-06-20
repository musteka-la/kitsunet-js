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
const libp2p_1 = __importDefault(require("libp2p"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const base_1 = require("./base");
const __1 = require("../");
const opium_decorators_1 = require("opium-decorators");
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default('kitsunet:kitsunet-pubsub-tracker');
const DEFAULT_TOPIC_NAMESPACE = `/kitsunet/slice`;
const DEFAULT_SLICE_TIMEOUT = 300 * 1000;
const DEFAULT_DEPTH = 10;
const createCache = (options = { max: 100, maxAge: DEFAULT_SLICE_TIMEOUT }) => {
    return new lru_cache_1.default(options);
};
let KitsunetPubSub = class KitsunetPubSub extends base_1.BaseTracker {
    constructor(node, namespace, depth, slices) {
        super(slices);
        this.namespace = DEFAULT_TOPIC_NAMESPACE;
        this.depth = DEFAULT_DEPTH;
        this.isStarted = false;
        this.multicast = node.multicast;
        this.node = node;
        this.namespace = namespace || DEFAULT_TOPIC_NAMESPACE;
        this.depth = depth || DEFAULT_DEPTH;
        this.forwardedSlicesCache = createCache();
        this.slicesHook = this.slicesHook.bind(this);
        this.handleSlice = this.handleSlice.bind(this);
    }
    static defaultNamespace() {
        return DEFAULT_TOPIC_NAMESPACE;
    }
    static defaultSliceTimeout() {
        return DEFAULT_SLICE_TIMEOUT;
    }
    /**
     * Helper to subscribe to a slice
     *
     * @param {Slice} slice - slice to subscribe to
     */
    subscribe(slice) {
        this.multicast.addFrwdHooks(this.makeSliceTopic(slice), [this.slicesHook]);
        this.multicast.subscribe(this.makeSliceTopic(slice), this.handleSlice);
    }
    /**
     * Helper to unsubscribe from a slice
     *
     * @param {Slice} slice - slice to unsubscribe from
     */
    unsubscribe(slice) {
        this.multicast.removeFrwdHooks(this.makeSliceTopic(slice), [this.slicesHook]);
        this.multicast.unsubscribe(this.makeSliceTopic(slice), this.handleSlice);
    }
    /**
     * Helper to make a slice topic
     *
     * @param {Slice|SliceId} slice - a Slice object
     * @returns {String} - a slice topic
     */
    makeSliceTopic(slice) {
        const { path, depth } = slice;
        return `${this.namespace}/${path}-${depth || this.depth}`;
    }
    /**
     * This is a hook that will be triggered on each pubsub message.
     *
     * This check if the slice has been already forwarded. This is
     * to check for duplicates at the application level, regardless of the msg id.
     *
     * @param {PeerInfo} peer - the peer sending the message
     * @param {Msg} msg - the pubsub message
     * @param {Function} cb - callback
     * @returns {Function}
     */
    slicesHook(peer, msg, cb) {
        let slice;
        try {
            slice = new __1.Slice(msg.data);
            if (!slice) {
                return cb(new Error(`No slice in message!`));
            }
        }
        catch (err) {
            log(err);
            return cb(err);
        }
        const peerId = peer.info.id.toB58String();
        const slices = this.forwardedSlicesCache.get(peerId) || createCache();
        if (!slices.has(slice.id)) {
            slices.set(slice.id, true);
            this.forwardedSlicesCache.set(peerId, slices);
            return cb(null, msg);
        }
        const skipMsg = `already forwarded to peer ${peerId}, skipping slice ${slice.id}`;
        log(skipMsg);
        return cb(skipMsg);
    }
    /**
     * Handle incoming pubsub messages.
     *
     * @param {Msg} msg - the pubsub message
     */
    handleSlice(msg) {
        try {
            this.emit(`slice`, new __1.Slice(msg.data));
        }
        catch (err) {
            log(err);
        }
    }
    /**
     * Stop tracking the provided slices
     *
     * @param {Set<SliceId>} slices - the slices to stop tracking
     */
    untrack(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            slices.forEach((slice) => __awaiter(this, void 0, void 0, function* () {
                this.unsubscribe(slice);
                this.slices.delete(slice);
            }));
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
            if (!this.isStarted)
                return;
            this.slices.forEach((slice) => __awaiter(this, void 0, void 0, function* () {
                if (yield this.isTracking(slice))
                    return;
                this.subscribe(slice);
                this.slices.add(slice);
            }));
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
            return (this.slices.has(slice) &&
                (yield this.multicast.ls()).indexOf(this.makeSliceTopic(slice)) > -1);
        });
    }
    /**
     * Publish the slice
     *
     * @param {Slice} slice - the slice to be published
     */
    publish(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isTracking(slice)) {
                yield this.track([slice]);
            }
            this.multicast.publish(this.makeSliceTopic(slice), slice.serialize());
        });
    }
    getSlice(slice) {
        throw new Error('Method not implemented.');
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isStarted = true;
            // track once libp2p is started
            yield this.track(this.slices);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.untrack(this.slices);
            this.isStarted = false;
        });
    }
};
__decorate([
    opium_decorators_1.register('default-namespace'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], KitsunetPubSub, "defaultNamespace", null);
__decorate([
    opium_decorators_1.register('default-timeout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], KitsunetPubSub, "defaultSliceTimeout", null);
KitsunetPubSub = __decorate([
    opium_decorators_1.register(),
    __param(1, opium_decorators_1.register('default-namespace')),
    __param(2, opium_decorators_1.register('default-timeout')),
    __param(3, opium_decorators_1.register('default-slices')),
    __metadata("design:paramtypes", [libp2p_1.default, String, Number, Set])
], KitsunetPubSub);
exports.KitsunetPubSub = KitsunetPubSub;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVic3ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NsaWNlL3RyYWNrZXJzL3B1YnN1Yi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixvREFBMkI7QUFDM0IsMERBQTZCO0FBQzdCLGlDQUFvQztBQUNwQywyQkFBb0M7QUFDcEMsdURBQTJDO0FBRTNDLGtEQUF5QjtBQUN6QixNQUFNLEdBQUcsR0FBRyxlQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtBQUVyRCxNQUFNLHVCQUF1QixHQUFXLGlCQUFpQixDQUFBO0FBQ3pELE1BQU0scUJBQXFCLEdBQVcsR0FBRyxHQUFHLElBQUksQ0FBQTtBQUNoRCxNQUFNLGFBQWEsR0FBVyxFQUFFLENBQUE7QUFJaEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxFQUFjLEVBQUU7SUFDeEYsT0FBTyxJQUFJLG1CQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDM0IsQ0FBQyxDQUFBO0FBR0QsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLGtCQUFXO0lBa0I3QyxZQUFhLElBQVksRUFFWixTQUFrQixFQUVsQixLQUFjLEVBRWQsTUFBbUI7UUFDOUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBdEJmLGNBQVMsR0FBVyx1QkFBdUIsQ0FBQTtRQUMzQyxVQUFLLEdBQVcsYUFBYSxDQUFBO1FBRTdCLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFvQnhCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQTtRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSx1QkFBdUIsQ0FBQTtRQUNyRCxJQUFJLENBQUMs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QixDQUFDOzs7OytDQUczQjtBQWhCVSxjQUFjO0lBRDFCLDJCQUFRLEVBQUU7SUFvQkssV0FBQSwyQkFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFFN0IsV0FBQSwyQkFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFFM0IsV0FBQSwyQkFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUE7cUNBTHJCLGdCQUFNLGtCQU1ILEdBQUc7R0F4QmQsY0FBYyxDQXVMMUI7QUF2TFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IExpYnAycCBmcm9tICdsaWJwMnAnXG5pbXBvcnQgQ2FjaGUgZnJvbSAnbHJ1LWNhY2hlJ1xuaW1wb3J0IHsgQmFzZVRyYWNrZXIgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyBTbGljZSwgU2xpY2VJZCB9IGZyb20gJy4uLydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgbG9nID0gZGVidWcoJ2tpdHN1bmV0OmtpdHN1bmV0LXB1YnN1Yi10cmFja2VyJylcblxuY29uc3QgREVGQVVMVF9UT1BJQ19OQU1FU1BBQ0U6IHN0cmluZyA9IGAva2l0c3VuZXQvc2xpY2VgXG5jb25zdCBERUZBVUxUX1NMSUNFX1RJTUVPVVQ6IG51bWJlciA9IDMwMCAqIDEwMDBcbmNvbnN0IERFRkFVTFRfREVQVEg6IG51bWJlciA9IDEwXG5cbnR5cGUgU2xpY2VDYWNoZSA9IENhY2hlPHN0cmluZywgYW55PlxuXG5jb25zdCBjcmVhdGVDYWNoZSA9IChvcHRpb25zID0geyBtYXg6IDEwMCwgbWF4QWdlOiBERUZBVUxUX1NMSUNFX1RJTUVPVVQgfSk6IFNsaWNlQ2FjaGUgPT4ge1xuICByZXR1cm4gbmV3IENhY2hlKG9wdGlvbnMpXG59XG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgS2l0c3VuZXRQdWJTdWIgZXh0ZW5kcyBCYXNlVHJhY2tlciB7XG4gIG11bHRpY2FzdDogYW55XG4gIG5vZGU6IGFueVxuICBuYW1lc3BhY2U6IHN0cmluZyA9IERFRkFVTFRfVE9QSUNfTkFNRVNQQUNFXG4gIGRlcHRoOiBudW1iZXIgPSBERUZBVUxUX0RFUFRIXG4gIGZvcndhcmRlZFNsaWNlc0NhY2hlOiBTbGljZUNhY2hlXG4gIGlzU3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgQHJlZ2lzdGVyKCdkZWZhdWx0LW5hbWVzcGFjZScpXG4gIHN0YXRpYyBkZWZhdWx0TmFtZXNwYWNlICgpOiBzdHJpbmcge1xuICAgIHJldHVybiBERUZBVUxUX1RPUElDX05BTUVTUEFDRVxuICB9XG5cbiAgQHJlZ2lzdGVyKCdkZWZhdWx0LXRpbWVvdXQnKVxuICBzdGF0aWMgZGVmYXVsdFNsaWNlVGltZW91dCAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gREVGQVVMVF9TTElDRV9USU1FT1VUXG4gIH1cblxuICBjb25zdHJ1Y3RvciAobm9kZTogTGlicDJwLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdkZWZhdWx0LW5hbWVzcGFjZScpXG4gICAgICAgICAgICAgICBuYW1lc3BhY2U/OiBzdHJpbmcsXG4gICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RlZmF1bHQtdGltZW91dCcpXG4gICAgICAgICAgICAgICBkZXB0aD86IG51bWJlcixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignZGVmYXVsdC1zbGljZXMnKVxuICAgICAgICAgICAgICAgc2xpY2VzPzogU2V0PFNsaWNlPikge1xuICAgIHN1cGVyKHNsaWNlcylcbiAgICB0aGlzLm11bHRpY2FzdCA9IG5vZGUubXVsdGljYXN0XG4gICAgdGhpcy5ub2RlID0gbm9kZVxuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlIHx8IERFRkFVTFRfVE9QSUNfTkFNRVNQQUNFXG4gICAgdGhpcy5kZXB0aCA9IGRlcHRoIHx8IERFRkFVTFRfREVQVEhcbiAgICB0aGlzLmZvcndhcmRlZFNsaWNlc0NhY2hlID0gY3JlYXRlQ2FjaGUoKVxuXG4gICAgdGhpcy5zbGljZXNIb29rID0gdGhpcy5zbGljZXNIb29rLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNsaWNlID0gdGhpcy5oYW5kbGVTbGljZS5iaW5kKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIHN1YnNjcmliZSB0byBhIHNsaWNlXG4gICAqXG4gICAqIEBwYXJhbSB7U2xpY2V9IHNsaWNlIC0gc2xpY2UgdG8gc3Vic2NyaWJlIHRvXG4gICAqL1xuICBwcml2YXRlIHN1YnNjcmliZSAoc2xpY2UpIHtcbiAgICB0aGlzLm11bHRpY2FzdC5hZGRGcndkSG9va3ModGhpcy5tYWtlU2xpY2VUb3BpYyhzbGljZSksIFt0aGlzLnNsaWNlc0hvb2tdKVxuICAgIHRoaXMubXVsdGljYXN0LnN1YnNjcmliZSh0aGlzLm1ha2VTbGljZVRvcGljKHNsaWNlKSwgdGhpcy5oYW5kbGVTbGljZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gdW5zdWJzY3JpYmUgZnJvbSBhIHNsaWNlXG4gICAqXG4gICAqIEBwYXJhbSB7U2xpY2V9IHNsaWNlIC0gc2xpY2UgdG8gdW5zdWJzY3JpYmUgZnJvbVxuICAgKi9cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZSAoc2xpY2UpIHtcbiAgICB0aGlzLm11bHRpY2FzdC5yZW1vdmVGcndkSG9va3ModGhpcy5tYWtlU2xpY2VUb3BpYyhzbGljZSksIFt0aGlzLnNsaWNlc0hvb2tdKVxuICAgIHRoaXMubXVsdGljYXN0LnVuc3Vic2NyaWJlKHRoaXMubWFrZVNsaWNlVG9waWMoc2xpY2UpLCB0aGlzLmhhbmRsZVNsaWNlKVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBtYWtlIGEgc2xpY2UgdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtTbGljZXxTbGljZUlkfSBzbGljZSAtIGEgU2xpY2Ugb2JqZWN0XG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYSBzbGljZSB0b3BpY1xuICAgKi9cbiAgcHJpdmF0ZSBtYWtlU2xpY2VUb3BpYyAoc2xpY2UpIHtcbiAgICBjb25zdCB7IHBhdGgsIGRlcHRoIH0gPSBzbGljZVxuICAgIHJldHVybiBgJHt0aGlzLm5hbWVzcGFjZX0vJHtwYXRofS0ke2RlcHRoIHx8IHRoaXMuZGVwdGh9YFxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBob29rIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgb24gZWFjaCBwdWJzdWIgbWVzc2FnZS5cbiAgICpcbiAgICogVGhpcyBjaGVjayBpZiB0aGUgc2xpY2UgaGFzIGJlZW4gYWxyZWFkeSBmb3J3YXJkZWQuIFRoaXMgaXNcbiAgICogdG8gY2hlY2sgZm9yIGR1cGxpY2F0ZXMgYXQgdGhlIGFwcGxpY2F0aW9uIGxldmVsLCByZWdhcmRsZXNzIG9mIHRoZSBtc2cgaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7UGVlckluZm99IHBlZXIgLSB0aGUgcGVlciBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7TXNnfSBtc2cgLSB0aGUgcHVic3ViIG1lc3NhZ2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgLSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAqL1xuICBwcml2YXRlIHNsaWNlc0hvb2sgKHBlZXIsIG1zZywgY2IpIHtcbiAgICBsZXQgc2xpY2U6IFNsaWNlXG4gICAgdHJ5IHtcbiAgICAgIHNsaWNlID0gbmV3IFNsaWNlKG1zZy5kYXRhKVxuICAgICAgaWYgKCFzbGljZSkge1xuICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGBObyBzbGljZSBpbiBtZXNzYWdlIWApKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nKGVycilcbiAgICAgIHJldHVybiBjYihlcnIpXG4gICAgfVxuXG4gICAgY29uc3QgcGVlcklkID0gcGVlci5pbmZvLmlkLnRvQjU4U3RyaW5nKClcbiAgICBjb25zdCBzbGljZXMgPSB0aGlzLmZvcndhcmRlZFNsaWNlc0NhY2hlLmdldChwZWVySWQpIHx8IGNyZWF0ZUNhY2hlKClcbiAgICBpZiAoIXNsaWNlcy5oYXMoc2xpY2UuaWQpKSB7XG4gICAgICBzbGljZXMuc2V0KHNsaWNlLmlkLCB0cnVlKVxuICAgICAgdGhpcy5mb3J3YXJkZWRTbGljZXNDYWNoZS5zZXQocGVlcklkLCBzbGljZXMpXG4gICAgICByZXR1cm4gY2IobnVsbCwgbXNnKVxuICAgIH1cblxuICAgIGNvbnN0IHNraXBNc2cgPSBgYWxyZWFkeSBmb3J3YXJkZWQgdG8gcGVlciAke3BlZXJJZH0sIHNraXBwaW5nIHNsaWNlICR7c2xpY2UuaWR9YFxuICAgIGxvZyhza2lwTXNnKVxuICAgIHJldHVybiBjYihza2lwTXNnKVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBpbmNvbWluZyBwdWJzdWIgbWVzc2FnZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7TXNnfSBtc2cgLSB0aGUgcHVic3ViIG1lc3NhZ2VcbiAgICovXG4gIHByaXZhdGUgaGFuZGxlU2xpY2UgKG1zZykge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVtaXQoYHNsaWNlYCwgbmV3IFNsaWNlKG1zZy5kYXRhKSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZyhlcnIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdHJhY2tpbmcgdGhlIHByb3ZpZGVkIHNsaWNlc1xuICAgKlxuICAgKiBAcGFyYW0ge1NldDxTbGljZUlkPn0gc2xpY2VzIC0gdGhlIHNsaWNlcyB0byBzdG9wIHRyYWNraW5nXG4gICAqL1xuICBhc3luYyB1bnRyYWNrIChzbGljZXM6IFNldDxTbGljZT4pIHtcbiAgICBzbGljZXMuZm9yRWFjaChhc3luYyAoc2xpY2UpID0+IHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmUoc2xpY2UpXG4gICAgICB0aGlzLnNsaWNlcy5kZWxldGUoc2xpY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIHdpbGwgZGlzY292ZXIsIGNvbm5lY3QgYW5kIHN0YXJ0IHRyYWNraW5nXG4gICAqIHRoZSByZXF1ZXN0ZWQgc2xpY2VzIGZyb20gdGhlIG5ldHdvcmsuXG4gICAqXG4gICAqIEBwYXJhbSB7U2V0PFNsaWNlSWQ+fSBzbGljZXMgLSBhIHNsaWNlIG9yIGFuIFNldCBvZiBzbGljZXMgdG8gdHJhY2tcbiAgICovXG4gIGFzeW5jIHRyYWNrIChzbGljZXMpIHtcbiAgICB0aGlzLnNsaWNlcyA9IG5ldyBTZXQoWy4uLnRoaXMuc2xpY2VzLCAuLi5zbGljZXNdKVxuXG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNsaWNlcy5mb3JFYWNoKGFzeW5jIChzbGljZSkgPT4ge1xuICAgICAgaWYgKGF3YWl0IHRoaXMuaXNUcmFja2luZyhzbGljZSkpIHJldHVyblxuICAgICAgdGhpcy5zdWJzY3JpYmUoc2xpY2UpXG4gICAgICB0aGlzLnNsaWNlcy5hZGQoc2xpY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3ZXRoZXIgdGhlIHNsaWNlIGlzIGFscmVhZHkgYmVpbmcgdHJhY2tlZFxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlIC0gdGhlIHNsaWNlIGlkXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgYXN5bmMgaXNUcmFja2luZyAoc2xpY2UpIHtcbiAgICByZXR1cm4gKHRoaXMuc2xpY2VzLmhhcyhzbGljZSkgJiZcbiAgICAgIChhd2FpdCB0aGlzLm11bHRpY2FzdC5scygpKS5pbmRleE9mKHRoaXMubWFrZVNsaWNlVG9waWMoc2xpY2UpKSA+IC0xKVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggdGhlIHNsaWNlXG4gICAqXG4gICAqIEBwYXJhbSB7U2xpY2V9IHNsaWNlIC0gdGhlIHNsaWNlIHRvIGJlIHB1Ymxpc2hlZFxuICAgKi9cbiAgYXN5bmMgcHVibGlzaCAoc2xpY2UpIHtcbiAgICBpZiAoIXRoaXMuaXNUcmFja2luZyhzbGljZSkpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJhY2soW3NsaWNlXSlcbiAgICB9XG4gICAgdGhpcy5tdWx0aWNhc3QucHVibGlzaCh0aGlzLm1ha2VTbGljZVRvcGljKHNsaWNlKSwgc2xpY2Uuc2VyaWFsaXplKCkpXG4gIH1cblxuICBnZXRTbGljZSAoc2xpY2U6IFNsaWNlSWQpOiBQcm9taXNlPFNsaWNlPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpXG4gIH1cblxuICBhc3luYyBzdGFydCAoKSB7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSB0cnVlXG4gICAgLy8gdHJhY2sgb25jZSBsaWJwMnAgaXMgc3RhcnRlZFxuICAgIGF3YWl0IHRoaXMudHJhY2sodGhpcy5zbGljZXMpXG4gIH1cblxuICBhc3luYyBzdG9wICgpIHtcbiAgICBhd2FpdCB0aGlzLnVudHJhY2sodGhpcy5zbGljZXMpXG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZVxuICB9XG59XG4iXX0=