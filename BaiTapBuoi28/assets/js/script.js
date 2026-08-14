const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loading = $("#loading");
const categoryFilter = $("#category-filter");
const loadingError = $("#error-message");
const productList = $("#product-grid");
const seartinput = $("#search-input");
const limit = 30;
let currentPage = 1;
let totalProducts = 0;
let totalPages = 0;
let products = [];

async function getProducts(page = 1) {
    loading.style.display = "flex";
    const skip = (page - 1) * limit;
    try {
        const res = await fetch(
            `https://dummyjson.com/products?skip=${skip}&limit=${limit}`,
        );
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();
        products = data.products;
        totalProducts = data.total;
        totalPages = Math.ceil(totalProducts / limit);
        return products;
    } catch (error) {
        loadingError.classList.remove("hidden");
    } finally {
        loading.style.display = "none";
    }
}

function loadProducts(products) {
    productList.innerHTML = "";
    if (products.length === 0) {
        productList.innerHTML = `
            <div class="empty-message">
                Không tìm thấy sản phẩm phù hợp.
            </div>
        `;
        return;
    }
    products.forEach((product) => {
        const salePrice =
            product.price * (1 - product.discountPercentage / 100);
        productList.innerHTML += `
        <a
            href="./detail.html?id=${product.id}"
            class="product-card"
        >
            <!-- Product image -->
            <div class="product-image-wrapper">
                <img
                    class="product-image"
                    src="${product.thumbnail}"
                    alt="${product.title}"
                />

                <span class="discount-badge">
                    -${product.discountPercentage}%
                </span>
            </div>

            <!-- Product content -->
            <div class="product-content">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <div class="product-rating">
                    <span class="rating-stars">
                        ★★★☆☆
                    </span>

                    <span class="rating-number">
                        ${product.rating}
                    </span>

                    <span class="rating-reviews">
                        (${product.reviews.length} reviews)
                    </span>
                </div>

                <div class="price-wrapper">
                    <span class="product-price">
                        $${salePrice.toFixed(2)}
                    </span>

                    <span class="product-old-price">
                        $${product.price.toFixed(2)}
                    </span>
                </div>

                <div class="product-meta">
                    <div class="product-stock">
                        <span class="stock-dot"></span>

                        <span>
                            Còn ${product.stock} sản phẩm
                        </span>
                    </div>
                </div>

                <div class="detail-btn">
                    <span>Xem chi tiết</span>

                    <span class="detail-arrow">
                        →
                    </span>
                </div>

            </div>
        </a>
    `;
    });
}

function loadCategories(products) {
    const categories = [
        ...new Set(products.map((product) => product.category)),
    ];

    categoryFilter.innerHTML = `
        <option value="">Tất cả danh mục</option>
    `;

    categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}

async function init() {
    products = await getProducts(currentPage);
    loadProducts(products);
    loadCategories(products);
}

init();

seartinput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    console.log(products[0].title.toLowerCase().includes(keyword));
    const newProductList = products.filter((item) =>
        item.title.toLowerCase().includes(keyword),
    );
    console.log(newProductList.length);
    loadProducts(newProductList);
});

// pagination

const nextBtn = $("#next-btn");
const preBtn = $("#prev-btn");
nextBtn.onclick = async function () {
    if (currentPage >= totalPages) return;

    currentPage++;

    await getProducts(currentPage);

    loadProducts(products);

    preBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
};
preBtn.onclick = async function () {
    if (currentPage <= 1) return;
    await getProducts(--currentPage);
    loadProducts(products);

    preBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
};

// Sort
const sort = $("#sort-select");

const sortFunctions = {
    "title-asc": (a, b) => a.title.localeCompare(b.title),
    "title-desc": (a, b) => b.title.localeCompare(a.title),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
};
sort.addEventListener("input", () => {
    const sortList = [...products];
    sortList.sort(sortFunctions[sort.value]);
    loadProducts(sortList);
});

categoryFilter.addEventListener("change", (e) => {
    let productCt = products.filter(
        (item) => item.category === categoryFilter.value,
    );
    if (categoryFilter.value == "") {
        loadProducts(products);
        return;
    }
    loadProducts(productCt);
});
