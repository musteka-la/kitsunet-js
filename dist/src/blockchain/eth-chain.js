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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
'use strict';
const bn_js_1 = __importDefault(require("bn.js"));
const debug_1 = __importDefault(require("debug"));
const ethereumjs_blockchain_1 = require("ethereumjs-blockchain");
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
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
            return new ethereumjs_block_1.default(genesisStates.genesisStateById(this.common.networkId()));
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
    __metadata("design:paramtypes", [typeof (_a = typeof ethereumjs_blockchain_1.Blockchain !== "undefined" && ethereumjs_blockchain_1.Blockchain) === "function" ? _a : Object, ethereumjs_common_1.default, Object])
], EthChain);
exports.EthChain = EthChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLWNoYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jsb2NrY2hhaW4vZXRoLWNoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFlBQVksQ0FBQTtBQUVaLGtEQUFzQjtBQUN0QixrREFBeUI7QUFDekIsaUVBQWtEO0FBQ2xELHdFQUFvQztBQUNwQywwRUFBc0M7QUFDdEMsb0ZBQXFFO0FBQ3JFLG1DQUEyQztBQUMzQyxrREFBeUI7QUFFekIsdURBQTJDO0FBQzNDLG1EQUF3RDtBQUd4RCxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUtwRCxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFTLFNBQVEscUJBQUU7SUFzQjlCOzs7Ozs7T0FNRztJQUNILFlBQWEsVUFBc0IsRUFDdEIsTUFBYyxFQUVkLEVBQVc7UUFDdEIsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQWlELENBQUE7UUFDbkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7SUFDZCxDQUFDO0lBL0JELE1BQU0sQ0FBQyxVQUFVLENBQUUsTUFBYyxFQUVkLEVBQVc7UUFDNUIsT0FBTywwQkFBUyxDQUFhLElBQUksa0NBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0lBR0QsTUFBTSxDQUFDLE1BQU0sQ0FBdUIsT0FBWTtRQUM5QyxPQUFPLElBQUksMkJBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDdkMsQ0FBQztJQUdELE1BQU0sQ0FBTyxVQUFVLENBQXVCLE9BQVk7O1lBQ3hELE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENB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IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgQmxvY2tjaGFpbiB9IGZyb20gJ2V0aGVyZXVtanMtYmxvY2tjaGFpbidcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IENvbW1vbiBmcm9tICdldGhlcmV1bWpzLWNvbW1vbidcbmltcG9ydCAqIGFzIGdlbmVzaXNTdGF0ZXMgZnJvbSAnZXRoZXJldW1qcy1jb21tb24vZGlzdC9nZW5lc2lzU3RhdGVzJ1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIGFzIEVFIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IGxldmVsIGZyb20gJ2xldmVsJ1xuaW1wb3J0IHsgTGV2ZWxVcCB9IGZyb20gJ2xldmVsdXAnXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBwcm9taXNpZnksIFByb21pc2lmeUFsbCB9IGZyb20gJ3Byb21pc2lmeS10aGlzJ1xuaW1wb3J0IHsgSUJsb2NrY2hhaW4gfSBmcm9tICcuL2ludGVyZmFjZXMnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoYGtpdHN1bmV0OmJsb2NrY2hhaW46ZXRoLWNoYWluYClcblxudHlwZSBIZWFkZXIgPSBCbG9jay5IZWFkZXJcblxuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBFdGhDaGFpbiBleHRlbmRzIEVFIGltcGxlbWVudHMgSUJsb2NrY2hhaW4ge1xuICBwcml2YXRlIGJsb2NrY2hhaW46IFByb21pc2lmeUFsbDxCbG9ja2NoYWluPlxuICBwdWJsaWMgY29tbW9uOiBDb21tb25cbiAgcHVibGljIGRiOiBMZXZlbFVwXG5cbiAgQHJlZ2lzdGVyKEJsb2NrY2hhaW4pXG4gIHN0YXRpYyBibG9ja0NoYWluIChjb21tb246IENvbW1vbixcbiAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlcignY2hhaW4tZGInKVxuICAgICAgICAgICAgICAgICAgICAgZGI6IExldmVsVXApOiBQcm9taXNpZnlBbGw8QmxvY2tjaGFpbj4ge1xuICAgIHJldHVybiBwcm9taXNpZnk8QmxvY2tjaGFpbj4obmV3IEJsb2NrY2hhaW4oeyBkYiwgdmFsaWRhdGU6IGZhbHNlLCBjb21tb24gfSkpXG4gIH1cblxuICBAcmVnaXN0ZXIoQ29tbW9uKVxuICBzdGF0aWMgY29tbW9uIChAcmVnaXN0ZXIoJ29wdGlvbnMnKSBvcHRpb25zOiBhbnkpOiBDb21tb24ge1xuICAgIHJldHVybiBuZXcgQ29tbW9uKG9wdGlvbnMuZXRoTmV0d29yaylcbiAgfVxuXG4gIEByZWdpc3RlcignY2hhaW4tZGInKVxuICBzdGF0aWMgYXN5bmMgZ2V0Q2hhaW5EYiAoQHJlZ2lzdGVyKCdvcHRpb25zJykgb3B0aW9uczogYW55KTogUHJvbWlzZTxMZXZlbFVwPiB7XG4gICAgcmV0dXJuIGxldmVsKG9wdGlvbnMuZXRoQ2hhaW5EYikgYXMgTGV2ZWxVcFxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGJsb2NrY2hhaW5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHBhcmFtIHtCbG9ja2NoYWlufSBPcHRpb25zLmJsb2NrY2hhaW5cbiAgICogQHBhcmFtIHtCYXNlU3luY30gT3B0aW9ucy5zeW5jXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoYmxvY2tjaGFpbjogQmxvY2tjaGFpbixcbiAgICAgICAgICAgICAgIGNvbW1vbjogQ29tbW9uLFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdjaGFpbi1kYicpXG4gICAgICAgICAgICAgICBkYjogTGV2ZWxVcCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmJsb2NrY2hhaW4gPSBibG9ja2NoYWluIGFzIHVua25vd24gYXMgUHJvbWlzaWZ5QWxsPEJsb2NrY2hhaW4+XG4gICAgdGhpcy5jb21tb24gPSBjb21tb25cbiAgICB0aGlzLmRiID0gZGJcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRvdGFsIGRpZmZpY3VsdHkgb2YgdGhlIGNoYWluXG4gICAqXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAqL1xuICBhc3luYyBnZXRCbG9ja3NURCAoKTogUHJvbWlzZTxCTj4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBibG9jazogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmdldExhdGVzdEJsb2NrKClcbiAgICAgIGlmIChibG9jaykgcmV0dXJuIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRUZChibG9jay5oZWFkZXIuaGFzaCgpLCBuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcikpIGFzIEJOXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCTih0aGlzLmNvbW1vbi5nZW5lc2lzKCkuZGlmZmljdWx0eSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRvdGFsIGRpZmZpY3VsdHkgb2YgdGhlIGNoYWluXG4gICAqXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAqL1xuICBhc3luYyBnZXRIZWFkZXJzVEQgKCk6IFByb21pc2U8Qk4+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaGVhZGVyOiBCbG9jay5IZWFkZXIgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmdldExhdGVzdEhlYWRlcigpXG4gICAgICBpZiAoaGVhZGVyKSByZXR1cm4gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmdldFRkKGhlYWRlci5oYXNoKCksIGhlYWRlci5udW1iZXIpIGFzIEJOXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCTigwKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBibG9ja3MgaGVpZ2h0XG4gICAqL1xuICBhc3luYyBnZXRCbG9ja3NIZWlnaHQgKCk6IFByb21pc2U8Qk4+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmxvY2s6IEJsb2NrID0gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmdldExhdGVzdEJsb2NrKCkgYXMgQmxvY2tcbiAgICAgIGlmIChibG9jaykgcmV0dXJuIG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCTigwKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBoZWFkZXIgaGVpZ2h0XG4gICAqL1xuICBhc3luYyBnZXRIZWFkZXJzSGVpZ2h0ICgpOiBQcm9taXNlPEJOPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhlYWRlcjogQmxvY2suSGVhZGVyID0gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmdldExhdGVzdEhlYWRlcigpIGFzIEJsb2NrLkhlYWRlclxuICAgICAgaWYgKGhlYWRlcikgcmV0dXJuIG5ldyBCTihoZWFkZXIubnVtYmVyKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCTigwKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYXRlc3QgaGVhZGVyXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheTxIZWFkZXI+fVxuICAgKi9cbiAgYXN5bmMgZ2V0TGF0ZXN0SGVhZGVyPFQ+ICgpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5nZXRMYXRlc3RIZWFkZXIoKSBhcyBUXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxhdGVzdCBibG9ja1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXk8QmxvY2s+fVxuICAgKi9cbiAgYXN5bmMgZ2V0TGF0ZXN0QmxvY2s8VD4gKCk6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmdldExhdGVzdEJsb2NrKCkgYXMgUHJvbWlzZTxUPlxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBhcnJheSBvZiBibG9ja3NcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBmcm9tIC0gYmxvY2sgbnVtYmVyIG9yIGhhc2hcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heCAtIGhvdyBtYW55IGJsb2NrcyB0byByZXR1cm5cbiAgICogQHJldHVybnMge0FycmF5PEJsb2NrPn0gLSBhbiBhcnJheSBvZiBibG9ja3NcbiAgICovXG4gIGFzeW5jIGdldEJsb2NrczxUPiAoYmxvY2tJZDogQnVmZmVyIHwgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIG1heEJsb2NrczogbnVtYmVyID0gMjUsXG4gICAgICAgICAgICAgICAgICAgICAgc2tpcDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPFRbXSB8IHVuZGVmaW5lZD4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmdldEJsb2NrcyhibG9ja0lkLCBtYXhCbG9ja3MsIHNraXAsIHJldmVyc2UpIGFzIFByb21pc2U8VFtdPlxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBhcnJheSBvZiBibG9ja3NcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBmcm9tIC0gYmxvY2sgbnVtYmVyIG9yIGhhc2hcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heCAtIGhvdyBtYW55IGJsb2NrcyB0byByZXR1cm5cbiAgICogQHJldHVybnMge0FycmF5PEhlYWRlcj59IC0gYW4gYXJyYXkgb2YgYmxvY2tzXG4gICAqL1xuICBhc3luYyBnZXRIZWFkZXJzPFQ+IChibG9ja0lkOiBCdWZmZXIgfCBCTiB8IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgbWF4QmxvY2tzOiBudW1iZXIgPSAyNSxcbiAgICAgICAgICAgICAgICAgICAgICAgc2tpcDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxUW10gfCB1bmRlZmluZWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmxvY2tzID0gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmdldEJsb2NrcyhibG9ja0lkLCBtYXhCbG9ja3MsIHNraXAsIHJldmVyc2UpXG4gICAgICByZXR1cm4gKGJsb2NrcyBhcyB1bmtub3duIGFzIEJsb2NrW10pLm1hcChiID0+IGIuaGVhZGVyKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKGUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1dCBibG9ja3MgdG8gdGhlIGJsb2NrY2hhaW5cbiAgICpcbiAgICogQHBhcmFtIHtCbG9ja30gYmxvY2tcbiAgICovXG4gIGFzeW5jIHB1dEJsb2NrczxUPiAoYmxvY2s6IFRbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5wdXRCbG9ja3MoYmxvY2spXG4gIH1cblxuICAvKipcbiAgICogUHV0IGhlYWRlcnMgdG8gdGhlIGJsb2NrY2hhaW5cbiAgICpcbiAgICogQHBhcmFtIHtIZWFkZXJ9IGhlYWRlclxuICAgKi9cbiAgYXN5bmMgcHV0SGVhZGVyczxUPiAoaGVhZGVyOiBUW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmJsb2NrY2hhaW4ucHV0SGVhZGVycyhoZWFkZXIpXG4gIH1cblxuICBhc3luYyBnZXRCZXN0QmxvY2s8VD4gKCk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGJsb2NrOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuZ2V0TGF0ZXN0QmxvY2soKVxuICAgIGlmIChibG9jaykgcmV0dXJuIGJsb2NrIGFzIHVua25vd24gYXMgVFxuICAgIHJldHVybiBuZXcgQmxvY2soZ2VuZXNpc1N0YXRlcy5nZW5lc2lzU3RhdGVCeUlkKHRoaXMuY29tbW9uLm5ldHdvcmtJZCgpKSkgYXMgdW5rbm93biBhcyBUXG4gIH1cblxuICBnZXROZXR3b3JrSWQgKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uLm5ldHdvcmtJZCgpXG4gIH1cblxuICBnZW5lc2lzICgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmNvbW1vbi5nZW5lc2lzKClcbiAgfVxuXG4gIGFzeW5jIHB1dENoZWNrcG9pbnQgKGJsb2NrOiBCbG9jayk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5wdXRDaGVja3BvaW50KGJsb2NrKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmRiLmlzQ2xvc2VkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRiLm9wZW4oKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN0b3AgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5kYi5pc0Nsb3NlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYi5jbG9zZSgpXG4gICAgfVxuICB9XG59XG4iXX0=