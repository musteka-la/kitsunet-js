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
            // FIXME: do we need this?
            const ancestor = yield this.findAncestor(protocol, peer, from);
            if (!ancestor) {
                debug(new Error(`unable to find common ancestor with peer ${peer.id}`));
                this.peerManager.ban([peer]);
                return;
            }
            from = new bn_js_1.default(ancestor.header.number);
            const remote = new bn_js_1.default(remoteHeader.header.number);
            const localStr = from.toString(10);
            const remoteStr = remote.toString(10);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBRXBDLDhDQUE4QztBQVc5QyxpQ0FLZTtBQUdmLGlDQUFtRDtBQUVuRCxrREFBeUI7QUFDekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7QUFXckQsTUFBYSxrQkFBbUIsU0FBUSxxQkFBYztJQUtwRCxZQUFvQixLQUFlLEVBQ3RCLFdBQXdCO1FBQ25DLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFGUCxVQUFLLEdBQUwsS0FBSyxDQUFVO1FBRm5DLGlCQUFZLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFLMUIsSUFBSSxDQUFDLElBQUksR0FBRywyQkFBYyxDQUFDLElBQUksQ0FBQTtRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLGFBQUssQ0FBQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsMEJBQW1CLENBQUMsQ0FBQTtJQUN6RSxDQUFDO0lBRWUsSUFBSSxDQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQWU7O1lBQzVFLE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFekMsMENBQTBDO1lBQzFDLEtBQUssQ0FBQyxjQUFjLHNCQUFlLFVBQVU7Z0JBQzNDLFFBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLGtCQUFrQixPQUFPLEVBQUUsQ0FBQyxDQUFB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a0JBQVcsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQVcsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtZQUVWLElBQUk7Z0JBQ0YsTUFBTSxPQUFPLEdBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQTtnQkFDbkYsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDOUIsS0FBSyxDQUFDLGtCQUFrQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxVQUFVLENBQUMsQ0FBQTthQUNwRztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLEtBQUssQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUMzRDtRQUNILENBQUM7S0FBQTtDQUNGO0FBaEhELGdEQWdIQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcblxuaW1wb3J0IHsgRG93bmxvYWRlclR5cGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHtcbiAgQmxvY2tCb2R5LFxuICBQZWVyLFxuICBJRXRoUHJvdG9jb2wsXG4gIFBlZXJNYW5hZ2VyLFxuICBFdGhQcm90b2NvbCxcbiAgSVByb3RvY29sLFxuICBQcm90b2NvbFR5cGVzXG59IGZyb20gJy4uLy4uL25ldCdcblxuaW1wb3J0IHtcbiAgQmFzZURvd25sb2FkZXIsXG4gIE1BWF9QRVJfUkVRVUVTVCxcbiAgQ09OQ0NVUkVOVF9SRVFVRVNUUyxcbiAgTUFYX1JFUVVFU1Rcbn0gZnJvbSAnLi9iYXNlJ1xuXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBxdWV1ZSwgQXN5bmNRdWV1ZSwgYXN5bmNpZnkgfSBmcm9tICdhc3luYydcblxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6ZG93bmxvYWRlcnM6ZmFzdC1zeW5jJylcblxuaW50ZXJmYWNlIFRhc2tQYXlsb2FkIHtcbiAgcHJvdG9jb2w6IElQcm90b2NvbDxQcm90b2NvbFR5cGVzPlxuICBmcm9tOiBCTlxuICB0bzogQk5cbiAgcmV2ZXJzZT86IGJvb2xlYW5cbiAgc2tpcD86IG51bWJlclxuICBwZWVyOiBQZWVyXG59XG5cbmV4cG9ydCBjbGFzcyBGYXN0U3luY0Rvd25sb2FkZXIgZXh0ZW5kcyBCYXNlRG93bmxvYWRlciB7XG4gIHR5cGU6IERvd25sb2FkZXJUeXBlXG4gIHF1ZXVlOiBBc3luY1F1ZXVlPFRhc2tQYXlsb2FkPlxuICBoaWdoZXN0QmxvY2s6IEJOID0gbmV3IEJOKDApXG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBjaGFpbjogRXRoQ2hhaW4sXG4gICAgICAgICAgICAgICBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIpIHtcbiAgICBzdXBlcihjaGFpbiwgcGVlck1hbmFnZXIpXG4gICAgdGhpcy50eXBlID0gRG93bmxvYWRlclR5cGUuRkFTVFxuICAgIHRoaXMucXVldWUgPSBxdWV1ZShhc3luY2lmeSh0aGlzLnRhc2suYmluZCh0aGlzKSksIENPTkNDVVJFTlRfUkVRVUVTVFMpXG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgdGFzayAoeyBmcm9tLCB0bywgc2tpcCwgcmV2ZXJzZSwgcHJvdG9jb2wsIHBlZXIgfTogVGFza1BheWxvYWQpIHtcbiAgICBjb25zdCBmcm9tU3RyOiBzdHJpbmcgPSBmcm9tLnRvU3RyaW5nKDEwKVxuXG4gICAgLy8gaW5jcmVtZW50IGN1cnJlbnQgYmxvY2sgdG8gc2V0IGFzIHN0YXJ0XG4gICAgZGVidWcoYHJlcXVlc3RpbmcgJHtNQVhfUEVSX1JFUVVFU1R9IGJsb2NrcyBgICtcbiAgICAgIGBmcm9tICR7cHJvdG9jb2wucGVlci5pZH0gc3RhcnRpbmcgZnJvbSAke2Zyb21TdHJ9YClcbiAgICB3aGlsZSAoZnJvbS5sdGUodG8pKSB7XG4gICAgICBjb25zdCBoZWFkZXJzOiBCbG9jay5IZWFkZXJbXSA9IGF3YWl0IHRoaXMuZ2V0SGVhZGVycyhcbiAgICAgICAgcHJvdG9jb2wgYXMgdW5rbm93biBhcyBJRXRoUHJvdG9jb2wsXG4gICAgICAgIHBlZXIsXG4gICAgICAgIGZyb20sXG4gICAgICAgIE1BWF9QRVJfUkVRVUVTVCxcbiAgICAgICAgc2tpcCxcbiAgICAgICAgcmV2ZXJzZSlcblxuICAgICAgaWYgKCFoZWFkZXJzLmxlbmd0aCkge1xuICAgICAgICBkZWJ1ZyhgY291bGRuJ3QgaW1wb3J0IGJsb2NrcyBmcm9tICR7cGVlci5pZH0sIGFib3J0aW5nYClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJvZGllczogQmxvY2tCb2R5W10gPSBhd2FpdCB0aGlzLmdldEJvZGllcyhcbiAgICAgICAgcHJvdG9jb2wgYXMgdW5rbm93biBhcyBJRXRoUHJvdG9jb2wsXG4gICAgICAgIHBlZXIsXG4gICAgICAgIGhlYWRlcnMubWFwKGggPT4gaC5oYXNoKCkpKVxuXG4gICAgICBhd2FpdCB0aGlzLnN0b3JlKGJvZGllcy5tYXAoKGJvZHksIGkpID0+IG5ldyBCbG9jayhbaGVhZGVyc1tpXS5yYXddLmNvbmNhdChib2R5KSkpKVxuICAgICAgZnJvbS5pYWRkbihoZWFkZXJzLmxlbmd0aClcbiAgICAgIGRlYnVnKGBpbXBvcnRlZCAke2hlYWRlcnMubGVuZ3RofSBibG9ja3MgZnJvbSAke3BlZXIuaWR9YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBiZXN0ICgpOiBQcm9taXNlPFBlZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBwZWVyczogUGVlcltdID0gdGhpcy5wZWVyTWFuYWdlci5nZXRCeUNhcGFiaWxpdHkoe1xuICAgICAgaWQ6ICdldGgnLFxuICAgICAgdmVyc2lvbnM6IFsnNjMnXVxuICAgIH0pXG5cbiAgICBpZiAoIXBlZXJzLmxlbmd0aCkgcmV0dXJuXG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgUHJvbWlzZS5hbGwocGVlcnMubWFwKChwKSA9PiB7XG4gICAgICByZXR1cm4gKHAucHJvdG9jb2xzLmdldCgnZXRoJykgYXMgRXRoUHJvdG9jb2w8YW55PikhLmdldFN0YXR1cygpXG4gICAgfSkpXG5cbiAgICBsZXQgYmVzdFBlZXI6IFBlZXIgfCB1bmRlZmluZWRcbiAgICBsZXQgYmVzdFBlZXJUZDogQk4gPSBhd2FpdCB0aGlzLmNoYWluLmdldEJsb2Nrc1REKClcbiAgICBzdGF0dXMuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgaWYgKHMudGQuZ3QoYmVzdFBlZXJUZCkpIGJlc3RQZWVyID0gcGVlcnNbaV1cbiAgICB9KVxuXG4gICAgaWYgKGJlc3RQZWVyKSB7XG4gICAgICB0aGlzLnBlZXJNYW5hZ2VyLnJlc2VydmUoW2Jlc3RQZWVyXSlcbiAgICB9XG5cbiAgICByZXR1cm4gYmVzdFBlZXJcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkIChwZWVyOiBQZWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGZyb206IEJOID0gbmV3IEJOKDApXG4gICAgY29uc3QgYmxvY2s6IEJsb2NrIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRMYXRlc3RCbG9jaygpXG4gICAgaWYgKGJsb2NrKSB7XG4gICAgICBmcm9tID0gbmV3IEJOKGJsb2NrLmhlYWRlci5udW1iZXIpXG4gICAgfVxuXG4gICAgY29uc3QgcHJvdG9jb2wgPSBwZWVyLnByb3RvY29scy5nZXQoJ2V0aCcpXG4gICAgaWYgKCFwcm90b2NvbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmYXN0IHN5bmMgcmVxdWlyZXMgdGhlIEVUSCBjYXBhYmlsaXR5IScpXG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3RlSGVhZGVyOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMubGF0ZXN0KHByb3RvY29sIGFzIHVua25vd24gYXMgSUV0aFByb3RvY29sLCBwZWVyKVxuICAgIGlmICghcmVtb3RlSGVhZGVyKSB7XG4gICAgICBkZWJ1ZyhgdW5hYmxlIHRvIGdldCByZW1vdGUgaGVhZGVyIGZyb20gJHtwZWVyLmlkfSFgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gRklYTUU6IGRvIHdlIG5lZWQgdGhpcz9cbiAgICBjb25zdCBhbmNlc3RvciA9IGF3YWl0IHRoaXMuZmluZEFuY2VzdG9yKHByb3RvY29sIGFzIHVua25vd24gYXMgSUV0aFByb3RvY29sLCBwZWVyLCBmcm9tKVxuICAgIGlmICghYW5jZXN0b3IpIHtcbiAgICAgIGRlYnVnKG5ldyBFcnJvcihgdW5hYmxlIHRvIGZpbmQgY29tbW9uIGFuY2VzdG9yIHdpdGggcGVlciAke3BlZXIuaWR9YCkpXG4gICAgICB0aGlzLnBlZXJNYW5hZ2VyLmJhbihbcGVlcl0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBmcm9tID0gbmV3IEJOKGFuY2VzdG9yLmhlYWRlci5udW1iZXIpXG4gICAgY29uc3QgcmVtb3RlOiBCTiA9IG5ldyBCTihyZW1vdGVIZWFkZXIuaGVhZGVyLm51bWJlcilcbiAgICBjb25zdCBsb2NhbFN0cjogc3RyaW5nID0gZnJvbS50b1N0cmluZygxMClcbiAgICBjb25zdCByZW1vdGVTdHI6IHN0cmluZyA9IHJlbW90ZS50b1N0cmluZygxMClcbiAgICBkZWJ1ZyhgbGF0ZXN0IGJsb2NrIGlzICR7bG9jYWxTdHJ9IHJlbW90ZSBibG9jayBpcyAke3JlbW90ZVN0cn1gKVxuXG4gICAgZnJvbS5pYWRkbigxKVxuICAgIGNvbnN0IHRvID0gcmVtb3RlLnN1Yihmcm9tKS5ndGVuKE1BWF9SRVFVRVNUKVxuICAgICAgPyBmcm9tLmFkZG4oTUFYX1JFUVVFU1QpXG4gICAgICA6IHJlbW90ZVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBheWxvYWQ6IFRhc2tQYXlsb2FkID0geyBmcm9tOiBmcm9tLmNsb25lKCksIHRvOiB0by5jbG9uZSgpLCBwcm90b2NvbCwgcGVlciB9XG4gICAgICBhd2FpdCB0aGlzLnF1ZXVlLnB1c2gocGF5bG9hZClcbiAgICAgIGRlYnVnKGBxdWV1ZSBjb250YWlucyAke3RoaXMucXVldWUubGVuZ3RoKCl9IHRhc2tzIGFuZCAke3RoaXMucXVldWUud29ya2Vyc0xpc3QoKS5sZW5ndGh9IHdvcmtlcnNgKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVidWcoYGFuIGVycm9yIG9jY3VycmVkIHByb2Nlc3NpbmcgZmFzdCBzeW5jIHRhc2sgYCwgZXJyKVxuICAgIH1cbiAgfVxufVxuIl19