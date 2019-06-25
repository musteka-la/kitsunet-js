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
const CONCCURENT_REQUESTS = 5;
class FastSyncDownloader extends base_1.BaseDownloader {
    constructor(chain, peerManager) {
        super(chain, peerManager);
        this.chain = chain;
        this.highestBlock = new bn_js_1.default(0);
        this.type = interfaces_1.DownloaderType.FAST;
        this.queue = async_1.queue(this.task.bind(this), CONCCURENT_REQUESTS);
    }
    task({ blockNumber, protocol }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockNumberStr = blockNumber.toString(10);
                // increment current block to set as start
                debug(`requesting ${MAX_PER_REQUEST} blocks ` +
                    `from ${protocol.peer.id} starting from ${blockNumberStr}`);
                let headers = yield this.getHeaders(protocol, blockNumber, MAX_PER_REQUEST);
                if (!headers.length)
                    return;
                let bodies = yield this.getBodies(protocol, headers.map(h => h.hash()));
                yield this.store(bodies.map((body, i) => new ethereumjs_block_1.default([headers[i].raw].concat(body))));
                debug(`imported ${headers.length} blocks`);
            }
            catch (err) {
                debug(err);
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
            while (blockNumber.lte(remoteNumber)) {
                this.queue.push({ blockNumber, protocol });
                blockNumber.addn(MAX_PER_REQUEST).gt(remoteNumber)
                    ? remoteNumber.isub(blockNumber)
                    : blockNumber.iaddn(MAX_PER_REQUEST);
                this.highestBlock = blockNumber;
            }
            yield this.queue.drain();
        });
    }
}
exports.FastSyncDownloader = FastSyncDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBRXBDLDhDQUE4QztBQVM5QyxpQ0FBdUM7QUFDdkMsaUNBQXlDO0FBRXpDLGtEQUF5QjtBQUN6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUVyRCxNQUFNLGVBQWUsR0FBVyxHQUFHLENBQUE7QUFDbkMsTUFBTSxtQkFBbUIsR0FBVyxDQUFDLENBQUE7QUFPckMsTUFBYSxrQkFBbUIsU0FBUSxxQkFBYztJQUtwRCxZQUFvQixLQUFlLEVBQUUsV0FBd0I7UUFDM0QsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtRQURQLFVBQUssR0FBTCxLQUFLLENBQVU7UUFGbkMsaUJBQVksR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUkxQixJQUFJLENBQUMsSUFBSSxHQUFHLDJCQUFjLENBQUMsSUFBSSxDQUFBO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUE7SUFDL0QsQ0FBQztJQUVlLElBQUksQ0FBRSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUU7O1lBQzdDLElBQUk7Z0JBQ0YsTUFBTSxjQUFjLEdBQVcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFFdkQsMENBQTBDO2dCQUMxQyxLQUFLLENBQUMsY0FBYyxlQUFlLFVBQVU7b0JBQzdDLFFBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLGtCQUFr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QUNqQixLQUFLLENBQUMsb0NBQW9DLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2dCQUNyRCxPQUFNO2FBQ1A7WUFFRCxNQUFNLFlBQVksR0FBTyxJQUFJLGVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzNELE1BQU0sY0FBYyxHQUFXLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDdkQsS0FBSyxDQUFDLG1CQUFtQixjQUFjLG9CQUFvQixZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN2RixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BCLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtnQkFDMUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUNoRCxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ2hDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO2dCQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQTthQUNoQztZQUNELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUMxQixDQUFDO0tBQUE7Q0FDRjtBQXpGRCxnREF5RkMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IEJsb2NrIGZyb20gJ2V0aGVyZXVtanMtYmxvY2snXG5cbmltcG9ydCB7IERvd25sb2FkZXJUeXBlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7XG4gIEJsb2NrQm9keSxcbiAgUGVlcixcbiAgSUV0aFByb3RvY29sLFxuICBQZWVyTWFuYWdlcixcbiAgRXRoUHJvdG9jb2xcbn0gZnJvbSAnLi4vLi4vbmV0J1xuaW1wb3J0IHsgRXRoQ2hhaW4gfSBmcm9tICcuLi8uLi9ibG9ja2NoYWluJ1xuaW1wb3J0IHsgQmFzZURvd25sb2FkZXIgfSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgeyBxdWV1ZSwgQXN5bmNRdWV1ZSB9IGZyb20gJ2FzeW5jJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyczpmYXN0LXN5bmMnKVxuXG5jb25zdCBNQVhfUEVSX1JFUVVFU1Q6IG51bWJlciA9IDEyOFxuY29uc3QgQ09OQ0NVUkVOVF9SRVFVRVNUUzogbnVtYmVyID0gNVxuXG5pbnRlcmZhY2UgVGFza1BheWxvYWQge1xuICBibG9ja051bWJlcjogQk5cbiAgcHJvdG9jb2w6IElFdGhQcm90b2NvbFxufVxuXG5leHBvcnQgY2xhc3MgRmFzdFN5bmNEb3dubG9hZGVyIGV4dGVuZHMgQmFzZURvd25sb2FkZXIge1xuICB0eXBlOiBEb3dubG9hZGVyVHlwZVxuICBxdWV1ZTogQXN5bmNRdWV1ZTxUYXNrUGF5bG9hZD5cbiAgaGlnaGVzdEJsb2NrOiBCTiA9IG5ldyBCTigwKVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgY2hhaW46IEV0aENoYWluLCBwZWVyTWFuYWdlcjogUGVlck1hbmFnZXIpIHtcbiAgICBzdXBlcihjaGFpbiwgcGVlck1hbmFnZXIpXG4gICAgdGhpcy50eXBlID0gRG93bmxvYWRlclR5cGUuRkFTVFxuICAgIHRoaXMucXVldWUgPSBxdWV1ZSh0aGlzLnRhc2suYmluZCh0aGlzKSwgQ09OQ0NVUkVOVF9SRVFVRVNUUylcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyB0YXNrICh7IGJsb2NrTnVtYmVyLCBwcm90b2NvbCB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJsb2NrTnVtYmVyU3RyOiBzdHJpbmcgPSBibG9ja051bWJlci50b1N0cmluZygxMClcblxuICAgICAgLy8gaW5jcmVtZW50IGN1cnJlbnQgYmxvY2sgdG8gc2V0IGFzIHN0YXJ0XG4gICAgICBkZWJ1ZyhgcmVxdWVzdGluZyAke01BWF9QRVJfUkVRVUVTVH0gYmxvY2tzIGAgK1xuICAgICAgYGZyb20gJHtwcm90b2NvbC5wZWVyLmlkfSBzdGFydGluZyBmcm9tICR7YmxvY2tOdW1iZXJTdHJ9YClcblxuICAgICAgbGV0IGhlYWRlcnM6IEJsb2NrLkhlYWRlcltdID0gYXdhaXQgdGhpcy5nZXRIZWFkZXJzKHByb3RvY29sIGFzIHVua25vd24gYXMgSUV0aFByb3RvY29sLFxuICAgICAgICBibG9ja051bWJlciwgTUFYX1BFUl9SRVFVRVNUKVxuXG4gICAgICBpZiAoIWhlYWRlcnMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgbGV0IGJvZGllczogQmxvY2tCb2R5W10gPSBhd2FpdCB0aGlzLmdldEJvZGllcyhwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCxcbiAgICAgICAgaGVhZGVycy5tYXAoaCA9PiBoLmhhc2goKSkpXG5cbiAgICAgIGF3YWl0IHRoaXMuc3RvcmUoYm9kaWVzLm1hcCgoYm9keSwgaSkgPT4gbmV3IEJsb2NrKFtoZWFkZXJzW2ldLnJhd10uY29uY2F0KGJvZHkpKSkpXG4gICAgICBkZWJ1ZyhgaW1wb3J0ZWQgJHtoZWFkZXJzLmxlbmd0aH0gYmxvY2tzYClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGRlYnVnKGVycilcbiAgICB9XG4gIH1cblxuICBhc3luYyBiZXN0ICgpOiBQcm9taXNlPFBlZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBwZWVyczogUGVlcltdID0gdGhpcy5wZWVyTWFuYWdlci5nZXRCeUNhcGFiaWxpdHkoe1xuICAgICAgaWQ6ICdldGgnLFxuICAgICAgdmVyc2lvbnM6IFsnNjMnXVxuICAgIH0pXG5cbiAgICBpZiAoIXBlZXJzLmxlbmd0aCkgcmV0dXJuXG4gICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgUHJvbWlzZS5hbGwocGVlcnMubWFwKChwKSA9PiB7XG4gICAgICByZXR1cm4gKHAucHJvdG9jb2xzLmdldCgnZXRoJykgYXMgRXRoUHJvdG9jb2w8YW55PikhLmdldFN0YXR1cygpXG4gICAgfSkpXG5cbiAgICBsZXQgYmVzdFBlZXI6IFBlZXIgfCB1bmRlZmluZWRcbiAgICBsZXQgYmVzdFBlZXJUZDogQk4gPSBhd2FpdCB0aGlzLmNoYWluLmdldEJsb2Nrc1REKClcbiAgICBzdGF0dXMuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgaWYgKHMudGQuZ3QoYmVzdFBlZXJUZCkpIGJlc3RQZWVyID0gcGVlcnNbaV1cbiAgICB9KVxuXG4gICAgaWYgKGJlc3RQZWVyKSB7XG4gICAgICB0aGlzLnBlZXJNYW5hZ2VyLnJlc2VydmUoW2Jlc3RQZWVyXSlcbiAgICB9XG5cbiAgICByZXR1cm4gYmVzdFBlZXJcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkIChwZWVyOiBQZWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGJsb2NrTnVtYmVyOiBCTiA9IG5ldyBCTigwKVxuICAgIGNvbnN0IGJsb2NrOiBCbG9jayB8IHVuZGVmaW5lZCA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0TGF0ZXN0QmxvY2soKVxuICAgIGlmIChibG9jaykge1xuICAgICAgYmxvY2tOdW1iZXIgPSBuZXcgQk4oYmxvY2suaGVhZGVyLm51bWJlcilcbiAgICB9XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHBlZXIucHJvdG9jb2xzLmdldCgnZXRoJykgYXMgdW5rbm93biBhcyBJRXRoUHJvdG9jb2xcbiAgICBpZiAoIXByb3RvY29sKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Zhc3Qgc3luYyByZXF1aXJlcyB0aGUgRVRIIGNhcGFiaWxpdHkhJylcbiAgICB9XG5cbiAgICBjb25zdCByZW1vdGVIZWFkZXI6IEJsb2NrIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5sYXRlc3QocHJvdG9jb2wsIHBlZXIpXG4gICAgaWYgKCFyZW1vdGVIZWFkZXIpIHtcbiAgICAgIGRlYnVnKGB1bmFibGUgdG8gZ2V0IHJlbW90ZSBoZWFkZXIgZnJvbSAke3BlZXIuaWR9IWApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCByZW1vdGVOdW1iZXI6IEJOID0gbmV3IEJOKHJlbW90ZUhlYWRlci5oZWFkZXIubnVtYmVyKVxuICAgIGNvbnN0IGJsb2NrTnVtYmVyU3RyOiBzdHJpbmcgPSBibG9ja051bWJlci50b1N0cmluZygxMClcbiAgICBkZWJ1ZyhgbGF0ZXN0IGJsb2NrIGlzICR7YmxvY2tOdW1iZXJTdHJ9IHJlbW90ZSBibG9jayBpcyAke3JlbW90ZU51bWJlci50b1N0cmluZygxMCl9YClcbiAgICBibG9ja051bWJlci5pYWRkbigxKVxuICAgIHdoaWxlIChibG9ja051bWJlci5sdGUocmVtb3RlTnVtYmVyKSkge1xuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHsgYmxvY2tOdW1iZXIsIHByb3RvY29sIH0pXG4gICAgICBibG9ja051bWJlci5hZGRuKE1BWF9QRVJfUkVRVUVTVCkuZ3QocmVtb3RlTnVtYmVyKVxuICAgICAgICA/IHJlbW90ZU51bWJlci5pc3ViKGJsb2NrTnVtYmVyKVxuICAgICAgICA6IGJsb2NrTnVtYmVyLmlhZGRuKE1BWF9QRVJfUkVRVUVTVClcbiAgICAgIHRoaXMuaGlnaGVzdEJsb2NrID0gYmxvY2tOdW1iZXJcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5xdWV1ZS5kcmFpbigpXG4gIH1cbn1cbiJdfQ==