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
const libp2p_1 = require("./stacks/libp2p");
const devp2p_1 = require("./stacks/devp2p");
const protocols_1 = require("./protocols");
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
    static createNodes(libp2pNode, devp2pNode, options) {
        const stacks = [];
        if (options.stacks.indexOf('libp2p') > -1)
            stacks.push(libp2pNode);
        if (options.stacks.indexOf('devp2p') > -1)
            stacks.push(devp2pNode);
        return stacks;
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
    __param(2, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [libp2p_1.Libp2pNode,
        devp2p_1.Devp2pNode, Object]),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25ldC9ub2RlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR1osdURBQTJDO0FBQzNDLG1DQUFxQztBQUVyQyw0Q0FBNEM7QUFDNUMsNENBQTRDO0FBRTVDLDJDQUlvQjtBQUVwQjs7Ozs7O0dBTUc7QUFFSCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUE0QyxTQUFRLHFCQUFZO0lBdUMzRSxZQUFnQyxLQUFnQjtRQUM5QyxLQUFLLEVBQUUsQ0FBQTtRQVJELHFCQUFnQixHQUFHLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFFdkMsd0JBQW1CLEdBQUcsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQTtRQUVsRCxVQUFLLEdBQWMsRUFBRSxDQUFBO1FBR25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0lBQ3BCLENBQUM7SUF4Q0QsTUFBTSxDQUFDLFdBQVcsQ0FBdUIsVUFBc0IsRUFDdEIsVUFBc0IsRUFFdEIsT0FBWTtRQUNuRCxNQUFNLE1BQU0sR0FBZ0IsRUFBRSxDQUFBO1FBQzlCLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNsRSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbEUsT0FBTyxNQUE4QixDQUFBO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUVILE1BQU0sQ0FBQyxnQkFBZ0I7UUFDckIsT0FBTyxDQUFDO2dCQUNOLFdBQVcsRUFBRSx1QkFBVztnQkFDeEIsR0FBRyxFQUFFO29CQUNILEVBQUUsRUFBRSxLQUFLO29CQUNULFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDcEI7YUFDRixFQUFFO2dCQUNELFdBQVcsRUFBRSx1QkFBVztnQkFDeEIsR0FBRyxFQUFFO29CQUNILEVBQUUsRUFBRSxLQUFLO29CQUNULFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7aUJBQ3ZCO2FBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQWNLLEtBQUs7O1lBQ1QsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM3QixJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUN6RCxJQUFJLENBQUMsRUFBRSxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUMvRCxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTthQUNuQjtRQUNILENBQUM7S0FBQTtJQUVLLElBQUk7O1lBQ1IsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUNoRSxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNsQjtRQUNILENBQUM7S0FBQTtDQUNGLENBQUE7QUF6REM7SUFEQywyQkFBUSxDQUFDLE9BQU8sQ0FBQztJQUd3QixXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7O3FDQUZSLG1CQUFVO1FBQ1YsbUJBQVU7O29DQU85RDtBQU1EO0lBREMsMkJBQVEsQ0FBQyxtQkFBbUIsQ0FBQzs7Ozt5Q0FlN0I7QUE5QlUsV0FBVztJQUR2QiwyQkFBUSxDQUFDLGNBQWMsQ0FBQztJQXdDVCxXQUFBLDJCQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7O0dBdkNwQixXQUFXLENBMkR2QjtBQTNEWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi9ub2RlJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHsgSVBlZXJEZXNjcmlwdG9yLCBOZXR3b3JrVHlwZSB9IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IExpYnAycE5vZGUgfSBmcm9tICcuL3N0YWNrcy9saWJwMnAnXG5pbXBvcnQgeyBEZXZwMnBOb2RlIH0gZnJvbSAnLi9zdGFja3MvZGV2cDJwJ1xuXG5pbXBvcnQge1xuICBLc25Qcm90b2NvbCxcbiAgRXRoUHJvdG9jb2wsXG4gIE5vZGVUeXBlXG59IGZyb20gJy4vcHJvdG9jb2xzJ1xuXG4vKipcbiAqIEEgbm9kZSBtYW5hZ2VyIHRvIHN0YXJ0L3N0b3Agbm9kZXMgYXMgd2VsbFxuICogYXMgc3Vic2NyaWJlZCB0byBkaXNjb3ZlcnkgZXZlbnRzXG4gKlxuICogQGZpcmVzIE5vZGVNYW5hZ2VyI2tpdHN1bmV0OnBlZXI6Y29ubmVjdGVkIC0gZmlyZXMgb24gbmV3IGNvbm5lY3RlZCBwZWVyXG4gKiBAZmlyZXMgTm9kZU1hbmFnZXIja2l0c3VuZXQ6cGVlcjpkaXNjb25uZWN0ZWQgLSBmaXJlcyB3aGVuIGEgcGVlciBkaXNjb25uZWN0c1xuICovXG5AcmVnaXN0ZXIoJ25vZGUtbWFuYWdlcicpXG5leHBvcnQgY2xhc3MgTm9kZU1hbmFnZXI8VCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIEByZWdpc3Rlcignbm9kZXMnKVxuICBzdGF0aWMgY3JlYXRlTm9kZXM8VSBleHRlbmRzIE5vZGU8YW55Pj4gKGxpYnAycE5vZGU6IExpYnAycE5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2cDJwTm9kZTogRGV2cDJwTm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ29wdGlvbnMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGFueSk6IE5vZGU8VT5bXSB7XG4gICAgY29uc3Qgc3RhY2tzOiBOb2RlPGFueT5bXSA9IFtdXG4gICAgaWYgKG9wdGlvbnMuc3RhY2tzLmluZGV4T2YoJ2xpYnAycCcpID4gLTEpIHN0YWNrcy5wdXNoKGxpYnAycE5vZGUpXG4gICAgaWYgKG9wdGlvbnMuc3RhY2tzLmluZGV4T2YoJ2RldnAycCcpID4gLTEpIHN0YWNrcy5wdXNoKGRldnAycE5vZGUpXG4gICAgcmV0dXJuIHN0YWNrcyBhcyB1bmtub3duIGFzIE5vZGU8VT5bXVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHByb3RvY29sIHJlZ2lzdHJ5XG4gICAqL1xuICBAcmVnaXN0ZXIoJ3Byb3RvY29sLXJlZ2lzdHJ5JylcbiAgc3RhdGljIHByb3RvY29sUmVnaXN0cnkgKCkge1xuICAgIHJldHVybiBbe1xuICAgICAgY29uc3RydWN0b3I6IEtzblByb3RvY29sLFxuICAgICAgY2FwOiB7XG4gICAgICAgIGlkOiAna3NuJyxcbiAgICAgICAgdmVyc2lvbnM6IFsnMS4wLjAnXVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNvbnN0cnVjdG9yOiBFdGhQcm90b2NvbCxcbiAgICAgIGNhcDoge1xuICAgICAgICBpZDogJ2V0aCcsXG4gICAgICAgIHZlcnNpb25zOiBbJzYyJywgJzYzJ11cbiAgICAgIH1cbiAgICB9XVxuICB9XG5cbiAgcHJpdmF0ZSBjb25uZWN0ZWRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PlxuICAgIHRoaXMuZW1pdCgna2l0c3VuZXQ6cGVlcjpjb25uZWN0ZWQnLCAuLi5hcmdzKVxuXG4gIHByaXZhdGUgZGlzY29ubmVjdGVkSGFuZGxlciA9ICguLi5hcmdzOiBhbnlbXSkgPT5cbiAgICB0aGlzLmVtaXQoJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgLi4uYXJncylcblxuICBub2RlczogTm9kZTxUPltdID0gW11cbiAgY29uc3RydWN0b3IgKEByZWdpc3Rlcignbm9kZXMnKSBub2RlczogTm9kZTxUPltdKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubm9kZXMgPSBub2Rlc1xuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLm5vZGVzKSB7XG4gICAgICBub2RlLm9uKCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIHRoaXMuY29ubmVjdGVkSGFuZGxlcilcbiAgICAgIG5vZGUub24oJ2tpdHN1bmV0OnBlZXI6ZGlzY29ubmVjdGVkJywgdGhpcy5kaXNjb25uZWN0ZWRIYW5kbGVyKVxuICAgICAgYXdhaXQgbm9kZS5zdGFydCgpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3RvcCAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMubm9kZXMpIHtcbiAgICAgIG5vZGUub2ZmKCdraXRzdW5ldDpwZWVyOmNvbm5lY3RlZCcsIHRoaXMuY29ubmVjdGVkSGFuZGxlcilcbiAgICAgIG5vZGUub2ZmKCdraXRzdW5ldDpwZWVyOmRpc2Nvbm5lY3RlZCcsIHRoaXMuZGlzY29ubmVjdGVkSGFuZGxlcilcbiAgICAgIGF3YWl0IG5vZGUuc3RvcCgpXG4gICAgfVxuICB9XG59XG4iXX0=