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
const events_1 = __importDefault(require("events"));
const assert_1 = __importDefault(require("assert"));
const debug_1 = __importDefault(require("debug"));
const libp2p_1 = __importDefault(require("libp2p"));
const opium_decorators_1 = require("opium-decorators");
const log = debug_1.default('kitsunet:net:libp2p:libp2p-dialer');
const MAX_PEERS = 25;
const MAX_PEERS_DISCOVERED = 250;
const INTERVAL = 60 * 1000; // every minute
/**
 * A dialer module that handles ambient
 * node discovery and such.
 *
 * FIXME: This is here also to mitigate various
 * issues with concurrent dialing in libp2p
 */
let Libp2pDialer = class Libp2pDialer extends events_1.default {
    constructor(node, options) {
        super();
        this.node = node;
        this.banned = new Map();
        this.interval = INTERVAL;
        this.maxPeers = MAX_PEERS;
        assert_1.default(node, 'node is required');
        this.intervalTimer = null;
        this.connected = new Map();
        this.discovered = new Map();
        this.dialing = new Map();
        this.interval = options.interval || this.interval;
        this.maxPeers = options.maxPeers || this.maxPeers;
        // store discovered peers to dial them later
        node.on('peer:discovery', (peerInfo) => {
            const id = peerInfo.id.toB58String();
            if (this.discovered.size > MAX_PEERS_DISCOVERED || this.banned.has(id))
                return;
            this.discovered.set(id, peerInfo);
            log(`peer discovered ${id}`);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tryConnect();
            this.intervalTimer = setInterval(this.tryConnect.bind(this), this.interval);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.intervalTimer) {
                clearInterval(this.intervalTimer);
            }
        });
    }
    get b58Id() {
        return this.b58Id;
    }
    banPeer(peerInfo, maxAge = 60 * 1000) {
        const id = peerInfo.id.toB58String();
        this.banned.set(id, true);
        this.connected.delete(id);
        this.discovered.delete(id);
        setTimeout(() => {
            this.banned.delete(peerInfo.id.toB58String());
        }, maxAge);
    }
    tryConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected.size <= this.maxPeers) {
                if (this.discovered.size > 0) {
                    const [id, peer] = this.discovered.entries().next().value;
                    this.discovered.delete(id);
                    return this.dial(peer);
                }
            }
        });
    }
    dial(peerInfo, protocol) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = peerInfo.id.toB58String();
            if (this.dialing.has(id)) {
                log(`dial already in progress for ${id}`);
                return;
            }
            if (this.banned.has(id)) {
                log(`peer ${id} banned, skipping dial`);
                return;
            }
            let conn = null;
            try {
                this.dialing.set(id, true);
                conn = yield this.node.dialProtocol(peerInfo, protocol);
                this.connected.set(id, peerInfo);
                this.emit('peer:dialed', peerInfo);
            }
            catch (err) {
                log(err);
            }
            finally {
                this.dialing.delete(id);
            }
            return conn;
        });
    }
    hangup(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.node.hangUp(this.node, peer);
        });
    }
};
Libp2pDialer = __decorate([
    opium_decorators_1.register(),
    __param(1, opium_decorators_1.register('options')),
    __metadata("design:paramtypes", [libp2p_1.default, Object])
], Libp2pDialer);
exports.Libp2pDialer = Libp2pDialer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLWRpYWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvc3RhY2tzL2xpYnAycC9saWJwMnAtZGlhbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUF1QjtBQUN2QixvREFBMkI7QUFDM0Isa0RBQXlCO0FBRXpCLG9EQUEyQjtBQUMzQix1REFBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsZUFBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7QUFFdEQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFBO0FBQ2hDLE1BQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUEsQ0FBQyxlQUFlO0FBRTFDOzs7Ozs7R0FNRztBQUVILElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQWEsU0FBUSxnQkFBRTtJQVNsQyxZQUFvQixJQUFZLEVBRW5CLE9BQVk7UUFDdkIsS0FBSyxFQUFFLENBQUE7UUFIVyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBSmhDLFdBQU0sR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUV4QyxhQUFRLEdBQVcsUUFBUSxDQUFBO1FBQzNCLGFBQVEsR0FBVyxTQUFTLENBQUE7UUFNMUIsZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFB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QUN2QixHQUFHLENBQUMsUUFBUSxFQUFFLHdCQUF3QixDQUFDLENBQUE7Z0JBQ3ZDLE9BQU07YUFDUDtZQUVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtZQUNmLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUMxQixJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTtnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7YUFDbkM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDVDtvQkFBUztnQkFDUixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTthQUN4QjtZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFFLElBQWM7O1lBQzFCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUMxQyxDQUFDO0tBQUE7Q0FDRixDQUFBO0FBaEdZLFlBQVk7SUFEeEIsMkJBQVEsRUFBRTtJQVdLLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtxQ0FEUCxnQkFBTTtHQVRyQixZQUFZLENBZ0d4QjtBQWhHWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRUUgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgUGVlckluZm8gZnJvbSAncGVlci1pbmZvJ1xuaW1wb3J0IExpYnAycCBmcm9tICdsaWJwMnAnXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdraXRzdW5ldDpuZXQ6bGlicDJwOmxpYnAycC1kaWFsZXInKVxuXG5jb25zdCBNQVhfUEVFUlMgPSAyNVxuY29uc3QgTUFYX1BFRVJTX0RJU0NPVkVSRUQgPSAyNTBcbmNvbnN0IElOVEVSVkFMID0gNjAgKiAxMDAwIC8vIGV2ZXJ5IG1pbnV0ZVxuXG4vKipcbiAqIEEgZGlhbGVyIG1vZHVsZSB0aGF0IGhhbmRsZXMgYW1iaWVudFxuICogbm9kZSBkaXNjb3ZlcnkgYW5kIHN1Y2guXG4gKlxuICogRklYTUU6IFRoaXMgaXMgaGVyZSBhbHNvIHRvIG1pdGlnYXRlIHZhcmlvdXNcbiAqIGlzc3VlcyB3aXRoIGNvbmN1cnJlbnQgZGlhbGluZyBpbiBsaWJwMnBcbiAqL1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBMaWJwMnBEaWFsZXIgZXh0ZW5kcyBFRSB7XG4gIGludGVydmFsVGltZXI6IE5vZGVKUy5UaW1lb3V0IHwgbnVsbFxuICBjb25uZWN0ZWQ6IE1hcDxzdHJpbmcsIFBlZXJJbmZvPlxuICBkaXNjb3ZlcmVkOiBNYXA8c3RyaW5nLCBQZWVySW5mbz5cbiAgZGlhbGluZzogTWFwPHN0cmluZywgYm9vbGVhbj5cbiAgYmFubmVkOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoKVxuXG4gIGludGVydmFsOiBudW1iZXIgPSBJTlRFUlZBTFxuICBtYXhQZWVyczogbnVtYmVyID0gTUFYX1BFRVJTXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgbm9kZTogTGlicDJwLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdvcHRpb25zJylcbiAgICAgICAgICAgICAgIG9wdGlvbnM6IGFueSkge1xuICAgIHN1cGVyKClcblxuICAgIGFzc2VydChub2RlLCAnbm9kZSBpcyByZXF1aXJlZCcpXG4gICAgdGhpcy5pbnRlcnZhbFRpbWVyID0gbnVsbFxuICAgIHRoaXMuY29ubmVjdGVkID0gbmV3IE1hcCgpXG4gICAgdGhpcy5kaXNjb3ZlcmVkID0gbmV3IE1hcCgpXG4gICAgdGhpcy5kaWFsaW5nID0gbmV3IE1hcCgpXG4gICAgdGhpcy5pbnRlcnZhbCA9IG9wdGlvbnMuaW50ZXJ2YWwgfHwgdGhpcy5pbnRlcnZhbFxuICAgIHRoaXMubWF4UGVlcnMgPSBvcHRpb25zLm1heFBlZXJzIHx8IHRoaXMubWF4UGVlcnNcblxuICAgIC8vIHN0b3JlIGRpc2NvdmVyZWQgcGVlcnMgdG8gZGlhbCB0aGVtIGxhdGVyXG4gICAgbm9kZS5vbigncGVlcjpkaXNjb3ZlcnknLCAocGVlckluZm86IFBlZXJJbmZvKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHBlZXJJbmZvLmlkLnRvQjU4U3RyaW5nKClcbiAgICAgIGlmICh0aGlzLmRpc2NvdmVyZWQuc2l6ZSA+IE1BWF9QRUVSU19ESVNDT1ZFUkVEIHx8IHRoaXMuYmFubmVkLmhhcyhpZCkpIHJldHVyblxuICAgICAgdGhpcy5kaXNjb3ZlcmVkLnNldChpZCwgcGVlckluZm8pXG4gICAgICBsb2coYHBlZXIgZGlzY292ZXJlZCAke2lkfWApXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICBhd2FpdCB0aGlzLnRyeUNvbm5lY3QoKVxuICAgIHRoaXMuaW50ZXJ2YWxUaW1lciA9IHNldEludGVydmFsKHRoaXMudHJ5Q29ubmVjdC5iaW5kKHRoaXMpLCB0aGlzLmludGVydmFsKVxuICB9XG5cbiAgYXN5bmMgc3RvcCAoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJ2YWxUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsVGltZXIpXG4gICAgfVxuICB9XG5cbiAgZ2V0IGI1OElkICgpIHtcbiAgICByZXR1cm4gdGhpcy5iNThJZFxuICB9XG5cbiAgYmFuUGVlciAocGVlckluZm86IFBlZXJJbmZvLCBtYXhBZ2U6IG51bWJlciA9IDYwICogMTAwMCkge1xuICAgIGNvbnN0IGlkID0gcGVlckluZm8uaWQudG9CNThTdHJpbmcoKVxuICAgIHRoaXMuYmFubmVkLnNldChpZCwgdHJ1ZSlcbiAgICB0aGlzLmNvbm5lY3RlZC5kZWxldGUoaWQpXG4gICAgdGhpcy5kaXNjb3ZlcmVkLmRlbGV0ZShpZClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuYmFubmVkLmRlbGV0ZShwZWVySW5mby5pZC50b0I1OFN0cmluZygpKVxuICAgIH0sIG1heEFnZSlcbiAgfVxuXG4gIGFzeW5jIHRyeUNvbm5lY3QgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZC5zaXplIDw9IHRoaXMubWF4UGVlcnMpIHtcbiAgICAgIGlmICh0aGlzLmRpc2NvdmVyZWQuc2l6ZSA+IDApIHtcbiAgICAgICAgY29uc3QgW2lkLCBwZWVyXSA9IHRoaXMuZGlzY292ZXJlZC5lbnRyaWVzKCkubmV4dCgpLnZhbHVlXG4gICAgICAgIHRoaXMuZGlzY292ZXJlZC5kZWxldGUoaWQpXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWwocGVlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBkaWFsIChwZWVySW5mbzogUGVlckluZm8sIHByb3RvY29sPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBpZCA9IHBlZXJJbmZvLmlkLnRvQjU4U3RyaW5nKClcbiAgICBpZiAodGhpcy5kaWFsaW5nLmhhcyhpZCkpIHtcbiAgICAgIGxvZyhgZGlhbCBhbHJlYWR5IGluIHByb2dyZXNzIGZvciAke2lkfWApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5iYW5uZWQuaGFzKGlkKSkge1xuICAgICAgbG9nKGBwZWVyICR7aWR9IGJhbm5lZCwgc2tpcHBpbmcgZGlhbGApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgY29ubiA9IG51bGxcbiAgICB0cnkge1xuICAgICAgdGhpcy5kaWFsaW5nLnNldChpZCwgdHJ1ZSlcbiAgICAgIGNvbm4gPSBhd2FpdCB0aGlzLm5vZGUuZGlhbFByb3RvY29sKHBlZXJJbmZvLCBwcm90b2NvbClcbiAgICAgIHRoaXMuY29ubmVjdGVkLnNldChpZCwgcGVlckluZm8pXG4gICAgICB0aGlzLmVtaXQoJ3BlZXI6ZGlhbGVkJywgcGVlckluZm8pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsb2coZXJyKVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmRpYWxpbmcuZGVsZXRlKGlkKVxuICAgIH1cblxuICAgIHJldHVybiBjb25uXG4gIH1cblxuICBhc3luYyBoYW5ndXAgKHBlZXI6IFBlZXJJbmZvKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZS5oYW5nVXAodGhpcy5ub2RlLCBwZWVyKVxuICB9XG59XG4iXX0=