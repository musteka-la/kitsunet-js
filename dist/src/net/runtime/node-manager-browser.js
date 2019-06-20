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
Object.defineProperty(exports, "__esModule", { value: true });
const opium_decorators_1 = require("opium-decorators");
const events_1 = require("events");
const libp2p_1 = require("../stacks/libp2p");
const protocols_1 = require("../protocols");
/**
 * A node manager to start/stop nodes as well
 * as subscribed to discovery events
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:disconnected - fires when a peer disconnects
 */
let NodeManager = class NodeManager extends events_1.EventEmitter {
    constructor(nodes) {
        super();
        this.connectedHandler = (...args) => this.emit('kitsunet:peer:connected', ...args);
        this.disconnectedHandler = (...args) => this.emit('kitsunet:peer:disconnected', ...args);
        this.nodes = [];
        this.nodes = nodes;
    }
    static createNodes(libp2pNode) {
        return [libp2pNode];
    }
    /**
     * Create a protocol registry
     */
    static protocolRegistry() {
        return [{
                constructor: protocols_1.KsnProtocol,
                cap: {
                    id: 'ksn',
                    versions: ['1.0.0']
                }
            }, {
                constructor: protocols_1.EthProtocol,
                cap: {
                    id: 'eth',
                    versions: ['62', '63']
                }
            }];
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const node of this.nodes) {
                node.on('kitsunet:peer:connected', this.connectedHandler);
                node.on('kitsunet:peer:disconnected', this.disconnectedHandler);
                yield node.start();
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const node of this.nodes) {
                node.off('kitsunet:peer:connected', this.connectedHandler);
                node.off('kitsunet:peer:disconnected', this.disconnectedHandler);
                yield node.stop();
            }
        });
    }
};
__decorate([
    opium_decorators_1.register('nodes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [libp2p_1.Libp2pNode]),
    __metadata("design:returntype", Array)
], NodeManager, "createNodes", null);
__decorate([
    opium_decorators_1.register('protocol-registry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NodeManager, "protocolRegistry", null);
NodeManager = __decorate([
    opium_decorators_1.register('node-manager'),
    __param(0, opium_decorators_1.register('nodes')),
    __metadata("design:paramtypes", [Array])
], NodeManager);
exports.NodeManager = NodeManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1tYW5hZ2VyLWJyb3dzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbmV0L3J1bnRpbWUvbm9kZS1tYW5hZ2VyLWJyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR1osdURBQTJDO0FBQzNDLG1DQUFxQztBQUVyQyw2Q0FBNkM7QUFDN0MsNENBQXVEO0FBRXZEOzs7Ozs7R0FNRztBQUVILElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQTRDLFNBQVEscUJBQVk7SUFpQzNFLFlBQWdDLEtBQWdCO1FBQzlDLEtBQUssRUFBRSxDQUFBO1FBUkQscUJBQWdCLEdBQUcsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQTtRQUV2Qyx3QkFBbUIsR0FBRyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUUsQ0FDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFBO1FBRWxELFVBQUssR0FBYyxFQUFFLENBQUE7UUFHbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQWxDRCxNQUFNLENBQUMsV0FBVyxDQUF1QixVQUFzQjtRQUM3RCxPQUFPLENBQUMsVUFBVSxDQUF5QixDQUFBO0lBQzdDLENBQUM7SUFFRDs7T0FFRztJQUVILE1BQU0sQ0FBQyxnQkFBZ0I7UUFDckIsT0FBTyxDQUFDO2dCQUNOLFdBQVcsRUFBRSx1QkFBVztnQkFDeEIsR0FBRyxFQUFFO29CQUNILEVBQUUsRUFBRSxLQUFLO29CQUNULFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDcEI7YUFDRixFQUFFO2dCQUNELFdBQVcsRUFBRSx1QkFBVztnQkFDeEIsR0FBRyxFQUFFO29CQUNILEVBQUUsRUFBRSxLQUFLO29CQUNULFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7aUJBQ3ZCO2FBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQWNLLEtBQUs7O1lBQ1QsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM3QixJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUN6RCxJQUFJLENBQUMsRUFBRSxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUMvRCxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTthQUNuQjtRQUNILENBQUM7S0FBQTtJQUVLLElBQUk7O1lBQ1IsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUNoRSxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNsQjtRQUNILENBQUM7S0FBQTtDQUNGLENBQUE7QUFuREM7SUFEQywyQkFBUSxDQUFDLE9BQU8sQ0FBQzs7cUNBQ21DLG1CQUFVOztvQ0FFOUQ7QUFNRDtJQURDLDJCQUFRLENBQUMsbUJBQW1CLENBQUM7Ozs7eUNBZTdCO0FBeEJVLFdBQVc7SUFEdkIsMkJBQVEsQ0FBQyxjQUFjLENBQUM7SUFrQ1QsV0FBQSwyQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBOztHQWpDcEIsV0FBVyxDQXFEdkI7QUFyRFksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uL25vZGUnXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBJUGVlckRlc2NyaXB0b3IgfSBmcm9tICcuLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgTGlicDJwTm9kZSB9IGZyb20gJy4uL3N0YWNrcy9saWJwMnAnXG5pbXBvcnQgeyBLc25Qcm90b2NvbCwgRXRoUHJvdG9jb2wgfSBmcm9tICcuLi9wcm90b2NvbHMnXG5cbi8qKlxuICogQSBub2RlIG1hbmFnZXIgdG8gc3RhcnQvc3RvcCBub2RlcyBhcyB3ZWxsXG4gKiBhcyBzdWJzY3JpYmVkIHRvIGRpc2NvdmVyeSBldmVudHNcbiAqXG4gKiBAZmlyZXMgTm9kZU1hbmFnZXIja2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQgLSBmaXJlcyBvbiBuZXcgY29ubmVjdGVkIHBlZXJcbiAqIEBmaXJlcyBOb2RlTWFuYWdlciNraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCAtIGZpcmVzIHdoZW4gYSBwZWVyIGRpc2Nvbm5lY3RzXG4gKi9cbkByZWdpc3Rlcignbm9kZS1tYW5hZ2VyJylcbmV4cG9ydCBjbGFzcyBOb2RlTWFuYWdlcjxUIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgQHJlZ2lzdGVyKCdub2RlcycpXG4gIHN0YXRpYyBjcmVhdGVOb2RlczxVIGV4dGVuZHMgTm9kZTxhbnk+PiAobGlicDJwTm9kZTogTGlicDJwTm9kZSk6IE5vZGU8VT5bXSB7XG4gICAgcmV0dXJuIFtsaWJwMnBOb2RlXSBhcyB1bmtub3duIGFzIE5vZGU8VT5bXVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHByb3RvY29sIHJlZ2lzdHJ5XG4gICAqL1xuICBAcmVnaXN0ZXIoJ3Byb3RvY29sLXJlZ2lzdHJ5JylcbiAgc3RhdGljIHByb3RvY29sUmVnaXN0cnkgKCkge1xuICAgIHJldHVybiBbe1xuICAgICAgY29uc3RydWN0b3I6IEtzblByb3RvY29sLFxuICAgICAgY2FwOiB7XG4gICAgICAgIGlkOiAna3NuJyxcbiAgICAgICAgdmVyc2lvbnM6IFsnMS4wLjAnXVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNvbnN0cnVjdG9yOiBFdGhQcm90b2NvbCxcbiAgICAgIGNhcDoge1xuICAgICAgICBpZDogJ2V0aCcsXG4gICAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ11cbiAgICAgIH1cbiAgICB9XVxuICB9XG5cbiAgcHJpdmF0ZSBjb25uZWN0ZWRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PlxuICAgIHRoaXMuZW1pdCgna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCAuLi5hcmdzKVxuXG4gIHByaXZhdGUgZGlzY29ubmVjdGVkSGFuZGxlciA9ICguLi5hcmdzOiBhbnlbXSkgPT5cbiAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgLi4uYXJncylcblxuICBub2RlczogTm9kZTxUPltdID0gW11cbiAgY29uc3RydWN0b3IgKEByZWdpc3Rlcignbm9kZXMnKSBub2RlczogTm9kZTxUPltdKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubm9kZXMgPSBub2Rlc1xuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLm5vZGVzKSB7XG4gICAgICBub2RlLm9uKCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIHRoaXMuY29ubmVjdGVkSGFuZGxlcilcbiAgICAgIG5vZGUub24oJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgdGhpcy5kaXNjb25uZWN0ZWRIYW5kbGVyKVxuICAgICAgYXdhaXQgbm9kZS5zdGFydCgpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3RvcCAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMubm9kZXMpIHtcbiAgICAgIG5vZGUub2ZmKCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIHRoaXMuY29ubmVjdGVkSGFuZGxlcilcbiAgICAgIG5vZGUub2ZmKCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIHRoaXMuZGlzY29ubmVjdGVkSGFuZGxlcilcbiAgICAgIGF3YWl0IG5vZGUuc3RvcCgpXG4gICAgfVxuICB9XG59XG4iXX0=