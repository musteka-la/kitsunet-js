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
            const config = yield config_1.Libp2pConfig.getConfig(peerInfo, options.addrs, options.bootstrap);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvbGlicDJwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosMERBQWdDO0FBQ2hDLHNEQUE0QjtBQUM1QixvREFBMkI7QUFDM0IsNERBQThCO0FBQzlCLDhEQUE4QjtBQUM5QixnRUFBZ0M7QUFDaEMsb0VBQWdDO0FBRWhDLHFDQUF1QztBQUN2QyxtREFBd0Q7QUFDeEQsdURBQTJDO0FBRTNDLDZFQUFtRDtBQUNuRCwrRUFBNkU7QUFFN0UsTUFBTSxTQUFTLEdBQVEsMEJBQVMsQ0FBQyxtQkFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ2pELE1BQU0sT0FBTyxHQUFRLDBCQUFTLENBQUMsaUJBQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQVM3QyxNQUFhLGFBQWE7Q0FJekI7QUFKRCxzQ0FJQztBQUdELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7SUFFeEIsTUFBTSxDQUFDLGdCQUFnQixDQUF1QixPQUFZO1FBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUE7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFBO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7UUFDaEMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBRUgsTUFBTSxDQUFPLGdCQUFnQixDQUFFLFFBQWtCLEVBQ2xCLE9BQXNCOztZQUNuRCxNQUFNLFFBQVEsR0FBRztnQkFDZixRQUFRO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUU7d0JBQ1gsb0JB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RTtBQVVEO0lBREMsMkJBQVEsQ0FBQyxnQkFBTSxDQUFDOztxQ0FDd0IsbUJBQVE7UUFDVCxhQUFhOzsyQ0FxQ3BEO0FBU0Q7SUFEQywyQkFBUSxDQUFDLG1CQUFRLENBQUM7O3FDQUNtQixhQUFhOzt5Q0FhbEQ7QUE5RVUsYUFBYTtJQUR6QiwyQkFBUSxFQUFFO0dBQ0UsYUFBYSxDQStFekI7QUEvRVksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCBQZWVySWQgZnJvbSAncGVlci1pZCdcbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuaW1wb3J0IE1wbGV4IGZyb20gJ3B1bGwtbXBsZXgnXG5pbXBvcnQgU1BEWSBmcm9tICdsaWJwMnAtc3BkeSdcbmltcG9ydCBTRUNJTyBmcm9tICdsaWJwMnAtc2VjaW8nXG5pbXBvcnQgREhUIGZyb20gJ2xpYnAycC1rYWQtZGh0J1xuXG5pbXBvcnQgeyBMaWJwMnBDb25maWcgfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7IHByb21pc2lmeSwgUHJvbWlzaWZ5QWxsIH0gZnJvbSAncHJvbWlzaWZ5LXRoaXMnXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5cbmltcG9ydCBkZWZhdWx0c0RlZXAgZnJvbSAnQG5vZGV1dGlscy9kZWZhdWx0cy1kZWVwJ1xuaW1wb3J0IGNyZWF0ZU11bHRpY2FzdENvbmRpdGlvbmFsIGZyb20gJ2xpYnAycC1tdWx0aWNhc3QtY29uZGl0aW9uYWwvc3JjL2FwaSdcblxuY29uc3QgUFBlZXJJbmZvOiBhbnkgPSBwcm9taXNpZnkoUGVlckluZm8sIGZhbHNlKVxuY29uc3QgUFBlZXJJZDogYW55ID0gcHJvbWlzaWZ5KFBlZXJJZCwgZmFsc2UpXG5cbmV4cG9ydCB0eXBlIExpYnAycFByb21pc2lmaWVkID0gUHJvbWlzaWZ5QWxsPFxuICBQaWNrPFxuICAgIExpYnAycCxcbiAgICAnc3RhcnQnIHwgJ3N0b3AnIHwgJ2RpYWwnIHwgJ2RpYWxQcm90b2NvbCcgfCAnbXVsdGljYXN0J1xuICA+XG4+ICYgTGlicDJwXG5cbmV4cG9ydCBjbGFzcyBMaWJwMnBPcHRpb25zIHtcbiAgaWRlbnRpdHk/OiB7IHByaXZLZXk/OiBzdHJpbmcgfVxuICBhZGRycz86IHN0cmluZ1tdXG4gIGJvb3RzdHJhcD86IHN0cmluZ1tdXG59XG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgTGliUDJQRmFjdG9yeSB7XG4gIEByZWdpc3RlcigpXG4gIHN0YXRpYyBnZXRMaWJwMnBPcHRpb25zIChAcmVnaXN0ZXIoJ29wdGlvbnMnKSBvcHRpb25zOiBhbnkpOiBMaWJwMnBPcHRpb25zIHtcbiAgICBjb25zdCBvcHRzID0gbmV3IExpYnAycE9wdGlvbnMoKVxuICAgIG9wdHMuYWRkcnMgPSBvcHRpb25zLmxpYnAycEFkZHJzXG4gICAgb3B0cy5ib290c3RyYXAgPSBvcHRpb25zLmxpYnAycEJvb3RzdHJhcFxuICAgIG9wdHMuaWRlbnRpdHkgPSBvcHRpb25zLmlkZW50aXR5XG4gICAgcmV0dXJuIG9wdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbGlicDJwIG5vZGVcbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IHt7cHJpdktleTogc3RyaW5nfX0gLSBhbiBvYmplY3Qgd2l0aCBhIHByaXZhdGUga2V5IGVudHJ5XG4gICAqIEBwYXJhbSBhZGRycyB7c3RyaW5nW119IC0gYW4gYXJyYXkgb2YgbXVsdGlhZGRyc1xuICAgKiBAcGFyYW0gYm9vdHN0cmFwIHtzdHJpbmdbXX0gLSBhbiBhcnJheSBvZiBib290c3RyYXAgbXVsdGlhZGRyIHN0cmluZ3NcbiAgICovXG4gIEByZWdpc3RlcihMaWJwMnApXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVMaWJQMlBOb2RlIChwZWVySW5mbzogUGVlckluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBMaWJwMnBPcHRpb25zKTogUHJvbWlzZSA8TGlicDJwUHJvbWlzaWZpZWQ+IHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHBlZXJJbmZvLFxuICAgICAgbW9kdWxlczoge1xuICAgICAgICBzdHJlYW1NdXhlcjogW1xuICAgICAgICAgIE1wbGV4LFxuICAgICAgICAgIFNQRFlcbiAgICAgICAgXSxcbiAgICAgICAgY29ubkVuY3J5cHRpb246IFtcbiAgICAgICAgICBTRUNJT1xuICAgICAgICBdLFxuICAgICAgICBkaHQ6IERIVFxuICAgICAgfSxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICByZWxheToge1xuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGRodDoge1xuICAgICAgICAgIGtCdWNrZXRTaXplOiAyMCxcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHJhbmRvbVdhbGs6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCBMaWJwMnBDb25maWcuZ2V0Q29uZmlnKHBlZXJJbmZvLCBvcHRpb25zLmFkZHJzLCBvcHRpb25zLmJvb3RzdHJhcClcbiAgICBjb25zdCBub2RlOiBMaWJwMnBQcm9taXNpZmllZCA9IG5ldyBMaWJwMnAoZGVmYXVsdHNEZWVwKGRlZmF1bHRzLCBjb25maWcpKSBhcyBMaWJwMnBQcm9taXNpZmllZFxuXG4gICAgbm9kZS5zdGFydCA9IHByb21pc2lmeShub2RlLnN0YXJ0LmJpbmQobm9kZSkpXG4gICAgbm9kZS5zdG9wID0gcHJvbWlzaWZ5KG5vZGUuc3RvcC5iaW5kKG5vZGUpKVxuICAgIG5vZGUuZGlhbCA9IHByb21pc2lmeShub2RlLmRpYWwuYmluZChub2RlKSlcbiAgICBub2RlLmRpYWxQcm90b2NvbCA9IHByb21pc2lmeShub2RlLmRpYWxQcm90b2NvbC5iaW5kKG5vZGUpKVxuICAgIG5vZGUubXVsdGljYXN0ID0gcHJvbWlzaWZ5KGNyZWF0ZU11bHRpY2FzdENvbmRpdGlvbmFsKG5vZGUpKVxuXG4gICAgbm9kZS5fbXVsdGljYXN0LnN0YXJ0ID0gcHJvbWlzaWZ5KG5vZGUuX211bHRpY2FzdC5zdGFydC5iaW5kKG5vZGUuX211bHRpY2FzdCkpXG4gICAgbm9kZS5fbXVsdGljYXN0LnN0b3AgPSBwcm9taXNpZnkobm9kZS5fbXVsdGljYXN0LnN0b3AuYmluZChub2RlLl9tdWx0aWNhc3QpKVxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgUGVlckluZm9cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IHt7cHJpdktleTogc3RyaW5nfX0gLSBhbiBvYmplY3Qgd2l0aCBhIHByaXZhdGUga2V5IGVudHJ5XG4gICAqIEBwYXJhbSBhZGRycyB7c3RyaW5nW119IC0gYW4gYXJyYXkgb2YgbXVsdGlhZGRyc1xuICAgKi9cbiAgQHJlZ2lzdGVyKFBlZXJJbmZvKVxuICBzdGF0aWMgYXN5bmMgY3JlYXRlUGVlckluZm8gKG9wdGlvbnM6IExpYnAycE9wdGlvbnMpOiBQcm9taXNlPFBlZXJJbmZvPiB7XG4gICAgbGV0IGlkOiBQZWVySWRcbiAgICBjb25zdCBwcml2S2V5ID0gb3B0aW9ucy5pZGVudGl0eSAmJiBvcHRpb25zLmlkZW50aXR5LnByaXZLZXkgPyBvcHRpb25zLmlkZW50aXR5LnByaXZLZXkgOiBudWxsXG4gICAgaWYgKCFwcml2S2V5KSB7XG4gICAgICBpZCA9IGF3YWl0IFBQZWVySWQuY3JlYXRlKClcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSBhd2FpdCBQUGVlcklkLmNyZWF0ZUZyb21KU09OKG9wdGlvbnMuaWRlbnRpdHkpXG4gICAgfVxuXG4gICAgY29uc3QgcGVlckluZm86IFBlZXJJbmZvID0gYXdhaXQgUFBlZXJJbmZvLmNyZWF0ZShpZClcbiAgICBjb25zdCBhZGRycyA9IG9wdGlvbnMuYWRkcnMgfHwgW11cbiAgICBhZGRycy5mb3JFYWNoKChhKSA9PiBwZWVySW5mby5tdWx0aWFkZHJzLmFkZChhKSlcbiAgICByZXR1cm4gcGVlckluZm9cbiAgfVxufVxuIl19