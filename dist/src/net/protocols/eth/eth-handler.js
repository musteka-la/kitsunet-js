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
class EthHandler extends events_1.default {
    constructor(name, id, protocol, peer) {
        super();
        this.name = name;
        this.id = id;
        this.protocol = protocol;
        this.peer = peer;
        this.log = debug_1.default(`kitsunet:eth-proto:base-handler-${this.name}`);
    }
    _send(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.unshift(this.id);
            this.log('sending message', msg);
            return this.protocol.send(msg);
        });
    }
}
exports.EthHandler = EthHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9ldGgvZXRoLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7O0FBRVosb0RBQXVCO0FBQ3ZCLGtEQUF5QjtBQUl6QixNQUFzQixVQUEyQyxTQUFRLGdCQUFFO0lBRXpFLFlBQW9CLElBQVksRUFDWixFQUFVLEVBQ1YsUUFBd0IsRUFDeEIsSUFBd0I7UUFDMUMsS0FBSyxFQUFFLENBQUE7UUFKVyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQ3hCLFNBQUksR0FBSixJQUFJLENBQW9CO1FBRTFDLElBQUksQ0FBQyxHQUFHLEdBQUcsZUFBSyxDQUFDLG1DQUFtQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNsRSxDQUFDO0lBZ0JlLEtBQUssQ0FBbUIsR0FBTTs7WUFDNUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNoQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hDLENBQUM7S0FBQTtDQUNGO0FBN0JELGdDQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgRUUgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgSUhhbmRsZXIsIElQZWVyRGVzY3JpcHRvciB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBFdGhQcm90b2NvbCB9IGZyb20gJy4vZXRoLXByb3RvY29sJ1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXRoSGFuZGxlcjxQIGV4dGVuZHMgSVBlZXJEZXNjcmlwdG9yPGFueT4+IGV4dGVuZHMgRUUgaW1wbGVtZW50cyBJSGFuZGxlcjxQPiB7XG4gIGxvZzogZGVidWcuRGVidWdnZXJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBwdWJsaWMgaWQ6IG51bWJlcixcbiAgICAgICAgICAgICAgIHB1YmxpYyBwcm90b2NvbDogRXRoUHJvdG9jb2w8UD4sXG4gICAgICAgICAgICAgICBwdWJsaWMgcGVlcjogSVBlZXJEZXNjcmlwdG9yPFA+KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubG9nID0gZGVidWcoYGtpdHN1bmV0OmV0aC1wcm90bzpiYXNlLWhhbmRsZXItJHt0aGlzLm5hbWV9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYW4gaW5jb21pbmcgbWVzc2FnZVxuICAgKlxuICAgKiBAcGFyYW0gbXNnIC0gdGhlIG1lc3NhZ2UgdG8gYmUgc2VudFxuICAgKi9cbiAgYWJzdHJhY3QgYXN5bmMgaGFuZGxlPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSk6IFByb21pc2U8YW55PlxuXG4gIC8qKlxuICAgKiBTZW5kIGEgcmVxdWVzdFxuICAgKlxuICAgKiBAcGFyYW0gbXNnIC0gdGhlIG1lc3NhZ2UgdG8gYmUgc2VudFxuICAgKi9cbiAgYWJzdHJhY3QgYXN5bmMgc2VuZDxVIGV4dGVuZHMgYW55W10+ICguLi5tc2c6IFUpOiBQcm9taXNlPGFueT5cblxuICBwcm90ZWN0ZWQgYXN5bmMgX3NlbmQ8VSBleHRlbmRzIGFueVtdPiAobXNnOiBVKTogUHJvbWlzZTxhbnk+IHtcbiAgICBtc2cudW5zaGlmdCh0aGlzLmlkKVxuICAgIHRoaXMubG9nKCdzZW5kaW5nIG1lc3NhZ2UnLCBtc2cpXG4gICAgcmV0dXJuIHRoaXMucHJvdG9jb2wuc2VuZChtc2cpXG4gIH1cbn1cbiJdfQ==