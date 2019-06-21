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
const libp2p_tcp_1 = __importDefault(require("libp2p-tcp"));
const libp2p_mdns_1 = __importDefault(require("libp2p-mdns"));
const libp2p_bootstrap_1 = __importDefault(require("libp2p-bootstrap"));
class Libp2pConfig {
    /**
     * Return a libp2p config
     *
     * @param peerInfo {PeerInfo} - the peerInfo for this peer
     * @param bootstrap {string[]} - the bootstraps addrs array
     */
    static getConfig(peerInfo, bootstrap) {
        return __awaiter(this, void 0, void 0, function* () {
            bootstrap = bootstrap || [];
            return {
                peerInfo,
                modules: {
                    transport: [
                        libp2p_websockets_1.default,
                        libp2p_tcp_1.default
                    ],
                    peerDiscovery: [
                        libp2p_mdns_1.default,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvY29uZmlnL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7OztBQUVaLDBFQUFrQztBQUNsQyw0REFBNEI7QUFDNUIsOERBQThCO0FBRTlCLHdFQUF3QztBQUd4QyxNQUFhLFlBQVk7SUFDdkI7Ozs7O09BS0c7SUFDSCxNQUFNLENBQU8sU0FBUyxDQUFFLFFBQWtCLEVBQ2xCLFNBQW9COztZQUMxQyxTQUFTLEdBQUcsU0FBUyxJQUFJLEVBQUUsQ0FBQTtZQUMzQixPQUFPO2dCQUNMLFFBQVE7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFNBQVMsRUFBRTt3QkFDVCwyQkFBRTt3QkFDRixvQkFBRztxQkFDSjtvQkFDRCxhQUFhLEVBQUU7d0JBQ2IscUJBQUk7d0JBQ0osMEJBQVM7cUJBQ1Y7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLGFBQWEsRUFBRTt3QkFDYixTQUFTLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsUUFBUSxFQUFFLEtBQUs7eUJBQ2hCO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQTtRQUNILENBQUM7S0FBQTtDQUNGO0FBaENELG9DQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgV1MgZnJvbSAnbGlicDJwLXdlYnNvY2tldHMnXG5pbXBvcnQgVENQIGZyb20gJ2xpYnAycC10Y3AnXG5pbXBvcnQgTUROUyBmcm9tICdsaWJwMnAtbWRucydcblxuaW1wb3J0IEJvb3RzdHJhcCBmcm9tICdsaWJwMnAtYm9vdHN0cmFwJ1xuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcblxuZXhwb3J0IGNsYXNzIExpYnAycENvbmZpZyB7XG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaWJwMnAgY29uZmlnXG4gICAqXG4gICAqIEBwYXJhbSBwZWVySW5mbyB7UGVlckluZm99IC0gdGhlIHBlZXJJbmZvIGZvciB0aGlzIHBlZXJcbiAgICogQHBhcmFtIGJvb3RzdHJhcCB7c3RyaW5nW119IC0gdGhlIGJvb3RzdHJhcHMgYWRkcnMgYXJyYXlcbiAgICovXG4gIHN0YXRpYyBhc3luYyBnZXRDb25maWcgKHBlZXJJbmZvOiBQZWVySW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vdHN0cmFwPzogc3RyaW5nW10pOiBQcm9taXNlPGFueT4ge1xuICAgIGJvb3RzdHJhcCA9IGJvb3RzdHJhcCB8fCBbXVxuICAgIHJldHVybiB7XG4gICAgICBwZWVySW5mbyxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgdHJhbnNwb3J0OiBbXG4gICAgICAgICAgV1MsXG4gICAgICAgICAgVENQXG4gICAgICAgIF0sXG4gICAgICAgIHBlZXJEaXNjb3Zlcnk6IFtcbiAgICAgICAgICBNRE5TLFxuICAgICAgICAgIEJvb3RzdHJhcFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHBlZXJEaXNjb3Zlcnk6IHtcbiAgICAgICAgICBib290c3RyYXA6IHtcbiAgICAgICAgICAgIGxpc3Q6IGJvb3RzdHJhcCxcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAwMFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19