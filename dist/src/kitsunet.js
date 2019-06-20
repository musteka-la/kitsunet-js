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
const nextTick_1 = __importDefault(require("async/nextTick"));
const slice_1 = require("./slice");
const opium_decorators_1 = require("opium-decorators");
const slice_manager_1 = require("./slice-manager");
const ksn_driver_1 = require("./ksn-driver");
const constants_1 = require("./constants");
let Kitsunet = class Kitsunet extends events_1.default {
    constructor(sliceManager, ksnDriver, depth = constants_1.DEFAULT_DEPTH) {
        super();
        this.sliceManager = sliceManager;
        this.ksnDriver = ksnDriver;
        this.depth = depth;
        this.sliceManager.blockTracker.on('latest', (block) => this.emit('latest', block));
        this.sliceManager.blockTracker.on('sync', ({ block, oldBlock }) => this.emit('sync', { block, oldBlock }));
        this.sliceManager.on('slice', (slice) => this.emit('slice', slice));
    }
    static getDefaultDepth(options) {
        return options.depth || constants_1.DEFAULT_DEPTH;
    }
    get addrs() {
        return this.ksnDriver.clientPeers.reduce((addrs, addr) => {
            addrs.push(addr);
            return addr;
        }, []);
    }
    get networkNodes() {
        return this.ksnDriver.nodeManager.nodes;
    }
    get peers() {
        return this.ksnDriver.peers;
    }
    /**
     * Get a slice
     *
     * @param {SliceId|String} slice - the slice to return
     * TODO: remove this - need to modify Geth to handle storage slices just any any other slice
     * @param {Boolean} storage - weather the slice is a storage slice
     * @return {Slice}
     */
    getSlice(slice, storage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof slice === 'string') {
                const [path, depth, root] = slice.split('-');
                slice = new slice_1.SliceId(path, Number(depth), root, storage);
            }
            return this.sliceManager.getSlice(slice);
        });
    }
    /**
     * Get the slice for a block
     *
     * @param {String|Number} block - the block tag to get the slice for
     * @param {SliceId|String} slice - the slice id to retrieve
     */
    getSliceForBlock(block, slice) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof slice === 'string') {
                slice = new slice_1.SliceId(slice);
            }
            return this.sliceManager.getSliceForBlock(block, slice);
        });
    }
    /**
     * Get the latest block
     */
    getLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ksnDriver.getLatestBlock();
        });
    }
    /**
     * Get a block by number
     *
     * @param {String|Number} block - the block number, if string is passed assumed to be in hex
     */
    getBlockByNumber(block) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ksnDriver.getBlockByNumber(block);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ksnDriver.start();
            yield this.sliceManager.start();
            nextTick_1.default(() => this.emit('kitsunet:start'));
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sliceManager.stop();
            yield this.ksnDriver.stop();
            nextTick_1.default(() => this.emit('kitsunet:stop'));
        });
    }
};
__decorate([
    opium_decorators_1.register('slice-depth'),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Number)
], Kitsunet, "getDefaultDepth", null);
Kitsunet = __decorate([
    opium_decorators_1.register(),
    __param(2, opium_decorators_1.register('slice-depth')),
    __metadata("design:paramtypes", [slice_manager_1.SliceManager,
        ksn_driver_1.KsnDriver, Number])
], Kitsunet);
exports.Kitsunet = Kitsunet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2l0c3VuZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMva2l0c3VuZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosb0RBQXVCO0FBQ3ZCLDhEQUFxQztBQUNyQyxtQ0FBaUM7QUFDakMsdURBQTJDO0FBQzNDLG1EQUE4QztBQUM5Qyw2Q0FBd0M7QUFDeEMsMkNBQTJDO0FBTTNDLElBQWEsUUFBUSxHQUFyQixNQUFhLFFBQTBDLFNBQVEsZ0JBQUU7SUFVL0QsWUFBYSxZQUE2QixFQUM3QixTQUF1QixFQUV2QixRQUFnQix5QkFBYTtRQUN4QyxLQUFLLEVBQUUsQ0FBQTtRQUVQLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBRWxCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBRTdCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUV6QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUF0QkQs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RUUgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IG5leHRUaWNrIGZyb20gJ2FzeW5jL25leHRUaWNrJ1xuaW1wb3J0IHsgU2xpY2VJZCB9IGZyb20gJy4vc2xpY2UnXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBTbGljZU1hbmFnZXIgfSBmcm9tICcuL3NsaWNlLW1hbmFnZXInXG5pbXBvcnQgeyBLc25Ecml2ZXIgfSBmcm9tICcuL2tzbi1kcml2ZXInXG5pbXBvcnQgeyBERUZBVUxUX0RFUFRIIH0gZnJvbSAnLi9jb25zdGFudHMnXG5pbXBvcnQgeyBOZXR3b3JrUGVlciB9IGZyb20gJy4vbmV0L3BlZXInXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuL25ldCdcblxuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBLaXRzdW5ldDxUIGV4dGVuZHMgTmV0d29ya1BlZXI8YW55LCBhbnk+PiBleHRlbmRzIEVFIHtcbiAgc2xpY2VNYW5hZ2VyOiBTbGljZU1hbmFnZXI8VD5cbiAga3NuRHJpdmVyOiBLc25Ecml2ZXI8VD5cbiAgZGVwdGg6IG51bWJlclxuXG4gIEByZWdpc3Rlcignc2xpY2UtZGVwdGgnKVxuICBzdGF0aWMgZ2V0RGVmYXVsdERlcHRoIChAcmVnaXN0ZXIoJ29wdGlvbnMnKSBvcHRpb25zOiBhbnkpOiBudW1iZXIge1xuICAgIHJldHVybiBvcHRpb25zLmRlcHRoIHx8IERFRkFVTFRfREVQVEhcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChzbGljZU1hbmFnZXI6IFNsaWNlTWFuYWdlcjxUPixcbiAgICAgICAgICAgICAgIGtzbkRyaXZlcjogS3NuRHJpdmVyPFQ+LFxuICAgICAgICAgICAgICAgQHJlZ2lzdGVyKCdzbGljZS1kZXB0aCcpXG4gICAgICAgICAgICAgICBkZXB0aDogbnVtYmVyID0gREVGQVVMVF9ERVBUSCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc2xpY2VNYW5hZ2VyID0gc2xpY2VNYW5hZ2VyXG4gICAgdGhpcy5rc25Ecml2ZXIgPSBrc25Ecml2ZXJcbiAgICB0aGlzLmRlcHRoID0gZGVwdGhcblxuICAgIHRoaXMuc2xpY2VNYW5hZ2VyLmJsb2NrVHJhY2tlci5vbignbGF0ZXN0JywgKGJsb2NrKSA9PlxuICAgICAgdGhpcy5lbWl0KCdsYXRlc3QnLCBibG9jaykpXG5cbiAgICB0aGlzLnNsaWNlTWFuYWdlci5ibG9ja1RyYWNrZXIub24oJ3N5bmMnLCAoeyBibG9jaywgb2xkQmxvY2sgfSkgPT5cbiAgICAgIHRoaXMuZW1pdCgnc3luYycsIHsgYmxvY2ssIG9sZEJsb2NrIH0pKVxuXG4gICAgdGhpcy5zbGljZU1hbmFnZXIub24oJ3NsaWNlJywgKHNsaWNlKSA9PlxuICAgICAgdGhpcy5lbWl0KCdzbGljZScsIHNsaWNlKSlcbiAgfVxuXG4gIGdldCBhZGRycyAoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmtzbkRyaXZlci5jbGllbnRQZWVycy5yZWR1Y2UoKGFkZHJzOiBhbnksIGFkZHIpID0+IHtcbiAgICAgIGFkZHJzLnB1c2goYWRkcilcbiAgICAgIHJldHVybiBhZGRyXG4gICAgfSwgW10pXG4gIH1cblxuICBnZXQgbmV0d29ya05vZGVzICgpOiBOb2RlPFQ+W10ge1xuICAgIHJldHVybiB0aGlzLmtzbkRyaXZlci5ub2RlTWFuYWdlci5ub2Rlc1xuICB9XG5cbiAgZ2V0IHBlZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5rc25Ecml2ZXIucGVlcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzbGljZVxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR8U3RyaW5nfSBzbGljZSAtIHRoZSBzbGljZSB0byByZXR1cm5cbiAgICogVE9ETzogcmVtb3ZlIHRoaXMgLSBuZWVkIHRvIG1vZGlmeSBHZXRoIHRvIGhhbmRsZSBzdG9yYWdlIHNsaWNlcyBqdXN0IGFueSBhbnkgb3RoZXIgc2xpY2VcbiAgICogQHBhcmFtIHtCb29sZWFufSBzdG9yYWdlIC0gd2VhdGhlciB0aGUgc2xpY2UgaXMgYSBzdG9yYWdlIHNsaWNlXG4gICAqIEByZXR1cm4ge1NsaWNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0U2xpY2UgKHNsaWNlLCBzdG9yYWdlKSB7XG4gICAgaWYgKHR5cGVvZiBzbGljZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IFtwYXRoLCBkZXB0aCwgcm9vdF0gPSBzbGljZS5zcGxpdCgnLScpXG4gICAgICBzbGljZSA9IG5ldyBTbGljZUlkKHBhdGgsIE51bWJlcihkZXB0aCksIHJvb3QsIHN0b3JhZ2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2xpY2VNYW5hZ2VyLmdldFNsaWNlKHNsaWNlKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc2xpY2UgZm9yIGEgYmxvY2tcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBibG9jayAtIHRoZSBibG9jayB0YWcgdG8gZ2V0IHRoZSBzbGljZSBmb3JcbiAgICogQHBhcmFtIHtTbGljZUlkfFN0cmluZ30gc2xpY2UgLSB0aGUgc2xpY2UgaWQgdG8gcmV0cmlldmVcbiAgICovXG4gIGFzeW5jIGdldFNsaWNlRm9yQmxvY2sgKGJsb2NrLCBzbGljZSkge1xuICAgIGlmICh0eXBlb2Ygc2xpY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzbGljZSA9IG5ldyBTbGljZUlkKHNsaWNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNsaWNlTWFuYWdlci5nZXRTbGljZUZvckJsb2NrKGJsb2NrLCBzbGljZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGxhdGVzdCBibG9ja1xuICAgKi9cbiAgYXN5bmMgZ2V0TGF0ZXN0QmxvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLmtzbkRyaXZlci5nZXRMYXRlc3RCbG9jaygpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgYmxvY2sgYnkgbnVtYmVyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gYmxvY2sgLSB0aGUgYmxvY2sgbnVtYmVyLCBpZiBzdHJpbmcgaXMgcGFzc2VkIGFzc3VtZWQgdG8gYmUgaW4gaGV4XG4gICAqL1xuICBhc3luYyBnZXRCbG9ja0J5TnVtYmVyIChibG9jazogbnVtYmVyKTogUHJvbWlzZTxCbG9jayB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmtzbkRyaXZlci5nZXRCbG9ja0J5TnVtYmVyKGJsb2NrKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQgKCkge1xuICAgIGF3YWl0IHRoaXMua3NuRHJpdmVyLnN0YXJ0KClcbiAgICBhd2FpdCB0aGlzLnNsaWNlTWFuYWdlci5zdGFydCgpXG5cbiAgICBuZXh0VGljaygoKSA9PiB0aGlzLmVtaXQoJ2tpdHN1bmV0OnN0YXJ0JykpXG4gIH1cblxuICBhc3luYyBzdG9wICgpIHtcbiAgICBhd2FpdCB0aGlzLnNsaWNlTWFuYWdlci5zdG9wKClcbiAgICBhd2FpdCB0aGlzLmtzbkRyaXZlci5zdG9wKClcblxuICAgIG5leHRUaWNrKCgpID0+IHRoaXMuZW1pdCgna2l0c3VuZXQ6c3RvcCcpKVxuICB9XG59XG4iXX0=