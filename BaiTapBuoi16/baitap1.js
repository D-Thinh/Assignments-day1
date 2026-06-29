// Viết code tạo ra mảng completedOrderDetails thỏa mãn 3 điều kiện:
// Chỉ lấy những đơn hàng có status là "completed".
// Kết hợp với mảng products để lấy tên sản phẩm và tính tổng tiền.
// Mỗi phần tử trong mảng kết quả có cấu trúc:
// { idDonHang, tenSanPham, tongTien }
// // tongTien = price * quantity
const products = [
    { id: 1, name: "MacBook Pro", price: 2000, category: "Laptop" },
    { id: 2, name: "iPhone 15", price: 1000, category: "Phone" },
    { id: 3, name: "Bàn phím cơ", price: 150, category: "Accessories" },
    { id: 4, name: "Màn hình Dell", price: 500, category: "Monitor" },
];

const orders = [
    { orderId: "ORD01", productId: 2, quantity: 2, status: "completed" },
    { orderId: "ORD02", productId: 1, quantity: 1, status: "pending" },
    { orderId: "ORD03", productId: 4, quantity: 3, status: "completed" },
    { orderId: "ORD04", productId: 3, quantity: 1, status: "canceled" },
    { orderId: "ORD05", productId: 2, quantity: 1, status: "completed" },
];
const completedOrderDetails = orders
    .filter((order) => order.status === "completed")
    .map((order) => {
        const product = products.find((p) => p.id === order.productId);
        return {
            idDonHang: order.orderId,
            tenSanPham: product.name,
            tongTien: product.price * order.quantity,
        };
    });

// Test case
// Kiểm tra độ dài — chỉ có 3 đơn completed
completedOrderDetails.length;
// 3

// Kiểm tra toàn bộ kết quả
console.log(completedOrderDetails);
// [
//   { idDonHang: "ORD01", tenSanPham: "iPhone 15",    tongTien: 2000 },
//   { idDonHang: "ORD03", tenSanPham: "Màn hình Dell", tongTien: 1500 },
//   { idDonHang: "ORD05", tenSanPham: "iPhone 15",    tongTien: 1000 },
// ]

// Kiểm tra từng đơn
completedOrderDetails[0].idDonHang; // "ORD01"
completedOrderDetails[0].tenSanPham; // "iPhone 15"
completedOrderDetails[0].tongTien; // 2000  (1000 * 2)

completedOrderDetails[1].idDonHang; // "ORD03"
completedOrderDetails[1].tenSanPham; // "Màn hình Dell"
completedOrderDetails[1].tongTien; // 1500  (500 * 3)

completedOrderDetails[2].idDonHang; // "ORD05"
completedOrderDetails[2].tenSanPham; // "iPhone 15"
completedOrderDetails[2].tongTien; // 1000  (1000 * 1)

// Đơn bị loại — không xuất hiện trong kết quả
completedOrderDetails.find((o) => o.idDonHang === "ORD02"); // undefined (pending)
completedOrderDetails.find((o) => o.idDonHang === "ORD04"); // undefined (canceled)
