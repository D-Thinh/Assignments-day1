// 1. Create config object
const config = {
    mucPhuPhi: 120000,
    phienBan: "v1.0",
};
Object.freeze(config);

// 2 Create Class
class MyClass {
    constructor(name) {
        this.name = name;
        this.items = [];
        this._discountPercent = 0;
        Object.defineProperty(this, "id", {
            value: Math.random(),
            writable: false,
            enumerable: false,
            configurable: false,
        });
    }

    addItem(name, price, count) {
        this.items.push({ name, price, count });
    }
    get total() {
        let rawTotal =
            this.items.reduce(
                (total, item) => (total += item.price * item.count),
                0,
            ) + config.mucPhuPhi;

        return (rawTotal -= (rawTotal * this._discountPercent) / 100);
    }
    set discountPercent(value) {
        if (value < 0 || value > 100) {
            throw new Error("Mức giảm giá phải nằm trong khoảng từ 0 đến 100!");
        }
        this._discountPercent = value;
    }
}

function logSummary() {
    console.log(`${this.name}: ${this.total}`);
}

// Test case
// config.mucPhuPhi = 0.5;
// console.log(config.mucPhuPhi);
// console.log(Object.isFrozen(config));

//console.log(instance.total);
// Output: 1320000
// instance.discountPercent = 10;
// console.log(instance.total);
// Output: 1188000
try {
    instance.discountPercent = 150;
} catch (e) {
    console.log(e.message);
}
setTimeout(logSummary.bind(instance), 100);
// Output sau 100ms: "Danh sách của An: 1188000"
console.log(Object.keys(instance));

instance.id = "hack123";
console.log(instance.id);
// Output: vẫn là id lúc đầu, không bị thay

const objA = { name: "Sản phẩm gốc", quantity: 5, price: 1000 };
const objB = { price: 2500, status: "active" };
const merged = Object.assign({}, objA, objB);
console.log(merged);
// Output: object đã gộp xong, ưu tiên giá trị của object thứ hai
console.log(objA);
// Output: object gốc vẫn y nguyên, không bị đụng tới
