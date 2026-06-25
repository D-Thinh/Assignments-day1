// Phân loại tam giác
// Viết hàm classifyTriangle(a, b, c) nhận vào ba số là độ dài ba cạnh, trả về một chuỗi mô tả loại hình tạo thành.
// Yêu cầu xử lý các trường hợp sau theo đúng thứ tự ưu tiên:
// Nếu một trong ba cạnh có giá trị nhỏ hơn hoặc bằng 0, trả về "Cạnh không hợp lệ".
// Nếu ba cạnh không thỏa bất đẳng thức tam giác (tổng hai cạnh phải lớn hơn cạnh còn lại), trả về "Không tạo thành tam giác".
// Nếu ba cạnh bằng nhau, trả về "Tam giác đều".
// Nếu có đúng hai cạnh bằng nhau, trả về "Tam giác cân".
// Nếu tam giác có một góc vuông (kiểm tra bằng định lý Pythagoras), trả về "Tam giác vuông".
// Còn lại, trả về "Tam giác thường".
// Ví dụ:
// classifyTriangle(3, 4, 5) → "Tam giác vuông"
// classifyTriangle(2, 2, 2) → "Tam giác đều"
// classifyTriangle(1, 2, 10) → "Không tạo thành tam giác"

function classifyTriangle(a, b, c) {
    let isTriangle = a + b > c && a + c > b && b + c > a;
    let isPitago =
        a ** 2 + b ** 2 === c ** 2 ||
        a ** 2 + c ** 2 === b ** 2 ||
        b ** 2 + c ** 2 === a ** 2;
    if (a <= 0 || b <= 0 || c <= 0) {
        return "Cạnh không hợp lệ";
    } else if (!isTriangle) {
        return "Không tạo thành tam giác";
    } else {
        if (a == b && b == c) {
            return "Tam giác đều";
        }
        if (a == b || a == c || c == b) {
            return "Tam giác cân";
        }
        if (isPitago) {
            return "Tam giác vuông";
        }
        return "Tam giác thường";
    }
}

classifyTriangle(3, 4, 5);

classifyTriangle(2, 2, 2);

classifyTriangle(1, 2, 10);
