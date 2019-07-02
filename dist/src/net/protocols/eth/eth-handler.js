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
            // this.log('sending message', msg)
            return this.protocol.send(msg);
        });
    }
}
exports.EthHandler = EthHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbmV0L3Byb3RvY29scy9ldGgvZXRoLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7O0FBRVosb0RBQXVCO0FBQ3ZCLGtEQUF5QjtBQUl6QixNQUFzQixVQUEyQyxTQUFRLGdCQUFFO0lBRXpFLFlBQW9CLElBQVksRUFDWixFQUFVLEVBQ1YsUUFBd0IsRUFDeEIsSUFBd0I7UUFDMUMsS0FBSyxFQUFFLENBQUE7UUFKVyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQ3hCLFNBQUksR0FBSixJQUFJLENBQW9CO1FBRTFDLElBQUksQ0FBQyxHQUFHLEdBQUcsZUFBSyxDQUFDLG1DQUFtQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNsRSxDQUFDO0lBZ0JlLEtBQUssQ0FBbUIsR0FBTTs7WUFDNUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEIsbUNBQW1DO1lBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDaEMsQ0FBQztLQUFBO0NBQ0Y7QUE3QkQsZ0NBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBFRSBmcm9tICdldmVudHMnXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBJSGFuZGxlciwgSVBlZXJEZXNjcmlwdG9yIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcydcbmltcG9ydCB7IEV0aFByb3RvY29sIH0gZnJvbSAnLi9ldGgtcHJvdG9jb2wnXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFdGhIYW5kbGVyPFAgZXh0ZW5kcyBJUGVlckRlc2NyaXB0b3I8YW55Pj4gZXh0ZW5kcyBFRSBpbXBsZW1lbnRzIElIYW5kbGVyPFA+IHtcbiAgbG9nOiBkZWJ1Zy5EZWJ1Z2dlclxuICBjb25zdHJ1Y3RvciAocHVibGljIG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHB1YmxpYyBpZDogbnVtYmVyLFxuICAgICAgICAgICAgICAgcHVibGljIHByb3RvY29sOiBFdGhQcm90b2NvbDxQPixcbiAgICAgICAgICAgICAgIHB1YmxpYyBwZWVyOiBJUGVlckRlc2NyaXB0b3I8UD4pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5sb2cgPSBkZWJ1Zyhga2l0c3VuZXQ6ZXRoLXByb3RvOmJhc2UtaGFuZGxlci0ke3RoaXMubmFtZX1gKVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhbiBpbmNvbWluZyBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSBtc2cgLSB0aGUgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBhYnN0cmFjdCBhc3luYyBoYW5kbGU8VSBleHRlbmRzIGFueVtdPiAoLi4ubXNnOiBVKTogUHJvbWlzZTxhbnk+XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0XG4gICAqXG4gICAqIEBwYXJhbSBtc2cgLSB0aGUgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBhYnN0cmFjdCBhc3luYyBzZW5kPFUgZXh0ZW5kcyBhbnlbXT4gKC4uLm1zZzogVSk6IFByb21pc2U8YW55PlxuXG4gIHByb3RlY3RlZCBhc3luYyBfc2VuZDxVIGV4dGVuZHMgYW55W10+IChtc2c6IFUpOiBQcm9taXNlPGFueT4ge1xuICAgIG1zZy51bnNoaWZ0KHRoaXMuaWQpXG4gICAgLy8gdGhpcy5sb2coJ3NlbmRpbmcgbWVzc2FnZScsIG1zZylcbiAgICByZXR1cm4gdGhpcy5wcm90b2NvbC5zZW5kKG1zZylcbiAgfVxufVxuIl19