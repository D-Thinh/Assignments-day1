function createOrderSystem() {
    let cart = [];

    function addToCart(name, price, qty) {
        return cart.push({ name, price, qty });
    }

    function getCartSize() {
        return cart.length;
    }

    function checkout(distance) {
        const value = {};
        const price = cart.reduce((total, item) => {
            total += item.price * item.qty;
            return total;
        }, 0);

        let shippingFee = 0;
        if (distance <= 5) {
            const baseFee = 15000;
            shippingFee = baseFee;
        } else if (distance <= 20) {
            const baseFee = 30000;
            shippingFee = baseFee;
        } else {
            const baseFee = 50000;
            shippingFee = baseFee;
        }
        if (price >= 500000) {
            shippingFee = 0;
        }

        value.subtotal = price;
        value.shippingFee = shippingFee;
        value.finalTotal = price + shippingFee;
        cart = [];
        return value;
    }
    return {
        addToCart,
        checkout,
        getCartSize,
    };
}

const store = createOrderSystem();

console.log(store.addToCart("Mũ lưỡi trai", 120000, 1)); // 1
console.log(store.getCartSize()); // 1

console.log(store.checkout(15));
// { subtotal: 120000, shippingFee: 30000, finalTotal: 150000 }

console.log(store.getCartSize()); // 0

// --- Một hệ thống khác, hoàn toàn độc lập ---
const store2 = createOrderSystem();
console.log(store2.addToCart("Tất", 30000, 2)); // 1
console.log(store2.checkout(3));
// { subtotal: 60000, shippingFee: 15000, finalTotal: 75000 }

// --- Đơn hàng lớn, miễn phí ship ---
const store3 = createOrderSystem();
console.log(store3.addToCart("Áo khoác", 600000, 1)); // 1
console.log(store3.checkout(30));
// { subtotal: 600000, shippingFee: 0, finalTotal: 600000 }

console.log(store.getCartSize()); // 0
console.log(store2.getCartSize()); // 0
console.log(store3.getCartSize()); // 0
