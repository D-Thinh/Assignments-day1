// Bảng cửu chương dạng tam giác có điều kiện lọc
// Viết đoạn code in ra một "tam giác số" từ 1 đến n (cho n do người dùng chọn, ví dụ n = 7), trong đó:
// Dòng thứ i (tính từ 1) in ra các số từ 1 đến i, cách nhau một khoảng trắng.
// Nếu một số trong dòng đó là số nguyên tố, thay số đó bằng ký tự *.
// Nếu một số chia hết cho cả 3 và 5, thay bằng ký tự # (ưu tiên quy tắc này cao hơn quy tắc số nguyên tố nếu trùng).
// Nếu dòng i là số chẵn, sau khi in xong dòng đó, in thêm một dòng phân cách gồm i dấu gạch ngang -.
// Ví dụ với n = 5, hai dòng đầu có thể trông như sau (chỉ minh họa ý tưởng, không phải kết quả đầy đủ):
// 1
// 1 *
// --
// 1 * #
// 1 * * *
// ----
// Điểm cần suy nghĩ: bài này buộc bạn phải lồng vòng lặp (for ngoài chạy theo dòng, for trong chạy theo từng số trong dòng), kết hợp một hàm phụ kiểm tra số nguyên tố, và xử lý đúng thứ tự ưu tiên giữa nhiều điều kiện ghi đè lên nhau.
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}
function isDivisibleBy15(n) {
    if (n % 15 === 0) {
        return true;
    }
    return false;
}
function printTriangleWithFilter(n) {
    for (let i = 1; i <= n; i++) {
        let row = "";

        for (let j = 1; j <= i; j++) {
            let item = j + " ";
            if (isDivisibleBy15(j)) {
                item = "# ";
            } else if (isPrime(j)) {
                item = "* ";
            }
            row += item;
        }
        console.log(row.trim());
        if (i % 2 === 0) {
            console.log("-".repeat(i));
        }
    }
}
printTriangleWithFilter(5);
printTriangleWithFilter(7);
printTriangleWithFilter(15);
