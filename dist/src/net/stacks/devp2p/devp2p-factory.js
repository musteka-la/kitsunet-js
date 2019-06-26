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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_devp2p_1 = require("ethereumjs-devp2p");
const crypto_1 = require("crypto");
const opium_decorators_1 = require("opium-decorators");
const ethereumjs_common_1 = __importDefault(require("ethereumjs-common"));
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
    static createPeerInfo(options) {
        return {
            address: '0.0.0.0',
            udpPort: options.devp2PPort,
            tcpPort: options.devp2PPort
        };
    }
    static createDptOptions(peerInfo) {
        const dptOpts = new DPTOptions();
        dptOpts.endpoint = peerInfo;
        dptOpts.timeout = 1000 * 60;
        return dptOpts;
    }
    static createRlpxOptions(common, dpt, peerInfo) {
        const rlpx = new RLPxNodeOptions();
        rlpx.dpt = dpt;
        rlpx.bootnodes = common.bootstrapNodes();
        rlpx.capabilities = [ethereumjs_devp2p_1.ETH.eth62, ethereumjs_devp2p_1.ETH.eth63];
        rlpx.listenPort = peerInfo.tcpPort || 30303;
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], DevP2PFactory, "createPeerInfo", null);
__decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('devp2p-peer-info')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", DPTOptions)
], DevP2PFactory, "createDptOptions", null);
__decorate([
    opium_decorators_1.register(),
    __param(2, opium_decorators_1.register('devp2p-peer-info')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ethereumjs_common_1.default,
        ethereumjs_devp2p_1.DPT, Object]),
    __metadata("design:returntype", RLPxNodeOptions)
], DevP2PFactory, "createRlpxOptions", null);
__decorate([
    opium_decorators_1.register(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DPTOptions]),
    __metadata("design:returntype", ethereumjs_devp2p_1.DPT)
], DevP2PFactory, "createDPT", null);
exports.DevP2PFactory = DevP2PFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2cDJwLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3N0YWNrcy9kZXZwMnAvZGV2cDJwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLHlEQU8wQjtBQUMxQixtQ0FBb0M7QUFDcEMsdURBQTJDO0FBQzNDLDBFQUFzQztBQUV0QyxNQUFNLDJCQUEyQixHQUFHO0lBQ2xDLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7SUFDUixNQUFNO0lBQ04sTUFBTTtJQUNOLEtBQUs7SUFDTCxRQUFRO0lBQ1IsVUFBVTtDQUNYLENBQUE7QUFFRCxNQUFhLGVBQWU7SUFBNUI7UUFHRSx5QkFBb0IsR0FBMEIsMkJBQTJCLENBQUE7UUFJekUsU0FBSSxHQUFXLEtBQUssQ0FBQTtRQUNwQixRQUFHLEdBQVcsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3QixjQUFTLEdBQWEsRUFBRSxDQUFBO1FBQ3hCLGFBQVEsR0FBVyxFQUFFLENBQUE7SUFDdkIsQ0FBQztDQUFBO0FBWEQsMENBV0M7QUFFRCxNQUFhLFVBQVU7SUFBdkI7UUFDRSxRQUFHLEdBQVcsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3QixvQkFBZSxHQUFXLEtBQUssQ0FBQTtRQUMvQixZQUFPLEdBQVcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQWE7WUFDbkIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsS0FBSztTQUNmLENBQUE7SUFDSCxDQUFDO0NBQUE7QUFURCxnQ0FTQztBQUVELE1BQWEsYUFBYTtJQUV4QixNQUFNLENBQUMsY0FBYyxDQUF1QixPQUFZO1FBQ3RELE9BQU87WUFDTCxPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsT0FBTyxDQUFDLFVBQVU7WUFDM0IsT0FBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVO1NBQzVCLENBQUE7SUFDSCxDQUFDO0lBR0QsTUFBTSxDQUFDLGdCQUFnQixDQUFnQyxRQUFrQjtRQUN2RSxNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFBO1FBQ2hDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQzNCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUMzQixPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBR0QsTUFBTSxDQUFDLGlCQUFpQixDQUFFLE1BQWMsRUFDZCxHQUFRLEVBRVIsUUFBa0I7UUFDMUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQTtRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyx1QkFBRyxDQUFDLEtBQUssRUFBRSx1QkFBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUE7UUFDM0MsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBR0QsTUFBTSxDQUFDLFNBQVMsQ0FBRSxPQUFtQjtRQUNuQyxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUk7WUFDckMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUE7UUFFRCxPQUFPLElBQUksdUJBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFHRCxVQUFVLENBQUUsT0FBd0I7UUFDbEMsT0FBTyxJQUFJLHdCQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0NBQ0Y7QUFIQztJQURDLDJCQUFRLEVBQUU7O3FDQUNVLGVBQWU7b0NBQUcsd0JBQUk7K0NBRTFDO0FBM0NEO0lBREMsMkJBQVEsQ0FBQyxrQkFBa0IsQ0FBQztJQUNMLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7Ozt5Q0FNMUM7QUFHRDtJQURDLDJCQUFRLEVBQUU7SUFDZSxXQUFBLDJCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7O29DQUFzQixVQUFVOzJDQUtyRjtBQUdEO0lBREMsMkJBQVEsRUFBRTtJQUdnQixXQUFBLDJCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7cUNBRnJCLDJCQUFNO1FBQ1QsdUJBQUc7b0NBRWEsZUFBZTs0Q0FPN0Q7QUFHRDtJQURDLDJCQUFRLEVBQUU7O3FDQUNnQixVQUFVO29DQUFHLHVCQUFHO29DQVExQztBQXhDSCxzQ0E4Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgRFBULFxuICBSTFB4LFxuICBQZWVySW5mbyxcbiAgQ2FwYWJpbGl0aWVzLFxuICBSTFB4T3B0aW9ucyxcbiAgRVRIXG59IGZyb20gJ2V0aGVyZXVtanMtZGV2cDJwJ1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgQ29tbW9uIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uJ1xuXG5jb25zdCBkZWZhdWx0UmVtb3RlQ2xpZW50SWRGaWx0ZXIgPSBbXG4gICdnbzEuNScsXG4gICdnbzEuNicsXG4gICdnbzEuNycsXG4gICdxdW9ydW0nLFxuICAncGlybCcsXG4gICd1YmlxJyxcbiAgJ2dtYycsXG4gICdnd2hhbGUnLFxuICAncHJpY2hhaW4nXG5dXG5cbmV4cG9ydCBjbGFzcyBSTFB4Tm9kZU9wdGlvbnMgaW1wbGVtZW50cyBSTFB4T3B0aW9ucyB7XG4gIGNsaWVudElkPzogQnVmZmVyIHwgdW5kZWZpbmVkXG4gIHRpbWVvdXQ/OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgcmVtb3RlQ2xpZW50SWRGaWx0ZXI/OiBzdHJpbmdbXSB8IHVuZGVmaW5lZCA9IGRlZmF1bHRSZW1vdGVDbGllbnRJZEZpbHRlclxuICBsaXN0ZW5Qb3J0ITogbnVtYmVyIHwgbnVsbFxuICBkcHQhOiBEUFRcbiAgY2FwYWJpbGl0aWVzITogQ2FwYWJpbGl0aWVzW11cbiAgcG9ydDogbnVtYmVyID0gMzAzMDNcbiAga2V5OiBCdWZmZXIgPSByYW5kb21CeXRlcygzMilcbiAgYm9vdG5vZGVzOiBzdHJpbmdbXSA9IFtdXG4gIG1heFBlZXJzOiBudW1iZXIgPSAyNVxufVxuXG5leHBvcnQgY2xhc3MgRFBUT3B0aW9ucyB7XG4gIGtleTogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMzIpXG4gIHJlZnJlc2hJbnRlcnZhbDogbnVtYmVyID0gMzAwMDBcbiAgdGltZW91dDogbnVtYmVyID0gMTAwMCAqIDEwXG4gIGVuZHBvaW50OiBQZWVySW5mbyA9IHtcbiAgICBhZGRyZXNzOiAnMC4wLjAuMCcsXG4gICAgdWRwUG9ydDogMzAzMDMsXG4gICAgdGNwUG9ydDogMzAzMDNcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGV2UDJQRmFjdG9yeSB7XG4gIEByZWdpc3RlcignZGV2cDJwLXBlZXItaW5mbycpXG4gIHN0YXRpYyBjcmVhdGVQZWVySW5mbyAoQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55KTogUGVlckluZm8ge1xuICAgIHJldHVybiB7XG4gICAgICBhZGRyZXNzOiAnMC4wLjAuMCcsXG4gICAgICB1ZHBQb3J0OiBvcHRpb25zLmRldnAyUFBvcnQsXG4gICAgICB0Y3BQb3J0OiBvcHRpb25zLmRldnAyUFBvcnRcbiAgICB9XG4gIH1cblxuICBAcmVnaXN0ZXIoKVxuICBzdGF0aWMgY3JlYXRlRHB0T3B0aW9ucyAoQHJlZ2lzdGVyKCdkZXZwMnAtcGVlci1pbmZvJykgcGVlckluZm86IFBlZXJJbmZvKTogRFBUT3B0aW9ucyB7XG4gICAgY29uc3QgZHB0T3B0cyA9IG5ldyBEUFRPcHRpb25zKClcbiAgICBkcHRPcHRzLmVuZHBvaW50ID0gcGVlckluZm9cbiAgICBkcHRPcHRzLnRpbWVvdXQgPSAxMDAwICogNjBcbiAgICByZXR1cm4gZHB0T3B0c1xuICB9XG5cbiAgQHJlZ2lzdGVyKClcbiAgc3RhdGljIGNyZWF0ZVJscHhPcHRpb25zIChjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcHQ6IERQVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RldnAycC1wZWVyLWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZXJJbmZvOiBQZWVySW5mbyk6IFJMUHhOb2RlT3B0aW9ucyB7XG4gICAgY29uc3QgcmxweCA9IG5ldyBSTFB4Tm9kZU9wdGlvbnMoKVxuICAgIHJscHguZHB0ID0gZHB0XG4gICAgcmxweC5ib290bm9kZXMgPSBjb21tb24uYm9vdHN0cmFwTm9kZXMoKVxuICAgIHJscHguY2FwYWJpbGl0aWVzID0gW0VUSC5ldGg2MiwgRVRILmV0aDYzXVxuICAgIHJscHgubGlzdGVuUG9ydCA9IHBlZXJJbmZvLnRjcFBvcnQgfHwgMzAzMDNcbiAgICByZXR1cm4gcmxweFxuICB9XG5cbiAgQHJlZ2lzdGVyKClcbiAgc3RhdGljIGNyZWF0ZURQVCAob3B0aW9uczogRFBUT3B0aW9ucyk6IERQVCB7XG4gICAgb3B0aW9ucy5lbmRwb2ludCA9IG9wdGlvbnMuZW5kcG9pbnQgfHwge1xuICAgICAgYWRkcmVzczogJzAuMC4wLjAnLFxuICAgICAgdWRwUG9ydDogbnVsbCxcbiAgICAgIHRjcFBvcnQ6IG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERQVChvcHRpb25zLmtleSwgb3B0aW9ucylcbiAgfVxuXG4gIEByZWdpc3RlcigpXG4gIGNyZWF0ZVJMUHggKG9wdGlvbnM6IFJMUHhOb2RlT3B0aW9ucyk6IFJMUHgge1xuICAgIHJldHVybiBuZXcgUkxQeChvcHRpb25zLmtleSwgb3B0aW9ucylcbiAgfVxufVxuIl19