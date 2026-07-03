const examResults = [
    { student: "An", scores: [8.5, 7, 9, 6.5] },
    { student: "Bình", scores: [10, 9.5, 8, 10] },
    { student: "Chi", scores: [5, 4.5, 6, 5.5] },
    { student: "Duy", scores: [7, 7, 7, 7] },
];

// Hàm 1: getAverage(scores)
function getAverage(scores) {
    return Number(
        (
            scores.reduce((sum, score) => {
                return (sum += score);
            }, 0) / scores.length
        ).toFixed(1),
    );
}
getAverage([8.5, 7, 9, 6.5]); // 7.75 -> 7.8
getAverage([10, 9.5, 8, 10]); // 9.375 -> 9.4

// Hàm 2: classifyStudent(average)
function classifyStudent(average) {
    if (average >= 9) {
        return "Xuất sắc";
    } else if (average >= 8) {
        return "Giỏi";
    } else if (average >= 6.5) {
        return "Khá";
    } else if (average >= 5) {
        return "Trung bình";
    } else return "Yếu";
}
classifyStudent(9.4); // "Xuất sắc"
classifyStudent(7.8); // "Khá"
classifyStudent(4.5); // "Yếu"

// Hàm 3: isValidScore(score)
function isValidScore(score) {
    return Number.isFinite(score) && score >= 0 && score <= 10;
}
isValidScore(8.5); // true
isValidScore(-1); // false
isValidScore(11); // false
isValidScore(Infinity); // false
isValidScore(NaN); // false

//  Hàm 4: getReportCard(examResults)
function getReportCard(examResults) {
    return examResults.map((item) => ({
        student: item.student,
        average: getAverage(item.scores),
        classification: isValidScore(getAverage(item.scores))
            ? classifyStudent(getAverage(item.scores))
            : 0,
    }));
}
getReportCard(examResults);
// [
//   { student: "An",   average: 7.8, classification: "Khá" },
//   { student: "Bình", average: 9.4, classification: "Xuất sắc" },
//   { student: "Chi",  average: 5.3, classification: "Trung bình" },
//   { student: "Duy",  average: 7,   classification: "Khá" },
// ]
