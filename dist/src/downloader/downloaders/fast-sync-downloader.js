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
const bn_js_1 = __importDefault(require("bn.js"));
const ethereumjs_block_1 = __importDefault(require("ethereumjs-block"));
const interfaces_1 = require("../interfaces");
const base_1 = require("./base");
const async_1 = require("async");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:downloaders:fast-sync');
const MAX_PER_REQUEST = 128;
const CONCCURENT_REQUESTS = 15;
const MAX_REQUEST = 128 * 16;
class FastSyncDownloader extends base_1.BaseDownloader {
    constructor(chain, peerManager) {
        super(chain, peerManager);
        this.chain = chain;
        this.highestBlock = new bn_js_1.default(0);
        this.type = interfaces_1.DownloaderType.FAST;
        this.queue = async_1.queue(async_1.asyncify(this.task.bind(this)), CONCCURENT_REQUESTS);
    }
    task({ from, protocol, to, skip, reverse }) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockNumberStr = from.toString(10);
            // increment current block to set as start
            debug(`requesting ${MAX_PER_REQUEST} blocks ` +
                `from ${protocol.peer.id} starting from ${blockNumberStr}`);
            while (from.lte(to)) {
                let headers = yield this.getHeaders(protocol, from, MAX_PER_REQUEST, skip, reverse);
                if (!headers.length)
                    return;
                let bodies = yield this.getBodies(protocol, headers.map(h => h.hash()));
                yield this.store(bodies.map((body, i) => new ethereumjs_block_1.default([headers[i].raw].concat(body))));
                from.iaddn(headers.length);
                debug(`imported ${headers.length} blocks`);
            }
        });
    }
    best() {
        return __awaiter(this, void 0, void 0, function* () {
            const peers = this.peerManager.getByCapability({
                id: 'eth',
                versions: ['63']
            });
            if (!peers.length)
                return;
            const status = yield Promise.all(peers.map((p) => {
                return p.protocols.get('eth').getStatus();
            }));
            let bestPeer;
            let bestPeerTd = yield this.chain.getBlocksTD();
            status.forEach((s, i) => {
                if (s.td.gt(bestPeerTd))
                    bestPeer = peers[i];
            });
            if (bestPeer) {
                this.peerManager.reserve([bestPeer]);
            }
            return bestPeer;
        });
    }
    download(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            let blockNumber = new bn_js_1.default(0);
            const block = yield this.chain.getLatestBlock();
            if (block) {
                blockNumber = new bn_js_1.default(block.header.number);
            }
            const protocol = peer.protocols.get('eth');
            if (!protocol) {
                throw new Error('fast sync requires the ETH capability!');
            }
            const remoteHeader = yield this.latest(protocol, peer);
            if (!remoteHeader) {
                debug(`unable to get remote header from ${peer.id}!`);
                return;
            }
            const remoteNumber = new bn_js_1.default(remoteHeader.header.number);
            const blockNumberStr = blockNumber.toString(10);
            debug(`latest block is ${blockNumberStr} remote block is ${remoteNumber.toString(10)}`);
            blockNumber.iaddn(1);
            const to = remoteNumber.gten(MAX_REQUEST) ? new bn_js_1.default(MAX_REQUEST) : remoteNumber;
            this.queue.push({ from: blockNumber.clone(), protocol, to: to.clone() });
        });
    }
}
exports.FastSyncDownloader = FastSyncDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBRXBDLDhDQUE4QztBQVM5QyxpQ0FBdUM7QUFDdkMsaUNBQW1EO0FBRW5ELGtEQUF5QjtBQUN6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUVyRCxNQUFNLGVBQWUsR0FBVyxHQUFHLENBQUE7QUFDbkMsTUFBTSxtQkFBbUIsR0FBVyxFQUFFLENBQUE7QUFDdEMsTUFBTSxXQUFXLEdBQVcsR0FBRyxHQUFHLEVBQUUsQ0FBQTtBQVVwQyxNQUFhLGtCQUFtQixTQUFRLHFCQUFjO0lBS3BELFlBQW9CLEtBQWUsRUFBRSxXQUF3QjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBRFAsVUFBSyxHQUFMLEtBQUssQ0FBVTtRQUZuQyxpQkFBWSxHQUFPLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBSTFCLElBQUksQ0FBQyxJQUFJLEdBQUcsMkJBQWMsQ0FBQyxJQUFJLENBQUE7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFLLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUE7SUFDekUsQ0FBQztJQUVlLElBQUksQ0FBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O1lBQ3pELE1BQU0sY0FBYyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFaEQsMENBQTBD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QUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFBO2FBQzFEO1lBRUQsTUFBTSxZQUFZLEdBQXNCLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDekUsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDakIsS0FBSyxDQUFDLG9DQUFvQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFDckQsT0FBTTthQUNQO1lBRUQsTUFBTSxZQUFZLEdBQU8sSUFBSSxlQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUMzRCxNQUFNLGNBQWMsR0FBVyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3ZELEtBQUssQ0FBQyxtQkFBbUIsY0FBYyxvQkFBb0IsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFdkYsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwQixNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFBO1lBQzlFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDMUUsQ0FBQztLQUFBO0NBQ0Y7QUFsRkQsZ0RBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCTiBmcm9tICdibi5qcydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuXG5pbXBvcnQgeyBEb3dubG9hZGVyVHlwZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQge1xuICBCbG9ja0JvZHksXG4gIFBlZXIsXG4gIElFdGhQcm90b2NvbCxcbiAgUGVlck1hbmFnZXIsXG4gIEV0aFByb3RvY29sXG59IGZyb20gJy4uLy4uL25ldCdcbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IEJhc2VEb3dubG9hZGVyIH0gZnJvbSAnLi9iYXNlJ1xuaW1wb3J0IHsgcXVldWUsIEFzeW5jUXVldWUsIGFzeW5jaWZ5IH0gZnJvbSAnYXN5bmMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmRvd25sb2FkZXJzOmZhc3Qtc3luYycpXG5cbmNvbnN0IE1BWF9QRVJfUkVRVUVTVDogbnVtYmVyID0gMTI4XG5jb25zdCBDT05DQ1VSRU5UX1JFUVVFU1RTOiBudW1iZXIgPSAxNVxuY29uc3QgTUFYX1JFUVVFU1Q6IG51bWJlciA9IDEyOCAqIDE2XG5cbmludGVyZmFjZSBUYXNrUGF5bG9hZCB7XG4gIHByb3RvY29sOiBJRXRoUHJvdG9jb2xcbiAgZnJvbTogQk5cbiAgdG86IEJOXG4gIHJldmVyc2U/OiBib29sZWFuXG4gIHNraXA/OiBudW1iZXJcbn1cblxuZXhwb3J0IGNsYXNzIEZhc3RTeW5jRG93bmxvYWRlciBleHRlbmRzIEJhc2VEb3dubG9hZGVyIHtcbiAgdHlwZTogRG93bmxvYWRlclR5cGVcbiAgcXVldWU6IEFzeW5jUXVldWU8VGFza1BheWxvYWQ+XG4gIGhpZ2hlc3RCbG9jazogQk4gPSBuZXcgQk4oMClcblxuICBjb25zdHJ1Y3RvciAocHVibGljIGNoYWluOiBFdGhDaGFpbiwgcGVlck1hbmFnZXI6IFBlZXJNYW5hZ2VyKSB7XG4gICAgc3VwZXIoY2hhaW4sIHBlZXJNYW5hZ2VyKVxuICAgIHRoaXMudHlwZSA9IERvd25sb2FkZXJUeXBlLkZBU1RcbiAgICB0aGlzLnF1ZXVlID0gcXVldWUoYXN5bmNpZnkodGhpcy50YXNrLmJpbmQodGhpcykpLCBDT05DQ1VSRU5UX1JFUVVFU1RTKVxuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIHRhc2sgKHsgZnJvbSwgcHJvdG9jb2wsIHRvLCBza2lwLCByZXZlcnNlIH0pIHtcbiAgICBjb25zdCBibG9ja051bWJlclN0cjogc3RyaW5nID0gZnJvbS50b1N0cmluZygxMClcblxuICAgIC8vIGluY3JlbWVudCBjdXJyZW50IGJsb2NrIHRvIHNldCBhcyBzdGFydFxuICAgIGRlYnVnKGByZXF1ZXN0aW5nICR7TUFYX1BFUl9SRVFVRVNUfSBibG9ja3MgYCArXG4gICAgICBgZnJvbSAke3Byb3RvY29sLnBlZXIuaWR9IHN0YXJ0aW5nIGZyb20gJHtibG9ja051bWJlclN0cn1gKVxuICAgIHdoaWxlIChmcm9tLmx0ZSh0bykpIHtcbiAgICAgIGxldCBoZWFkZXJzOiBCbG9jay5IZWFkZXJbXSA9IGF3YWl0IHRoaXMuZ2V0SGVhZGVycyhwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCxcbiAgICAgICAgZnJvbSwgTUFYX1BFUl9SRVFVRVNULCBza2lwLCByZXZlcnNlKVxuXG4gICAgICBpZiAoIWhlYWRlcnMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgbGV0IGJvZGllczogQmxvY2tCb2R5W10gPSBhd2FpdCB0aGlzLmdldEJvZGllcyhwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCxcbiAgICAgICAgaGVhZGVycy5tYXAoaCA9PiBoLmhhc2goKSkpXG5cbiAgICAgIGF3YWl0IHRoaXMuc3RvcmUoYm9kaWVzLm1hcCgoYm9keSwgaSkgPT4gbmV3IEJsb2NrKFtoZWFkZXJzW2ldLnJhd10uY29uY2F0KGJvZHkpKSkpXG4gICAgICBmcm9tLmlhZGRuKGhlYWRlcnMubGVuZ3RoKVxuICAgICAgZGVidWcoYGltcG9ydGVkICR7aGVhZGVycy5sZW5ndGh9IGJsb2Nrc2ApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYmVzdCAoKTogUHJvbWlzZTxQZWVyIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgcGVlcnM6IFBlZXJbXSA9IHRoaXMucGVlck1hbmFnZXIuZ2V0QnlDYXBhYmlsaXR5KHtcbiAgICAgIGlkOiAnZXRoJyxcbiAgICAgIHZlcnNpb25zOiBbJzYzJ11cbiAgICB9KVxuXG4gICAgaWYgKCFwZWVycy5sZW5ndGgpIHJldHVyblxuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IFByb21pc2UuYWxsKHBlZXJzLm1hcCgocCkgPT4ge1xuICAgICAgcmV0dXJuIChwLnByb3RvY29scy5nZXQoJ2V0aCcpIGFzIEV0aFByb3RvY29sPGFueT4pIS5nZXRTdGF0dXMoKVxuICAgIH0pKVxuXG4gICAgbGV0IGJlc3RQZWVyOiBQZWVyIHwgdW5kZWZpbmVkXG4gICAgbGV0IGJlc3RQZWVyVGQ6IEJOID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRCbG9ja3NURCgpXG4gICAgc3RhdHVzLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgIGlmIChzLnRkLmd0KGJlc3RQZWVyVGQpKSBiZXN0UGVlciA9IHBlZXJzW2ldXG4gICAgfSlcblxuICAgIGlmIChiZXN0UGVlcikge1xuICAgICAgdGhpcy5wZWVyTWFuYWdlci5yZXNlcnZlKFtiZXN0UGVlcl0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGJlc3RQZWVyXG4gIH1cblxuICBhc3luYyBkb3dubG9hZCAocGVlcjogUGVlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBibG9ja051bWJlcjogQk4gPSBuZXcgQk4oMClcbiAgICBjb25zdCBibG9jazogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmNoYWluLmdldExhdGVzdEJsb2NrKClcbiAgICBpZiAoYmxvY2spIHtcbiAgICAgIGJsb2NrTnVtYmVyID0gbmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpXG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwZWVyLnByb3RvY29scy5nZXQoJ2V0aCcpIGFzIHVua25vd24gYXMgSUV0aFByb3RvY29sXG4gICAgaWYgKCFwcm90b2NvbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmYXN0IHN5bmMgcmVxdWlyZXMgdGhlIEVUSCBjYXBhYmlsaXR5IScpXG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3RlSGVhZGVyOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMubGF0ZXN0KHByb3RvY29sLCBwZWVyKVxuICAgIGlmICghcmVtb3RlSGVhZGVyKSB7XG4gICAgICBkZWJ1ZyhgdW5hYmxlIHRvIGdldCByZW1vdGUgaGVhZGVyIGZyb20gJHtwZWVyLmlkfSFgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3RlTnVtYmVyOiBCTiA9IG5ldyBCTihyZW1vdGVIZWFkZXIuaGVhZGVyLm51bWJlcilcbiAgICBjb25zdCBibG9ja051bWJlclN0cjogc3RyaW5nID0gYmxvY2tOdW1iZXIudG9TdHJpbmcoMTApXG4gICAgZGVidWcoYGxhdGVzdCBibG9jayBpcyAke2Jsb2NrTnVtYmVyU3RyfSByZW1vdGUgYmxvY2sgaXMgJHtyZW1vdGVOdW1iZXIudG9TdHJpbmcoMTApfWApXG5cbiAgICBibG9ja051bWJlci5pYWRkbigxKVxuICAgIGNvbnN0IHRvID0gcmVtb3RlTnVtYmVyLmd0ZW4oTUFYX1JFUVVFU1QpID8gbmV3IEJOKE1BWF9SRVFVRVNUKSA6IHJlbW90ZU51bWJlclxuICAgIHRoaXMucXVldWUucHVzaCh7IGZyb206IGJsb2NrTnVtYmVyLmNsb25lKCksIHByb3RvY29sLCB0bzogdG8uY2xvbmUoKSB9KVxuICB9XG59XG4iXX0=