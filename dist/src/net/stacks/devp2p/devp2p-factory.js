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
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const secp256k1_1 = require("secp256k1");
const crypto_1 = require("crypto");
const opium_decorators_1 = require("opium-decorators");
const ethereumjs_common_1 = __importDefault(require("ethereumjs-common"));
const devp2p_peer_1 = require("./devp2p-peer");
const defaultRemoteClientIdFilter = [
    'go1.5',
    'go1.6',
    'go1.7',
    'quorum',
    'pirl',
    'ubiq',
    'gmc',
    'gwhale',
    'prichain'
];
class RLPxNodeOptions {
    constructor() {
        this.timeout = 1000 * 60 * 60 * 10;
        this.remoteClientIdFilter = defaultRemoteClientIdFilter;
        this.port = 30303;
        this.key = crypto_1.randomBytes(32);
        this.bootnodes = [];
        this.maxPeers = 25;
    }
}
exports.RLPxNodeOptions = RLPxNodeOptions;
class DPTOptions {
    constructor() {
        this.key = crypto_1.randomBytes(32);
        this.refreshInterval = 30 * 1000;
        this.timeout = 1000 * 60 * 60 * 10;
        this.endpoint = {
            address: '0.0.0.0',
            udpPort: 30303,
            tcpPort: 30303
        };
    }
}
exports.DPTOptions = DPTOptions;
class DevP2PFactory {
    static createPeerInfo(options, rlpxKey) {
        return {
            id: ethereumjs_devp2p_1.pk2id(rlpxKey),
            address: '0.0.0.0',
            udpPort: options.devp2PPort,
            tcpPort: options.devp2PPort
        };
    }
    static rlpxKey(options) {
        return (options.devp2pIdentity && options.devp2pIdentity.privKey)
            ? secp256k1_1.publicKeyCreate(Buffer.from(options.devp2pIdentity.privKey, 'base64'), false)
            : crypto_1.randomBytes(32);
    }
    static createDptOptions(peerInfo, rlpxKey) {
        const dptOpts = new DPTOptions();
        dptOpts.key = rlpxKey;
        dptOpts.endpoint = peerInfo;
        return dptOpts;
    }
    static createRlpxOptions(common, dptOptions, dpt, peerInfo, rlpxKey) {
        const rlpx = new RLPxNodeOptions();
        rlpx.dpt = dpt;
        rlpx.bootnodes = common.bootstrapNodes();
        rlpx.capabilities = [ethereumjs_devp2p_1.ETH.eth62, ethereumjs_devp2p_1.ETH.eth63];
        rlpx.listenPort = peerInfo.tcpPort || 30303;
        rlpx.key = rlpxKey;
        return rlpx;
    }
    static createDPT(options) {
        options.endpoint = options.endpoint || {
            address: '0.0.0.0',
            udpPort: null,
            tcpPort: null
        };
        return new ethereumjs_devp2p_1.DPT(options.key, options);
    }
    createRLPx(options) {
        return new ethereumjs_devp2p_1.RLPx(options.key, options);
    }
    static createLibp2pPeer(peerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return new devp2p_peer_1.Devp2pPeer(peerInfo);
        });
    }
}
__decorate([
    opium_decorators_1.register(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RLPxNodeOptions]),
    __metadata("design:returntype", ethereumjs_devp2p_1.RLPx)
], DevP2PFactory.prototype, "createRLPx", null);
__decorate([
    opium_decorators_1.register('devp2p-peer-info'),
    __param(0, opium_decorators_1.register('options')),
    __param(1, opium_decorators_1.register('rlpx-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Buffer]),
    __metadata("design:returntype", Object)
], DevP2PFactory, "createPeerInfo", null);
__decorate([
    opium_decorators_1.register('rlpx-key'),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Buffer)
], DevP2PFactory, "rlpxKey", null);
__decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('devp2p-peer-info')),
    __param(1, opium_decorators_1.register('rlpx-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Buffer]),
    __metadata("design:returntype", DPTOptions)
], DevP2PFactory, "createDptOptions", null);
__decorate([
    opium_decorators_1.register(),
    __param(3, opium_decorators_1.register('devp2p-peer-info')),
    __param(4, opium_decorators_1.register('rlpx-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ethereumjs_common_1.default,
        DPTOptions,
        ethereumjs_devp2p_1.DPT, Object, Buffer]),
    __metadata("design:returntype", RLPxNodeOptions)
], DevP2PFactory, "createRlpxOptions", null);
__decorate([
    opium_decorators_1.register(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DPTOptions]),
    __metadata("design:returntype", ethereumjs_devp2p_1.DPT)
], DevP2PFactory, "createDPT", null);
__decorate([
    opium_decorators_1.register('devp2p-peer'),
    __param(0, opium_decorators_1.register('devp2p-peer-info')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevP2PFactory, "createLibp2pPeer", null);
exports.DevP2PFactory = DevP2PFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVoseURBUTBCO0FBRTFCLHlDQUEyQztBQUMzQyxtQ0FBb0M7QUFDcEMsdURBQTJDO0FBQzNDLDBFQUFzQztBQUN0QywrQ0FBMEM7QUFHMUMsTUFBTSwyQkFBMkIsR0FBRztJQUNsQyxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxRQUFRO0lBQ1IsTUFBTTtJQUNOLE1BQU07SUFDTixLQUFLO0lBQ0wsUUFBUTtJQUNSLFVBQVU7Q0FDWCxDQUFBO0FBRUQsTUFBYSxlQUFlO0lBQTVCO1FBRUUsWUFBTyxHQUFZLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQTtRQUN0Qyx5QkFBb0IsR0FBYywyQkFBMkIsQ0FBQTtRQUk3RCxTQUFJLEdBQVcsS0FBSyxDQUFBO1FBQ3BCLFFBQUcsR0FBVyxvQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdCLGNBQVMsR0FBYSxFQUFFLENBQUE7UUFDeEIsYUFBUSxHQUFXLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0NBQUE7QUFYRCwwQ0FXQztBQUVELE1BQWEsVUFBVTtJQUF2QjtRQUNFLFFBQUcsR0FBVyxvQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdCLG9CQUFlLEdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQTtRQUNuQyxZQUFPLEdBQVcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBO1FBQ3JDLGFBQVEsR0FBYTtZQUNuQixPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxLQUFLO1NBQ2YsQ0FBQTtJQUNILENBQUM7Q0FBQTtBQVRELGdDQVNDO0FBRUQsTUFBYSxhQUFhO0lBRXhCLE1BQU0sQ0FBQyxjQUFjLENBQXVCLE9BQVksRUFDWCxPQUFlO1FBQzFELE9BQU87WUFDTCxFQUFFLEVBQUUseUJBQUssQ0FBQyxPQUFPLENBQUM7WUFDbEIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVO1lBQzNCLE9BQU8sRUFBRSxPQUFPLENBQUMsVUFBVTtTQUM1QixDQUFBO0lBQ0gsQ0FBQztJQUdELE1BQU0sQ0FBQyxPQUFPLENBQXVCLE9BQVk7UUFDL0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7WUFDL0QsQ0FBQyxDQUFDLDJCQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUM7WUFDL0UsQ0FBQyxDQUFDLG9CQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDckIsQ0FBQztJQUdELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBZ0MsUUFBa0IsRUFDMUIsT0FBZTtRQUM1RCxNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFBO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFBO1FBQ3JCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQzNCLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFHRCxNQUFNLENBQUMsaUJBQWlCLENBQUUsTUFBYyxFQUNkLFVBQXNCLEVBQ3RCLEdBQVEsRUFFUixRQUFrQixFQUVsQixPQUFlO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUE7UUFDbEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsdUJBQUcsQ0FBQyxLQUFLLEVBQUUsdUJBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxQyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFBO1FBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFBO1FBQ2xCLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUdELE1BQU0sQ0FBQyxTQUFTLENBQUUsT0FBbUI7UUFDbkMsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJO1lBQ3JDLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFBO1FBRUQsT0FBTyxJQUFJLHVCQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBR0QsVUFBVSxDQUFFLE9BQXdCO1FBQ2xDLE9BQU8sSUFBSSx3QkFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDdkMsQ0FBQztJQUdELE1BQU0sQ0FBTyxnQkFBZ0IsQ0FBZ0MsUUFBa0I7O1lBQzdFLE9BQU8sSUFBSSx3QkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ2pDLENBQUM7S0FBQTtDQUNGO0FBUkM7SUFEQywyQkFBUSxFQUFFOztxQ0FDVSxlQUFlO29DQUFHLHdCQUFJOytDQUUxQztBQXpERDtJQURDLDJCQUFRLENBQUMsa0JBQWtCLENBQUM7SUFDTCxXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDbkIsV0FBQSwyQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBOzs2Q0FBVSxNQUFNOzt5Q0FPM0Q7QUFHRDtJQURDLDJCQUFRLENBQUMsVUFBVSxDQUFDO0lBQ0osV0FBQSwyQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBOzs7b0NBQWdCLE1BQU07a0NBSXpEO0FBR0Q7SUFEQywyQkFBUSxFQUFFO0lBQ2UsV0FBQSwyQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFDNUIsV0FBQSwyQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBOzs2Q0FBVSxNQUFNO29DQUFHLFVBQVU7MkNBSzFFO0FBR0Q7SUFEQywyQkFBUSxFQUFFO0lBSWdCLFdBQUEsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBRTVCLFdBQUEsMkJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQTs7cUNBTGIsMkJBQU07UUFDRixVQUFVO1FBQ2pCLHVCQUFHLFVBSUMsTUFBTTtvQ0FBRyxlQUFlOzRDQVExRDtBQUdEO0lBREMsMkJBQVEsRUFBRTs7cUNBQ2dCLFVBQVU7b0NBQUcsdUJBQUc7b0NBUTFDO0FBUUQ7SUFEQywyQkFBUSxDQUFDLGFBQWEsQ0FBQztJQUNRLFdBQUEsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOzs7OzJDQUUzRDtBQWhFSCxzQ0FpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgRFBULFxuICBSTFB4LFxuICBQZWVySW5mbyxcbiAgQ2FwYWJpbGl0aWVzLFxuICBSTFB4T3B0aW9ucyxcbiAgRVRILFxuICBwazJpZFxufSBmcm9tICdldGhlcmV1bWpzLWRldnAycCdcblxuaW1wb3J0IHsgcHVibGljS2V5Q3JlYXRlIH0gZnJvbSAnc2VjcDI1NmsxJ1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuaW1wb3J0IHsgRGV2cDJwUGVlciB9IGZyb20gJy4vZGV2cDJwLXBlZXInXG5pbXBvcnQgeyBybHAgfSBmcm9tICdldGhlcmV1bWpzLXV0aWwnO1xuXG5jb25zdCBkZWZhdWx0UmVtb3RlQ2xpZW50SWRGaWx0ZXIgPSBbXG4gICdnbzEuNScsXG4gICdnbzEuNicsXG4gICdnbzEuNycsXG4gICdxdW9ydW0nLFxuICAncGlybCcsXG4gICd1YmlxJyxcbiAgJ2dtYycsXG4gICdnd2hhbGUnLFxuICAncHJpY2hhaW4nXG5dXG5cbmV4cG9ydCBjbGFzcyBSTFB4Tm9kZU9wdGlvbnMgaW1wbGVtZW50cyBSTFB4T3B0aW9ucyB7XG4gIGNsaWVudElkPzogQnVmZmVyXG4gIHRpbWVvdXQ/OiBudW1iZXIgPSAxMDAwICogNjAgKiA2MCAqIDEwXG4gIHJlbW90ZUNsaWVudElkRmlsdGVyPzogc3RyaW5nW10gPSBkZWZhdWx0UmVtb3RlQ2xpZW50SWRGaWx0ZXJcbiAgbGlzdGVuUG9ydCE6IG51bWJlciB8IG51bGxcbiAgZHB0ITogRFBUXG4gIGNhcGFiaWxpdGllcyE6IENhcGFiaWxpdGllc1tdXG4gIHBvcnQ6IG51bWJlciA9IDMwMzAzXG4gIGtleTogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMzIpXG4gIGJvb3Rub2Rlczogc3RyaW5nW10gPSBbXVxuICBtYXhQZWVyczogbnVtYmVyID0gMjVcbn1cblxuZXhwb3J0IGNsYXNzIERQVE9wdGlvbnMge1xuICBrZXk6IEJ1ZmZlciA9IHJhbmRvbUJ5dGVzKDMyKVxuICByZWZyZXNoSW50ZXJ2YWw6IG51bWJlciA9IDMwICogMTAwMFxuICB0aW1lb3V0OiBudW1iZXIgPSAxMDAwICogNjAgKiA2MCAqIDEwXG4gIGVuZHBvaW50OiBQZWVySW5mbyA9IHtcbiAgICBhZGRyZXNzOiAnMC4wLjAuMCcsXG4gICAgdWRwUG9ydDogMzAzMDMsXG4gICAgdGNwUG9ydDogMzAzMDNcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGV2UDJQRmFjdG9yeSB7XG4gIEByZWdpc3RlcignZGV2cDJwLXBlZXItaW5mbycpXG4gIHN0YXRpYyBjcmVhdGVQZWVySW5mbyAoQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlcigncmxweC1rZXknKSBybHB4S2V5OiBCdWZmZXIpOiBQZWVySW5mbyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBwazJpZChybHB4S2V5KSxcbiAgICAgIGFkZHJlc3M6ICcwLjAuMC4wJyxcbiAgICAgIHVkcFBvcnQ6IG9wdGlvbnMuZGV2cDJQUG9ydCxcbiAgICAgIHRjcFBvcnQ6IG9wdGlvbnMuZGV2cDJQUG9ydFxuICAgIH1cbiAgfVxuXG4gIEByZWdpc3RlcigncmxweC1rZXknKVxuICBzdGF0aWMgcmxweEtleSAoQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55KTogQnVmZmVyIHtcbiAgICByZXR1cm4gKG9wdGlvbnMuZGV2cDJwSWRlbnRpdHkgJiYgb3B0aW9ucy5kZXZwMnBJZGVudGl0eS5wcml2S2V5KVxuICAgICAgPyBwdWJsaWNLZXlDcmVhdGUoQnVmZmVyLmZyb20ob3B0aW9ucy5kZXZwMnBJZGVudGl0eS5wcml2S2V5LCAnYmFzZTY0JyksIGZhbHNlKVxuICAgICAgOiByYW5kb21CeXRlcygzMilcbiAgfVxuXG4gIEByZWdpc3RlcigpXG4gIHN0YXRpYyBjcmVhdGVEcHRPcHRpb25zIChAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKSBwZWVySW5mbzogUGVlckluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3JscHgta2V5JykgcmxweEtleTogQnVmZmVyKTogRFBUT3B0aW9ucyB7XG4gICAgY29uc3QgZHB0T3B0cyA9IG5ldyBEUFRPcHRpb25zKClcbiAgICBkcHRPcHRzLmtleSA9IHJscHhLZXlcbiAgICBkcHRPcHRzLmVuZHBvaW50ID0gcGVlckluZm9cbiAgICByZXR1cm4gZHB0T3B0c1xuICB9XG5cbiAgQHJlZ2lzdGVyKClcbiAgc3RhdGljIGNyZWF0ZVJscHhPcHRpb25zIChjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcHRPcHRpb25zOiBEUFRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRwdDogRFBULFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlcignZGV2cDJwLXBlZXItaW5mbycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVlckluZm86IFBlZXJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlcigncmxweC1rZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJscHhLZXk6IEJ1ZmZlcik6IFJMUHhOb2RlT3B0aW9ucyB7XG4gICAgY29uc3QgcmxweCA9IG5ldyBSTFB4Tm9kZU9wdGlvbnMoKVxuICAgIHJscHguZHB0ID0gZHB0XG4gICAgcmxweC5ib290bm9kZXMgPSBjb21tb24uYm9vdHN0cmFwTm9kZXMoKVxuICAgIHJscHguY2FwYWJpbGl0aWVzID0gW0VUSC5ldGg2MiwgRVRILmV0aDYzXVxuICAgIHJscHgubGlzdGVuUG9ydCA9IHBlZXJJbmZvLnRjcFBvcnQgfHwgMzAzMDNcbiAgICBybHB4LmtleSA9IHJscHhLZXlcbiAgICByZXR1cm4gcmxweFxuICB9XG5cbiAgQHJlZ2lzdGVyKClcbiAgc3RhdGljIGNyZWF0ZURQVCAob3B0aW9uczogRFBUT3B0aW9ucyk6IERQVCB7XG4gICAgb3B0aW9ucy5lbmRwb2ludCA9IG9wdGlvbnMuZW5kcG9pbnQgfHwge1xuICAgICAgYWRkcmVzczogJzAuMC4wLjAnLFxuICAgICAgdWRwUG9ydDogbnVsbCxcbiAgICAgIHRjcFBvcnQ6IG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERQVChvcHRpb25zLmtleSwgb3B0aW9ucylcbiAgfVxuXG4gIEByZWdpc3RlcigpXG4gIGNyZWF0ZVJMUHggKG9wdGlvbnM6IFJMUHhOb2RlT3B0aW9ucyk6IFJMUHgge1xuICAgIHJldHVybiBuZXcgUkxQeChvcHRpb25zLmtleSwgb3B0aW9ucylcbiAgfVxuXG4gIEByZWdpc3RlcignZGV2cDJwLXBlZXInKVxuICBzdGF0aWMgYXN5bmMgY3JlYXRlTGlicDJwUGVlciAoQHJlZ2lzdGVyKCdkZXZwMnAtcGVlci1pbmZvJykgcGVlckluZm86IFBlZXJJbmZvKTogUHJvbWlzZTxEZXZwMnBQZWVyPiB7XG4gICAgcmV0dXJuIG5ldyBEZXZwMnBQZWVyKHBlZXJJbmZvKVxuICB9XG59XG4iXX0=