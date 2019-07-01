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
            return this.node.hangUp(peer);
        });
    }
};
Libp2pDialer = __decorate([
    opium_decorators_1.register(),
    __param(1, opium_decorators_1.register('options')),
    __metadata("design:paramtypes", [libp2p_1.default, Object])
], Libp2pDialer);
exports.Libp2pDialer = Libp2pDialer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLWRpYWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvc3RhY2tzL2xpYnAycC9saWJwMnAtZGlhbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUF1QjtBQUN2QixvREFBMkI7QUFDM0Isa0RBQXlCO0FBRXpCLG9EQUEyQjtBQUMzQix1REFBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsZUFBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7QUFFdEQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFBO0FBQ2hDLE1BQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUEsQ0FBQyxlQUFlO0FBRTFDOzs7Ozs7R0FNRztBQUVILElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQWEsU0FBUSxnQkFBRTtJQVNsQyxZQUFvQixJQUFZLEVBRW5CLE9BQVk7UUFDdkIsS0FBSyxFQUFFLENBQUE7UUFIVyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBSmhDLFdBQU0sR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUV4QyxhQUFRLEdBQVcsUUFBUSxDQUFBO1FBQzNCLGFBQVEsR0FBVyxTQUFTLENBQUE7UUFNMUIsZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFB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QUN2QixHQUFHLENBQUMsUUFBUSxFQUFFLHdCQUF3QixDQUFDLENBQUE7Z0JBQ3ZDLE9BQU07YUFDUDtZQUVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtZQUNmLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUMxQixJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTtnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7YUFDbkM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDVDtvQkFBUztnQkFDUixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTthQUN4QjtZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFFLElBQWM7O1lBQzFCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDL0IsQ0FBQztLQUFBO0NBQ0YsQ0FBQTtBQWhHWSxZQUFZO0lBRHhCLDJCQUFRLEVBQUU7SUFXSyxXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7cUNBRFAsZ0JBQU07R0FUckIsWUFBWSxDQWdHeEI7QUFoR1ksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEVFIGZyb20gJ2V2ZW50cydcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IFBlZXJJbmZvIGZyb20gJ3BlZXItaW5mbydcbmltcG9ydCBMaWJwMnAgZnJvbSAnbGlicDJwJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygna2l0c3VuZXQ6bmV0OmxpYnAycDpsaWJwMnAtZGlhbGVyJylcblxuY29uc3QgTUFYX1BFRVJTID0gMjVcbmNvbnN0IE1BWF9QRUVSU19ESVNDT1ZFUkVEID0gMjUwXG5jb25zdCBJTlRFUlZBTCA9IDYwICogMTAwMCAvLyBldmVyeSBtaW51dGVcblxuLyoqXG4gKiBBIGRpYWxlciBtb2R1bGUgdGhhdCBoYW5kbGVzIGFtYmllbnRcbiAqIG5vZGUgZGlzY292ZXJ5IGFuZCBzdWNoLlxuICpcbiAqIEZJWE1FOiBUaGlzIGlzIGhlcmUgYWxzbyB0byBtaXRpZ2F0ZSB2YXJpb3VzXG4gKiBpc3N1ZXMgd2l0aCBjb25jdXJyZW50IGRpYWxpbmcgaW4gbGlicDJwXG4gKi9cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgTGlicDJwRGlhbGVyIGV4dGVuZHMgRUUge1xuICBpbnRlcnZhbFRpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGxcbiAgY29ubmVjdGVkOiBNYXA8c3RyaW5nLCBQZWVySW5mbz5cbiAgZGlzY292ZXJlZDogTWFwPHN0cmluZywgUGVlckluZm8+XG4gIGRpYWxpbmc6IE1hcDxzdHJpbmcsIGJvb2xlYW4+XG4gIGJhbm5lZDogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwKClcblxuICBpbnRlcnZhbDogbnVtYmVyID0gSU5URVJWQUxcbiAgbWF4UGVlcnM6IG51bWJlciA9IE1BWF9QRUVSU1xuICBjb25zdHJ1Y3RvciAocHVibGljIG5vZGU6IExpYnAycCxcbiAgICAgICAgICAgICAgIEByZWdpc3Rlcignb3B0aW9ucycpXG4gICAgICAgICAgICAgICBvcHRpb25zOiBhbnkpIHtcbiAgICBzdXBlcigpXG5cbiAgICBhc3NlcnQobm9kZSwgJ25vZGUgaXMgcmVxdWlyZWQnKVxuICAgIHRoaXMuaW50ZXJ2YWxUaW1lciA9IG51bGxcbiAgICB0aGlzLmNvbm5lY3RlZCA9IG5ldyBNYXAoKVxuICAgIHRoaXMuZGlzY292ZXJlZCA9IG5ldyBNYXAoKVxuICAgIHRoaXMuZGlhbGluZyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuaW50ZXJ2YWwgPSBvcHRpb25zLmludGVydmFsIHx8IHRoaXMuaW50ZXJ2YWxcbiAgICB0aGlzLm1heFBlZXJzID0gb3B0aW9ucy5tYXhQZWVycyB8fCB0aGlzLm1heFBlZXJzXG5cbiAgICAvLyBzdG9yZSBkaXNjb3ZlcmVkIHBlZXJzIHRvIGRpYWwgdGhlbSBsYXRlclxuICAgIG5vZGUub24oJ3BlZXI6ZGlzY292ZXJ5JywgKHBlZXJJbmZvOiBQZWVySW5mbykgPT4ge1xuICAgICAgY29uc3QgaWQgPSBwZWVySW5mby5pZC50b0I1OFN0cmluZygpXG4gICAgICBpZiAodGhpcy5kaXNjb3ZlcmVkLnNpemUgPiBNQVhfUEVFUlNfRElTQ09WRVJFRCB8fCB0aGlzLmJhbm5lZC5oYXMoaWQpKSByZXR1cm5cbiAgICAgIHRoaXMuZGlzY292ZXJlZC5zZXQoaWQsIHBlZXJJbmZvKVxuICAgICAgbG9nKGBwZWVyIGRpc2NvdmVyZWQgJHtpZH1gKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBzdGFydCAoKSB7XG4gICAgYXdhaXQgdGhpcy50cnlDb25uZWN0KClcbiAgICB0aGlzLmludGVydmFsVGltZXIgPSBzZXRJbnRlcnZhbCh0aGlzLnRyeUNvbm5lY3QuYmluZCh0aGlzKSwgdGhpcy5pbnRlcnZhbClcbiAgfVxuXG4gIGFzeW5jIHN0b3AgKCkge1xuICAgIGlmICh0aGlzLmludGVydmFsVGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbFRpbWVyKVxuICAgIH1cbiAgfVxuXG4gIGdldCBiNThJZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYjU4SWRcbiAgfVxuXG4gIGJhblBlZXIgKHBlZXJJbmZvOiBQZWVySW5mbywgbWF4QWdlOiBudW1iZXIgPSA2MCAqIDEwMDApIHtcbiAgICBjb25zdCBpZCA9IHBlZXJJbmZvLmlkLnRvQjU4U3RyaW5nKClcbiAgICB0aGlzLmJhbm5lZC5zZXQoaWQsIHRydWUpXG4gICAgdGhpcy5jb25uZWN0ZWQuZGVsZXRlKGlkKVxuICAgIHRoaXMuZGlzY292ZXJlZC5kZWxldGUoaWQpXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmJhbm5lZC5kZWxldGUocGVlckluZm8uaWQudG9CNThTdHJpbmcoKSlcbiAgICB9LCBtYXhBZ2UpXG4gIH1cblxuICBhc3luYyB0cnlDb25uZWN0ICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWQuc2l6ZSA8PSB0aGlzLm1heFBlZXJzKSB7XG4gICAgICBpZiAodGhpcy5kaXNjb3ZlcmVkLnNpemUgPiAwKSB7XG4gICAgICAgIGNvbnN0IFtpZCwgcGVlcl0gPSB0aGlzLmRpc2NvdmVyZWQuZW50cmllcygpLm5leHQoKS52YWx1ZVxuICAgICAgICB0aGlzLmRpc2NvdmVyZWQuZGVsZXRlKGlkKVxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsKHBlZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlhbCAocGVlckluZm86IFBlZXJJbmZvLCBwcm90b2NvbD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgaWQgPSBwZWVySW5mby5pZC50b0I1OFN0cmluZygpXG4gICAgaWYgKHRoaXMuZGlhbGluZy5oYXMoaWQpKSB7XG4gICAgICBsb2coYGRpYWwgYWxyZWFkeSBpbiBwcm9ncmVzcyBmb3IgJHtpZH1gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYmFubmVkLmhhcyhpZCkpIHtcbiAgICAgIGxvZyhgcGVlciAke2lkfSBiYW5uZWQsIHNraXBwaW5nIGRpYWxgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IGNvbm4gPSBudWxsXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGlhbGluZy5zZXQoaWQsIHRydWUpXG4gICAgICBjb25uID0gYXdhaXQgdGhpcy5ub2RlLmRpYWxQcm90b2NvbChwZWVySW5mbywgcHJvdG9jb2wpXG4gICAgICB0aGlzLmNvbm5lY3RlZC5zZXQoaWQsIHBlZXJJbmZvKVxuICAgICAgdGhpcy5lbWl0KCdwZWVyOmRpYWxlZCcsIHBlZXJJbmZvKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nKGVycilcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5kaWFsaW5nLmRlbGV0ZShpZClcbiAgICB9XG5cbiAgICByZXR1cm4gY29ublxuICB9XG5cbiAgYXN5bmMgaGFuZ3VwIChwZWVyOiBQZWVySW5mbykge1xuICAgIHJldHVybiB0aGlzLm5vZGUuaGFuZ1VwKHBlZXIpXG4gIH1cbn1cbiJdfQ==