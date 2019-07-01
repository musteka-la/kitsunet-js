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
                let headers = yield this.getHeaders(protocol, peer, from, base_1.MAX_PER_REQUEST, skip, reverse);
                if (!headers.length)
                    return;
                let bodies = yield this.getBodies(protocol, peer, headers.map(h => h.hash()));
                this.store(bodies.map((body, i) => new ethereumjs_block_1.default([headers[i].raw].concat(body))));
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
            const ancestor = yield this.findAncestor(protocol, peer, from);
            if (!ancestor) {
                debug(new Error(`unable to find common ancestor with peer ${peer.id}`));
                this.peerManager.ban([peer]);
                return;
            }
            from = new bn_js_1.default(ancestor.header.number);
            const remote = new bn_js_1.default(remoteHeader.header.number);
            const localStr = from.toString(10);
            debug(`latest block is ${localStr} remote block is ${remote.toString(10)}`);
            from.iaddn(1);
            const to = remote.sub(from).gten(base_1.MAX_REQUEST)
                ? from.addn(base_1.MAX_REQUEST)
                : remote;
            this.queue.push({ from: from.clone(), to: to.clone(), protocol, peer });
        });
    }
}
exports.FastSyncDownloader = FastSyncDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBRXBDLDhDQUE4QztBQVM5QyxpQ0FBMEY7QUFDMUYsaUNBQW1EO0FBRW5ELGtEQUF5QjtBQUN6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtBQVdyRCxNQUFhLGtCQUFtQixTQUFRLHFCQUFjO0lBS3BELFlBQW9CLEtBQWUsRUFDdEIsV0FBd0I7UUFDbkMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUZQLFVBQUssR0FBTCxLQUFLLENBQVU7UUFGbkMsaUJBQVksR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUsxQixJQUFJLENBQUMsSUFBSSxHQUFHLDJCQUFjLENBQUMsSUFBSSxDQUFBO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBSyxDQUFDLGdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSwwQkFBbUIsQ0FBQyxDQUFBO0lBQ3pFLENBQUM7SUFFZSxJQUFJLENBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTs7WUFDL0QsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUV6QywwQ0FBMEM7WUFDMUMsS0FBSyxDQUFDLGNBQWMsc0JBQWUsVUFBVTtnQkFDM0MsUUFBUSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsa0JBQWtCLE9BQU8sRUFBRSxDQUFDLENB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QUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUN6RSxDQUFDO0tBQUE7Q0FDRjtBQXBHRCxnREFvR0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5cbmltcG9ydCB7IERvd25sb2FkZXJUeXBlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7XG4gIEJsb2NrQm9keSxcbiAgUGVlcixcbiAgSUV0aFByb3RvY29sLFxuICBQZWVyTWFuYWdlcixcbiAgRXRoUHJvdG9jb2xcbn0gZnJvbSAnLi4vLi4vbmV0J1xuaW1wb3J0IHsgRXRoQ2hhaW4gfSBmcm9tICcuLi8uLi9ibG9ja2NoYWluJ1xuaW1wb3J0IHsgQmFzZURvd25sb2FkZXIsIE1BWF9QRVJfUkVRVUVTVCwgQ09OQ0NVUkVOVF9SRVFVRVNUUywgTUFYX1JFUVVFU1QgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyBxdWV1ZSwgQXN5bmNRdWV1ZSwgYXN5bmNpZnkgfSBmcm9tICdhc3luYydcblxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6ZG93bmxvYWRlcnM6ZmFzdC1zeW5jJylcblxuaW50ZXJmYWNlIFRhc2tQYXlsb2FkIHtcbiAgcHJvdG9jb2w6IElFdGhQcm90b2NvbFxuICBmcm9tOiBCTlxuICB0bzogQk5cbiAgcmV2ZXJzZT86IGJvb2xlYW5cbiAgc2tpcD86IG51bWJlclxuICBwZWVyOiBQZWVyXG59XG5cbmV4cG9ydCBjbGFzcyBGYXN0U3luY0Rvd25sb2FkZXIgZXh0ZW5kcyBCYXNlRG93bmxvYWRlciB7XG4gIHR5cGU6IERvd25sb2FkZXJUeXBlXG4gIHF1ZXVlOiBBc3luY1F1ZXVlPFRhc2tQYXlsb2FkPlxuICBoaWdoZXN0QmxvY2s6IEJOID0gbmV3IEJOKDApXG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBjaGFpbjogRXRoQ2hhaW4sXG4gICAgICAgICAgICAgICBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIpIHtcbiAgICBzdXBlcihjaGFpbiwgcGVlck1hbmFnZXIpXG4gICAgdGhpcy50eXBlID0gRG93bmxvYWRlclR5cGUuRkFTVFxuICAgIHRoaXMucXVldWUgPSBxdWV1ZShhc3luY2lmeSh0aGlzLnRhc2suYmluZCh0aGlzKSksIENPTkNDVVJFTlRfUkVRVUVTVFMpXG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgdGFzayAoeyBmcm9tLCB0bywgc2tpcCwgcmV2ZXJzZSwgcHJvdG9jb2wsIHBlZXIgfSkge1xuICAgIGNvbnN0IGZyb21TdHI6IHN0cmluZyA9IGZyb20udG9TdHJpbmcoMTApXG5cbiAgICAvLyBpbmNyZW1lbnQgY3VycmVudCBibG9jayB0byBzZXQgYXMgc3RhcnRcbiAgICBkZWJ1ZyhgcmVxdWVzdGluZyAke01BWF9QRVJfUkVRVUVTVH0gYmxvY2tzIGAgK1xuICAgICAgYGZyb20gJHtwcm90b2NvbC5wZWVyLmlkfSBzdGFydGluZyBmcm9tICR7ZnJvbVN0cn1gKVxuICAgIHdoaWxlIChmcm9tLmx0ZSh0bykpIHtcbiAgICAgIGxldCBoZWFkZXJzOiBCbG9jay5IZWFkZXJbXSA9IGF3YWl0IHRoaXMuZ2V0SGVhZGVycyhcbiAgICAgICAgcHJvdG9jb2wgYXMgdW5rbm93biBhcyBJRXRoUHJvdG9jb2wsXG4gICAgICAgIHBlZXIsXG4gICAgICAgIGZyb20sXG4gICAgICAgIE1BWF9QRVJfUkVRVUVTVCxcbiAgICAgICAgc2tpcCxcbiAgICAgICAgcmV2ZXJzZSlcblxuICAgICAgaWYgKCFoZWFkZXJzLmxlbmd0aCkgcmV0dXJuXG5cbiAgICAgIGxldCBib2RpZXM6IEJsb2NrQm9keVtdID0gYXdhaXQgdGhpcy5nZXRCb2RpZXMoXG4gICAgICAgIHByb3RvY29sIGFzIHVua25vd24gYXMgSUV0aFByb3RvY29sLFxuICAgICAgICBwZWVyLFxuICAgICAgICBoZWFkZXJzLm1hcChoID0+IGguaGFzaCgpKSlcblxuICAgICAgdGhpcy5zdG9yZShib2RpZXMubWFwKChib2R5LCBpKSA9PiBuZXcgQmxvY2soW2hlYWRlcnNbaV0ucmF3XS5jb25jYXQoYm9keSkpKSlcbiAgICAgIGZyb20uaWFkZG4oaGVhZGVycy5sZW5ndGgpXG4gICAgICBkZWJ1ZyhgaW1wb3J0ZWQgJHtoZWFkZXJzLmxlbmd0aH0gYmxvY2tzIGZyb20gJHtwZWVyLmlkfWApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYmVzdCAoKTogUHJvbWlzZTxQZWVyIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgcGVlcnM6IFBlZXJbXSA9IHRoaXMucGVlck1hbmFnZXIuZ2V0QnlDYXBhYmlsaXR5KHtcbiAgICAgIGlkOiAnZXRoJyxcbiAgICAgIHZlcnNpb25zOiBbJzYzJ11cbiAgICB9KVxuXG4gICAgaWYgKCFwZWVycy5sZW5ndGgpIHJldHVyblxuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IFByb21pc2UuYWxsKHBlZXJzLm1hcCgocCkgPT4ge1xuICAgICAgcmV0dXJuIChwLnByb3RvY29scy5nZXQoJ2V0aCcpIGFzIEV0aFByb3RvY29sPGFueT4pIS5nZXRTdGF0dXMoKVxuICAgIH0pKVxuXG4gICAgbGV0IGJlc3RQZWVyOiBQZWVyIHwgdW5kZWZpbmVkXG4gICAgbGV0IGJlc3RQZWVyVGQ6IEJOID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRCbG9ja3NURCgpXG4gICAgc3RhdHVzLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgIGlmIChzLnRkLmd0KGJlc3RQZWVyVGQpKSBiZXN0UGVlciA9IHBlZXJzW2ldXG4gICAgfSlcblxuICAgIGlmIChiZXN0UGVlcikge1xuICAgICAgdGhpcy5wZWVyTWFuYWdlci5yZXNlcnZlKFtiZXN0UGVlcl0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGJlc3RQZWVyXG4gIH1cblxuICBhc3luYyBkb3dubG9hZCAocGVlcjogUGVlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBmcm9tOiBCTiA9IG5ldyBCTigwKVxuICAgIGNvbnN0IGJsb2NrOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0TGF0ZXN0QmxvY2soKVxuICAgIGlmIChibG9jaykge1xuICAgICAgZnJvbSA9IG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKVxuICAgIH1cblxuICAgIGNvbnN0IHByb3RvY29sID0gcGVlci5wcm90b2NvbHMuZ2V0KCdldGgnKSBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbFxuICAgIGlmICghcHJvdG9jb2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmFzdCBzeW5jIHJlcXVpcmVzIHRoZSBFVEggY2FwYWJpbGl0eSEnKVxuICAgIH1cblxuICAgIGNvbnN0IHJlbW90ZUhlYWRlcjogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmxhdGVzdChwcm90b2NvbCwgcGVlcilcbiAgICBpZiAoIXJlbW90ZUhlYWRlcikge1xuICAgICAgZGVidWcoYHVuYWJsZSB0byBnZXQgcmVtb3RlIGhlYWRlciBmcm9tICR7cGVlci5pZH0hYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGFuY2VzdG9yID0gYXdhaXQgdGhpcy5maW5kQW5jZXN0b3IocHJvdG9jb2wsIHBlZXIsIGZyb20pXG4gICAgaWYgKCFhbmNlc3Rvcikge1xuICAgICAgZGVidWcobmV3IEVycm9yKGB1bmFibGUgdG8gZmluZCBjb21tb24gYW5jZXN0b3Igd2l0aCBwZWVyICR7cGVlci5pZH1gKSlcbiAgICAgIHRoaXMucGVlck1hbmFnZXIuYmFuKFtwZWVyXSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZyb20gPSBuZXcgQk4oYW5jZXN0b3IuaGVhZGVyLm51bWJlcilcbiAgICBjb25zdCByZW1vdGU6IEJOID0gbmV3IEJOKHJlbW90ZUhlYWRlci5oZWFkZXIubnVtYmVyKVxuICAgIGNvbnN0IGxvY2FsU3RyOiBzdHJpbmcgPSBmcm9tLnRvU3RyaW5nKDEwKVxuICAgIGRlYnVnKGBsYXRlc3QgYmxvY2sgaXMgJHtsb2NhbFN0cn0gcmVtb3RlIGJsb2NrIGlzICR7cmVtb3RlLnRvU3RyaW5nKDEwKX1gKVxuXG4gICAgZnJvbS5pYWRkbigxKVxuICAgIGNvbnN0IHRvID0gcmVtb3RlLnN1Yihmcm9tKS5ndGVuKE1BWF9SRVFVRVNUKVxuICAgICAgPyBmcm9tLmFkZG4oTUFYX1JFUVVFU1QpXG4gICAgICA6IHJlbW90ZVxuICAgIHRoaXMucXVldWUucHVzaCh7IGZyb206IGZyb20uY2xvbmUoKSwgdG86IHRvLmNsb25lKCksIHByb3RvY29sLCBwZWVyIH0pXG4gIH1cbn1cbiJdfQ==