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
const events_1 = __importDefault(require("events"));
const debug_1 = __importDefault(require("debug"));
const interfaces_1 = require("./interfaces");
class KitsunetHandler extends events_1.default {
    constructor(name, id, protocol, peer) {
        super();
        this.name = name;
        this.id = id;
        this.protocol = protocol;
        this.peer = peer;
        this.log = debug_1.default(`kitsunet:kitsunet-proto:base-handler-${this.name}`);
    }
    _send(...msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('sending request', msg);
            const res = yield this.protocol.send(msg.shift());
            if (res && res.status !== interfaces_1.ResponseStatus.OK) {
                const err = res.error ? new Error(res.error) : new Error('unknown error!');
                this.log(err);
                throw err;
            }
            this.log('got response', res);
            return res;
        });
    }
    errResponse(err) {
        this.log(err);
        return { status: interfaces_1.ResponseStatus.ERROR, error: err };
    }
}
exports.KitsunetHandler = KitsunetHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2l0c3VuZXQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9uZXQvcHJvdG9jb2xzL2tpdHN1bmV0L2tpdHN1bmV0LWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7O0FBRVosb0RBQXVCO0FBQ3ZCLGtEQUF5QjtBQUd6Qiw2Q0FBMEQ7QUFFMUQsTUFBc0IsZUFBZ0QsU0FBUSxnQkFBRTtJQUU5RSxZQUFvQixJQUFZLEVBQ1osRUFBVSxFQUNWLFFBQXdCLEVBQ3hCLElBQU87UUFDekIsS0FBSyxFQUFFLENBQUE7UUFKVyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQ3hCLFNBQUksR0FBSixJQUFJLENBQUc7UUFFekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxlQUFLLENBQUMsd0NBQXdDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFnQmUsS0FBSyxDQUFtQixHQUFHLEdBQU07O1lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDaEMsTUFBTSxHQUFHLEdBQWdCLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFnQixDQUFBO1lBQzdFLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssMkJBQWMsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtnQkFDMUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDYixNQUFNLEdBQUcsQ0FBQTthQUNWO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDN0IsT0FBTyxHQUFHLENBQUE7UUFDWixDQUFDO0tBQUE7SUFFRCxXQUFXLENBQUUsR0FBVTtRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2IsT0FBTyxFQUFFLE1BQU0sRUFBRSwyQkFBYyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUE7SUFDckQsQ0FBQztDQUNGO0FBekNELDBDQXlDQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRUUgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgS3NuUHJvdG9jb2wgfSBmcm9tICcuL2tzbi1wcm90b2NvbCdcbmltcG9ydCB7IElQZWVyRGVzY3JpcHRvciwgSUhhbmRsZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgS3NuUmVzcG9uc2UsIFJlc3BvbnNlU3RhdHVzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgS2l0c3VuZXRIYW5kbGVyPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFRSBpbXBsZW1lbnRzIElIYW5kbGVyPFA+IHtcbiAgbG9nOiBkZWJ1Zy5EZWJ1Z2dlclxuICBjb25zdHJ1Y3RvciAocHVibGljIG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHB1YmxpYyBpZDogbnVtYmVyLFxuICAgICAgICAgICAgICAgcHVibGljIHByb3RvY29sOiBLc25Qcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyOiBQKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubG9nID0gZGVidWcoYGtpdHN1bmV0OmtpdHN1bmV0LXByb3RvOmJhc2UtaGFuZGxlci0ke3RoaXMubmFtZX1gKVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhbiBpbmNvbWluZyBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSBtc2cgLSB0aGUgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBhYnN0cmFjdCBoYW5kbGU8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVKTogUHJvbWlzZTxhbnk+XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0XG4gICAqXG4gICAqIEBwYXJhbSBtc2cgLSB0aGUgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBhYnN0cmFjdCBhc3luYyBzZW5kPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSk6IFByb21pc2U8YW55PlxuXG4gIHByb3RlY3RlZCBhc3luYyBfc2VuZDxVIGV4dGVuZHMgYW55W10+ICguLi5tc2c6IFUpOiBQcm9taXNlPEtzblJlc3BvbnNlPiB7XG4gICAgdGhpcy5sb2coJ3NlbmRpbmcgcmVxdWVzdCcsIG1zZylcbiAgICBjb25zdCByZXM6IEtzblJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcm90b2NvbC5zZW5kKG1zZy5zaGlmdCgpKSBhcyBLc25SZXNwb25zZVxuICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1cyAhPT0gUmVzcG9uc2VTdGF0dXMuT0spIHtcbiAgICAgIGNvbnN0IGVyciA9IHJlcy5lcnJvciA/IG5ldyBFcnJvcihyZXMuZXJyb3IpIDogbmV3IEVycm9yKCd1bmtub3duIGVycm9yIScpXG4gICAgICB0aGlzLmxvZyhlcnIpXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG5cbiAgICB0aGlzLmxvZygnZ290IHJlc3BvbnNlJywgcmVzKVxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGVyclJlc3BvbnNlIChlcnI6IEVycm9yKSB7XG4gICAgdGhpcy5sb2coZXJyKVxuICAgIHJldHVybiB7IHN0YXR1czogUmVzcG9uc2VTdGF0dXMuRVJST1IsIGVycm9yOiBlcnIgfVxuICB9XG59XG4iXX0=