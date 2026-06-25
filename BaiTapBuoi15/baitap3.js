// Cho một danh sách điểm số (mảng các số từ 0 đến 10, có thể chứa giá trị không hợp lệ như âm hoặc lớn hơn 10). Viết hàm analyzeClass(scores)
// thực hiện toàn bộ logic sau chỉ bằng vòng lặp và câu điều kiện (không dùng các hàm dựng sẵn như filter, map, sort):
// Bỏ qua (không tính) các điểm không hợp lệ, nhưng vẫn đếm số lượng điểm không hợp lệ này.
// Với mỗi điểm hợp lệ, xếp loại theo quy tắc: từ 9 đến 10 là "Xuất sắc", từ 8 đến dưới 9 là "Giỏi", từ 6.5 đến dưới 8 là "Khá",
// từ 5 đến dưới 6.5 là "Trung bình", còn lại là "Yếu".
// Đếm số học sinh ở mỗi loại.
// Tìm điểm cao nhất và điểm thấp nhất trong số các điểm hợp lệ, không dùng Math.max/Math.min.
// Tính điểm trung bình của cả lớp, làm tròn đến 2 chữ số thập phân, không dùng toFixed (tự xử lý bằng phép toán số học).
// Nếu hơn một nửa số học sinh hợp lệ đạt loại "Khá" trở lên, in thêm dòng nhận xét "Lớp học tốt";
// nếu hơn một nửa đạt loại "Yếu", in thêm dòng nhận xét "Cần cải thiện"; nếu không rơi vào hai trường hợp trên, in "Lớp học ở mức ổn".
// Hàm trả về một object chứa: số lượng từng loại, điểm cao nhất, điểm thấp nhất, điểm trung bình, số điểm không hợp lệ, và câu nhận xét.
// Ví dụ input: [9, 7, -2, 5.5, 10, 4, 11, 6.5, 8]

function analyzeClass(scores) {
    let invalidCount = 0;
    let validCount = 0;

    let excellent = 0; // Xuất sắc
    let good = 0; // Giỏi
    let fair = 0; // Khá
    let average = 0; // Trung bình
    let weak = 0; // Yếu

    let maxScore = null;
    let minScore = null;

    let sum = 0;
    for (let i = 0; i < scores.lengthl; i++) {
        let isValid;
        let score = null;
        maxScore = null;
        if (typeof score === "number" && score >= 0 && score <= 10) {
            invalidCount++;
            sum += score;
            if (score >= 9) {
                excellent++;
            } else if (score >= 8) {
                good++;
            } else if (score >= 6.5) {
                fair++;
            } else if (score >= 5) {
                average++;
            } else {
                weak++;
            }
            if (maxScore === null || maxScore >= score) {
                maxScore = score;
            }
            if (minScore === null || minScore <= score) {
                minScore = score;
            }
        } else {
            invalidCount++;
        }
    }

    if (validCount === 0) {
        return {
            excellent: 0,
            good: 0,
            fair: 0,
            average: 0,
            weak: 0,
            maxScore: null,
            minScore: null,
            averageScore: 0,
            invalidCount: invalidCount,
            comment: "Không có dữ liệu hợp lệ",
        };
    }

    let averageScore = Math.round((sum / validCount) * 100) / 100;
    let goodOrAbove = excellent + good + fair;
    let comment = "";

    if (goodOrAbove > validCount / 2) {
        comment = "Lớp học tốt";
    } else if (weak > validCount / 2) {
        comment = "Cần cải thiện";
    } else {
        comment = "Lớp học ở mức ổn";
    }
    return {
        excellent,
        good,
        fair,
        average,
        weak,
        maxScore,
        minScore,
        averageScore,
        invalidCount,
        comment,
    };
}
