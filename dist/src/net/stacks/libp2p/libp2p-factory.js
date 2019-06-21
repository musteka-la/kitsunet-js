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
        opts.identity = options.identity;
        return opts;
    }
    /**
     * Create libp2p node
     *
     * @param identity {{privKey: string}} - an object with a private key entry
     * @param addrs {string[]} - an array of multiaddrs
     * @param bootstrap {string[]} - an array of bootstrap multiaddr strings
     */
    static createLibP2PNode(peerInfo, options) {
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [peer_info_1.default,
        Libp2pOptions]),
    __metadata("design:returntype", Promise)
], LibP2PFactory, "createLibP2PNode", null);
__decorate([
    opium_decorators_1.register(peer_info_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Libp2pOptions]),
    __metadata("design:returntype", Promise)
], LibP2PFactory, "createPeerInfo", null);
LibP2PFactory = __decorate([
    opium_decorators_1.register()
], LibP2PFactory);
exports.LibP2PFactory = LibP2PFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosMERBQWdDO0FBQ2hDLHNEQUE0QjtBQUM1QixvREFBMkI7QUFDM0IsNERBQThCO0FBQzlCLDhEQUE4QjtBQUM5QixnRUFBZ0M7QUFDaEMsb0VBQWdDO0FBRWhDLHFDQUF1QztBQUN2QyxtREFBd0Q7QUFDeEQsdURBQTJDO0FBRTNDLDZFQUFtRDtBQUNuRCwrRUFBNkU7QUFFN0UsTUFBTSxTQUFTLEdBQVEsMEJBQVMsQ0FBQyxtQkFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ2pELE1BQU0sT0FBTyxHQUFRLDBCQUFTLENBQUMsaUJBQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQVM3QyxNQUFhLGFBQWE7Q0FJekI7QUFKRCxzQ0FJQztBQUdELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7SUFFeEIsTUFBTSxDQUFDLGdCQUFnQixDQUF1QixPQUFZO1FBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUE7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFBO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7UUFDaEMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBRUgsTUFBTSxDQUFPLGdCQUFnQixDQUFFLFFBQWtCLEVBQ2xCLE9BQXNCOztZQUNuRCxNQUFNLFFBQVEsR0FBRztnQkFDZixRQUFRO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUU7d0JBQ1gsb0JB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QUMsZ0JBQU0sQ0FBQzs7cUNBQ3dCLG1CQUFRO1FBQ1QsYUFBYTs7MkNBcUNwRDtBQVNEO0lBREMsMkJBQVEsQ0FBQyxtQkFBUSxDQUFDOztxQ0FDbUIsYUFBYTs7eUNBYWxEO0FBOUVVLGFBQWE7SUFEekIsMkJBQVEsRUFBRTtHQUNFLGFBQWEsQ0ErRXpCO0FBL0VZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBQZWVySW5mbyBmcm9tICdwZWVyLWluZm8nXG5pbXBvcnQgUGVlcklkIGZyb20gJ3BlZXItaWQnXG5pbXBvcnQgTGlicDJwIGZyb20gJ2xpYnAycCdcbmltcG9ydCBNcGxleCBmcm9tICdwdWxsLW1wbGV4J1xuaW1wb3J0IFNQRFkgZnJvbSAnbGlicDJwLXNwZHknXG5pbXBvcnQgU0VDSU8gZnJvbSAnbGlicDJwLXNlY2lvJ1xuaW1wb3J0IERIVCBmcm9tICdsaWJwMnAta2FkLWRodCdcblxuaW1wb3J0IHsgTGlicDJwQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnXG5pbXBvcnQgeyBwcm9taXNpZnksIFByb21pc2lmeUFsbCB9IGZyb20gJ3Byb21pc2lmeS10aGlzJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuXG5pbXBvcnQgZGVmYXVsdHNEZWVwIGZyb20gJ0Bub2RldXRpbHMvZGVmYXVsdHMtZGVlcCdcbmltcG9ydCBjcmVhdGVNdWx0aWNhc3RDb25kaXRpb25hbCBmcm9tICdsaWJwMnAtbXVsdGljYXN0LWNvbmRpdGlvbmFsL3NyYy9hcGknXG5cbmNvbnN0IFBQZWVySW5mbzogYW55ID0gcHJvbWlzaWZ5KFBlZXJJbmZvLCBmYWxzZSlcbmNvbnN0IFBQZWVySWQ6IGFueSA9IHByb21pc2lmeShQZWVySWQsIGZhbHNlKVxuXG5leHBvcnQgdHlwZSBMaWJwMnBQcm9taXNpZmllZCA9IFByb21pc2lmeUFsbDxcbiAgUGljazxcbiAgICBMaWJwMnAsXG4gICAgJ3N0YXJ0JyB8ICdzdG9wJyB8ICdkaWFsJyB8ICdkaWFsUHJvdG9jb2wnIHwgJ211bHRpY2FzdCdcbiAgPlxuPiAmIExpYnAycFxuXG5leHBvcnQgY2xhc3MgTGlicDJwT3B0aW9ucyB7XG4gIGlkZW50aXR5PzogeyBwcml2S2V5Pzogc3RyaW5nIH1cbiAgYWRkcnM/OiBzdHJpbmdbXVxuICBib290c3RyYXA/OiBzdHJpbmdbXVxufVxuXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIExpYlAyUEZhY3Rvcnkge1xuICBAcmVnaXN0ZXIoKVxuICBzdGF0aWMgZ2V0TGlicDJwT3B0aW9ucyAoQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55KTogTGlicDJwT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0cyA9IG5ldyBMaWJwMnBPcHRpb25zKClcbiAgICBvcHRzLmFkZHJzID0gb3B0aW9ucy5saWJwMnBBZGRyc1xuICAgIG9wdHMuYm9vdHN0cmFwID0gb3B0aW9ucy5saWJwMnBCb290c3RyYXBcbiAgICBvcHRzLmlkZW50aXR5ID0gb3B0aW9ucy5pZGVudGl0eVxuICAgIHJldHVybiBvcHRzXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGxpYnAycCBub2RlXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSB7e3ByaXZLZXk6IHN0cmluZ319IC0gYW4gb2JqZWN0IHdpdGggYSBwcml2YXRlIGtleSBlbnRyeVxuICAgKiBAcGFyYW0gYWRkcnMge3N0cmluZ1tdfSAtIGFuIGFycmF5IG9mIG11bHRpYWRkcnNcbiAgICogQHBhcmFtIGJvb3RzdHJhcCB7c3RyaW5nW119IC0gYW4gYXJyYXkgb2YgYm9vdHN0cmFwIG11bHRpYWRkciBzdHJpbmdzXG4gICAqL1xuICBAcmVnaXN0ZXIoTGlicDJwKVxuICBzdGF0aWMgYXN5bmMgY3JlYXRlTGliUDJQTm9kZSAocGVlckluZm86IFBlZXJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogTGlicDJwT3B0aW9ucyk6IFByb21pc2UgPExpYnAycFByb21pc2lmaWVkPiB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBwZWVySW5mbyxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgc3RyZWFtTXV4ZXI6IFtcbiAgICAgICAgICBNcGxleCxcbiAgICAgICAgICBTUERZXG4gICAgICAgIF0sXG4gICAgICAgIGNvbm5FbmNyeXB0aW9uOiBbXG4gICAgICAgICAgU0VDSU9cbiAgICAgICAgXSxcbiAgICAgICAgZGh0OiBESFRcbiAgICAgIH0sXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgcmVsYXk6IHtcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkaHQ6IHtcbiAgICAgICAgICBrQnVja2V0U2l6ZTogMjAsXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICByYW5kb21XYWxrOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29uZmlnID0gYXdhaXQgTGlicDJwQ29uZmlnLmdldENvbmZpZyhwZWVySW5mbywgb3B0aW9ucy5ib290c3RyYXApXG4gICAgY29uc3Qgbm9kZTogTGlicDJwUHJvbWlzaWZpZWQgPSBuZXcgTGlicDJwKGRlZmF1bHRzRGVlcChkZWZhdWx0cywgY29uZmlnKSkgYXMgTGlicDJwUHJvbWlzaWZpZWRcblxuICAgIG5vZGUuc3RhcnQgPSBwcm9taXNpZnkobm9kZS5zdGFydC5iaW5kKG5vZGUpKVxuICAgIG5vZGUuc3RvcCA9IHByb21pc2lmeShub2RlLnN0b3AuYmluZChub2RlKSlcbiAgICBub2RlLmRpYWwgPSBwcm9taXNpZnkobm9kZS5kaWFsLmJpbmQobm9kZSkpXG4gICAgbm9kZS5kaWFsUHJvdG9jb2wgPSBwcm9taXNpZnkobm9kZS5kaWFsUHJvdG9jb2wuYmluZChub2RlKSlcbiAgICBub2RlLm11bHRpY2FzdCA9IHByb21pc2lmeShjcmVhdGVNdWx0aWNhc3RDb25kaXRpb25hbChub2RlKSlcblxuICAgIG5vZGUuX211bHRpY2FzdC5zdGFydCA9IHByb21pc2lmeShub2RlLl9tdWx0aWNhc3Quc3RhcnQuYmluZChub2RlLl9tdWx0aWNhc3QpKVxuICAgIG5vZGUuX211bHRpY2FzdC5zdG9wID0gcHJvbWlzaWZ5KG5vZGUuX211bHRpY2FzdC5zdG9wLmJpbmQobm9kZS5fbXVsdGljYXN0KSlcbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFBlZXJJbmZvXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSB7e3ByaXZLZXk6IHN0cmluZ319IC0gYW4gb2JqZWN0IHdpdGggYSBwcml2YXRlIGtleSBlbnRyeVxuICAgKiBAcGFyYW0gYWRkcnMge3N0cmluZ1tdfSAtIGFuIGFycmF5IG9mIG11bHRpYWRkcnNcbiAgICovXG4gIEByZWdpc3RlcihQZWVySW5mbylcbiAgc3RhdGljIGFzeW5jIGNyZWF0ZVBlZXJJbmZvIChvcHRpb25zOiBMaWJwMnBPcHRpb25zKTogUHJvbWlzZTxQZWVySW5mbz4ge1xuICAgIGxldCBpZDogUGVlcklkXG4gICAgY29uc3QgcHJpdktleSA9IG9wdGlvbnMuaWRlbnRpdHkgJiYgb3B0aW9ucy5pZGVudGl0eS5wcml2S2V5ID8gb3B0aW9ucy5pZGVudGl0eS5wcml2S2V5IDogbnVsbFxuICAgIGlmICghcHJpdktleSkge1xuICAgICAgaWQgPSBhd2FpdCBQUGVlcklkLmNyZWF0ZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gYXdhaXQgUFBlZXJJZC5jcmVhdGVGcm9tSlNPTihvcHRpb25zLmlkZW50aXR5KVxuICAgIH1cblxuICAgIGNvbnN0IHBlZXJJbmZvOiBQZWVySW5mbyA9IGF3YWl0IFBQZWVySW5mby5jcmVhdGUoaWQpXG4gICAgY29uc3QgYWRkcnMgPSBvcHRpb25zLmFkZHJzIHx8IFtdXG4gICAgYWRkcnMuZm9yRWFjaCgoYSkgPT4gcGVlckluZm8ubXVsdGlhZGRycy5hZGQoYSkpXG4gICAgcmV0dXJuIHBlZXJJbmZvXG4gIH1cbn1cbiJdfQ==