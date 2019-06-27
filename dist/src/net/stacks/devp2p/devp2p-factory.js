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
        this.refreshInterval = 30000;
        this.timeout = 1000 * 10;
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
        dptOpts.timeout = 1000 * 60;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVoseURBUTBCO0FBRTFCLHlDQUEyQztBQUMzQyxtQ0FBb0M7QUFDcEMsdURBQTJDO0FBQzNDLDBFQUFzQztBQUN0QywrQ0FBMEM7QUFFMUMsTUFBTSwyQkFBMkIsR0FBRztJQUNsQyxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxRQUFRO0lBQ1IsTUFBTTtJQUNOLE1BQU07SUFDTixLQUFLO0lBQ0wsUUFBUTtJQUNSLFVBQVU7Q0FDWCxDQUFBO0FBRUQsTUFBYSxlQUFlO0lBQTVCO1FBR0UseUJBQW9CLEdBQWMsMkJBQTJCLENBQUE7UUFJN0QsU0FBSSxHQUFXLEtBQUssQ0FBQTtRQUNwQixRQUFHLEdBQVcsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3QixjQUFTLEdBQWEsRUFBRSxDQUFBO1FBQ3hCLGFBQVEsR0FBVyxFQUFFLENBQUE7SUFDdkIsQ0FBQztDQUFBO0FBWEQsMENBV0M7QUFFRCxNQUFhLFVBQVU7SUFBdkI7UUFDRSxRQUFHLEdBQVcsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3QixvQkFBZSxHQUFXLEtBQUssQ0FBQTtRQUMvQixZQUFPLEdBQVcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQWE7WUFDbkIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsS0FBSztTQUNmLENBQUE7SUFDSCxDQUFDO0NBQUE7QUFURCxnQ0FTQztBQUVELE1BQWEsYUFBYTtJQUV4QixNQUFNLENBQUMsY0FBYyxDQUF1QixPQUFZLEVBQ1gsT0FBZTtRQUMxRCxPQUFPO1lBQ0wsRUFB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OzZDQUFVLE1BQU07b0NBQUcsVUFBVTsyQ0FNMUU7QUFHRDtJQURDLDJCQUFRLEVBQUU7SUFJZ0IsV0FBQSwyQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFFNUIsV0FBQSwyQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztxQ0FMYiwyQkFBTTtRQUNGLFVBQVU7UUFDakIsdUJBQUcsVUFJQyxNQUFNO29DQUFHLGVBQWU7NENBUTFEO0FBR0Q7SUFEQywyQkFBUSxFQUFFOztxQ0FDZ0IsVUFBVTtvQ0FBRyx1QkFBRztvQ0FRMUM7QUFRRDtJQURDLDJCQUFRLENBQUMsYUFBYSxDQUFDO0lBQ1EsV0FBQSwyQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUE7Ozs7MkNBRTNEO0FBakVILHNDQWtFQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICBEUFQsXG4gIFJMUHgsXG4gIFBlZXJJbmZvLFxuICBDYXBhYmlsaXRpZXMsXG4gIFJMUHhPcHRpb25zLFxuICBFVEgsXG4gIHBrMmlkXG59IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuXG5pbXBvcnQgeyBwdWJsaWNLZXlDcmVhdGUgfSBmcm9tICdzZWNwMjU2azEnXG5pbXBvcnQgeyByYW5kb21CeXRlcyB9IGZyb20gJ2NyeXB0bydcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcbmltcG9ydCBDb21tb24gZnJvbSAnZXRoZXJldW1qcy1jb21tb24nXG5pbXBvcnQgeyBEZXZwMnBQZWVyIH0gZnJvbSAnLi9kZXZwMnAtcGVlcidcblxuY29uc3QgZGVmYXVsdFJlbW90ZUNsaWVudElkRmlsdGVyID0gW1xuICAnZ28xLjUnLFxuICAnZ28xLjYnLFxuICAnZ28xLjcnLFxuICAncXVvcnVtJyxcbiAgJ3BpcmwnLFxuICAndWJpcScsXG4gICdnbWMnLFxuICAnZ3doYWxlJyxcbiAgJ3ByaWNoYWluJ1xuXVxuXG5leHBvcnQgY2xhc3MgUkxQeE5vZGVPcHRpb25zIGltcGxlbWVudHMgUkxQeE9wdGlvbnMge1xuICBjbGllbnRJZD86IEJ1ZmZlclxuICB0aW1lb3V0PzogbnVtYmVyXG4gIHJlbW90ZUNsaWVudElkRmlsdGVyPzogc3RyaW5nW10gPSBkZWZhdWx0UmVtb3RlQ2xpZW50SWRGaWx0ZXJcbiAgbGlzdGVuUG9ydCE6IG51bWJlciB8IG51bGxcbiAgZHB0ITogRFBUXG4gIGNhcGFiaWxpdGllcyE6IENhcGFiaWxpdGllc1tdXG4gIHBvcnQ6IG51bWJlciA9IDMwMzAzXG4gIGtleTogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMzIpXG4gIGJvb3Rub2Rlczogc3RyaW5nW10gPSBbXVxuICBtYXhQZWVyczogbnVtYmVyID0gMjVcbn1cblxuZXhwb3J0IGNsYXNzIERQVE9wdGlvbnMge1xuICBrZXk6IEJ1ZmZlciA9IHJhbmRvbUJ5dGVzKDMyKVxuICByZWZyZXNoSW50ZXJ2YWw6IG51bWJlciA9IDMwMDAwXG4gIHRpbWVvdXQ6IG51bWJlciA9IDEwMDAgKiAxMFxuICBlbmRwb2ludDogUGVlckluZm8gPSB7XG4gICAgYWRkcmVzczogJzAuMC4wLjAnLFxuICAgIHVkcFBvcnQ6IDMwMzAzLFxuICAgIHRjcFBvcnQ6IDMwMzAzXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERldlAyUEZhY3Rvcnkge1xuICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKVxuICBzdGF0aWMgY3JlYXRlUGVlckluZm8gKEByZWdpc3Rlcignb3B0aW9ucycpIG9wdGlvbnM6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3JscHgta2V5JykgcmxweEtleTogQnVmZmVyKTogUGVlckluZm8ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogcGsyaWQocmxweEtleSksXG4gICAgICBhZGRyZXNzOiAnMC4wLjAuMCcsXG4gICAgICB1ZHBQb3J0OiBvcHRpb25zLmRldnAyUFBvcnQsXG4gICAgICB0Y3BQb3J0OiBvcHRpb25zLmRldnAyUFBvcnRcbiAgICB9XG4gIH1cblxuICBAcmVnaXN0ZXIoJ3JscHgta2V5JylcbiAgc3RhdGljIHJscHhLZXkgKEByZWdpc3Rlcignb3B0aW9ucycpIG9wdGlvbnM6IGFueSk6IEJ1ZmZlciB7XG4gICAgcmV0dXJuIChvcHRpb25zLmRldnAycElkZW50aXR5ICYmIG9wdGlvbnMuZGV2cDJwSWRlbnRpdHkucHJpdktleSlcbiAgICAgID8gcHVibGljS2V5Q3JlYXRlKEJ1ZmZlci5mcm9tKG9wdGlvbnMuZGV2cDJwSWRlbnRpdHkucHJpdktleSwgJ2Jhc2U2NCcpLCBmYWxzZSlcbiAgICAgIDogcmFuZG9tQnl0ZXMoMzIpXG4gIH1cblxuICBAcmVnaXN0ZXIoKVxuICBzdGF0aWMgY3JlYXRlRHB0T3B0aW9ucyAoQHJlZ2lzdGVyKCdkZXZwMnAtcGVlci1pbmZvJykgcGVlckluZm86IFBlZXJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdybHB4LWtleScpIHJscHhLZXk6IEJ1ZmZlcik6IERQVE9wdGlvbnMge1xuICAgIGNvbnN0IGRwdE9wdHMgPSBuZXcgRFBUT3B0aW9ucygpXG4gICAgZHB0T3B0cy5rZXkgPSBybHB4S2V5XG4gICAgZHB0T3B0cy5lbmRwb2ludCA9IHBlZXJJbmZvXG4gICAgZHB0T3B0cy50aW1lb3V0ID0gMTAwMCAqIDYwXG4gICAgcmV0dXJuIGRwdE9wdHNcbiAgfVxuXG4gIEByZWdpc3RlcigpXG4gIHN0YXRpYyBjcmVhdGVSbHB4T3B0aW9ucyAoY29tbW9uOiBDb21tb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHB0T3B0aW9uczogRFBUT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcHQ6IERQVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXJJbmZvOiBQZWVySW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ3JscHgta2V5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBybHB4S2V5OiBCdWZmZXIpOiBSTFB4Tm9kZU9wdGlvbnMge1xuICAgIGNvbnN0IHJscHggPSBuZXcgUkxQeE5vZGVPcHRpb25zKClcbiAgICBybHB4LmRwdCA9IGRwdFxuICAgIHJscHguYm9vdG5vZGVzID0gY29tbW9uLmJvb3RzdHJhcE5vZGVzKClcbiAgICBybHB4LmNhcGFiaWxpdGllcyA9IFtFVEguZXRoNjIsIEVUSC5ldGg2M11cbiAgICBybHB4Lmxpc3RlblBvcnQgPSBwZWVySW5mby50Y3BQb3J0IHx8IDMwMzAzXG4gICAgcmxweC5rZXkgPSBybHB4S2V5XG4gICAgcmV0dXJuIHJscHhcbiAgfVxuXG4gIEByZWdpc3RlcigpXG4gIHN0YXRpYyBjcmVhdGVEUFQgKG9wdGlvbnM6IERQVE9wdGlvbnMpOiBEUFQge1xuICAgIG9wdGlvbnMuZW5kcG9pbnQgPSBvcHRpb25zLmVuZHBvaW50IHx8IHtcbiAgICAgIGFkZHJlc3M6ICcwLjAuMC4wJyxcbiAgICAgIHVkcFBvcnQ6IG51bGwsXG4gICAgICB0Y3BQb3J0OiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEUFQob3B0aW9ucy5rZXksIG9wdGlvbnMpXG4gIH1cblxuICBAcmVnaXN0ZXIoKVxuICBjcmVhdGVSTFB4IChvcHRpb25zOiBSTFB4Tm9kZU9wdGlvbnMpOiBSTFB4IHtcbiAgICByZXR1cm4gbmV3IFJMUHgob3B0aW9ucy5rZXksIG9wdGlvbnMpXG4gIH1cblxuICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyJylcbiAgc3RhdGljIGFzeW5jIGNyZWF0ZUxpYnAycFBlZXIgKEByZWdpc3RlcignZGV2cDJwLXBlZXItaW5mbycpIHBlZXJJbmZvOiBQZWVySW5mbyk6IFByb21pc2U8RGV2cDJwUGVlcj4ge1xuICAgIHJldHVybiBuZXcgRGV2cDJwUGVlcihwZWVySW5mbylcbiAgfVxufVxuIl19