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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const debug_1 = __importDefault(require("debug"));
const ethereumjs_blockchain_1 = require("ethereumjs-blockchain");
const ethereumjs_common_1 = __importDefault(require("ethereumjs-common"));
const genesisStates = __importStar(require("ethereumjs-common/dist/genesisStates"));
const events_1 = require("events");
const level_1 = __importDefault(require("level"));
const opium_decorators_1 = require("opium-decorators");
const promisify_this_1 = require("promisify-this");
const debug = debug_1.default(`kitsunet:blockchain:eth-chain`);
let EthChain = class EthChain extends events_1.EventEmitter {
    /**
     * Create a blockchain
     *
     * @param {Object} options
     * @param {Blockchain} Options.blockchain
     * @param {BaseSync} Options.sync
     */
    constructor(blockchain, common, db) {
        super();
        this.blockchain = blockchain;
        this.common = common;
        this.db = db;
    }
    static blockChain(common, db) {
        return promisify_this_1.promisify(new ethereumjs_blockchain_1.Blockchain({ db, validate: false, common }));
    }
    static common(options) {
        return new ethereumjs_common_1.default(options.ethNetwork);
    }
    static getChainDb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return level_1.default(options.ethChainDb);
        });
    }
    /**
     * Get the total difficulty of the chain
     *
     * @returns {Number}
     */
    getBlocksTD() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const block = yield this.getLatestBlock();
                if (block)
                    return yield this.blockchain.getTd(block.header.hash(), new bn_js_1.default(block.header.number));
            }
            catch (e) {
                debug(e);
            }
            return new bn_js_1.default(this.common.genesis().difficulty);
        });
    }
    /**
     * Get the total difficulty of the chain
     *
     * @returns {Number}
     */
    getHeadersTD() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const header = yield this.getLatestHeader();
                if (header)
                    return yield this.blockchain.getTd(header.hash(), header.number);
            }
            catch (e) {
                debug(e);
            }
            return new bn_js_1.default(0);
        });
    }
    /**
     * Get the current blocks height
     */
    getBlocksHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const block = yield this.blockchain.getLatestBlock();
                if (block)
                    return new bn_js_1.default(block.header.number);
            }
            catch (e) {
                debug(e);
            }
            return new bn_js_1.default(0);
        });
    }
    /**
     * Get the current header height
     */
    getHeadersHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const header = yield this.blockchain.getLatestHeader();
                if (header)
                    return new bn_js_1.default(header.number);
            }
            catch (e) {
                debug(e);
            }
            return new bn_js_1.default(0);
        });
    }
    /**
     * Get latest header
     *
     * @returns {Array<Header>}
     */
    getLatestHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.blockchain.getLatestHeader();
            }
            catch (e) {
                debug(e);
            }
        });
    }
    /**
     * Get latest block
     *
     * @returns {Array<Block>}
     */
    getLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.blockchain.getLatestBlock();
            }
            catch (e) {
                debug(e);
            }
        });
    }
    /**
     * Get an array of blocks
     *
     * @param {Number|String} from - block number or hash
     * @param {Number} max - how many blocks to return
     * @returns {Array<Block>} - an array of blocks
     */
    getBlocks(blockId, maxBlocks = 25, skip = 0, reverse = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse);
            }
            catch (e) {
                debug(e);
            }
        });
    }
    /**
     * Get an array of blocks
     *
     * @param {Number|String} from - block number or hash
     * @param {Number} max - how many blocks to return
     * @returns {Array<Header>} - an array of blocks
     */
    getHeaders(blockId, maxBlocks = 25, skip = 0, reverse = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blocks = yield this.blockchain.getBlocks(blockId, maxBlocks, skip, reverse);
                return blocks.map(b => b.header);
            }
            catch (e) {
                debug(e);
            }
        });
    }
    /**
     * Put blocks to the blockchain
     *
     * @param {Block} block
     */
    putBlocks(block) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockchain.putBlocks(block);
        });
    }
    /**
     * Put headers to the blockchain
     *
     * @param {Header} header
     */
    putHeaders(header) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockchain.putHeaders(header);
        });
    }
    getBestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const block = yield this.getLatestBlock();
            if (block)
                return block;
            return new ethereumjs_blockchain_1.Block(genesisStates.genesisStateById(this.common.networkId()));
        });
    }
    getNetworkId() {
        return this.common.networkId();
    }
    genesis() {
        return this.common.genesis();
    }
    putCheckpoint(block) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockchain.putCheckpoint(block);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db.isClosed()) {
                return this.db.open();
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db.isClosed()) {
                return this.db.close();
            }
        });
    }
};
__decorate([
    opium_decorators_1.register(ethereumjs_blockchain_1.Blockchain),
    __param(1, opium_decorators_1.register('chain-db')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ethereumjs_common_1.default, Object]),
    __metadata("design:returntype", Object)
], EthChain, "blockChain", null);
__decorate([
    opium_decorators_1.register(ethereumjs_common_1.default),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", ethereumjs_common_1.default)
], EthChain, "common", null);
__decorate([
    opium_decorators_1.register('chain-db'),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EthChain, "getChainDb", null);
EthChain = __decorate([
    opium_decorators_1.register(),
    __param(2, opium_decorators_1.register('chain-db')),
    __metadata("design:paramtypes", [ethereumjs_blockchain_1.Blockchain,
        ethereumjs_common_1.default, Object])
], EthChain);
exports.EthChain = EthChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLWNoYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jsb2NrY2hhaW4vZXRoLWNoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsa0RBQXlCO0FBQ3pCLGlFQUF5RDtBQUN6RCwwRUFBc0M7QUFDdEMsb0ZBQXFFO0FBQ3JFLG1DQUEyQztBQUMzQyxrREFBeUI7QUFFekIsdURBQTJDO0FBQzNDLG1EQUF3RDtBQUd4RCxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUtwRCxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFTLFNBQVEscUJBQUU7SUFzQjlCOzs7Ozs7T0FNRztJQUNILFlBQWEsVUFBc0IsRUFDdEIsTUFBYyxFQUVkLEVBQVc7UUFDdEIsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQWlELENBQUE7UUFDbkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7SUFDZCxDQUFDO0lBL0JELE1BQU0sQ0FBQyxVQUFVLENBQUUsTUFBYyxFQUVkLEVBQVc7UUFDNUIsT0FBTywwQkFBUyxDQUFhLElBQUksa0NBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0lBR0QsTUFBTSxDQUFDLE1BQU0sQ0FBdUIsT0FBWTtRQUM5QyxPQUFPLElBQUksMkJBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDdkMsQ0FBQztJQUdELE1BQU0sQ0FBTyxVQUFVLENBQXVCLE9BQVk7O1lBQ3hELE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQVksQ0FBQTtRQUM3QyxD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LENBQUMsU0FBUyxFQUFFLENBQUE7SUFDaEMsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDOUIsQ0FBQztJQUVLLGFBQWEsQ0FBRSxLQUFZOztZQUMvQixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzVDLENBQUM7S0FBQTtJQUVLLEtBQUs7O1lBQ1QsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUN0QixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDdEI7UUFDSCxDQUFDO0tBQUE7SUFFSyxJQUFJOztZQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUE7YUFDdkI7UUFDSCxDQUFDO0tBQUE7Q0FDRixDQUFBO0FBek1DO0lBREMsMkJBQVEsQ0FBQyxrQ0FBVSxDQUFDO0lBRUQsV0FBQSwyQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztxQ0FEYiwyQkFBTTs7Z0NBSWhDO0FBR0Q7SUFEQywyQkFBUSxDQUFDLDJCQUFNLENBQUM7SUFDRCxXQUFBLDJCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7OztvQ0FBZ0IsMkJBQU07NEJBRXhEO0FBR0Q7SUFEQywyQkFBUSxDQUFDLFVBQVUsQ0FBQztJQUNLLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7OztnQ0FFNUM7QUFwQlUsUUFBUTtJQURwQiwyQkFBUSxFQUFFO0lBZ0NLLFdBQUEsMkJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtxQ0FGVCxrQ0FBVTtRQUNkLDJCQUFNO0dBOUJoQixRQUFRLENBK01wQjtBQS9NWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBCbG9jaywgQmxvY2tjaGFpbiB9IGZyb20gJ2V0aGVyZXVtanMtYmxvY2tjaGFpbidcbmltcG9ydCBDb21tb24gZnJvbSAnZXRoZXJldW1qcy1jb21tb24nXG5pbXBvcnQgKiBhcyBnZW5lc2lzU3RhdGVzIGZyb20gJ2V0aGVyZXVtanMtY29tbW9uL2Rpc3QvZ2VuZXNpc1N0YXRlcydcbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBFRSB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCBsZXZlbCBmcm9tICdsZXZlbCdcbmltcG9ydCB7IExldmVsVXAgfSBmcm9tICdsZXZlbHVwJ1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tICdvcGl1bS1kZWNvcmF0b3JzJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5LCBQcm9taXNpZnlBbGwgfSBmcm9tICdwcm9taXNpZnktdGhpcydcbmltcG9ydCB7IElCbG9ja2NoYWluIH0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKGBraXRzdW5ldDpibG9ja2NoYWluOmV0aC1jaGFpbmApXG5cbnR5cGUgSGVhZGVyID0gQmxvY2suSGVhZGVyXG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgRXRoQ2hhaW4gZXh0ZW5kcyBFRSBpbXBsZW1lbnRzIElCbG9ja2NoYWluIHtcbiAgcHJpdmF0ZSBibG9ja2NoYWluOiBQcm9taXNpZnlBbGw8QmxvY2tjaGFpbj5cbiAgcHVibGljIGNvbW1vbjogQ29tbW9uXG4gIHB1YmxpYyBkYjogTGV2ZWxVcFxuXG4gIEByZWdpc3RlcihCbG9ja2NoYWluKVxuICBzdGF0aWMgYmxvY2tDaGFpbiAoY29tbW9uOiBDb21tb24sXG4gICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2NoYWluLWRiJylcbiAgICAgICAgICAgICAgICAgICAgIGRiOiBMZXZlbFVwKTogUHJvbWlzaWZ5QWxsPEJsb2NrY2hhaW4+IHtcbiAgICByZXR1cm4gcHJvbWlzaWZ5PEJsb2NrY2hhaW4+KG5ldyBCbG9ja2NoYWluKHsgZGIsIHZhbGlkYXRlOiBmYWxzZSwgY29tbW9uIH0pKVxuICB9XG5cbiAgQHJlZ2lzdGVyKENvbW1vbilcbiAgc3RhdGljIGNvbW1vbiAoQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55KTogQ29tbW9uIHtcbiAgICByZXR1cm4gbmV3IENvbW1vbihvcHRpb25zLmV0aE5ldHdvcmspXG4gIH1cblxuICBAcmVnaXN0ZXIoJ2NoYWluLWRiJylcbiAgc3RhdGljIGFzeW5jIGdldENoYWluRGIgKEByZWdpc3Rlcignb3B0aW9ucycpIG9wdGlvbnM6IGFueSk6IFByb21pc2U8TGV2ZWxVcD4ge1xuICAgIHJldHVybiBsZXZlbChvcHRpb25zLmV0aENoYWluRGIpIGFzIExldmVsVXBcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBibG9ja2NoYWluXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7QmxvY2tjaGFpbn0gT3B0aW9ucy5ibG9ja2NoYWluXG4gICAqIEBwYXJhbSB7QmFzZVN5bmN9IE9wdGlvbnMuc3luY1xuICAgKi9cbiAgY29uc3RydWN0b3IgKGJsb2NrY2hhaW46IEJsb2NrY2hhaW4sXG4gICAgICAgICAgICAgICBjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgIEByZWdpc3RlcignY2hhaW4tZGInKVxuICAgICAgICAgICAgICAgZGI6IExldmVsVXApIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5ibG9ja2NoYWluID0gYmxvY2tjaGFpbiBhcyB1bmtub3duIGFzIFByb21pc2lmeUFsbDxCbG9ja2NoYWluPlxuICAgIHRoaXMuY29tbW9uID0gY29tbW9uXG4gICAgdGhpcy5kYiA9IGRiXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB0b3RhbCBkaWZmaWN1bHR5IG9mIHRoZSBjaGFpblxuICAgKlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgKi9cbiAgYXN5bmMgZ2V0QmxvY2tzVEQgKCk6IFByb21pc2U8Qk4+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmxvY2s6IEJsb2NrIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5nZXRMYXRlc3RCbG9jaygpXG4gICAgICBpZiAoYmxvY2spIHJldHVybiBhd2FpdCB0aGlzLmJsb2NrY2hhaW4uZ2V0VGQoYmxvY2suaGVhZGVyLmhhc2goKSwgbmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpKSBhcyBCTlxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICAgIHJldHVybiBuZXcgQk4odGhpcy5jb21tb24uZ2VuZXNpcygpLmRpZmZpY3VsdHkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB0b3RhbCBkaWZmaWN1bHR5IG9mIHRoZSBjaGFpblxuICAgKlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgKi9cbiAgYXN5bmMgZ2V0SGVhZGVyc1REICgpOiBQcm9taXNlPEJOPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhlYWRlcjogQmxvY2suSGVhZGVyIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5nZXRMYXRlc3RIZWFkZXIoKVxuICAgICAgaWYgKGhlYWRlcikgcmV0dXJuIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRUZChoZWFkZXIuaGFzaCgpLCBoZWFkZXIubnVtYmVyKSBhcyBCTlxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICAgIHJldHVybiBuZXcgQk4oMClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYmxvY2tzIGhlaWdodFxuICAgKi9cbiAgYXN5bmMgZ2V0QmxvY2tzSGVpZ2h0ICgpOiBQcm9taXNlPEJOPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJsb2NrOiBCbG9jayA9IGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRMYXRlc3RCbG9jaygpIGFzIEJsb2NrXG4gICAgICBpZiAoYmxvY2spIHJldHVybiBuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcilcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQk4oMClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgaGVhZGVyIGhlaWdodFxuICAgKi9cbiAgYXN5bmMgZ2V0SGVhZGVyc0hlaWdodCAoKTogUHJvbWlzZTxCTj4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBoZWFkZXI6IEJsb2NrLkhlYWRlciA9IGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRMYXRlc3RIZWFkZXIoKSBhcyBCbG9jay5IZWFkZXJcbiAgICAgIGlmIChoZWFkZXIpIHJldHVybiBuZXcgQk4oaGVhZGVyLm51bWJlcilcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQk4oMClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbGF0ZXN0IGhlYWRlclxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXk8SGVhZGVyPn1cbiAgICovXG4gIGFzeW5jIGdldExhdGVzdEhlYWRlcjxUPiAoKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkPiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJsb2NrY2hhaW4uZ2V0TGF0ZXN0SGVhZGVyKCkgYXMgVFxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYXRlc3QgYmxvY2tcbiAgICpcbiAgICogQHJldHVybnMge0FycmF5PEJsb2NrPn1cbiAgICovXG4gIGFzeW5jIGdldExhdGVzdEJsb2NrPFQ+ICgpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRMYXRlc3RCbG9jaygpIGFzIFByb21pc2U8VD5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXJyYXkgb2YgYmxvY2tzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gZnJvbSAtIGJsb2NrIG51bWJlciBvciBoYXNoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggLSBob3cgbWFueSBibG9ja3MgdG8gcmV0dXJuXG4gICAqIEByZXR1cm5zIHtBcnJheTxCbG9jaz59IC0gYW4gYXJyYXkgb2YgYmxvY2tzXG4gICAqL1xuICBhc3luYyBnZXRCbG9ja3M8VD4gKGJsb2NrSWQ6IEJ1ZmZlciB8IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhCbG9ja3M6IG51bWJlciA9IDI1LFxuICAgICAgICAgICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxUW10gfCB1bmRlZmluZWQ+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRCbG9ja3MoYmxvY2tJZCwgbWF4QmxvY2tzLCBza2lwLCByZXZlcnNlKSBhcyBQcm9taXNlPFRbXT5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXJyYXkgb2YgYmxvY2tzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gZnJvbSAtIGJsb2NrIG51bWJlciBvciBoYXNoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXggLSBob3cgbWFueSBibG9ja3MgdG8gcmV0dXJuXG4gICAqIEByZXR1cm5zIHtBcnJheTxIZWFkZXI+fSAtIGFuIGFycmF5IG9mIGJsb2Nrc1xuICAgKi9cbiAgYXN5bmMgZ2V0SGVhZGVyczxUPiAoYmxvY2tJZDogQnVmZmVyIHwgQk4gfCBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgIG1heEJsb2NrczogbnVtYmVyID0gMjUsXG4gICAgICAgICAgICAgICAgICAgICAgIHNraXA6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgIHJldmVyc2U6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8VFtdIHwgdW5kZWZpbmVkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJsb2NrcyA9IGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRCbG9ja3MoYmxvY2tJZCwgbWF4QmxvY2tzLCBza2lwLCByZXZlcnNlKVxuICAgICAgcmV0dXJuIChibG9ja3MgYXMgdW5rbm93biBhcyBCbG9ja1tdKS5tYXAoYiA9PiBiLmhlYWRlcilcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZyhlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdXQgYmxvY2tzIHRvIHRoZSBibG9ja2NoYWluXG4gICAqXG4gICAqIEBwYXJhbSB7QmxvY2t9IGJsb2NrXG4gICAqL1xuICBhc3luYyBwdXRCbG9ja3M8VD4gKGJsb2NrOiBUW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmJsb2NrY2hhaW4ucHV0QmxvY2tzKGJsb2NrKVxuICB9XG5cbiAgLyoqXG4gICAqIFB1dCBoZWFkZXJzIHRvIHRoZSBibG9ja2NoYWluXG4gICAqXG4gICAqIEBwYXJhbSB7SGVhZGVyfSBoZWFkZXJcbiAgICovXG4gIGFzeW5jIHB1dEhlYWRlcnM8VD4gKGhlYWRlcjogVFtdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ibG9ja2NoYWluLnB1dEhlYWRlcnMoaGVhZGVyKVxuICB9XG5cbiAgYXN5bmMgZ2V0QmVzdEJsb2NrPFQ+ICgpOiBQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBibG9jazogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmdldExhdGVzdEJsb2NrKClcbiAgICBpZiAoYmxvY2spIHJldHVybiBibG9jayBhcyB1bmtub3duIGFzIFRcbiAgICByZXR1cm4gbmV3IEJsb2NrKGdlbmVzaXNTdGF0ZXMuZ2VuZXNpc1N0YXRlQnlJZCh0aGlzLmNvbW1vbi5uZXR3b3JrSWQoKSkpIGFzIHVua25vd24gYXMgVFxuICB9XG5cbiAgZ2V0TmV0d29ya0lkICgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbW1vbi5uZXR3b3JrSWQoKVxuICB9XG5cbiAgZ2VuZXNpcyAoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb21tb24uZ2VuZXNpcygpXG4gIH1cblxuICBhc3luYyBwdXRDaGVja3BvaW50IChibG9jazogQmxvY2spOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmJsb2NrY2hhaW4ucHV0Q2hlY2twb2ludChibG9jaylcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0ICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5kYi5pc0Nsb3NlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYi5vcGVuKClcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdG9wICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuZGIuaXNDbG9zZWQoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGIuY2xvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19