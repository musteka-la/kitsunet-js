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
const cids_1 = __importDefault(require("cids"));
const libp2p_1 = __importDefault(require("libp2p"));
const multihashing_async_1 = __importDefault(require("multihashing-async"));
const base_1 = require("./base");
const promisify_this_1 = require("promisify-this");
const opium_decorators_1 = require("opium-decorators");
const empty = Buffer.from([0]);
const TIMEOUT = 1000 * 60; // one minute
let DhtDiscovery = class DhtDiscovery extends base_1.Discovery {
    /**
     * Discover nodes for slices using the kademlia DHT
     *
     * @param {Libp2p} node - the libp2p kademlia dht instance
     */
    constructor(node) {
        super();
        this.contentRouting = promisify_this_1.promisify(node.contentRouting);
    }
    _makeKeyId(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = (yield multihashing_async_1.default(sliceId.serialize(), 'sha2-256')) || empty;
            return new cids_1.default(key);
        });
    }
    /**
     * Discover peers tracking this slice
     *
     * @param {Array<SliceId>|SliceId} sliceId - the slices to find the peers for
     * @returns {Array<PeerInfo>} peers - an array of peers tracking the slice
     */
    findPeers(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = yield Promise.all(sliceId.map((s) => __awaiter(this, void 0, void 0, function* () {
                return this.contentRouting.findProviders(yield this._makeKeyId(s), TIMEOUT);
            })));
            return providers.filter(Boolean);
        });
    }
    /**
     * Announces slice to the network using whatever
     * mechanisms are available, e.g DHT, RPC, etc...
     *
     * @param {Array<SliceId>} slices - the slices to announce to the network
     */
    announce(slices) {
        return __awaiter(this, void 0, void 0, function* () {
            slices.forEach((sliceId) => __awaiter(this, void 0, void 0, function* () {
                return this.contentRouting.provide(yield this._makeKeyId(sliceId));
            }));
        });
    }
};
DhtDiscovery = __decorate([
    opium_decorators_1.register(base_1.Discovery),
    __metadata("design:paramtypes", [libp2p_1.default])
], DhtDiscovery);
exports.DhtDiscovery = DhtDiscovery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NsaWNlL2Rpc2NvdmVyeS9kaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosZ0RBQXNCO0FBQ3RCLG9EQUEyQjtBQUMzQiw0RUFBNkM7QUFDN0MsaUNBQWtDO0FBQ2xDLG1EQUEwQztBQUMxQyx1REFBMkM7QUFHM0MsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFFOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQSxDQUFDLGFBQWE7QUFHdkMsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBYSxTQUFRLGdCQUFTO0lBR3pDOzs7O09BSUc7SUFDSCxZQUFhLElBQVk7UUFDdkIsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsY0FBYyxHQUFHLDBCQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ3RELENBQUM7SUFFSyxVQUFVLENBQUUsT0FBZ0I7O1lBQ2hDLE1BQU0sR0FBRyxHQUFXLENBQUMsTUFBTSw0QkFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQTtZQUNsRixPQUFPLElBQUksY0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ0csU0FBUyxDQUFFLE9BQWtCOztZQUNqQyxNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFPLENBQUMsRUFBRSxFQUFFO2dCQUMxRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUM3RSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7WUFFSCxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDbEMsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDRyxRQUFRLENBQUUsTUFBaUI7O1lBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsRUFBRTtnQkFDL0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtZQUNwRSxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUFBO0NBQ0YsQ0FBQTtBQTNDWSxZQUFZO0lBRHhCLDJCQUFRLENBQUMsZ0JBQVMsQ0FBQztxQ0FTQyxnQkFBTTtHQVJkLFlBQVksQ0EyQ3hCO0FBM0NZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBDSUQgZnJvbSAnY2lkcydcbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuaW1wb3J0IG11bHRpaGFzaGluZyBmcm9tICdtdWx0aWhhc2hpbmctYXN5bmMnXG5pbXBvcnQgeyBEaXNjb3ZlcnkgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICdwcm9taXNpZnktdGhpcydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCB7IFNsaWNlSWQgfSBmcm9tICcuLi9zbGljZS1pZCdcblxuY29uc3QgZW1wdHkgPSBCdWZmZXIuZnJvbShbMF0pXG5cbmNvbnN0IFRJTUVPVVQgPSAxMDAwICogNjAgLy8gb25lIG1pbnV0ZVxuXG5AcmVnaXN0ZXIoRGlzY292ZXJ5KVxuZXhwb3J0IGNsYXNzIERodERpc2NvdmVyeSBleHRlbmRzIERpc2NvdmVyeSB7XG4gIGNvbnRlbnRSb3V0aW5nOiBhbnlcblxuICAvKipcbiAgICogRGlzY292ZXIgbm9kZXMgZm9yIHNsaWNlcyB1c2luZyB0aGUga2FkZW1saWEgREhUXG4gICAqXG4gICAqIEBwYXJhbSB7TGlicDJwfSBub2RlIC0gdGhlIGxpYnAycCBrYWRlbWxpYSBkaHQgaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yIChub2RlOiBMaWJwMnApIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5jb250ZW50Um91dGluZyA9IHByb21pc2lmeShub2RlLmNvbnRlbnRSb3V0aW5nKVxuICB9XG5cbiAgYXN5bmMgX21ha2VLZXlJZCAoc2xpY2VJZDogU2xpY2VJZCkge1xuICAgIGNvbnN0IGtleTogQnVmZmVyID0gKGF3YWl0IG11bHRpaGFzaGluZyhzbGljZUlkLnNlcmlhbGl6ZSgpLCAnc2hhMi0yNTYnKSkgfHwgZW1wdHlcbiAgICByZXR1cm4gbmV3IENJRChrZXkpXG4gIH1cblxuICAvKipcbiAgICogRGlzY292ZXIgcGVlcnMgdHJhY2tpbmcgdGhpcyBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PFNsaWNlSWQ+fFNsaWNlSWR9IHNsaWNlSWQgLSB0aGUgc2xpY2VzIHRvIGZpbmQgdGhlIHBlZXJzIGZvclxuICAgKiBAcmV0dXJucyB7QXJyYXk8UGVlckluZm8+fSBwZWVycyAtIGFuIGFycmF5IG9mIHBlZXJzIHRyYWNraW5nIHRoZSBzbGljZVxuICAgKi9cbiAgYXN5bmMgZmluZFBlZXJzIChzbGljZUlkOiBTbGljZUlkW10pIHtcbiAgICBjb25zdCBwcm92aWRlcnMgPSBhd2FpdCBQcm9taXNlLmFsbChzbGljZUlkLm1hcChhc3luYyAocykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudFJvdXRpbmcuZmluZFByb3ZpZGVycyhhd2FpdCB0aGlzLl9tYWtlS2V5SWQocyksIFRJTUVPVVQpXG4gICAgfSkpXG5cbiAgICByZXR1cm4gcHJvdmlkZXJzLmZpbHRlcihCb29sZWFuKVxuICB9XG5cbiAgLyoqXG4gICAqIEFubm91bmNlcyBzbGljZSB0byB0aGUgbmV0d29yayB1c2luZyB3aGF0ZXZlclxuICAgKiBtZWNoYW5pc21zIGFyZSBhdmFpbGFibGUsIGUuZyBESFQsIFJQQywgZXRjLi4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8U2xpY2VJZD59IHNsaWNlcyAtIHRoZSBzbGljZXMgdG8gYW5ub3VuY2UgdG8gdGhlIG5ldHdvcmtcbiAgICovXG4gIGFzeW5jIGFubm91bmNlIChzbGljZXM6IFNsaWNlSWRbXSkge1xuICAgIHNsaWNlcy5mb3JFYWNoKGFzeW5jIChzbGljZUlkKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50Um91dGluZy5wcm92aWRlKGF3YWl0IHRoaXMuX21ha2VLZXlJZChzbGljZUlkKSlcbiAgICB9KVxuICB9XG59XG4iXX0=