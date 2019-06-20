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
     * @param addrs {string[]} - the addrs array
     * @param bootstrap {string[]} - the bootstraps addrs array
     */
    static getConfig(peerInfo, addrs, bootstrap) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9saWJwMnAvY29uZmlnL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7OztBQUVaLDBFQUFrQztBQUNsQyw0REFBNEI7QUFDNUIsOERBQThCO0FBRTlCLHdFQUF3QztBQUd4QyxNQUFhLFlBQVk7SUFDdkI7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFPLFNBQVMsQ0FBRSxRQUFrQixFQUNsQixLQUFnQixFQUNoQixTQUFvQjs7WUFDMUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxFQUFFLENBQUE7WUFFM0IsT0FBTztnQkFDTCxRQUFRO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxTQUFTLEVBQUU7d0JBQ1QsMkJBQUU7d0JBQ0Ysb0JBQUc7cUJBQ0o7b0JBQ0QsYUFBYSxFQUFFO3dCQUNiLHFCQUFJO3dCQUNKLDBCQUFTO3FCQUNWO2lCQUNGO2dCQUNELE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUU7d0JBQ2IsU0FBUyxFQUFFOzRCQUNULElBQUksRUFBRSxTQUFTOzRCQUNmLFFBQVEsRUFBRSxLQUFLO3lCQUNoQjtxQkFDRjtpQkFDRjthQUNGLENBQUE7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQW5DRCxvQ0FtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IFdTIGZyb20gJ2xpYnAycC13ZWJzb2NrZXRzJ1xuaW1wb3J0IFRDUCBmcm9tICdsaWJwMnAtdGNwJ1xuaW1wb3J0IE1ETlMgZnJvbSAnbGlicDJwLW1kbnMnXG5cbmltcG9ydCBCb290c3RyYXAgZnJvbSAnbGlicDJwLWJvb3RzdHJhcCdcbmltcG9ydCBQZWVySW5mbyBmcm9tICdwZWVyLWluZm8nXG5cbmV4cG9ydCBjbGFzcyBMaWJwMnBDb25maWcge1xuICAvKipcbiAgICogUmV0dXJuIGEgbGlicDJwIGNvbmZpZ1xuICAgKlxuICAgKiBAcGFyYW0gcGVlckluZm8ge1BlZXJJbmZvfSAtIHRoZSBwZWVySW5mbyBmb3IgdGhpcyBwZWVyXG4gICAqIEBwYXJhbSBhZGRycyB7c3RyaW5nW119IC0gdGhlIGFkZHJzIGFycmF5XG4gICAqIEBwYXJhbSBib290c3RyYXAge3N0cmluZ1tdfSAtIHRoZSBib290c3RyYXBzIGFkZHJzIGFycmF5XG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZ2V0Q29uZmlnIChwZWVySW5mbzogUGVlckluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJzPzogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvb3RzdHJhcD86IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBib290c3RyYXAgPSBib290c3RyYXAgfHwgW11cblxuICAgIHJldHVybiB7XG4gICAgICBwZWVySW5mbyxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgdHJhbnNwb3J0OiBbXG4gICAgICAgICAgV1MsXG4gICAgICAgICAgVENQXG4gICAgICAgIF0sXG4gICAgICAgIHBlZXJEaXNjb3Zlcnk6IFtcbiAgICAgICAgICBNRE5TLFxuICAgICAgICAgIEJvb3RzdHJhcFxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHBlZXJEaXNjb3Zlcnk6IHtcbiAgICAgICAgICBib290c3RyYXA6IHtcbiAgICAgICAgICAgIGxpc3Q6IGJvb3RzdHJhcCxcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAwMFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19