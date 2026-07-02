// Hàm 1: createSlug(text)
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9àáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƠƯ\s]/g, "")
        .replaceAll(" ", "-");
}
createSlug("MacBook Pro 2024"); // "macbook-pro-2024"
createSlug("Bàn Phím Cơ RGB"); // "bn-phm-c-rgb"  ← tiếng Việt mất dấu là bình thường
createSlug("iPhone 15 Pro Max!!!"); // "iphone-15-pro-max"

// Hàm 2: generateOrderId(productName, quantity)
function generateOrderId(productName, quantity) {
    return (
        "ORD-" +
        productName.slice(0, 3).toUpperCase() +
        "-" +
        quantity +
        "-" +
        productName.length
    );
}
generateOrderId("MacBook Pro", 2); // "ORD-MAC-2-11"
generateOrderId("iPhone 15", 5); // "ORD-IPH-5-9"
generateOrderId("Bàn phím cơ", 1); // "ORD-BÀN-1-11"

// Hàm 3: formatPrice(price, currency)
function formatPrice(price, currency) {
    if (currency === undefined || currency === "VND") {
        currency = "VND";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: currency,
        }).format(price);
    }
    if (currency === "USD") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(price);
    }
}
formatPrice(2000000, "VND"); // "2.000.000 ₫"
formatPrice(2000, "USD"); // "$2,000.00"
formatPrice(500000); // "500.000 ₫"  (mặc định VND)

// Hàm 4: buildProductUrl(baseUrl, product)
function buildProductUrl(baseUrl, product) {
    const nameSlug = createSlug(product.name).replaceAll("_", "-");
    return `${baseUrl}/${product.category}/${nameSlug}?id=${product.id}`;
}
buildProductUrl("https://shop.vn", {
    name: "MacBook Pro 2024",
    id: 101,
    category: "laptop",
});
// "https://shop.vn/laptop/macbook-pro-2024?id=101"

buildProductUrl("https://shop.vn", {
    name: "iPhone 15",
    id: 55,
    category: "phone",
});
// "https://shop.vn/phone/iphone-15?id=55"
