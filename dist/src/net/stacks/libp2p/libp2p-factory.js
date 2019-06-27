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
const peer_info_1 = __importDefault(require("peer-info"));
const peer_id_1 = __importDefault(require("peer-id"));
const libp2p_1 = __importDefault(require("libp2p"));
const pull_mplex_1 = __importDefault(require("pull-mplex"));
const libp2p_spdy_1 = __importDefault(require("libp2p-spdy"));
const libp2p_secio_1 = __importDefault(require("libp2p-secio"));
const libp2p_kad_dht_1 = __importDefault(require("libp2p-kad-dht"));
const config_1 = require("./config");
const promisify_this_1 = require("promisify-this");
const opium_decorators_1 = require("opium-decorators");
const defaults_deep_1 = __importDefault(require("@nodeutils/defaults-deep"));
const api_1 = __importDefault(require("libp2p-multicast-conditional/src/api"));
const libp2p_peer_1 = require("./libp2p-peer");
const PPeerInfo = promisify_this_1.promisify(peer_info_1.default, false);
const PPeerId = promisify_this_1.promisify(peer_id_1.default, false);
class Libp2pOptions {
}
exports.Libp2pOptions = Libp2pOptions;
let LibP2PFactory = class LibP2PFactory {
    static getLibp2pOptions(options) {
        const opts = new Libp2pOptions();
        opts.addrs = options.libp2pAddrs;
        opts.bootstrap = options.libp2pBootstrap;
        opts.identity = options.libp2pIdentity;
        return opts;
    }
    /**
     * Create libp2p node
     *
     * @param identity {{privKey: string}} - an object with a private key entry
     * @param addrs {string[]} - an array of multiaddrs
     * @param bootstrap {string[]} - an array of bootstrap multiaddr strings
     */
    static createLibP2PNode(options, peerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = {
                peerInfo,
                modules: {
                    streamMuxer: [
                        pull_mplex_1.default,
                        libp2p_spdy_1.default
                    ],
                    connEncryption: [
                        libp2p_secio_1.default
                    ],
                    dht: libp2p_kad_dht_1.default
                },
                config: {
                    relay: {
                        enabled: false
                    },
                    dht: {
                        kBucketSize: 20,
                        enabled: true,
                        randomWalk: false
                    }
                }
            };
            const config = yield config_1.Libp2pConfig.getConfig(peerInfo, options.bootstrap);
            const node = new libp2p_1.default(defaults_deep_1.default(defaults, config));
            node.start = promisify_this_1.promisify(node.start.bind(node));
            node.stop = promisify_this_1.promisify(node.stop.bind(node));
            node.dial = promisify_this_1.promisify(node.dial.bind(node));
            node.dialProtocol = promisify_this_1.promisify(node.dialProtocol.bind(node));
            node.multicast = promisify_this_1.promisify(api_1.default(node));
            node._multicast.start = promisify_this_1.promisify(node._multicast.start.bind(node._multicast));
            node._multicast.stop = promisify_this_1.promisify(node._multicast.stop.bind(node._multicast));
            return node;
        });
    }
    /**
     * Create a PeerInfo
     *
     * @param identity {{privKey: string}} - an object with a private key entry
     * @param addrs {string[]} - an array of multiaddrs
     */
    static createPeerInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let id;
            const privKey = options.identity && options.identity.privKey ? options.identity.privKey : null;
            if (!privKey) {
                id = yield PPeerId.create();
            }
            else {
                id = yield PPeerId.createFromJSON(options.identity);
            }
            const peerInfo = yield PPeerInfo.create(id);
            const addrs = options.addrs || [];
            addrs.forEach((a) => peerInfo.multiaddrs.add(a));
            return peerInfo;
        });
    }
    static createLibp2pPeer(peerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return new libp2p_peer_1.Libp2pPeer(peerInfo);
        });
    }
};
__decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Libp2pOptions)
], LibP2PFactory, "getLibp2pOptions", null);
__decorate([
    opium_decorators_1.register(libp2p_1.default),
    __param(1, opium_decorators_1.register('libp2p-peer-info')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Libp2pOptions,
        peer_info_1.default]),
    __metadata("design:returntype", Promise)
], LibP2PFactory, "createLibP2PNode", null);
__decorate([
    opium_decorators_1.register('libp2p-peer-info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Libp2pOptions]),
    __metadata("design:returntype", Promise)
], LibP2PFactory, "createPeerInfo", null);
__decorate([
    opium_decorators_1.register('libp2p-peer'),
    __param(0, opium_decorators_1.register('libp2p-peer-info')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [peer_info_1.default]),
    __metadata("design:returntype", Promise)
], LibP2PFactory, "createLibp2pPeer", null);
LibP2PFactory = __decorate([
    opium_decorators_1.register()
], LibP2PFactory);
exports.LibP2PFactory = LibP2PFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosMERBQWdDO0FBQ2hDLHNEQUE0QjtBQUM1QixvREFBMkI7QUFDM0IsNERBQThCO0FBQzlCLDhEQUE4QjtBQUM5QixnRUFBZ0M7QUFDaEMsb0VBQWdDO0FBRWhDLHFDQUF1QztBQUN2QyxtREFBd0Q7QUFDeEQsdURBQTJDO0FBRTNDLDZFQUFtRDtBQUNuRCwrRUFBNkU7QUFDN0UsK0NBQTBDO0FBRTFDLE1BQU0sU0FBUyxHQUFRLDBCQUFTLENBQUMsbUJBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNqRCxNQUFNLE9BQU8sR0FBUSwwQkFBUyxDQUFDLGlCQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFTN0MsTUFBYSxhQUFhO0NBSXpCO0FBSkQsc0NBSUM7QUFHRCxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBRXhCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBdUIsT0FBWTtRQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQTtRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUE7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFBO1FBQ3RDLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUVILE1BQU0sQ0FBTyxnQkFBZ0IsQ0FBRSxPQUFzQixFQUV0QixRQUFrQjs7WUFDL0MsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsUUFBUTtnQkFDUixPQUFPLEVBQUU7b0JBQ1AsV0FBVyxF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QUNGLENBQUE7QUFuRkM7SUFEQywyQkFBUSxFQUFFO0lBQ2UsV0FBQSwyQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBOzs7b0NBQWdCLGFBQWE7MkNBTXpFO0FBVUQ7SUFEQywyQkFBUSxDQUFDLGdCQUFNLENBQUM7SUFFZSxXQUFBLDJCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7cUNBRHBCLGFBQWE7UUFFWixtQkFBUTs7MkNBcUNoRDtBQVNEO0lBREMsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQzs7cUNBQ1MsYUFBYTs7eUNBYWxEO0FBR0Q7SUFEQywyQkFBUSxDQUFDLGFBQWEsQ0FBQztJQUNRLFdBQUEsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOztxQ0FBVyxtQkFBUTs7MkNBRTlFO0FBcEZVLGFBQWE7SUFEekIsMkJBQVEsRUFBRTtHQUNFLGFBQWEsQ0FxRnpCO0FBckZZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBQZWVySW5mbyBmcm9tICdwZWVyLWluZm8nXG5pbXBvcnQgUGVlcklkIGZyb20gJ3BlZXItaWQnXG5pbXBvcnQgTGlicDJwIGZyb20gJ2xpYnAycCdcbmltcG9ydCBNcGxleCBmcm9tICdwdWxsLW1wbGV4J1xuaW1wb3J0IFNQRFkgZnJvbSAnbGlicDJwLXNwZHknXG5pbXBvcnQgU0VDSU8gZnJvbSAnbGlicDJwLXNlY2lvJ1xuaW1wb3J0IERIVCBmcm9tICdsaWJwMnAta2FkLWRodCdcblxuaW1wb3J0IHsgTGlicDJwQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnXG5pbXBvcnQgeyBwcm9taXNpZnksIFByb21pc2lmeUFsbCB9IGZyb20gJ3Byb21pc2lmeS10aGlzJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuXG5pbXBvcnQgZGVmYXVsdHNEZWVwIGZyb20gJ0Bub2RldXRpbHMvZGVmYXVsdHMtZGVlcCdcbmltcG9ydCBjcmVhdGVNdWx0aWNhc3RDb25kaXRpb25hbCBmcm9tICdsaWJwMnAtbXVsdGljYXN0LWNvbmRpdGlvbmFsL3NyYy9hcGknXG5pbXBvcnQgeyBMaWJwMnBQZWVyIH0gZnJvbSAnLi9saWJwMnAtcGVlcidcblxuY29uc3QgUFBlZXJJbmZvOiBhbnkgPSBwcm9taXNpZnkoUGVlckluZm8sIGZhbHNlKVxuY29uc3QgUFBlZXJJZDogYW55ID0gcHJvbWlzaWZ5KFBlZXJJZCwgZmFsc2UpXG5cbmV4cG9ydCB0eXBlIExpYnAycFByb21pc2lmaWVkID0gUHJvbWlzaWZ5QWxsPFxuICBQaWNrPFxuICAgIExpYnAycCxcbiAgICAnc3RhcnQnIHwgJ3N0b3AnIHwgJ2RpYWwnIHwgJ2RpYWxQcm90b2NvbCcgfCAnbXVsdGljYXN0J1xuICA+XG4+ICYgTGlicDJwXG5cbmV4cG9ydCBjbGFzcyBMaWJwMnBPcHRpb25zIHtcbiAgaWRlbnRpdHk/OiB7IHByaXZLZXk/OiBzdHJpbmcgfVxuICBhZGRycz86IHN0cmluZ1tdXG4gIGJvb3RzdHJhcD86IHN0cmluZ1tdXG59XG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgTGliUDJQRmFjdG9yeSB7XG4gIEByZWdpc3RlcigpXG4gIHN0YXRpYyBnZXRMaWJwMnBPcHRpb25zIChAcmVnaXN0ZXIoJ29wdGlvbnMnKSBvcHRpb25zOiBhbnkpOiBMaWJwMnBPcHRpb25zIHtcbiAgICBjb25zdCBvcHRzID0gbmV3IExpYnAycE9wdGlvbnMoKVxuICAgIG9wdHMuYWRkcnMgPSBvcHRpb25zLmxpYnAycEFkZHJzXG4gICAgb3B0cy5ib290c3RyYXAgPSBvcHRpb25zLmxpYnAycEJvb3RzdHJhcFxuICAgIG9wdHMuaWRlbnRpdHkgPSBvcHRpb25zLmxpYnAycElkZW50aXR5XG4gICAgcmV0dXJuIG9wdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbGlicDJwIG5vZGVcbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IHt7cHJpdktleTogc3RyaW5nfX0gLSBhbiBvYmplY3Qgd2l0aCBhIHByaXZhdGUga2V5IGVudHJ5XG4gICAqIEBwYXJhbSBhZGRycyB7c3RyaW5nW119IC0gYW4gYXJyYXkgb2YgbXVsdGlhZGRyc1xuICAgKiBAcGFyYW0gYm9vdHN0cmFwIHtzdHJpbmdbXX0gLSBhbiBhcnJheSBvZiBib290c3RyYXAgbXVsdGlhZGRyIHN0cmluZ3NcbiAgICovXG4gIEByZWdpc3RlcihMaWJwMnApXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVMaWJQMlBOb2RlIChvcHRpb25zOiBMaWJwMnBPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdsaWJwMnAtcGVlci1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXJJbmZvOiBQZWVySW5mbyk6IFByb21pc2UgPExpYnAycFByb21pc2lmaWVkPiB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBwZWVySW5mbyxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgc3RyZWFtTXV4ZXI6IFtcbiAgICAgICAgICBNcGxleCxcbiAgICAgICAgICBTUERZXG4gICAgICAgIF0sXG4gICAgICAgIGNvbm5FbmNyeXB0aW9uOiBbXG4gICAgICAgICAgU0VDSU9cbiAgICAgICAgXSxcbiAgICAgICAgZGh0OiBESFRcbiAgICAgIH0sXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgcmVsYXk6IHtcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkaHQ6IHtcbiAgICAgICAgICBrQnVja2V0U2l6ZTogMjAsXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICByYW5kb21XYWxrOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29uZmlnID0gYXdhaXQgTGlicDJwQ29uZmlnLmdldENvbmZpZyhwZWVySW5mbywgb3B0aW9ucy5ib290c3RyYXApXG4gICAgY29uc3Qgbm9kZTogTGlicDJwUHJvbWlzaWZpZWQgPSBuZXcgTGlicDJwKGRlZmF1bHRzRGVlcChkZWZhdWx0cywgY29uZmlnKSkgYXMgTGlicDJwUHJvbWlzaWZpZWRcblxuICAgIG5vZGUuc3RhcnQgPSBwcm9taXNpZnkobm9kZS5zdGFydC5iaW5kKG5vZGUpKVxuICAgIG5vZGUuc3RvcCA9IHByb21pc2lmeShub2RlLnN0b3AuYmluZChub2RlKSlcbiAgICBub2RlLmRpYWwgPSBwcm9taXNpZnkobm9kZS5kaWFsLmJpbmQobm9kZSkpXG4gICAgbm9kZS5kaWFsUHJvdG9jb2wgPSBwcm9taXNpZnkobm9kZS5kaWFsUHJvdG9jb2wuYmluZChub2RlKSlcbiAgICBub2RlLm11bHRpY2FzdCA9IHByb21pc2lmeShjcmVhdGVNdWx0aWNhc3RDb25kaXRpb25hbChub2RlKSlcblxuICAgIG5vZGUuX211bHRpY2FzdC5zdGFydCA9IHByb21pc2lmeShub2RlLl9tdWx0aWNhc3Quc3RhcnQuYmluZChub2RlLl9tdWx0aWNhc3QpKVxuICAgIG5vZGUuX211bHRpY2FzdC5zdG9wID0gcHJvbWlzaWZ5KG5vZGUuX211bHRpY2FzdC5zdG9wLmJpbmQobm9kZS5fbXVsdGljYXN0KSlcbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFBlZXJJbmZvXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSB7e3ByaXZLZXk6IHN0cmluZ319IC0gYW4gb2JqZWN0IHdpdGggYSBwcml2YXRlIGtleSBlbnRyeVxuICAgKiBAcGFyYW0gYWRkcnMge3N0cmluZ1tdfSAtIGFuIGFycmF5IG9mIG11bHRpYWRkcnNcbiAgICovXG4gIEByZWdpc3RlcignbGlicDJwLXBlZXItaW5mbycpXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVQZWVySW5mbyAob3B0aW9uczogTGlicDJwT3B0aW9ucyk6IFByb21pc2U8UGVlckluZm8+IHtcbiAgICBsZXQgaWQ6IFBlZXJJZFxuICAgIGNvbnN0IHByaXZLZXkgPSBvcHRpb25zLmlkZW50aXR5ICYmIG9wdGlvbnMuaWRlbnRpdHkucHJpdktleSA/IG9wdGlvbnMuaWRlbnRpdHkucHJpdktleSA6IG51bGxcbiAgICBpZiAoIXByaXZLZXkpIHtcbiAgICAgIGlkID0gYXdhaXQgUFBlZXJJZC5jcmVhdGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZCA9IGF3YWl0IFBQZWVySWQuY3JlYXRlRnJvbUpTT04ob3B0aW9ucy5pZGVudGl0eSlcbiAgICB9XG5cbiAgICBjb25zdCBwZWVySW5mbzogUGVlckluZm8gPSBhd2FpdCBQUGVlckluZm8uY3JlYXRlKGlkKVxuICAgIGNvbnN0IGFkZHJzID0gb3B0aW9ucy5hZGRycyB8fCBbXVxuICAgIGFkZHJzLmZvckVhY2goKGEpID0+IHBlZXJJbmZvLm11bHRpYWRkcnMuYWRkKGEpKVxuICAgIHJldHVybiBwZWVySW5mb1xuICB9XG5cbiAgQHJlZ2lzdGVyKCdsaWJwMnAtcGVlcicpXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVMaWJwMnBQZWVyIChAcmVnaXN0ZXIoJ2xpYnAycC1wZWVyLWluZm8nKSBwZWVySW5mbzogUGVlckluZm8pOiBQcm9taXNlPExpYnAycFBlZXI+IHtcbiAgICByZXR1cm4gbmV3IExpYnAycFBlZXIocGVlckluZm8pXG4gIH1cbn1cbiJdfQ==