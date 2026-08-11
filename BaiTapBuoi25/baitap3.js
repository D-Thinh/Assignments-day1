const products = [
    {
        id: 1,
        name: "Tai nghe Bluetooth",
        category: "do-dien-tu",
        price: 350000,
        inStock: true,
    },
    {
        id: 2,
        name: "Áo thun cotton",
        category: "quan-ao",
        price: 150000,
        inStock: true,
    },
    {
        id: 3,
        name: "Sách Lập trình JS căn bản",
        category: "sach",
        price: 120000,
        inStock: false,
    },
    {
        id: 4,
        name: "Bàn phím cơ",
        category: "do-dien-tu",
        price: 890000,
        inStock: true,
    },
    {
        id: 5,
        name: "Quần jean nam",
        category: "quan-ao",
        price: 420000,
        inStock: false,
    },
    {
        id: 6,
        name: "Sách Tư duy nhanh và chậm",
        category: "sach",
        price: 95000,
        inStock: true,
    },
];

const categoryFilter = $("#category-filter");
const btnSortPrice = $("#sort-price-btn");
const resultCount = $("#result-count");
const nameSearch = $("#search-box");
let descSort = false;
let productCategory = products;

document.addEventListener("DOMContentLoaded", function () {
    loadData(products);
});

function loadData(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    if (products.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "Không tìm thấy sản phẩm nào phù hợp.";

        productList.appendChild(emptyMessage);
        resultCount.textContent = `Tìm thấy 0 sản phẩm`;
        return;
    }
    products.map((product) => {
        const productItem = document.createElement("div");
        productItem.classList = "product-item";

        const productName = document.createElement("h3");
        productName.textContent = product.name;
        productName.classList = "product-title";

        const productCategory = document.createElement("p");
        productCategory.textContent = `Danh mục: ${product.category}`;
        productCategory.classList = "product-category";

        const productPrice = document.createElement("p");
        productPrice.textContent = `Giá: ${product.price.toLocaleString()}d`;
        productPrice.classList = "product-price";

        const productStock = document.createElement("p");
        productStock.textContent = product.inStock ? "Còn hàng" : "Hết hàng";
        productStock.classList = "product-status";
        if (product.inStock == false) {
            productStock.classList.add("out-of-stock");
        }
        productItem.append(
            productName,
            productCategory,
            productPrice,
            productStock,
        );

        productList.appendChild(productItem);
    });
    resultCount.textContent = `Tìm thấy ${productList.childElementCount} sản phẩm`;
}

categoryFilter.addEventListener("change", function () {
    productCategory = products.filter(
        (item) => item.category === categoryFilter.value,
    );
    if (categoryFilter.value == "all") {
        productCategory = products;
    }
    loadData(productCategory);
});

btnSortPrice.onclick = function () {
    const sortedProducts = [...productCategory].sort((a, b) =>
        descSort ? b.price - a.price : a.price - b.price,
    );

    btnSortPrice.textContent = descSort ? "Giá tăng dần" : "Giá giảm dần";
    descSort = !descSort;

    loadData(sortedProducts);
};

nameSearch.addEventListener("input", function () {
    console.log(nameSearch.value);

    productCategory = products.filter((item) =>
        item.name
            .toLocaleLowerCase()
            .includes(nameSearch.value.toLocaleLowerCase()),
    );
    if (nameSearch.value.trim() === "") {
        productCategory = products;
    }
    loadData(productCategory);
});
