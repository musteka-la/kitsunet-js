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
Object.defineProperty(exports, "__esModule", { value: true });
const slice_store_1 = require("./slice-store");
const interface_datastore_1 = require("interface-datastore");
const opium_decorators_1 = require("opium-decorators");
class StoresFactory {
    createStore() {
        return new interface_datastore_1.MemoryDatastore();
    }
    createSliceStore(dataStore) {
        return new slice_store_1.SliceStore(dataStore);
    }
}
__decorate([
    opium_decorators_1.register('data-store'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], StoresFactory.prototype, "createStore", null);
__decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('data-store')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", slice_store_1.SliceStore)
], StoresFactory.prototype, "createSliceStore", null);
exports.StoresFactory = StoresFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0b3Jlcy9kZXBlbmRlbmNpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUVaLCtDQUEwQztBQUMxQyw2REFHNEI7QUFDNUIsdURBQTJDO0FBRTNDLE1BQWEsYUFBYTtJQUV4QixXQUFXO1FBQ1QsT0FBTyxJQUFJLHFDQUFlLEVBQUUsQ0FBQTtJQUM5QixDQUFDO0lBR0QsZ0JBQWdCLENBQTBCLFNBQW9CO1FBQzVELE9BQU8sSUFBSSx3QkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7Q0FDRjtBQVJDO0lBREMsMkJBQVEsQ0FBQyxZQUFZLENBQUM7Ozs7Z0RBR3RCO0FBR0Q7SUFEQywyQkFBUSxFQUFFO0lBQ1EsV0FBQSwyQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFBOzs7b0NBQXdCLHdCQUFVO3FEQUUxRTtBQVRILHNDQVVDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IFNsaWNlU3RvcmUgfSBmcm9tICcuL3NsaWNlLXN0b3JlJ1xuaW1wb3J0IHtcbiAgTWVtb3J5RGF0YXN0b3JlLFxuICBEYXRhc3RvcmVcbn0gZnJvbSAnaW50ZXJmYWNlLWRhdGFzdG9yZSdcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuZXhwb3J0IGNsYXNzIFN0b3Jlc0ZhY3Rvcnkge1xuICBAcmVnaXN0ZXIoJ2RhdGEtc3RvcmUnKVxuICBjcmVhdGVTdG9yZSAoKTogRGF0YXN0b3JlIHtcbiAgICByZXR1cm4gbmV3IE1lbW9yeURhdGFzdG9yZSgpXG4gIH1cblxuICBAcmVnaXN0ZXIoKVxuICBjcmVhdGVTbGljZVN0b3JlIChAcmVnaXN0ZXIoJ2RhdGEtc3RvcmUnKSBkYXRhU3RvcmU6IERhdGFzdG9yZSk6IFNsaWNlU3RvcmUge1xuICAgIHJldHVybiBuZXcgU2xpY2VTdG9yZShkYXRhU3RvcmUpXG4gIH1cbn1cbiJdfQ==