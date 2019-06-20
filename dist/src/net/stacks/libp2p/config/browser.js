'use strict';
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
const libp2p_websockets_1 = __importDefault(require("libp2p-websockets"));
const libp2p_webrtc_star_1 = __importDefault(require("libp2p-webrtc-star"));
const libp2p_bootstrap_1 = __importDefault(require("libp2p-bootstrap"));
class Libp2pConfig {
    /**
     * Return a libp2p config
     *
     * @param peerInfo {PeerInfo} - the peerInfo for this peer
     * @param addrs {string[]} - the addrs array
     * @param bootstrap {string[]} - the bootstraps addrs array
     */
    static getConfig(peerInfo, addrs, bootstrap) {
        return __awaiter(this, void 0, void 0, function* () {
            bootstrap = bootstrap || [];
            const wstar = new libp2p_webrtc_star_1.default();
            return {
                peerInfo,
                modules: {
                    transport: [
                        libp2p_websockets_1.default,
                        wstar
                    ],
                    peerDiscovery: [
                        wstar.discovery,
                        libp2p_bootstrap_1.default
                    ]
                },
                config: {
                    peerDiscovery: {
                        bootstrap: {
                            list: bootstrap,
                            interval: 10000
                        }
                    }
                }
            };
        });
    }
}
exports.Libp2pConfig = Libp2pConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvc3RhY2tzL2xpYnAycC9jb25maWcvYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWiwwRUFBa0M7QUFDbEMsNEVBQXNDO0FBQ3RDLHdFQUF3QztBQUd4QyxNQUFhLFlBQVk7SUFDdkI7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFPLFNBQVMsQ0FBRSxRQUFrQixFQUNsQixLQUFnQixFQUNoQixTQUFvQjs7WUFFMUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxFQUFFLENBQUE7WUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBSyxFQUFFLENBQUE7WUFDekIsT0FBTztnQkFDTCxRQUFRO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxTQUFTLEVBQUU7d0JBQ1QsMkJBQUU7d0JBQ0YsS0FBSztxQkFDTjtvQkFDRCxhQUFhLEVBQUU7d0JBQ2IsS0FBSyxDQUFDLFNBQVM7d0JBQ2YsMEJBQVM7cUJBQ1Y7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLGFBQWEsRUFBRTt3QkFDYixTQUFTLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsUUFBUSxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQTtRQUNILENBQUM7S0FBQTtDQUNGO0FBcENELG9DQW9DQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgV1MgZnJvbSAnbGlicDJwLXdlYnNvY2tldHMnXG5pbXBvcnQgV1N0YXIgZnJvbSAnbGlicDJwLXdlYnJ0Yy1zdGFyJ1xuaW1wb3J0IEJvb3RzdHJhcCBmcm9tICdsaWJwMnAtYm9vdHN0cmFwJ1xuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcblxuZXhwb3J0IGNsYXNzIExpYnAycENvbmZpZyB7XG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaWJwMnAgY29uZmlnXG4gICAqXG4gICAqIEBwYXJhbSBwZWVySW5mbyB7UGVlckluZm99IC0gdGhlIHBlZXJJbmZvIGZvciB0aGlzIHBlZXJcbiAgICogQHBhcmFtIGFkZHJzIHtzdHJpbmdbXX0gLSB0aGUgYWRkcnMgYXJyYXlcbiAgICogQHBhcmFtIGJvb3RzdHJhcCB7c3RyaW5nW119IC0gdGhlIGJvb3RzdHJhcHMgYWRkcnMgYXJyYXlcbiAgICovXG4gIHN0YXRpYyBhc3luYyBnZXRDb25maWcgKHBlZXJJbmZvOiBQZWVySW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcnM/OiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vdHN0cmFwPzogc3RyaW5nW10pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgYm9vdHN0cmFwID0gYm9vdHN0cmFwIHx8IFtdXG4gICAgY29uc3Qgd3N0YXIgPSBuZXcgV1N0YXIoKVxuICAgIHJldHVybiB7XG4gICAgICBwZWVySW5mbyxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgdHJhbnNwb3J0OiBbXG4gICAgICAgICAgV1MsXG4gICAgICAgICAgd3N0YXJcbiAgICAgICAgXSxcbiAgICAgICAgcGVlckRpc2NvdmVyeTogW1xuICAgICAgICAgIHdzdGFyLmRpc2NvdmVyeSxcbiAgICAgICAgICBCb290c3RyYXBcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBwZWVyRGlzY292ZXJ5OiB7XG4gICAgICAgICAgYm9vdHN0cmFwOiB7XG4gICAgICAgICAgICBsaXN0OiBib290c3RyYXAsXG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwMDBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==