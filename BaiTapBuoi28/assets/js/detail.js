const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const param = new URLSearchParams(window.location.search);
const errorMessage = $("#detail-error");
const loading = $("#detail-loading");
const productDetail = document.querySelector("#product-detail");
const productId = param.get("id");

async function getProductDetail(productId) {
    loading.style.display = "flex";
    if (!productId) {
        errorMessage.classList.remove("hidden");
        loading.style.display = "none";
        return;
    }
    try {
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json();
        renderData(data);
    } catch (e) {
        console.error("Failed to get product detail:", e);
        errorMessage.classList.remove("hidden");
    } finally {
        loading.style.display = "none";
    }
}
getProductDetail(productId);
function renderData(product) {
    const salePrice = product.price * (1 - product.discountPercentage / 100);

    const images = product.images
        .map(
            (image, index) => `
                <img
                    class="thumbnail-image ${index === 0 ? "active" : ""}"
                    src="${image}"
                    alt="${product.title} ${index + 1}"
                    data-image="${image}"
                />
            `,
        )
        .join("");

    const tags = product.tags
        .map(
            (tag) => `
                <span class="product-tag">
                    ${tag}
                </span>
            `,
        )
        .join("");

    productDetail.innerHTML = `
        <!-- Gallery -->
        <div class="product-gallery">

            <div class="main-image-wrapper">

                <img
                    id="main-product-image"
                    class="main-product-image"
                    src="${product.thumbnail}"
                    alt="${product.title}"
                />

                <span class="discount-badge">
                    -${Math.round(product.discountPercentage)}%
                </span>

            </div>

            <div class="image-list">
                ${images}
            </div>

        </div>


        <!-- Information -->
        <div class="product-detail-info">

            <span class="product-category">
                ${product.category}
            </span>


            <h1 class="detail-title">
                ${product.title}
            </h1>


            <!-- Rating -->
            <div class="detail-rating">

                <span class="rating-star">
                    ★
                </span>

                <strong>
                    ${product.rating}
                </strong>

                <span class="rating-text">
                    đánh giá
                </span>

            </div>


            <!-- Price -->
            <div class="detail-price-wrapper">

                <span class="detail-sale-price">
                    $${salePrice.toFixed(2)}
                </span>

                <span class="detail-old-price">
                    $${product.price.toFixed(2)}
                </span>

            </div>


            <!-- Stock -->
            <div class="detail-stock">

                <span class="stock-dot"></span>

                <span>
                    Còn
                    <strong>
                        ${product.stock}
                    </strong>
                    sản phẩm
                </span>

            </div>


            <!-- Description -->
            <div class="detail-block">

                <h3>
                    Mô tả sản phẩm
                </h3>

                <p>
                    ${product.description}
                </p>

            </div>


            <!-- Basic information -->
            <div class="detail-block">

                <h3>
                    Thông tin sản phẩm
                </h3>

                <div class="info-grid">

                    <div class="info-item">
                        <span>Brand</span>
                        <strong>
                            ${product.brand || "-"}
                        </strong>
                    </div>

                    <div class="info-item">
                        <span>SKU</span>
                        <strong>
                            ${product.sku}
                        </strong>
                    </div>

                    <div class="info-item">
                        <span>Category</span>
                        <strong>
                            ${product.category}
                        </strong>
                    </div>

                    <div class="info-item">
                        <span>Weight</span>
                        <strong>
                            ${product.weight}
                        </strong>
                    </div>

                </div>

            </div>


            <!-- Tags -->
            <div class="detail-block">

                <h3>
                    Tags
                </h3>

                <div class="tags-list">
                    ${tags}
                </div>

            </div>


            <!-- Dimensions -->
            <div class="detail-block">

                <h3>
                    Kích thước
                </h3>

                <div class="dimensions">

                    <div>
                        <span>Width</span>
                        <strong>
                            ${product.dimensions.width}
                        </strong>
                    </div>

                    <div>
                        <span>Height</span>
                        <strong>
                            ${product.dimensions.height}
                        </strong>
                    </div>

                    <div>
                        <span>Depth</span>
                        <strong>
                            ${product.dimensions.depth}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    `;

    productDetail.classList.remove("hidden");

    initImageGallery();
    renderReviews(product.reviews);
}
function initImageGallery() {
    const mainImage = document.querySelector("#main-product-image");
    const thumbnails = document.querySelectorAll(".thumbnail-image");

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
            const imageUrl = thumbnail.dataset.image;
            mainImage.src = imageUrl;

            thumbnails.forEach((item) => {
                item.classList.remove("active");
            });
            thumbnail.classList.add("active");
        });
    });
}
function renderReviews(reviews) {
    const reviewsSection = document.querySelector("#reviews-section");

    const reviewsList = document.querySelector("#reviews-list");

    const reviewCount = document.querySelector("#review-count");

    if (!reviews || reviews.length === 0) {
        reviewsSection.classList.remove("hidden");

        reviewCount.textContent = "0 reviews";

        reviewsList.innerHTML = `
            <div class="empty-reviews">
                <p>Chưa có đánh giá nào.</p>
            </div>
        `;

        return;
    }

    reviewCount.textContent = `${reviews.length} reviews`;

    reviewsList.innerHTML = reviews
        .map((review) => {
            const date = new Date(review.date);

            return `
                <article class="review-card">

                    <div class="review-header">

                        <div class="review-user">

                            <div class="review-avatar">
                                ${review.reviewerName.charAt(0).toUpperCase()}
                            </div>

                            <div class="review-user-info">

                                <strong>
                                    ${review.reviewerName}
                                </strong>

                                <span>
                                    ${review.reviewerEmail}
                                </span>

                            </div>

                        </div>

                        <time>
                            ${date.toLocaleDateString("vi-VN")}
                        </time>

                    </div>


                    <div class="review-rating">

                        ${"★".repeat(review.rating)}

                        ${"☆".repeat(5 - review.rating)}

                        <span>
                            ${review.rating}.0
                        </span>

                    </div>


                    <p class="review-comment">
                        ${review.comment}
                    </p>

                </article>
            `;
        })
        .join("");

    reviewsSection.classList.remove("hidden");
}
