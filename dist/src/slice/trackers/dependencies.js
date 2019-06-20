"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const opium_decorators_1 = require("opium-decorators");
const ksn_eth_query_1 = require("../../ksn-eth-query");
const kitsunet_block_tracker_1 = __importDefault(require("kitsunet-block-tracker"));
const ethjs_provider_http_1 = __importDefault(require("ethjs-provider-http"));
const eth_block_tracker_1 = __importDefault(require("eth-block-tracker"));
const eth_query_1 = __importDefault(require("eth-query"));
const libp2p_1 = __importDefault(require("libp2p"));
class TrackerFactory {
    createEthHttpProvider(options) {
        return options.bridge ? new ethjs_provider_http_1.default(options.rpcUrl) : null;
    }
    createPollingBlockProvider(options, provider) {
        return options.bridge ? new eth_block_tracker_1.default({ provider }) : null;
    }
    createEthQuery(options, provider) {
        return options.bridge ? new ksn_eth_query_1.KsnEthQuery(provider) : null;
    }
    createKitsunetBlockTracker(node, blockTracker, ethQuery) {
        return new kitsunet_block_tracker_1.default({ node, blockTracker, ethQuery });
    }
}
__decorate([
    opium_decorators_1.register(ethjs_provider_http_1.default),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], TrackerFactory.prototype, "createEthHttpProvider", null);
__decorate([
    opium_decorators_1.register(eth_block_tracker_1.default),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ethjs_provider_http_1.default]),
    __metadata("design:returntype", Object)
], TrackerFactory.prototype, "createPollingBlockProvider", null);
__decorate([
    opium_decorators_1.register(eth_query_1.default),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ethjs_provider_http_1.default]),
    __metadata("design:returntype", Object)
], TrackerFactory.prototype, "createEthQuery", null);
__decorate([
    opium_decorators_1.register(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [libp2p_1.default,
        eth_block_tracker_1.default,
        eth_query_1.default]),
    __metadata("design:returntype", kitsunet_block_tracker_1.default)
], TrackerFactory.prototype, "createKitsunetBlockTracker", null);
exports.TrackerFactory = TrackerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NsaWNlL3RyYWNrZXJzL2RlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVEQUEyQztBQUUzQyx1REFBaUQ7QUFDakQsb0ZBQXlEO0FBQ3pELDhFQUE4QztBQUM5QywwRUFBbUQ7QUFDbkQsMERBQWdDO0FBQ2hDLG9EQUEyQjtBQUUzQixNQUFhLGNBQWM7SUFFekIscUJBQXFCLENBQ0UsT0FBWTtRQUNqQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksNkJBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUNqRSxDQUFDO0lBR0QsMEJBQTBCLENBQ0UsT0FBWSxFQUNaLFFBQXNCO1FBQ2hELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSwyQkFBbUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUN0RSxDQUFDO0lBR0QsY0FBYyxDQUNFLE9BQVksRUFDWixRQUFzQjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksMkJBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBQzFELENBQUM7SUFHRCwwQkFBMEIsQ0FBRSxJQUFZLEVBQ1osWUFBaUMsRUFDakMsUUFBa0I7UUFDNUMsT0FBTyxJQUFJLGdDQUFvQixDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ25FLENBQUM7Q0FDRjtBQXpCQztJQURDLDJCQUFRLENBQUMsNkJBQVksQ0FBQztJQUNDLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7OzsyREFHMUM7QUFHRDtJQURDLDJCQUFRLENBQUMsMkJBQW1CLENBQUM7SUFDRCxXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7OzZDQUVWLDZCQUFZOztnRUFFakQ7QUFHRDtJQURDLDJCQUFRLENBQUMsbUJBQVEsQ0FBQztJQUNGLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7NkNBRVYsNkJBQVk7O29EQUVyQztBQUdEO0lBREMsMkJBQVEsRUFBRTs7cUNBQ3VCLGdCQUFNO1FBQ0UsMkJBQW1CO1FBQ3ZCLG1CQUFRO29DQUFHLGdDQUFvQjtnRUFFcEU7QUExQkgsd0NBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuXG5pbXBvcnQgeyBLc25FdGhRdWVyeSB9IGZyb20gJy4uLy4uL2tzbi1ldGgtcXVlcnknXG5pbXBvcnQgS2l0c3VuZXRCbG9ja1RyYWNrZXIgZnJvbSAna2l0c3VuZXQtYmxvY2stdHJhY2tlcidcbmltcG9ydCBIdHRwUHJvdmlkZXIgZnJvbSAnZXRoanMtcHJvdmlkZXItaHR0cCdcbmltcG9ydCBQb2xsaW5nQmxvY2tUcmFja2VyIGZyb20gJ2V0aC1ibG9jay10cmFja2VyJ1xuaW1wb3J0IEV0aFF1ZXJ5IGZyb20gJ2V0aC1xdWVyeSdcbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuXG5leHBvcnQgY2xhc3MgVHJhY2tlckZhY3Rvcnkge1xuICBAcmVnaXN0ZXIoSHR0cFByb3ZpZGVyKVxuICBjcmVhdGVFdGhIdHRwUHJvdmlkZXIgKEByZWdpc3Rlcignb3B0aW9ucycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogYW55KTogSHR0cFByb3ZpZGVyIHwgbnVsbCB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYnJpZGdlID8gbmV3IEh0dHBQcm92aWRlcihvcHRpb25zLnJwY1VybCkgOiBudWxsXG4gIH1cblxuICBAcmVnaXN0ZXIoUG9sbGluZ0Jsb2NrVHJhY2tlcilcbiAgY3JlYXRlUG9sbGluZ0Jsb2NrUHJvdmlkZXIgKEByZWdpc3Rlcignb3B0aW9ucycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcjogSHR0cFByb3ZpZGVyKTogUG9sbGluZ0Jsb2NrVHJhY2tlciB8IG51bGwge1xuICAgIHJldHVybiBvcHRpb25zLmJyaWRnZSA/IG5ldyBQb2xsaW5nQmxvY2tUcmFja2VyKHsgcHJvdmlkZXIgfSkgOiBudWxsXG4gIH1cblxuICBAcmVnaXN0ZXIoRXRoUXVlcnkpXG4gIGNyZWF0ZUV0aFF1ZXJ5IChAcmVnaXN0ZXIoJ29wdGlvbnMnKVxuICAgICAgICAgICAgICAgICAgb3B0aW9uczogYW55LFxuICAgICAgICAgICAgICAgICAgcHJvdmlkZXI6IEh0dHBQcm92aWRlcik6IEV0aFF1ZXJ5IHwgbnVsbCB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYnJpZGdlID8gbmV3IEtzbkV0aFF1ZXJ5KHByb3ZpZGVyKSA6IG51bGxcbiAgfVxuXG4gIEByZWdpc3RlcigpXG4gIGNyZWF0ZUtpdHN1bmV0QmxvY2tUcmFja2VyIChub2RlOiBMaWJwMnAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja1RyYWNrZXI6IFBvbGxpbmdCbG9ja1RyYWNrZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldGhRdWVyeTogRXRoUXVlcnkpOiBLaXRzdW5ldEJsb2NrVHJhY2tlciB7XG4gICAgcmV0dXJuIG5ldyBLaXRzdW5ldEJsb2NrVHJhY2tlcih7IG5vZGUsIGJsb2NrVHJhY2tlciwgZXRoUXVlcnkgfSlcbiAgfVxufVxuIl19