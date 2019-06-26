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
class FastSyncDownloader extends base_1.BaseDownloader {
    constructor(chain, peerManager) {
        super(chain, peerManager);
        this.chain = chain;
        this.highestBlock = new bn_js_1.default(0);
        this.type = interfaces_1.DownloaderType.FAST;
        this.queue = async_1.queue(async_1.asyncify(this.task.bind(this)), CONCCURENT_REQUESTS);
    }
    task({ number, protocol, max, skip, reverse }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockNumberStr = number.toString(10);
                // increment current block to set as start
                debug(`requesting ${MAX_PER_REQUEST} blocks ` +
                    `from ${protocol.peer.id} starting from ${blockNumberStr}`);
                let headers = yield this.getHeaders(protocol, number, max, skip, reverse);
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
            const tasks = [];
            while (blockNumber.lte(remoteNumber)) {
                let max = MAX_PER_REQUEST;
                if (remoteNumber.lt(blockNumber.addn(max))) {
                    max = (remoteNumber.sub(blockNumber).toNumber()) || 1;
                }
                tasks.push({ number: blockNumber.clone(), protocol, max });
                this.highestBlock = blockNumber;
                blockNumber.iaddn(max);
            }
            this.queue.push(tasks);
        });
    }
}
exports.FastSyncDownloader = FastSyncDownloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zeW5jLWRvd25sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG93bmxvYWRlci9kb3dubG9hZGVycy9mYXN0LXN5bmMtZG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7QUFFWixrREFBc0I7QUFDdEIsd0VBQW9DO0FBRXBDLDhDQUE4QztBQVM5QyxpQ0FBdUM7QUFDdkMsaUNBQW1EO0FBRW5ELGtEQUF5QjtBQUN6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUVyRCxNQUFNLGVBQWUsR0FBVyxHQUFHLENBQUE7QUFDbkMsTUFBTSxtQkFBbUIsR0FBVyxFQUFFLENBQUE7QUFVdEMsTUFBYSxrQkFBbUIsU0FBUSxxQkFBYztJQUtwRCxZQUFvQixLQUFlLEVBQUUsV0FBd0I7UUFDM0QsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtRQURQLFVBQUssR0FBTCxLQUFLLENBQVU7UUFGbkMsaUJBQVksR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUkxQixJQUFJLENBQUMsSUFBSSxHQUFHLDJCQUFjLENBQUMsSUFBSSxDQUFBO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBSyxDQUFDLGdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO0lBQ3pFLENBQUM7SUFFZSxJQUFJLENBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztZQUM1RCxJQUFJO2dCQUNGLE1BQU0sY0FBYyxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBRWxELDBDQUEwQztnQkFDMUMsS0FBSyxDQUFDLGNBQWMsZUFBZSxVQUFVO29CQUM3QyxRQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxrQkFBa0IsY0FBYyxFQUFFLENBQUMsQ0FBQTtnQkFFM0QsSUFBSSxPQUFPLEdBQW1CLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFtQyxFQUNyRixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtnQkFFN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO29CQUFFLE9BQU07Z0JBRTNCLElBQUksTUFBTSxHQUFnQixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBbUMsRUFDaEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBRTdCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSwwQkFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkYsS0FBSyxDQUFDLFlBQVksT0FBTyxDQUFDLE1BQU0sU0FBUyxDQUFDLENBQUE7YUFDM0M7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDWDtRQUNILENBQUM7S0FBQTtJQUVLLElBQUk7O1lBQ1IsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7Z0JBQ3JELEVBQUUsRUFBRSxLQUFLO2dCQUNULFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNqQixDQUFDLENBQUE7WUFFRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07Z0JBQUUsT0FBTTtZQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxPQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBdUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUNsRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRUgsSUFBSSxRQUEwQixDQUFBO1lBQzlCLElBQUksVUFBVSxHQUFPLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUNuRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0QixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlDLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO2FBQ3JDO1lBRUQsT0FBTyxRQUFRLENBQUE7UUFDakIsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFFLElBQVU7O1lBQ3hCLElBQUksV0FBVyxHQUFPLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9CLE1BQU0sS0FBSyxHQUFzQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7WUFDbEUsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsV0FBVyxHQUFHLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDMUM7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQTRCLENBQUE7WUFDckUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUE7YUFDMUQ7WUFFRCxNQUFNLFlBQVksR0FBc0IsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUN6RSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNqQixLQUFLLENBQUMsb0NBQW9DLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2dCQUNyRCxPQUFNO2FBQ1A7WUFFRCxNQUFNLFlBQVksR0FBTyxJQUFJLGVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzNELE1BQU0sY0FBYyxHQUFXLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDdkQsS0FBSyxDQUFDLG1CQUFtQixjQUFjLG9CQUFvQixZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUV2RixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BCLE1BQU0sS0FBSyxHQUFrQixFQUFFLENBQUE7WUFDL0IsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLEdBQUcsR0FBVyxlQUFlLENBQUE7Z0JBQ2pDLElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQzFDLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ3REO2dCQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFBO2dCQUMxRCxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQTtnQkFDL0IsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUN2QjtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLENBQUM7S0FBQTtDQUNGO0FBL0ZELGdEQStGQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnXG5pbXBvcnQgQmxvY2sgZnJvbSAnZXRoZXJldW1qcy1ibG9jaydcblxuaW1wb3J0IHsgRG93bmxvYWRlclR5cGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHtcbiAgQmxvY2tCb2R5LFxuICBQZWVyLFxuICBJRXRoUHJvdG9jb2wsXG4gIFBlZXJNYW5hZ2VyLFxuICBFdGhQcm90b2NvbFxufSBmcm9tICcuLi8uLi9uZXQnXG5pbXBvcnQgeyBFdGhDaGFpbiB9IGZyb20gJy4uLy4uL2Jsb2NrY2hhaW4nXG5pbXBvcnQgeyBCYXNlRG93bmxvYWRlciB9IGZyb20gJy4vYmFzZSdcbmltcG9ydCB7IHF1ZXVlLCBBc3luY1F1ZXVlLCBhc3luY2lmeSB9IGZyb20gJ2FzeW5jJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpkb3dubG9hZGVyczpmYXN0LXN5bmMnKVxuXG5jb25zdCBNQVhfUEVSX1JFUVVFU1Q6IG51bWJlciA9IDEyOFxuY29uc3QgQ09OQ0NVUkVOVF9SRVFVRVNUUzogbnVtYmVyID0gMTVcblxuaW50ZXJmYWNlIFRhc2tQYXlsb2FkIHtcbiAgbnVtYmVyOiBCTlxuICBwcm90b2NvbDogSUV0aFByb3RvY29sXG4gIG1heD86IG51bWJlclxuICByZXZlcnNlPzogYm9vbGVhblxuICBza2lwPzogbnVtYmVyXG59XG5cbmV4cG9ydCBjbGFzcyBGYXN0U3luY0Rvd25sb2FkZXIgZXh0ZW5kcyBCYXNlRG93bmxvYWRlciB7XG4gIHR5cGU6IERvd25sb2FkZXJUeXBlXG4gIHF1ZXVlOiBBc3luY1F1ZXVlPFRhc2tQYXlsb2FkPlxuICBoaWdoZXN0QmxvY2s6IEJOID0gbmV3IEJOKDApXG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBjaGFpbjogRXRoQ2hhaW4sIHBlZXJNYW5hZ2VyOiBQZWVyTWFuYWdlcikge1xuICAgIHN1cGVyKGNoYWluLCBwZWVyTWFuYWdlcilcbiAgICB0aGlzLnR5cGUgPSBEb3dubG9hZGVyVHlwZS5GQVNUXG4gICAgdGhpcy5xdWV1ZSA9IHF1ZXVlKGFzeW5jaWZ5KHRoaXMudGFzay5iaW5kKHRoaXMpKSwgQ09OQ0NVUkVOVF9SRVFVRVNUUylcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyB0YXNrICh7IG51bWJlciwgcHJvdG9jb2wsIG1heCwgc2tpcCwgcmV2ZXJzZSB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJsb2NrTnVtYmVyU3RyOiBzdHJpbmcgPSBudW1iZXIudG9TdHJpbmcoMTApXG5cbiAgICAgIC8vIGluY3JlbWVudCBjdXJyZW50IGJsb2NrIHRvIHNldCBhcyBzdGFydFxuICAgICAgZGVidWcoYHJlcXVlc3RpbmcgJHtNQVhfUEVSX1JFUVVFU1R9IGJsb2NrcyBgICtcbiAgICAgIGBmcm9tICR7cHJvdG9jb2wucGVlci5pZH0gc3RhcnRpbmcgZnJvbSAke2Jsb2NrTnVtYmVyU3RyfWApXG5cbiAgICAgIGxldCBoZWFkZXJzOiBCbG9jay5IZWFkZXJbXSA9IGF3YWl0IHRoaXMuZ2V0SGVhZGVycyhwcm90b2NvbCBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbCxcbiAgICAgICAgbnVtYmVyLCBtYXgsIHNraXAsIHJldmVyc2UpXG5cbiAgICAgIGlmICghaGVhZGVycy5sZW5ndGgpIHJldHVyblxuXG4gICAgICBsZXQgYm9kaWVzOiBCbG9ja0JvZHlbXSA9IGF3YWl0IHRoaXMuZ2V0Qm9kaWVzKHByb3RvY29sIGFzIHVua25vd24gYXMgSUV0aFByb3RvY29sLFxuICAgICAgICBoZWFkZXJzLm1hcChoID0+IGguaGFzaCgpKSlcblxuICAgICAgYXdhaXQgdGhpcy5zdG9yZShib2RpZXMubWFwKChib2R5LCBpKSA9PiBuZXcgQmxvY2soW2hlYWRlcnNbaV0ucmF3XS5jb25jYXQoYm9keSkpKSlcbiAgICAgIGRlYnVnKGBpbXBvcnRlZCAke2hlYWRlcnMubGVuZ3RofSBibG9ja3NgKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVidWcoZXJyKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGJlc3QgKCk6IFByb21pc2U8UGVlciB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHBlZXJzOiBQZWVyW10gPSB0aGlzLnBlZXJNYW5hZ2VyLmdldEJ5Q2FwYWJpbGl0eSh7XG4gICAgICBpZDogJ2V0aCcsXG4gICAgICB2ZXJzaW9uczogWyc2MyddXG4gICAgfSlcblxuICAgIGlmICghcGVlcnMubGVuZ3RoKSByZXR1cm5cbiAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBQcm9taXNlLmFsbChwZWVycy5tYXAoKHApID0+IHtcbiAgICAgIHJldHVybiAocC5wcm90b2NvbHMuZ2V0KCdldGgnKSBhcyBFdGhQcm90b2NvbDxhbnk+KSEuZ2V0U3RhdHVzKClcbiAgICB9KSlcblxuICAgIGxldCBiZXN0UGVlcjogUGVlciB8IHVuZGVmaW5lZFxuICAgIGxldCBiZXN0UGVlclRkOiBCTiA9IGF3YWl0IHRoaXMuY2hhaW4uZ2V0QmxvY2tzVEQoKVxuICAgIHN0YXR1cy5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICBpZiAocy50ZC5ndChiZXN0UGVlclRkKSkgYmVzdFBlZXIgPSBwZWVyc1tpXVxuICAgIH0pXG5cbiAgICBpZiAoYmVzdFBlZXIpIHtcbiAgICAgIHRoaXMucGVlck1hbmFnZXIucmVzZXJ2ZShbYmVzdFBlZXJdKVxuICAgIH1cblxuICAgIHJldHVybiBiZXN0UGVlclxuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQgKHBlZXI6IFBlZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgYmxvY2tOdW1iZXI6IEJOID0gbmV3IEJOKDApXG4gICAgY29uc3QgYmxvY2s6IEJsb2NrIHwgdW5kZWZpbmVkID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRMYXRlc3RCbG9jaygpXG4gICAgaWYgKGJsb2NrKSB7XG4gICAgICBibG9ja051bWJlciA9IG5ldyBCTihibG9jay5oZWFkZXIubnVtYmVyKVxuICAgIH1cblxuICAgIGNvbnN0IHByb3RvY29sID0gcGVlci5wcm90b2NvbHMuZ2V0KCdldGgnKSBhcyB1bmtub3duIGFzIElFdGhQcm90b2NvbFxuICAgIGlmICghcHJvdG9jb2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmFzdCBzeW5jIHJlcXVpcmVzIHRoZSBFVEggY2FwYWJpbGl0eSEnKVxuICAgIH1cblxuICAgIGNvbnN0IHJlbW90ZUhlYWRlcjogQmxvY2sgfCB1bmRlZmluZWQgPSBhd2FpdCB0aGlzLmxhdGVzdChwcm90b2NvbCwgcGVlcilcbiAgICBpZiAoIXJlbW90ZUhlYWRlcikge1xuICAgICAgZGVidWcoYHVuYWJsZSB0byBnZXQgcmVtb3RlIGhlYWRlciBmcm9tICR7cGVlci5pZH0hYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHJlbW90ZU51bWJlcjogQk4gPSBuZXcgQk4ocmVtb3RlSGVhZGVyLmhlYWRlci5udW1iZXIpXG4gICAgY29uc3QgYmxvY2tOdW1iZXJTdHI6IHN0cmluZyA9IGJsb2NrTnVtYmVyLnRvU3RyaW5nKDEwKVxuICAgIGRlYnVnKGBsYXRlc3QgYmxvY2sgaXMgJHtibG9ja051bWJlclN0cn0gcmVtb3RlIGJsb2NrIGlzICR7cmVtb3RlTnVtYmVyLnRvU3RyaW5nKDEwKX1gKVxuXG4gICAgYmxvY2tOdW1iZXIuaWFkZG4oMSlcbiAgICBjb25zdCB0YXNrczogVGFza1BheWxvYWRbXSA9IFtdXG4gICAgd2hpbGUgKGJsb2NrTnVtYmVyLmx0ZShyZW1vdGVOdW1iZXIpKSB7XG4gICAgICBsZXQgbWF4OiBudW1iZXIgPSBNQVhfUEVSX1JFUVVFU1RcbiAgICAgIGlmIChyZW1vdGVOdW1iZXIubHQoYmxvY2tOdW1iZXIuYWRkbihtYXgpKSkge1xuICAgICAgICBtYXggPSAocmVtb3RlTnVtYmVyLnN1YihibG9ja051bWJlcikudG9OdW1iZXIoKSkgfHwgMVxuICAgICAgfVxuXG4gICAgICB0YXNrcy5wdXNoKHsgbnVtYmVyOiBibG9ja051bWJlci5jbG9uZSgpLCBwcm90b2NvbCwgbWF4IH0pXG4gICAgICB0aGlzLmhpZ2hlc3RCbG9jayA9IGJsb2NrTnVtYmVyXG4gICAgICBibG9ja051bWJlci5pYWRkbihtYXgpXG4gICAgfVxuXG4gICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2tzKVxuICB9XG59XG4iXX0=