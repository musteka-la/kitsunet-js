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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethjs_util_1 = __importDefault(require("ethjs-util"));
const kitsunet_1 = require("./kitsunet");
const opium_decorators_1 = require("opium-decorators");
const ethereumjs_util_1 = require("ethereumjs-util");
const slice_1 = require("./slice");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:kitsunet-factory');
__export(require("./kitsunet"));
class KitsunetFactory {
    static getOptions() {
        return KitsunetFactory.options;
    }
    static defaultSlices(options) {
        let paths = options.slicePath || [];
        let ethAddrs = options.ethAddrs || [];
        if (ethAddrs.length) {
            paths = paths.concat(ethAddrs.map((a) => {
                if (ethereumjs_util_1.isValidAddress(a)) {
                    return ethereumjs_util_1.keccak256(ethjs_util_1.default.stripHexPrefix(a)).toString('hex').slice(0, 4);
                }
            }));
        }
        let slices = paths.map((p) => {
            return new slice_1.SliceId(p, options.sliceDepth);
        });
        if (options.sliceFile && options.sliceFile.length > 0) {
            const slicesFile = require(options.sliceFile);
            slices = slices.concat(slicesFile.slices.map((p) => {
                return new slice_1.SliceId(p, options.sliceDepth);
            }));
        }
        return slices;
    }
    static kitsunetFactory(kitsunet, slices) {
        return __awaiter(this, void 0, void 0, function* () {
            kitsunet.on('kitsunet:start', () => {
                debug('kitsunet started');
                return kitsunet.sliceManager.track(new Set(slices));
            });
            return kitsunet;
        });
    }
    static createKitsunet(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.ethNetwork = options.ethNetwork || 'mainnet';
            options.chainDb = options.chainDb || 'kitsunet';
            KitsunetFactory.options = options;
            const injectable = opium_decorators_1.injectableFactory()(KitsunetFactory, 'kitsunetFactory');
            return injectable.inject();
        });
    }
}
__decorate([
    opium_decorators_1.register('options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], KitsunetFactory, "getOptions", null);
__decorate([
    opium_decorators_1.register('default-slices'),
    __param(0, opium_decorators_1.register('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], KitsunetFactory, "defaultSlices", null);
__decorate([
    opium_decorators_1.register(),
    __param(1, opium_decorators_1.register('default-slices')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kitsunet_1.Kitsunet, Array]),
    __metadata("design:returntype", Promise)
], KitsunetFactory, "kitsunetFactory", null);
exports.KitsunetFactory = KitsunetFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosNERBQW1DO0FBQ25DLHlDQUFxQztBQUNyQyx1REFBOEQ7QUFDOUQscURBQTJEO0FBQzNELG1DQUF3QztBQUd4QyxrREFBeUI7QUFDekIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLDJCQUEyQixDQUFDLENBQUE7QUFFaEQsZ0NBQTBCO0FBRTFCLE1BQWEsZUFBZTtJQUkxQixNQUFNLENBQUMsVUFBVTtRQUNmLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQTtJQUNoQyxDQUFDO0lBR0QsTUFBTSxDQUFDLGFBQWEsQ0FBdUIsT0FBWTtRQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQTtRQUNuQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTtRQUNyQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDbkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLGdDQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3JCLE9BQU8sMkJBQVMsQ0FBQyxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO2lCQUMzRTtZQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDSjtRQUVELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUMzQixPQUFPLElBQUksZUFBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDN0MsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDakQsT0FBTyxJQUFJLGVBQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzNDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztJQUdELE1BQU0sQ0FBTyxlQUFlLENBQW1DLFFBQXFCLEVBRXJCLE1BQWU7O1lBQzVFLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO2dCQUNqQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtnQkFDekIsT0FBTyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQ3JELENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxRQUFRLENBQUE7UUFDakIsQ0FBQztLQUFBO0lBRUQsTUFBTSxDQUFPLGNBQWMsQ0FBRSxPQUFZOztZQUN2QyxPQUFPLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFBO1lBQ3BELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUE7WUFDL0MsZUFBZSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7WUFFakMsTUFBTSxVQUFVLEdBQUcsb0NBQWlCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtZQUMxRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUM1QixDQUFDO0tBQUE7Q0FDRjtBQWxEQztJQURDLDJCQUFRLENBQUMsU0FBUyxDQUFDOzs7O3VDQUduQjtBQUdEO0lBREMsMkJBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNKLFdBQUEsMkJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7OzswQ0F1QnpDO0FBR0Q7SUFEQywyQkFBUSxFQUFFO0lBRXFELFdBQUEsMkJBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBOztxQ0FEakIsbUJBQVE7OzRDQVNoRjtBQTVDSCwwQ0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IGV0aGpzVXRpbHMgZnJvbSAnZXRoanMtdXRpbCdcbmltcG9ydCB7IEtpdHN1bmV0IH0gZnJvbSAnLi9raXRzdW5ldCdcbmltcG9ydCB7IHJlZ2lzdGVyLCBpbmplY3RhYmxlRmFjdG9yeSB9IGZyb20gJ29waXVtLWRlY29yYXRvcnMnXG5pbXBvcnQgeyBpc1ZhbGlkQWRkcmVzcywga2VjY2FrMjU2IH0gZnJvbSAnZXRoZXJldW1qcy11dGlsJ1xuaW1wb3J0IHsgU2xpY2VJZCwgU2xpY2UgfSBmcm9tICcuL3NsaWNlJ1xuaW1wb3J0IHsgTmV0d29ya1BlZXIgfSBmcm9tICcuL25ldCdcblxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBEZWJ1Zygna2l0c3VuZXQ6a2l0c3VuZXQtZmFjdG9yeScpXG5cbmV4cG9ydCAqIGZyb20gJy4va2l0c3VuZXQnXG5cbmV4cG9ydCBjbGFzcyBLaXRzdW5ldEZhY3Rvcnkge1xuICBzdGF0aWMgb3B0aW9uczogYW55XG5cbiAgQHJlZ2lzdGVyKCdvcHRpb25zJylcbiAgc3RhdGljIGdldE9wdGlvbnMgKCk6IGFueSB7XG4gICAgcmV0dXJuIEtpdHN1bmV0RmFjdG9yeS5vcHRpb25zXG4gIH1cblxuICBAcmVnaXN0ZXIoJ2RlZmF1bHQtc2xpY2VzJylcbiAgc3RhdGljIGRlZmF1bHRTbGljZXMgKEByZWdpc3Rlcignb3B0aW9ucycpIG9wdGlvbnM6IGFueSk6IFNsaWNlW10ge1xuICAgIGxldCBwYXRocyA9IG9wdGlvbnMuc2xpY2VQYXRoIHx8IFtdXG4gICAgbGV0IGV0aEFkZHJzID0gb3B0aW9ucy5ldGhBZGRycyB8fCBbXVxuICAgIGlmIChldGhBZGRycy5sZW5ndGgpIHtcbiAgICAgIHBhdGhzID0gcGF0aHMuY29uY2F0KGV0aEFkZHJzLm1hcCgoYSkgPT4ge1xuICAgICAgICBpZiAoaXNWYWxpZEFkZHJlc3MoYSkpIHtcbiAgICAgICAgICByZXR1cm4ga2VjY2FrMjU2KGV0aGpzVXRpbHMuc3RyaXBIZXhQcmVmaXgoYSkpLnRvU3RyaW5nKCdoZXgnKS5zbGljZSgwLCA0KVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9XG5cbiAgICBsZXQgc2xpY2VzID0gcGF0aHMubWFwKChwKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFNsaWNlSWQocCwgb3B0aW9ucy5zbGljZURlcHRoKVxuICAgIH0pXG5cbiAgICBpZiAob3B0aW9ucy5zbGljZUZpbGUgJiYgb3B0aW9ucy5zbGljZUZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2xpY2VzRmlsZSA9IHJlcXVpcmUob3B0aW9ucy5zbGljZUZpbGUpXG4gICAgICBzbGljZXMgPSBzbGljZXMuY29uY2F0KHNsaWNlc0ZpbGUuc2xpY2VzLm1hcCgocCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFNsaWNlSWQocCwgb3B0aW9ucy5zbGljZURlcHRoKVxuICAgICAgfSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWNlc1xuICB9XG5cbiAgQHJlZ2lzdGVyKClcbiAgc3RhdGljIGFzeW5jIGtpdHN1bmV0RmFjdG9yeTxUIGV4dGVuZHMgTmV0d29ya1BlZXI8YW55LCBhbnk+PiAoa2l0c3VuZXQ6IEtpdHN1bmV0PFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXIoJ2RlZmF1bHQtc2xpY2VzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpY2VzOiBTbGljZVtdKTogUHJvbWlzZTxLaXRzdW5ldDxUPj4ge1xuICAgIGtpdHN1bmV0Lm9uKCdraXRzdW5ldDpzdGFydCcsICgpID0+IHtcbiAgICAgIGRlYnVnKCdraXRzdW5ldCBzdGFydGVkJylcbiAgICAgIHJldHVybiBraXRzdW5ldC5zbGljZU1hbmFnZXIudHJhY2sobmV3IFNldChzbGljZXMpKVxuICAgIH0pXG5cbiAgICByZXR1cm4ga2l0c3VuZXRcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVLaXRzdW5ldCAob3B0aW9uczogYW55KSB7XG4gICAgb3B0aW9ucy5ldGhOZXR3b3JrID0gb3B0aW9ucy5ldGhOZXR3b3JrIHx8ICdtYWlubmV0J1xuICAgIG9wdGlvbnMuY2hhaW5EYiA9IG9wdGlvbnMuY2hhaW5EYiB8fCAna2l0c3VuZXQnXG4gICAgS2l0c3VuZXRGYWN0b3J5Lm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICBjb25zdCBpbmplY3RhYmxlID0gaW5qZWN0YWJsZUZhY3RvcnkoKShLaXRzdW5ldEZhY3RvcnksICdraXRzdW5ldEZhY3RvcnknKVxuICAgIHJldHVybiBpbmplY3RhYmxlLmluamVjdCgpXG4gIH1cbn1cbiJdfQ==