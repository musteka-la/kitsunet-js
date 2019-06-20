"use strict";
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
var SliceStore_1;
Object.defineProperty(exports, "__esModule", { value: true });
'use strict';
require("./dependencies");
const slice_1 = require("../slice");
const interface_datastore_1 = require("interface-datastore");
const opium_decorators_1 = require("opium-decorators");
const SLICE_PREFIX = '/slices';
let SliceStore = SliceStore_1 = class SliceStore {
    /**
     * The store where to retrieve data from
     *
     * @param {Store} store - underlying store where slice data is stored
     */
    constructor(store) {
        this._store = store;
    }
    getSlices() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${SLICE_PREFIX}`;
            const slices = [...this._store.query({ prefix: key })];
            if (slices.length > 0) {
                return slices.map((s) => new slice_1.Slice(s));
            }
        });
    }
    static _mkKey(...entries) {
        entries.unshift(`/${SLICE_PREFIX}`);
        return entries.join('/');
    }
    /**
     * Lookup all slices with a path
     *
     * @param {SliceId} sliceId - the slices to look for
     */
    getByPath(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = SliceStore_1._mkKey(sliceId.path);
            const slices = [...this._store.query({ prefix: key })];
            if (slices.length > 0) {
                return slices.map((s) => new slice_1.Slice(s));
            }
        });
    }
    /**
     * Lookup a slice by its id
     *
     * @param {SliceId} sliceId - the slice to lookup
     */
    getById(sliceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = SliceStore_1._mkKey(sliceId.path, String(sliceId.depth), sliceId.root);
            const raw = yield this._store.get(new interface_datastore_1.Key(key));
            if (raw) {
                return new slice_1.Slice(raw);
            }
        });
    }
    /**
     * Store a slice in the underlying store
     *
     * @param {Slice} slice - the slice to store
     */
    put(slice) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = SliceStore_1._mkKey(slice.path, String(slice.depth), slice.root);
            return this._store.put(new interface_datastore_1.Key(key), slice.serialize());
        });
    }
};
SliceStore = SliceStore_1 = __decorate([
    opium_decorators_1.register(),
    __param(0, opium_decorators_1.register('data-store')),
    __metadata("design:paramtypes", [Object])
], SliceStore);
exports.SliceStore = SliceStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2Utc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RvcmVzL3NsaWNlLXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsWUFBWSxDQUFBO0FBRVosMEJBQXVCO0FBQ3ZCLG9DQUF5QztBQUN6Qyw2REFBb0Q7QUFDcEQsdURBQTJDO0FBRTNDLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQTtBQUc5QixJQUFhLFVBQVUsa0JBQXZCLE1BQWEsVUFBVTtJQUtyQjs7OztPQUlHO0lBQ0gsWUFBcUMsS0FBZ0I7UUFDbkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7SUFDckIsQ0FBQztJQUVLLFNBQVM7O1lBQ2IsTUFBTSxHQUFHLEdBQUcsR0FBRyxZQUFZLEVBQUUsQ0FBQTtZQUM3QixNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3RELElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxhQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUN2QztRQUNILENBQUM7S0FBQTtJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUUsR0FBRyxPQUFpQjtRQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQTtRQUNuQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDRyxTQUFTLENBQUUsT0FBZ0I7O1lBQy9CLE1BQU0sR0FBRyxHQUFHLFlBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzNDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDdEQsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGFBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ3ZDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNHLE9BQU8sQ0FBRSxPQUFnQjs7WUFDN0IsTUFBTSxHQUFHLEdBQVcsWUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3hGLE1BQU0sR0FBRyxHQUFXLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSx5QkFBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDdkQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsT0FBTyxJQUFJLGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUN0QjtRQUNILENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDRyxHQUFHLENBQUUsS0FBWTs7WUFDckIsTUFBTSxHQUFHLEdBQUcsWUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSx5QkFBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ3pELENBQUM7S0FBQTtDQUNGLENBQUE7QUE5RFksVUFBVTtJQUR0QiwyQkFBUSxFQUFFO0lBV0ssV0FBQSwyQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFBOztHQVZ6QixVQUFVLENBOER0QjtBQTlEWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgJy4vZGVwZW5kZW5jaWVzJ1xuaW1wb3J0IHsgU2xpY2UsIFNsaWNlSWQgfSBmcm9tICcuLi9zbGljZSdcbmltcG9ydCB7IEtleSwgRGF0YXN0b3JlIH0gZnJvbSAnaW50ZXJmYWNlLWRhdGFzdG9yZSdcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnb3BpdW0tZGVjb3JhdG9ycydcblxuY29uc3QgU0xJQ0VfUFJFRklYID0gJy9zbGljZXMnXG5cbkByZWdpc3RlcigpXG5leHBvcnQgY2xhc3MgU2xpY2VTdG9yZSB7XG4gIC8vIHF1ZXJ5IGRvZXNuJ3QgdGFrZSBhIGNhbGxiYWNrLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGV4dHJhY3QgaXQgZnJvbSB0aGUgc2V0IG9mIHByb21pc2lmaWFibGUgbWVtYmVyc1xuICBfc3RvcmU6IERhdGFzdG9yZVxuXG4gIC8qKlxuICAgKiBUaGUgc3RvcmUgd2hlcmUgdG8gcmV0cmlldmUgZGF0YSBmcm9tXG4gICAqXG4gICAqIEBwYXJhbSB7U3RvcmV9IHN0b3JlIC0gdW5kZXJseWluZyBzdG9yZSB3aGVyZSBzbGljZSBkYXRhIGlzIHN0b3JlZFxuICAgKi9cbiAgY29uc3RydWN0b3IgKEByZWdpc3RlcignZGF0YS1zdG9yZScpIHN0b3JlOiBEYXRhc3RvcmUpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlXG4gIH1cblxuICBhc3luYyBnZXRTbGljZXMgKCk6IFByb21pc2U8U2xpY2VbXSB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGtleSA9IGAke1NMSUNFX1BSRUZJWH1gXG4gICAgY29uc3Qgc2xpY2VzID0gWy4uLnRoaXMuX3N0b3JlLnF1ZXJ5KHsgcHJlZml4OiBrZXkgfSldXG4gICAgaWYgKHNsaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gc2xpY2VzLm1hcCgocykgPT4gbmV3IFNsaWNlKHMpKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBfbWtLZXkgKC4uLmVudHJpZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBlbnRyaWVzLnVuc2hpZnQoYC8ke1NMSUNFX1BSRUZJWH1gKVxuICAgIHJldHVybiBlbnRyaWVzLmpvaW4oJy8nKVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2t1cCBhbGwgc2xpY2VzIHdpdGggYSBwYXRoXG4gICAqXG4gICAqIEBwYXJhbSB7U2xpY2VJZH0gc2xpY2VJZCAtIHRoZSBzbGljZXMgdG8gbG9vayBmb3JcbiAgICovXG4gIGFzeW5jIGdldEJ5UGF0aCAoc2xpY2VJZDogU2xpY2VJZCk6IFByb21pc2U8U2xpY2VbXSB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGtleSA9IFNsaWNlU3RvcmUuX21rS2V5KHNsaWNlSWQucGF0aClcbiAgICBjb25zdCBzbGljZXMgPSBbLi4udGhpcy5fc3RvcmUucXVlcnkoeyBwcmVmaXg6IGtleSB9KV1cbiAgICBpZiAoc2xpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBzbGljZXMubWFwKChzKSA9PiBuZXcgU2xpY2UocykpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2t1cCBhIHNsaWNlIGJ5IGl0cyBpZFxuICAgKlxuICAgKiBAcGFyYW0ge1NsaWNlSWR9IHNsaWNlSWQgLSB0aGUgc2xpY2UgdG8gbG9va3VwXG4gICAqL1xuICBhc3luYyBnZXRCeUlkIChzbGljZUlkOiBTbGljZUlkKTogUHJvbWlzZTxTbGljZSB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGtleTogc3RyaW5nID0gU2xpY2VTdG9yZS5fbWtLZXkoc2xpY2VJZC5wYXRoLCBTdHJpbmcoc2xpY2VJZC5kZXB0aCksIHNsaWNlSWQucm9vdClcbiAgICBjb25zdCByYXc6IEJ1ZmZlciA9IGF3YWl0IHRoaXMuX3N0b3JlLmdldChuZXcgS2V5KGtleSkpXG4gICAgaWYgKHJhdykge1xuICAgICAgcmV0dXJuIG5ldyBTbGljZShyYXcpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIGEgc2xpY2UgaW4gdGhlIHVuZGVybHlpbmcgc3RvcmVcbiAgICpcbiAgICogQHBhcmFtIHtTbGljZX0gc2xpY2UgLSB0aGUgc2xpY2UgdG8gc3RvcmVcbiAgICovXG4gIGFzeW5jIHB1dCAoc2xpY2U6IFNsaWNlKSB7XG4gICAgY29uc3Qga2V5ID0gU2xpY2VTdG9yZS5fbWtLZXkoc2xpY2UucGF0aCwgU3RyaW5nKHNsaWNlLmRlcHRoKSwgc2xpY2Uucm9vdClcbiAgICByZXR1cm4gdGhpcy5fc3RvcmUucHV0KG5ldyBLZXkoa2V5KSwgc2xpY2Uuc2VyaWFsaXplKCkpXG4gIH1cbn1cbiJdfQ==