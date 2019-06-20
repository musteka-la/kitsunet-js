'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethjs_provider_http_1 = __importDefault(require("ethjs-provider-http"));
const eth_query_1 = __importDefault(require("eth-query"));
const opium_decorators_1 = require("opium-decorators");
/**
 * Extends EthQuery with getSlice call
 */
let KsnEthQuery = class KsnEthQuery extends eth_query_1.default {
    constructor(provider) {
        super(provider);
        this.getSlice = this.generateFnFor('eth_getSlice').bind(this);
    }
    generateFnFor(methodName) {
        return (...args) => {
            let cb = args.pop();
            this.sendAsync({ method: methodName, params: args }, cb);
        };
    }
};
KsnEthQuery = __decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register(ethjs_provider_http_1.default)),
    __metadata("design:paramtypes", [ethjs_provider_http_1.default])
], KsnEthQuery);
exports.KsnEthQuery = KsnEthQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3NuLWV0aC1xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rc24tZXRoLXF1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFWiw4RUFBOEM7QUFDOUMsMERBQWdDO0FBQ2hDLHVEQUEyQztBQUUzQzs7R0FFRztBQUVILElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVksU0FBUSxtQkFBUTtJQUd2QyxZQUFxQyxRQUFzQjtRQUN6RCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQy9ELENBQUM7SUFFUyxhQUFhLENBQUUsVUFBa0I7UUFDekMsT0FBTyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUU7WUFDeEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMxRCxDQUFDLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQWRZLFdBQVc7SUFEdkIsMkJBQVEsRUFBRTtJQUlLLFdBQUEsMkJBQVEsQ0FBQyw2QkFBWSxDQUFDLENBQUE7cUNBQVcsNkJBQVk7R0FIaEQsV0FBVyxDQWN2QjtBQWRZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBIdHRwUHJvdmlkZXIgZnJvbSAnZXRoanMtcHJvdmlkZXItaHR0cCdcbmltcG9ydCBFdGhRdWVyeSBmcm9tICdldGgtcXVlcnknXG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5cbi8qKlxuICogRXh0ZW5kcyBFdGhRdWVyeSB3aXRoIGdldFNsaWNlIGNhbGxcbiAqL1xuQHJlZ2lzdGVyKClcbmV4cG9ydCBjbGFzcyBLc25FdGhRdWVyeSBleHRlbmRzIEV0aFF1ZXJ5IHtcbiAgZ2V0U2xpY2U6IChwYXRoOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIsIHJvb3Q6IHN0cmluZywgaXNTdG9yYWdlOiBib29sZWFuKSA9PiBhbnlcblxuICBjb25zdHJ1Y3RvciAoQHJlZ2lzdGVyKEh0dHBQcm92aWRlcikgcHJvdmlkZXI6IEh0dHBQcm92aWRlcikge1xuICAgIHN1cGVyKHByb3ZpZGVyKVxuICAgIHRoaXMuZ2V0U2xpY2UgPSB0aGlzLmdlbmVyYXRlRm5Gb3IoJ2V0aF9nZXRTbGljZScpLmJpbmQodGhpcylcbiAgfVxuXG4gIHByb3RlY3RlZCBnZW5lcmF0ZUZuRm9yIChtZXRob2ROYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBsZXQgY2IgPSBhcmdzLnBvcCgpXG4gICAgICB0aGlzLnNlbmRBc3luYyh7IG1ldGhvZDogbWV0aG9kTmFtZSwgcGFyYW1zOiBhcmdzIH0sIGNiKVxuICAgIH1cbiAgfVxufVxuIl19