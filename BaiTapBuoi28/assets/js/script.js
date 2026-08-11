const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loading = $("#loading");
const loadingError = $("#error-message");
const productList = $("#product-grid");

let products = [];

async function getProducts() {
    try {
        const res = await fetch("https://dummyjson.com/products");

        const data = await res.json();
        products = data.products;
        loading.style.display = "none";
        // return products;
    } catch (error) {
        loadingError.classList.remove("hidden");
    }
}

function loadProducts() {
    console.log("products:", products);

    products.forEach((product) => {
        const salePrice =
            product.price * (1 - product.discountPercentage / 100);
        productList.innerHTML += `<div class="product-card">

        <!-- Product image -->
        <div class="product-image-wrapper">
            <img
                class="product-image"
                src="${product.thumbnail}"
                alt="${product.title}"
            />

            <!-- Discount -->
            <span class="discount-badge">
                -${product.discountPercentage}%
            </span>

        </div>

        <!-- Product content -->
        <div class="product-content">

            <!-- Category -->
            <span class="product-category">
                ${product.category}
            </span>


            <!-- Title -->
            <h3 class="product-title">
                ${product.title}
            </h3>


            <!-- Rating -->
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


            <!-- Price -->
            <div class="price-wrapper">

                <span class="product-price">
                    $${salePrice.toFixed(2)}
                </span>

                <span class="product-old-price">
                    $${product.price.toFixed(2)}
                </span>

            </div>


            <!-- Product meta -->
            <div class="product-meta">

                <div class="product-stock">

                    <span class="stock-dot"></span>

                    <span>
                        Còn ${product.stock} sản phẩm
                    </span>

                </div>

            </div>


            <!-- Detail button -->
            <a
                href="./detail.html?id=${product.id}"
                class="detail-btn"
            >
                <span>Xem chi tiết</span>

                <span class="detail-arrow">
                    →
                </span>
            </a>

        </div>

    </div>`;
    });
}

async function init() {
    await getProducts();
    loadProducts();
}
init();
