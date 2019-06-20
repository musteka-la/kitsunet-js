'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slice_id_1 = require("./slice-id");
const normalize_keys_1 = __importDefault(require("normalize-keys"));
const bourne_1 = __importDefault(require("bourne"));
const borc_1 = require("borc");
class Slice extends slice_id_1.SliceId {
    constructor(data) {
        const parsed = Slice.parse(data);
        const [path, depth, root] = parsed.sliceId.split('-');
        // call super after parsing the slice
        super(path, depth, root);
        this.parsed = parsed;
        this.nodes = Object.assign({}, this.head, this.sliceNodes, this.stem);
    }
    static parse(data) {
        let parsed;
        if (Buffer.isBuffer(data)) {
            parsed = borc_1.decode(data);
            parsed = Object.assign({}, parsed, borc_1.decode(parsed.__sliceId__));
            delete parsed.__sliceId__;
        }
        else if (typeof data === 'string') {
            parsed = normalize_keys_1.default(bourne_1.default.parse(data), ['metadata']);
        }
        else if (typeof data.metadata !== 'undefined') {
            parsed = normalize_keys_1.default(data, ['metadata']);
        }
        else {
            throw new Error('slice data must be Buffer, JSON or a parsed Slice Object');
        }
        return parsed;
    }
    get head() {
        return this.parsed.trieNodes.head;
    }
    get stem() {
        return this.parsed.trieNodes.stem;
    }
    get sliceNodes() {
        return this.parsed.trieNodes.sliceNodes;
    }
    get leaves() {
        return this.parsed.leaves;
    }
    serialize() {
        return borc_1.encode({
            __sliceId__: super.serialize(),
            trieNodes: {
                head: this.head,
                stem: this.stem,
                sliceNodes: this.sliceNodes
            },
            leaves: this.leaves
        });
    }
}
exports.Slice = Slice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2xpY2Uvc2xpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7OztBQUVaLHlDQUFvQztBQUNwQyxvRUFBMEM7QUFDMUMsb0RBQTJCO0FBQzNCLCtCQUFxQztBQUVyQyxNQUFhLEtBQU0sU0FBUSxrQkFBTztJQUloQyxZQUFhLElBQThCO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFckQscUNBQXFDO1FBQ3JDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXhCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxLQUFLLHFCQUFRLElBQUksQ0FBQyxJQUFJLEVBQUssSUFBSSxDQUFDLFVBQVUsRUFBSyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUE7SUFDakUsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUUsSUFBUztRQUNyQixJQUFJLE1BQU0sQ0FBQTtRQUNWLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QixNQUFNLEdBQUcsYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3JCLE1BQU0scUJBQVEsTUFBTSxFQUFLLGFBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUUsQ0FBQTtZQUNyRCxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUE7U0FDMUI7YUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNuQyxNQUFNLEdBQUcsd0JBQWEsQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7U0FDekQ7YUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDL0MsTUFBTSxHQUFHLHdCQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtTQUMzQzthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFBO1NBQzVFO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUE7SUFDbkMsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFBO0lBQ25DLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTtJQUMzQixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sYUFBTSxDQUFDO1lBQ1osV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDOUIsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2FBQzVCO1lBQ0QsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQTNERCxzQkEyREMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgU2xpY2VJZCB9IGZyb20gJy4vc2xpY2UtaWQnXG5pbXBvcnQgbm9ybWFsaXplS2V5cyBmcm9tICdub3JtYWxpemUta2V5cydcbmltcG9ydCBib3VybmUgZnJvbSAnYm91cm5lJ1xuaW1wb3J0IHsgZGVjb2RlLCBlbmNvZGUgfSBmcm9tICdib3JjJ1xuXG5leHBvcnQgY2xhc3MgU2xpY2UgZXh0ZW5kcyBTbGljZUlkIHtcbiAgcGFyc2VkOiBhbnlcbiAgbm9kZXM6IGFueVxuXG4gIGNvbnN0cnVjdG9yIChkYXRhOiBCdWZmZXIgfCBzdHJpbmcgfCBPYmplY3QpIHtcbiAgICBjb25zdCBwYXJzZWQgPSBTbGljZS5wYXJzZShkYXRhKVxuICAgIGNvbnN0IFtwYXRoLCBkZXB0aCwgcm9vdF0gPSBwYXJzZWQuc2xpY2VJZC5zcGxpdCgnLScpXG5cbiAgICAvLyBjYWxsIHN1cGVyIGFmdGVyIHBhcnNpbmcgdGhlIHNsaWNlXG4gICAgc3VwZXIocGF0aCwgZGVwdGgsIHJvb3QpXG5cbiAgICB0aGlzLnBhcnNlZCA9IHBhcnNlZFxuICAgIHRoaXMubm9kZXMgPSB7IC4uLnRoaXMuaGVhZCwgLi4udGhpcy5zbGljZU5vZGVzLCAuLi50aGlzLnN0ZW0gfVxuICB9XG5cbiAgc3RhdGljIHBhcnNlIChkYXRhOiBhbnkpIHtcbiAgICBsZXQgcGFyc2VkXG4gICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkge1xuICAgICAgcGFyc2VkID0gZGVjb2RlKGRhdGEpXG4gICAgICBwYXJzZWQgPSB7IC4uLnBhcnNlZCwgLi4uZGVjb2RlKHBhcnNlZC5fX3NsaWNlSWRfXykgfVxuICAgICAgZGVsZXRlIHBhcnNlZC5fX3NsaWNlSWRfX1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJzZWQgPSBub3JtYWxpemVLZXlzKGJvdXJuZS5wYXJzZShkYXRhKSwgWydtZXRhZGF0YSddKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEubWV0YWRhdGEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBwYXJzZWQgPSBub3JtYWxpemVLZXlzKGRhdGEsIFsnbWV0YWRhdGEnXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzbGljZSBkYXRhIG11c3QgYmUgQnVmZmVyLCBKU09OIG9yIGEgcGFyc2VkIFNsaWNlIE9iamVjdCcpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZFxuICB9XG5cbiAgZ2V0IGhlYWQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlZC50cmllTm9kZXMuaGVhZFxuICB9XG5cbiAgZ2V0IHN0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlZC50cmllTm9kZXMuc3RlbVxuICB9XG5cbiAgZ2V0IHNsaWNlTm9kZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlZC50cmllTm9kZXMuc2xpY2VOb2Rlc1xuICB9XG5cbiAgZ2V0IGxlYXZlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VkLmxlYXZlc1xuICB9XG5cbiAgc2VyaWFsaXplICgpIHtcbiAgICByZXR1cm4gZW5jb2RlKHtcbiAgICAgIF9fc2xpY2VJZF9fOiBzdXBlci5zZXJpYWxpemUoKSxcbiAgICAgIHRyaWVOb2Rlczoge1xuICAgICAgICBoZWFkOiB0aGlzLmhlYWQsXG4gICAgICAgIHN0ZW06IHRoaXMuc3RlbSxcbiAgICAgICAgc2xpY2VOb2RlczogdGhpcy5zbGljZU5vZGVzXG4gICAgICB9LFxuICAgICAgbGVhdmVzOiB0aGlzLmxlYXZlc1xuICAgIH0pXG4gIH1cbn1cbiJdfQ==