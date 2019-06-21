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
     * @param bootstrap {string[]} - the bootstraps addrs array
     */
    static getConfig(peerInfo, bootstrap) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvc3RhY2tzL2xpYnAycC9jb25maWcvYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWiwwRUFBa0M7QUFDbEMsNEVBQXNDO0FBQ3RDLHdFQUF3QztBQUd4QyxNQUFhLFlBQVk7SUFDdkI7Ozs7O09BS0c7SUFDSCxNQUFNLENBQU8sU0FBUyxDQUFFLFFBQWtCLEVBQ2xCLFNBQW9COztZQUMxQyxTQUFTLEdBQUcsU0FBUyxJQUFJLEVBQUUsQ0FBQTtZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLDRCQUFLLEVBQUUsQ0FBQTtZQUN6QixPQUFPO2dCQUNMLFFBQVE7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFNBQVMsRUFBRTt3QkFDVCwyQkFBRTt3QkFDRixLQUFLO3FCQUNOO29CQUNELGFBQWEsRUFBRTt3QkFDYixLQUFLLENBQUMsU0FBUzt3QkFDZiwwQkFBUztxQkFDVjtpQkFDRjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sYUFBYSxFQUFFO3dCQUNiLFNBQVMsRUFBRTs0QkFDVCxJQUFJLEVBQUUsU0FBUzs0QkFDZixRQUFRLEVBQUUsS0FBSzt5QkFDaEI7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFBO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFqQ0Qsb0NBaUNDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBXUyBmcm9tICdsaWJwMnAtd2Vic29ja2V0cydcbmltcG9ydCBXU3RhciBmcm9tICdsaWJwMnAtd2VicnRjLXN0YXInXG5pbXBvcnQgQm9vdHN0cmFwIGZyb20gJ2xpYnAycC1ib290c3RyYXAnXG5pbXBvcnQgUGVlckluZm8gZnJvbSAncGVlci1pbmZvJ1xuXG5leHBvcnQgY2xhc3MgTGlicDJwQ29uZmlnIHtcbiAgLyoqXG4gICAqIFJldHVybiBhIGxpYnAycCBjb25maWdcbiAgICpcbiAgICogQHBhcmFtIHBlZXJJbmZvIHtQZWVySW5mb30gLSB0aGUgcGVlckluZm8gZm9yIHRoaXMgcGVlclxuICAgKiBAcGFyYW0gYm9vdHN0cmFwIHtzdHJpbmdbXX0gLSB0aGUgYm9vdHN0cmFwcyBhZGRycyBhcnJheVxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGdldENvbmZpZyAocGVlckluZm86IFBlZXJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBib290c3RyYXA/OiBzdHJpbmdbXSk6IFByb21pc2U8YW55PiB7XG4gICAgYm9vdHN0cmFwID0gYm9vdHN0cmFwIHx8IFtdXG4gICAgY29uc3Qgd3N0YXIgPSBuZXcgV1N0YXIoKVxuICAgIHJldHVybiB7XG4gICAgICBwZWVySW5mbyxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgdHJhbnNwb3J0OiBbXG4gICAgICAgICAgV1MsXG4gICAgICAgICAgd3N0YXJcbiAgICAgICAgXSxcbiAgICAgICAgcGVlckRpc2NvdmVyeTogW1xuICAgICAgICAgIHdzdGFyLmRpc2NvdmVyeSxcbiAgICAgICAgICBCb290c3RyYXBcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBwZWVyRGlzY292ZXJ5OiB7XG4gICAgICAgICAgYm9vdHN0cmFwOiB7XG4gICAgICAgICAgICBsaXN0OiBib290c3RyYXAsXG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwMDBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==