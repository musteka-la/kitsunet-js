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
            if (this.discovered.size > MAX_PEERS_DISCOVERED)
                return;
            this.discovered.set(peerInfo.id.toB58String(), peerInfo);
            log(`peer discovered ${peerInfo.id.toB58String()}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicDJwLWRpYWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvc3RhY2tzL2xpYnAycC9saWJwMnAtZGlhbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVaLG9EQUF1QjtBQUN2QixvREFBMkI7QUFDM0Isa0RBQXlCO0FBRXpCLG9EQUEyQjtBQUMzQix1REFBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsZUFBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7QUFFdEQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFBO0FBQ2hDLE1BQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUEsQ0FBQyxlQUFlO0FBRTFDOzs7Ozs7R0FNRztBQUVILElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQWEsU0FBUSxnQkFBRTtJQVFsQyxZQUFvQixJQUFZLEVBQ0UsT0FBWTtRQUM1QyxLQUFLLEVBQUUsQ0FBQTtRQUZXLFNBQUksR0FBSixJQUFJLENBQVE7UUFGaEMsYUFBUSxHQUFXLFFBQVEsQ0FBQTtRQUMzQixhQUFRLEdBQVcsU0FBUyxDQUFBO1FBSzFCLGdCQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUE7UUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDakQsSUFBSSxDQUFDLFFBQVEs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LENBQUM7S0FBQTtDQUNGLENBQUE7QUE5RVksWUFBWTtJQUR4QiwyQkFBUSxFQUFFO0lBVUssV0FBQSwyQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO3FDQURQLGdCQUFNO0dBUnJCLFlBQVksQ0E4RXhCO0FBOUVZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBFRSBmcm9tICdldmVudHMnXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBQZWVySW5mbyBmcm9tICdwZWVyLWluZm8nXG5pbXBvcnQgTGlicDJwIGZyb20gJ2xpYnAycCdcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuY29uc3QgbG9nID0gZGVidWcoJ2tpdHN1bmV0Om5ldDpsaWJwMnA6bGlicDJwLWRpYWxlcicpXG5cbmNvbnN0IE1BWF9QRUVSUyA9IDI1XG5jb25zdCBNQVhfUEVFUlNfRElTQ09WRVJFRCA9IDI1MFxuY29uc3QgSU5URVJWQUwgPSA2MCAqIDEwMDAgLy8gZXZlcnkgbWludXRlXG5cbi8qKlxuICogQSBkaWFsZXIgbW9kdWxlIHRoYXQgaGFuZGxlcyBhbWJpZW50XG4gKiBub2RlIGRpc2NvdmVyeSBhbmQgc3VjaC5cbiAqXG4gKiBGSVhNRTogVGhpcyBpcyBoZXJlIGFsc28gdG8gbWl0aWdhdGUgdmFyaW91c1xuICogaXNzdWVzIHdpdGggY29uY3VycmVudCBkaWFsaW5nIGluIGxpYnAycFxuICovXG5AcmVnaXN0ZXIoKVxuZXhwb3J0IGNsYXNzIExpYnAycERpYWxlciBleHRlbmRzIEVFIHtcbiAgaW50ZXJ2YWxUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCBudWxsXG4gIGNvbm5lY3RlZDogTWFwPHN0cmluZywgUGVlckluZm8+XG4gIGRpc2NvdmVyZWQ6IE1hcDxzdHJpbmcsIFBlZXJJbmZvPlxuICBkaWFsaW5nOiBNYXA8c3RyaW5nLCBib29sZWFuPlxuXG4gIGludGVydmFsOiBudW1iZXIgPSBJTlRFUlZBTFxuICBtYXhQZWVyczogbnVtYmVyID0gTUFYX1BFRVJTXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgbm9kZTogTGlicDJwLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55KSB7XG4gICAgc3VwZXIoKVxuXG4gICAgYXNzZXJ0KG5vZGUsICdub2RlIGlzIHJlcXVpcmVkJylcbiAgICB0aGlzLmludGVydmFsVGltZXIgPSBudWxsXG4gICAgdGhpcy5jb25uZWN0ZWQgPSBuZXcgTWFwKClcbiAgICB0aGlzLmRpc2NvdmVyZWQgPSBuZXcgTWFwKClcbiAgICB0aGlzLmRpYWxpbmcgPSBuZXcgTWFwKClcbiAgICB0aGlzLmludGVydmFsID0gb3B0aW9ucy5pbnRlcnZhbCB8fCB0aGlzLmludGVydmFsXG4gICAgdGhpcy5tYXhQZWVycyA9IG9wdGlvbnMubWF4UGVlcnMgfHwgdGhpcy5tYXhQZWVyc1xuXG4gICAgLy8gc3RvcmUgZGlzY292ZXJlZCBwZWVycyB0byBkaWFsIHRoZW0gbGF0ZXJcbiAgICBub2RlLm9uKCdwZWVyOmRpc2NvdmVyeScsIChwZWVySW5mbzogUGVlckluZm8pID0+IHtcbiAgICAgIGlmICh0aGlzLmRpc2NvdmVyZWQuc2l6ZSA+IE1BWF9QRUVSU19ESVNDT1ZFUkVEKSByZXR1cm5cbiAgICAgIHRoaXMuZGlzY292ZXJlZC5zZXQocGVlckluZm8uaWQudG9CNThTdHJpbmcoKSwgcGVlckluZm8pXG4gICAgICBsb2coYHBlZXIgZGlzY292ZXJlZCAke3BlZXJJbmZvLmlkLnRvQjU4U3RyaW5nKCl9YClcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCkge1xuICAgIGF3YWl0IHRoaXMudHJ5Q29ubmVjdCgpXG4gICAgdGhpcy5pbnRlcnZhbFRpbWVyID0gc2V0SW50ZXJ2YWwodGhpcy50cnlDb25uZWN0LmJpbmQodGhpcyksIHRoaXMuaW50ZXJ2YWwpXG4gIH1cblxuICBhc3luYyBzdG9wICgpIHtcbiAgICBpZiAodGhpcy5pbnRlcnZhbFRpbWVyKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxUaW1lcilcbiAgICB9XG4gIH1cblxuICBnZXQgYjU4SWQgKCkge1xuICAgIHJldHVybiB0aGlzLmI1OElkXG4gIH1cblxuICBhc3luYyB0cnlDb25uZWN0ICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWQuc2l6ZSA8PSB0aGlzLm1heFBlZXJzKSB7XG4gICAgICBpZiAodGhpcy5kaXNjb3ZlcmVkLnNpemUgPiAwKSB7XG4gICAgICAgIGNvbnN0IFtpZCwgcGVlcl0gPSB0aGlzLmRpc2NvdmVyZWQuZW50cmllcygpLm5leHQoKS52YWx1ZVxuICAgICAgICB0aGlzLmRpc2NvdmVyZWQuZGVsZXRlKGlkKVxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsKHBlZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlhbCAocGVlckluZm86IFBlZXJJbmZvLCBwcm90b2NvbD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgaWQgPSBwZWVySW5mby5pZC50b0I1OFN0cmluZygpXG4gICAgaWYgKHRoaXMuZGlhbGluZy5oYXMoaWQpKSB7XG4gICAgICBsb2coYGRpYWwgYWxyZWFkeSBpbiBwcm9ncmVzcyBmb3IgJHtpZH1gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IGNvbm4gPSBudWxsXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGlhbGluZy5zZXQoaWQsIHRydWUpXG4gICAgICBjb25uID0gYXdhaXQgdGhpcy5ub2RlLmRpYWxQcm90b2NvbChwZWVySW5mbywgcHJvdG9jb2wpXG4gICAgICB0aGlzLmNvbm5lY3RlZC5zZXQoaWQsIHBlZXJJbmZvKVxuICAgICAgdGhpcy5lbWl0KCdwZWVyOmRpYWxlZCcsIHBlZXJJbmZvKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nKGVycilcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5kaWFsaW5nLmRlbGV0ZShpZClcbiAgICB9XG5cbiAgICByZXR1cm4gY29ublxuICB9XG5cbiAgYXN5bmMgaGFuZ3VwIChwZWVyOiBQZWVySW5mbykge1xuICAgIHJldHVybiB0aGlzLm5vZGUuaGFuZ1VwKHRoaXMubm9kZSwgcGVlcilcbiAgfVxufVxuIl19