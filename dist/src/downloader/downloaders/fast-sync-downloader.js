'use strict';
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
const interfaces_1 = require("../interfaces");
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const bn_js_1 = __importDefault(require("bn.js"));
const debug_1 = __importDefault(require("debug"));
const base_1 = require("./base");
const debug = debug_1.default('kitsunet:downloaders:fast-sync');
const MAX_PER_REQUEST = 128;
class FastSyncDownloader extends base_1.BaseDownloader {
    constructor(protocol, peer, chain) {
        super(protocol, interfaces_1.DownloaderType.FAST, chain);
        this.protocol = protocol;
        this.peer = peer;
        this.chain = chain;
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            let blockNumber = new bn_js_1.default(0);
            const block = yield this.chain.getLatestBlock();
            if (block) {
                blockNumber = new bn_js_1.default(block.header.number);
            }
            try {
                debug(`trying to sync with ${this.protocol.peer.id}`);
                const remoteHeader = yield this.latest();
                if (remoteHeader) {
                    const remoteNumber = new bn_js_1.default(remoteHeader.header.number);
                    const blockNumberStr = blockNumber.toString(10);
                    debug(`latest block is ${blockNumberStr} remote block is ${remoteNumber.toString(10)}`);
                    // increment current block to set as start
                    blockNumber.iaddn(1);
                    while (blockNumber.lte(remoteNumber)) {
                        debug(`requesting ${MAX_PER_REQUEST} blocks from ${this.protocol.peer.id} starting ` +
                            `from ${blockNumberStr}`);
                        let headers = yield this.getHeaders(blockNumber, MAX_PER_REQUEST);
                        if (!headers.length)
                            return;
                        let bodies = yield this.getBodies(headers.map(h => h.hash()));
                        yield this.store(bodies.map((body, i) => new ethereumjs_block_1.default([headers[i].raw].concat(body))));
                        blockNumber.iaddn(headers.length);
                        debug(`imported ${headers.length} blocks`);
                    }
                }
            }
            catch (err) {
                debug(err);
            }
        });
    }
}
exports.FastSyncDownloader = FastSyncDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWiw4Q0FBOEM7QUFDOUMsd0VBQW9DO0FBUXBDLGtEQUFzQjtBQUV0QixrREFBeUI7QUFDekIsaUNBQXVDO0FBQ3ZDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRXJELE1BQU0sZUFBZSxHQUFXLEdBQUcsQ0FBQTtBQUVuQyxNQUFhLGtCQUFtRCxTQUFRLHFCQUFpQjtJQUN2RixZQUFvQixRQUF3QixFQUN4QixJQUF3QixFQUN4QixLQUFlO1FBQ2pDLEtBQUssQ0FBQyxRQUFRLEVBQUUsMkJBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFIekIsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBb0I7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBVTtJQUVuQyxDQUFDO0lBRUssUUFBUTs7WUFDWixJQUFJLFdBQVcsR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvQixNQUFNLEtBQUssR0FBc0IsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ2xFLElBQUksS0FBSyxFQUFFO2dCQUNULFdBQVcsR0FBRyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQzFDO1lBRUQsSUFBSTtnQkFDRixLQUFLLENBQUMsdUJBQXVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQ3JELE1BQU0sWUFBWSxHQUFzQixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtnQkFDM0QsSUFBSSxZQUFZLEVBQUU7b0JBQ2hCLE1BQU0sWUFBWSxHQUFPLElBQUksZUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQzNELE1BQU0sY0FBYyxHQUFXLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQ3ZELEtBQUssQ0FBQyxtQkFBbUIsY0FBYyxvQkFBb0IsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBRXZGLDBDQUEwQztvQkFDMUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDcEIsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO3dCQUNwQyxLQUFLLENBQUMsY0FBYyxlQUFlLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVk7NEJBQ3BGLFFBQVEsY0FBYyxFQUFFLENBQUMsQ0FBQTt3QkFFekIsSUFBSSxPQUFPLEdBQW1CLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUE7d0JBQ2pGLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTs0QkFBRSxPQUFNO3dCQUUzQixJQUFJLE1BQU0sR0FBZ0IsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO3dCQUMxRSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksMEJBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7d0JBRW5GLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dCQUNqQyxLQUFLLENBQUMsWUFBWSxPQUFPLENBQUMsTUFBTSxTQUFTLENBQUMsQ0FBQTtxQkFDM0M7aUJBQ0Y7YUFDRjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUNYO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUExQ0QsZ0RBMENDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IERvd25sb2FkZXJUeXBlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuaW1wb3J0IHtcbiAgRXRoUHJvdG9jb2wsXG4gIEJsb2NrQm9keSxcbiAgSVBlZXJEZXNjcmlwdG9yXG59IGZyb20gJy4uLy4uL25ldCdcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vYmxvY2tjaGFpbidcblxuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBCYXNlRG93bmxvYWRlciB9IGZyb20gJy4vYmFzZSdcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmRvd25sb2FkZXJzOmZhc3Qtc3luYycpXG5cbmNvbnN0IE1BWF9QRVJfUkVRVUVTVDogbnVtYmVyID0gMTI4XG5cbmV4cG9ydCBjbGFzcyBGYXN0U3luY0Rvd25sb2FkZXI8VCBleHRlbmRzIElQZWVyRGVzY3JpcHRvcjxhbnk+PiBleHRlbmRzIEJhc2VEb3dubG9hZGVyPFQ+IHtcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBwcm90b2NvbDogRXRoUHJvdG9jb2w8VD4sXG4gICAgICAgICAgICAgICBwdWJsaWMgcGVlcjogSVBlZXJEZXNjcmlwdG9yPFQ+LFxuICAgICAgICAgICAgICAgcHVibGljIGNoYWluOiBFdGhDaGFpbikge1xuICAgIHN1cGVyKHByb3RvY29sLCBEb3dubG9hZGVyVHlwZS5GQVNULCBjaGFpbilcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgYmxvY2tOdW1iZXI6IEJOID0gbmV3IEJOKDApXG4gICAgY29uc3QgYmxvY2s6IEJsb2NrIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRMYXRlc3RCbG9jaygpXG4gICAgaWYgKGJsb2NrKSB7XG4gICAgICBibG9ja051bWJlciA9IG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBkZWJ1ZyhgdHJ5aW5nIHRvIHN5bmMgd2l0aCAke3RoaXMucHJvdG9jb2wucGVlci5pZH1gKVxuICAgICAgY29uc3QgcmVtb3RlSGVhZGVyOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMubGF0ZXN0KClcbiAgICAgIGlmIChyZW1vdGVIZWFkZXIpIHtcbiAgICAgICAgY29uc3QgcmVtb3RlTnVtYmVyOiBCTiA9IG5ldyBCTihyZW1vdGVIZWFkZXIuaGVhZGVyLm51bWJlcilcbiAgICAgICAgY29uc3QgYmxvY2tOdW1iZXJTdHI6IHN0cmluZyA9IGJsb2NrTnVtYmVyLnRvU3RyaW5nKDEwKVxuICAgICAgICBkZWJ1ZyhgbGF0ZXN0IGJsb2NrIGlzICR7YmxvY2tOdW1iZXJTdHJ9IHJlbW90ZSBibG9jayBpcyAke3JlbW90ZU51bWJlci50b1N0cmluZygxMCl9YClcblxuICAgICAgICAvLyBpbmNyZW1lbnQgY3VycmVudCBibG9jayB0byBzZXQgYXMgc3RhcnRcbiAgICAgICAgYmxvY2tOdW1iZXIuaWFkZG4oMSlcbiAgICAgICAgd2hpbGUgKGJsb2NrTnVtYmVyLmx0ZShyZW1vdGVOdW1iZXIpKSB7XG4gICAgICAgICAgZGVidWcoYHJlcXVlc3RpbmcgJHtNQVhfUEVSX1JFUVVFU1R9IGJsb2NrcyBmcm9tICR7dGhpcy5wcm90b2NvbC5wZWVyLmlkfSBzdGFydGluZyBgICtcbiAgICAgICAgICBgZnJvbSAke2Jsb2NrTnVtYmVyU3RyfWApXG5cbiAgICAgICAgICBsZXQgaGVhZGVyczogQmxvY2suSGVhZGVyW10gPSBhd2FpdCB0aGlzLmdldEhlYWRlcnMoYmxvY2tOdW1iZXIsIE1BWF9QRVJfUkVRVUVTVClcbiAgICAgICAgICBpZiAoIWhlYWRlcnMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgICAgIGxldCBib2RpZXM6IEJsb2NrQm9keVtdID0gYXdhaXQgdGhpcy5nZXRCb2RpZXMoaGVhZGVycy5tYXAoaCA9PiBoLmhhc2goKSkpXG4gICAgICAgICAgYXdhaXQgdGhpcy5zdG9yZShib2RpZXMubWFwKChib2R5LCBpKSA9PiBuZXcgQmxvY2soW2hlYWRlcnNbaV0ucmF3XS5jb25jYXQoYm9keSkpKSlcblxuICAgICAgICAgIGJsb2NrTnVtYmVyLmlhZGRuKGhlYWRlcnMubGVuZ3RoKVxuICAgICAgICAgIGRlYnVnKGBpbXBvcnRlZCAke2hlYWRlcnMubGVuZ3RofSBibG9ja3NgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBkZWJ1ZyhlcnIpXG4gICAgfVxuICB9XG59XG4iXX0=