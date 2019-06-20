'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cbor = __importStar(require("borc"));
class SliceId {
    constructor(path = '0x0000', depth = 10, root, isStorage = false) {
        [
            this.path,
            this.depth,
            this.root,
            this.isStorage
        ] = SliceId.parse(path, depth, root, isStorage);
    }
    static parse(path, depth, root, isStorage = false) {
        if (Buffer.isBuffer(path)) {
            ({ path, depth, root, isStorage } = cbor.decode(path));
        }
        else if (String(path).includes('-')) {
            [path, depth, root] = path.split('-');
        }
        return [path, Number(depth), root, Boolean(isStorage)];
    }
    get id() {
        return `${this.path}-${this.depth}${this.root ? '-' + this.root : ''}`;
    }
    serialize() {
        return cbor.encode({
            sliceId: this.id,
            path: this.path,
            depth: this.depth,
            root: this.root,
            isStorage: Boolean(this.isStorage)
        });
    }
}
exports.SliceId = SliceId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UtaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2xpY2Uvc2xpY2UtaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7QUFFWiwyQ0FBNEI7QUFFNUIsTUFBYSxPQUFPO0lBTWxCLFlBQWEsT0FBZSxRQUFRLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxJQUFhLEVBQUUsWUFBcUIsS0FBSztRQUN6RjtZQUNFLElBQUksQ0FBQyxJQUFJO1lBQ1QsSUFBSSxDQUFDLEtBQUs7WUFDVixJQUFJLENBQUMsSUFBSTtZQUNULElBQUksQ0FBQyxTQUFTO1NBQ2YsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBQ2pELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFFLElBQVksRUFBRSxLQUFzQixFQUFFLElBQWEsRUFBRSxZQUFxQixLQUFLO1FBQzNGLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QixDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQ3ZEO2FBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ3RDO1FBRUQsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRCxJQUFJLEVBQUU7UUFDSixPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUN4RSxDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNuQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUF0Q0QsMEJBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCAqIGFzIGNib3IgZnJvbSAnYm9yYydcblxuZXhwb3J0IGNsYXNzIFNsaWNlSWQge1xuICBwYXRoOiBzdHJpbmdcbiAgZGVwdGg6IG51bWJlclxuICByb290OiBzdHJpbmdcbiAgaXNTdG9yYWdlOiBib29sZWFuXG5cbiAgY29uc3RydWN0b3IgKHBhdGg6IHN0cmluZyA9ICcweDAwMDAnLCBkZXB0aCA9IDEwLCByb290Pzogc3RyaW5nLCBpc1N0b3JhZ2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIFtcbiAgICAgIHRoaXMucGF0aCxcbiAgICAgIHRoaXMuZGVwdGgsXG4gICAgICB0aGlzLnJvb3QsXG4gICAgICB0aGlzLmlzU3RvcmFnZVxuICAgIF0gPSBTbGljZUlkLnBhcnNlKHBhdGgsIGRlcHRoLCByb290LCBpc1N0b3JhZ2UpXG4gIH1cblxuICBzdGF0aWMgcGFyc2UgKHBhdGg6IHN0cmluZywgZGVwdGg6IG51bWJlciB8IHN0cmluZywgcm9vdD86IHN0cmluZywgaXNTdG9yYWdlOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIocGF0aCkpIHtcbiAgICAgICh7IHBhdGgsIGRlcHRoLCByb290LCBpc1N0b3JhZ2UgfSA9IGNib3IuZGVjb2RlKHBhdGgpKVxuICAgIH0gZWxzZSBpZiAoU3RyaW5nKHBhdGgpLmluY2x1ZGVzKCctJykpIHtcbiAgICAgIFtwYXRoLCBkZXB0aCwgcm9vdF0gPSBwYXRoLnNwbGl0KCctJylcbiAgICB9XG5cbiAgICByZXR1cm4gW3BhdGgsIE51bWJlcihkZXB0aCksIHJvb3QsIEJvb2xlYW4oaXNTdG9yYWdlKV1cbiAgfVxuXG4gIGdldCBpZCAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5wYXRofS0ke3RoaXMuZGVwdGh9JHt0aGlzLnJvb3QgPyAnLScgKyB0aGlzLnJvb3QgOiAnJ31gXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuICAgIHJldHVybiBjYm9yLmVuY29kZSh7XG4gICAgICBzbGljZUlkOiB0aGlzLmlkLFxuICAgICAgcGF0aDogdGhpcy5wYXRoLFxuICAgICAgZGVwdGg6IHRoaXMuZGVwdGgsXG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBpc1N0b3JhZ2U6IEJvb2xlYW4odGhpcy5pc1N0b3JhZ2UpXG4gICAgfSlcbiAgfVxufVxuIl19