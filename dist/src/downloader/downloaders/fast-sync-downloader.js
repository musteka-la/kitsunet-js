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
class FastSyncDownloader extends base_1.BaseDownloader {
    constructor(chain, peerManager) {
        super(chain, peerManager);
        this.chain = chain;
        this.highestBlock = new bn_js_1.default(0);
        this.type = interfaces_1.DownloaderType.FAST;
        this.queue = async_1.queue(async_1.asyncify(this.task.bind(this)), base_1.CONCCURENT_REQUESTS);
    }
    task({ from, to, skip, reverse, protocol, peer }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromStr = from.toString(10);
            // increment current block to set as start
            debug(`requesting ${base_1.MAX_PER_REQUEST} blocks ` +
                `from ${protocol.peer.id} starting from ${fromStr}`);
            while (from.lte(to)) {
                const headers = yield this.getHeaders(protocol, peer, from, base_1.MAX_PER_REQUEST, skip, reverse);
                if (!headers.length) {
                    debug(`couldn't import blocks from ${peer.id}, aborting`);
                    return;
                }
                const bodies = yield this.getBodies(protocol, peer, headers.map(h => h.hash()));
                yield this.store(bodies.map((body, i) => new ethereumjs_block_1.default([headers[i].raw].concat(body))));
                from.iaddn(headers.length);
                debug(`imported ${headers.length} blocks from ${peer.id}`);
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
            let from = new bn_js_1.default(0);
            const block = yield this.chain.getLatestBlock();
            if (block) {
                from = new bn_js_1.default(block.header.number);
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
            const remote = new bn_js_1.default(remoteHeader.header.number);
            const remoteStr = remote.toString(10);
            if (from.gte(remote)) {
                debug(`remote block ${remoteStr} is lower or equal to local block, skiping!`);
                return;
            }
            const ancestor = yield this.findAncestor(protocol, peer, from);
            if (!ancestor) {
                debug(new Error(`unable to find common ancestor with peer ${peer.id}`));
                this.peerManager.ban([peer]);
                return;
            }
            from = new bn_js_1.default(ancestor.header.number);
            const localStr = from.toString(10);
            debug(`latest block is ${localStr} remote block is ${remoteStr}`);
            from.iaddn(1);
            const to = remote.sub(from).gten(base_1.MAX_REQUEST)
                ? from.addn(base_1.MAX_REQUEST)
                : remote;
            try {
                const payload = { from: from.clone(), to: to.clone(), protocol, peer };
                yield this.queue.push(payload);
                debug(`queue contains ${this.queue.length()} tasks and ${this.queue.workersList().length} workers`);
            }
            catch (err) {
                debug(`an error occurred processing fast sync task `, err);
            }
        });
    }
}
exports.FastSyncDownloader = FastSyncDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBRXBDLDhDQUE4QztBQVc5QyxpQ0FLZTtBQUdmLGlDQUFtRDtBQUVuRCxrREFBeUI7QUFDekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7QUFXckQsTUFBYSxrQkFBbUIsU0FBUSxxQkFBYztJQUtwRCxZQUFvQixLQUFlLEVBQ3RCLFdBQXdCO1FBQ25DLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFGUCxVQUFLLEdBQUwsS0FBSyxDQUFVO1FBRm5DLGlCQUFZLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFLMUIsSUFBSSxDQUFDLElBQUksR0FBRywyQkFBYyxDQUFDLElBQUksQ0FBQTtRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLGFBQUssQ0FBQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsMEJBQW1CLENBQUMsQ0FBQTtJQUN6RSxDQUFDO0lBRWUsSUFBSSxDQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQWU7O1lBQzVFLE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFekMsMENBQTBDO1lBQzFDLEtBQUssQ0FBQyxjQUFjLHNCQUFlLFVBQVU7Z0JBQzNDLFFBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLGtCQUFrQixPQUFPLEVBQUUsQ0FBQyxDQUFB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Q0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDYixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBVyxDQUFDO2dCQUMzQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBVyxDQUFDO2dCQUN4QixDQUFDLENBQUMsTUFBTSxDQUFBO1lBRVYsSUFBSTtnQkFDRixNQUFNLE9BQU8sR0FBZ0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFBO2dCQUNuRixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUM5QixLQUFLLENBQUMsa0JBQWtCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFBO2FBQ3BHO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osS0FBSyxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2FBQzNEO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFwSEQsZ0RBb0hDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCTiBmcm9tICdibi5qcydcbmltcG9ydCBCbG9jayBmcm9tICdldGhlcmV1bWpzLWJsb2NrJ1xuXG5pbXBvcnQgeyBEb3dubG9hZGVyVHlwZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQge1xuICBCbG9ja0JvZHksXG4gIFBlZXIsXG4gIElFdGhQcm90b2NvbCxcbiAgUGVlck1hbmFnZXIsXG4gIEV0aFByb3RvY29sLFxuICBJUHJvdG9jb2wsXG4gIFByb3RvY29sVHlwZXNcbn0gZnJvbSAnLi4vLi4vbmV0J1xuXG5pbXBvcnQge1xuICBCYXNlRG93bmxvYWRlcixcbiAgTUFYX1BFUl9SRVFVRVNULFxuICBDT05DQ1VSRU5UX1JFUVVFU1RTLFxuICBNQVhfUkVRVUVTVFxufSBmcm9tICcuL2Jhc2UnXG5cbmltcG9ydCB7IEV0aENoYWluIH0gZnJvbSAnLi4vLi4vYmxvY2tjaGFpbidcbmltcG9ydCB7IHF1ZXVlLCBBc3luY1F1ZXVlLCBhc3luY2lmeSB9IGZyb20gJ2FzeW5jJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyczpmYXN0LXN5bmMnKVxuXG5pbnRlcmZhY2UgVGFza1BheWxvYWQge1xuICBwcm90b2NvbDogSVByb3RvY29sPFByb3RvY29sVHlwZXM+XG4gIGZyb206IEJOXG4gIHRvOiBCTlxuICByZXZlcnNlPzogYm9vbGVhblxuICBza2lwPzogbnVtYmVyXG4gIHBlZXI6IFBlZXJcbn1cblxuZXhwb3J0IGNsYXNzIEZhc3RTeW5jRG93bmxvYWRlciBleHRlbmRzIEJhc2VEb3dubG9hZGVyIHtcbiAgdHlwZTogRG93bmxvYWRlclR5cGVcbiAgcXVldWU6IEFzeW5jUXVldWU8VGFza1BheWxvYWQ+XG4gIGhpZ2hlc3RCbG9jazogQk4gPSBuZXcgQk4oMClcblxuICBjb25zdHJ1Y3RvciAocHVibGljIGNoYWluOiBFdGhDaGFpbixcbiAgICAgICAgICAgICAgIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlcikge1xuICAgIHN1cGVyKGNoYWluLCBwZWVyTWFuYWdlcilcbiAgICB0aGlzLnR5cGUgPSBEb3dubG9hZGVyVHlwZS5GQVNUXG4gICAgdGhpcy5xdWV1ZSA9IHF1ZXVlKGFzeW5jaWZ5KHRoaXMudGFzay5iaW5kKHRoaXMpKSwgQ09OQ0NVUkVOVF9SRVFVRVNUUylcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyB0YXNrICh7IGZyb20sIHRvLCBza2lwLCByZXZlcnNlLCBwcm90b2NvbCwgcGVlciB9OiBUYXNrUGF5bG9hZCkge1xuICAgIGNvbnN0IGZyb21TdHI6IHN0cmluZyA9IGZyb20udG9TdHJpbmcoMTApXG5cbiAgICAvLyBpbmNyZW1lbnQgY3VycmVudCBibG9jayB0byBzZXQgYXMgc3RhcnRcbiAgICBkZWJ1ZyhgcmVxdWVzdGluZyAke01BWF9QRVJfUkVRVUVTVH0gYmxvY2tzIGAgK1xuICAgICAgYGZyb20gJHtwcm90b2NvbC5wZWVyLmlkfSBzdGFydGluZyBmcm9tICR7ZnJvbVN0cn1gKVxuICAgIHdoaWxlIChmcm9tLmx0ZSh0bykpIHtcbiAgICAgIGNvbnN0IGhlYWRlcnM6IEJsb2NrLkhlYWRlcltdID0gYXdhaXQgdGhpcy5nZXRIZWFkZXJzKFxuICAgICAgICBwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCxcbiAgICAgICAgcGVlcixcbiAgICAgICAgZnJvbSxcbiAgICAgICAgTUFYX1BFUl9SRVFVRVNULFxuICAgICAgICBza2lwLFxuICAgICAgICByZXZlcnNlKVxuXG4gICAgICBpZiAoIWhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICAgIGRlYnVnKGBjb3VsZG4ndCBpbXBvcnQgYmxvY2tzIGZyb20gJHtwZWVyLmlkfSwgYWJvcnRpbmdgKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgYm9kaWVzOiBCbG9ja0JvZHlbXSA9IGF3YWl0IHRoaXMuZ2V0Qm9kaWVzKFxuICAgICAgICBwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCxcbiAgICAgICAgcGVlcixcbiAgICAgICAgaGVhZGVycy5tYXAoaCA9PiBoLmhhc2goKSkpXG5cbiAgICAgIGF3YWl0IHRoaXMuc3RvcmUoYm9kaWVzLm1hcCgoYm9keSwgaSkgPT4gbmV3IEJsb2NrKFtoZWFkZXJzW2ldLnJhd10uY29uY2F0KGJvZHkpKSkpXG4gICAgICBmcm9tLmlhZGRuKGhlYWRlcnMubGVuZ3RoKVxuICAgICAgZGVidWcoYGltcG9ydGVkICR7aGVhZGVycy5sZW5ndGh9IGJsb2NrcyBmcm9tICR7cGVlci5pZH1gKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGJlc3QgKCk6IFByb21pc2U8UGVlciB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHBlZXJzOiBQZWVyW10gPSB0aGlzLnBlZXJNYW5hZ2VyLmdldEJ5Q2FwYWJpbGl0eSh7XG4gICAgICBpZDogJ2V0aCcsXG4gICAgICB2ZXJzaW9uczogWyc2MyddXG4gICAgfSlcblxuICAgIGlmICghcGVlcnMubGVuZ3RoKSByZXR1cm5cbiAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBQcm9taXNlLmFsbChwZWVycy5tYXAoKHApID0+IHtcbiAgICAgIHJldHVybiAocC5wcm90b2NvbHMuZ2V0KCdldGgnKSBhcyBFdGhQcm90b2NvbDxhbnk+KSEuZ2V0U3RhdHVzKClcbiAgICB9KSlcblxuICAgIGxldCBiZXN0UGVlcjogUGVlciB8IHVuZGVmaW5lZFxuICAgIGxldCBiZXN0UGVlclRkOiBCTiA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0QmxvY2tzVEQoKVxuICAgIHN0YXR1cy5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICBpZiAocy50ZC5ndChiZXN0UGVlclRkKSkgYmVzdFBlZXIgPSBwZWVyc1tpXVxuICAgIH0pXG5cbiAgICBpZiAoYmVzdFBlZXIpIHtcbiAgICAgIHRoaXMucGVlck1hbmFnZXIucmVzZXJ2ZShbYmVzdFBlZXJdKVxuICAgIH1cblxuICAgIHJldHVybiBiZXN0UGVlclxuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQgKHBlZXI6IFBlZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgZnJvbTogQk4gPSBuZXcgQk4oMClcbiAgICBjb25zdCBibG9jazogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmNoYWluLmdldExhdGVzdEJsb2NrKClcbiAgICBpZiAoYmxvY2spIHtcbiAgICAgIGZyb20gPSBuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcilcbiAgICB9XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHBlZXIucHJvdG9jb2xzLmdldCgnZXRoJylcbiAgICBpZiAoIXByb3RvY29sKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Zhc3Qgc3luYyByZXF1aXJlcyB0aGUgRVRIIGNhcGFiaWxpdHkhJylcbiAgICB9XG5cbiAgICBjb25zdCByZW1vdGVIZWFkZXI6IEJsb2NrIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5sYXRlc3QocHJvdG9jb2wgYXMgdW5rbm93biBhcyBJRXRoUHJvdG9jb2wsIHBlZXIpXG4gICAgaWYgKCFyZW1vdGVIZWFkZXIpIHtcbiAgICAgIGRlYnVnKGB1bmFibGUgdG8gZ2V0IHJlbW90ZSBoZWFkZXIgZnJvbSAke3BlZXIuaWR9IWApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCByZW1vdGU6IEJOID0gbmV3IEJOKHJlbW90ZUhlYWRlci5oZWFkZXIubnVtYmVyKVxuICAgIGNvbnN0IHJlbW90ZVN0cjogc3RyaW5nID0gcmVtb3RlLnRvU3RyaW5nKDEwKVxuICAgIGlmIChmcm9tLmd0ZShyZW1vdGUpKSB7XG4gICAgICBkZWJ1ZyhgcmVtb3RlIGJsb2NrICR7cmVtb3RlU3RyfSBpcyBsb3dlciBvciBlcXVhbCB0byBsb2NhbCBibG9jaywgc2tpcGluZyFgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgYW5jZXN0b3IgPSBhd2FpdCB0aGlzLmZpbmRBbmNlc3Rvcihwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCwgcGVlciwgZnJvbSlcbiAgICBpZiAoIWFuY2VzdG9yKSB7XG4gICAgICBkZWJ1ZyhuZXcgRXJyb3IoYHVuYWJsZSB0byBmaW5kIGNvbW1vbiBhbmNlc3RvciB3aXRoIHBlZXIgJHtwZWVyLmlkfWApKVxuICAgICAgdGhpcy5wZWVyTWFuYWdlci5iYW4oW3BlZXJdKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZnJvbSA9IG5ldyBCTihhbmNlc3Rvci5oZWFkZXIubnVtYmVyKVxuICAgIGNvbnN0IGxvY2FsU3RyOiBzdHJpbmcgPSBmcm9tLnRvU3RyaW5nKDEwKVxuICAgIGRlYnVnKGBsYXRlc3QgYmxvY2sgaXMgJHtsb2NhbFN0cn0gcmVtb3RlIGJsb2NrIGlzICR7cmVtb3RlU3RyfWApXG5cbiAgICBmcm9tLmlhZGRuKDEpXG4gICAgY29uc3QgdG8gPSByZW1vdGUuc3ViKGZyb20pLmd0ZW4oTUFYX1JFUVVFU1QpXG4gICAgICA/IGZyb20uYWRkbihNQVhfUkVRVUVTVClcbiAgICAgIDogcmVtb3RlXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcGF5bG9hZDogVGFza1BheWxvYWQgPSB7IGZyb206IGZyb20uY2xvbmUoKSwgdG86IHRvLmNsb25lKCksIHByb3RvY29sLCBwZWVyIH1cbiAgICAgIGF3YWl0IHRoaXMucXVldWUucHVzaChwYXlsb2FkKVxuICAgICAgZGVidWcoYHF1ZXVlIGNvbnRhaW5zICR7dGhpcy5xdWV1ZS5sZW5ndGgoKX0gdGFza3MgYW5kICR7dGhpcy5xdWV1ZS53b3JrZXJzTGlzdCgpLmxlbmd0aH0gd29ya2Vyc2ApXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBkZWJ1ZyhgYW4gZXJyb3Igb2NjdXJyZWQgcHJvY2Vzc2luZyBmYXN0IHN5bmMgdGFzayBgLCBlcnIpXG4gICAgfVxuICB9XG59XG4iXX0=