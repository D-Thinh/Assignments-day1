const comments = [
    {
        id: 1,
        user: "An",
        content: "Sản phẩm rất tốt!",
        rating: 5,
        verified: true,
        likes: 12,
    },
    { id: 2, user: "", content: "ok", rating: 3, verified: false, likes: 0 },
    {
        id: 3,
        user: "Bình",
        content: "Mua lần 2 rồi, vẫn chất lượng",
        rating: 4,
        verified: true,
        likes: 8,
    },
    {
        id: 4,
        user: "Chi",
        content: "   ",
        rating: null,
        verified: false,
        likes: 2,
    },
    {
        id: 5,
        user: "Duy",
        content: "Giao hàng nhanh, đóng gói cẩn thận, sẽ ủng hộ tiếp!",
        rating: 5,
        verified: true,
        likes: 20,
    },
    {
        id: 6,
        user: null,
        content: "Tệ quá",
        rating: 1,
        verified: false,
        likes: 0,
    },
    {
        id: 7,
        user: "Em",
        content: "Bình thường",
        rating: 3,
        verified: true,
        likes: 1,
    },
];

// Hàm 1: isValidComment(comment)
function isValidComment(comment) {
    if (
        comment.user == null ||
        comment.user.trim() === "" ||
        comment.content.trim().length < 5 ||
        !Number.isInteger(comment.rating) ||
        comment.rating < 1 ||
        comment.rating > 5
    ) {
        return false;
    }
    return true;
}

// Hàm 2: filterValidComments(comments)
function filterValidComments(comments) {
    return comments.filter((comment) => isValidComment(comment));
}

// Hàm 3: getCommentStats(validComments)
function getCommentStats(validComments) {
    const total = validComments.length;
    const avgRating = +(
        validComments.reduce((sum, comment) => sum + comment.rating, 0) / total
    ).toFixed(1);
    const verifiedCount = validComments.filter(
        (comment) => comment.verified,
    ).length;
    const totalLikes = validComments.reduce(
        (sum, comment) => sum + (comment.likes || 0),
        0,
    );
    const topComment = validComments.reduce((top, comment) => {
        if (comment.likes > top.likes) {
            return comment;
        }
        return top;
    }, validComments[0]);
    return {
        total,
        avgRating,
        totalLikes,
        verifiedCount,
        topComment,
    };
}
formatComment(comments[2]);

// Hàm 4: formatComment(comment)
function formatComment(comment) {
    return `${"⭐".repeat(comment.rating)} | ${comment.user ?? "Ẩn danh"} ${comment.verified ? "✓" : ""} | ${comment.content} | 👍 ${comment.likes}`;
}
formatComment(comments[6]);
