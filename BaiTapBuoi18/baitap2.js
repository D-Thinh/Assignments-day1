// Hàm 1: createCalculator()
function createCalculator() {
    return {
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        multiply: (a, b) => a * b,
        divide: (a, b) => {
            if (b == 0) return "Lỗi: chia cho 0";
            return a / b;
        },
    };
}
const calculator = createCalculator();
calculator.add(2, 3); // 5
calculator.subtract(10, 4); // 6
calculator.multiply(3, 5); // 15
calculator.divide(10, 2); // 5
calculator.divide(10, 0); // "Lỗi: chia cho 0"

// Hàm 2: average(...numbers)
function average(...numbers) {
    return numbers.length === 0
        ? 0
        : numbers.reduce((sum, curent) => (sum += curent), 0) / numbers.length;
}
average(10, 20, 30); // 20
average(5); // 5
average(); // 0
average(1, 2, 3, 4, 5); // 3

// Hàm 3: Hàm 3: applyDiscount(price, discountPercent = 10)
function isValidNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}
function applyDiscount(price, discountPercent = 10) {
    if (!isValidNumber(price)) return "Giá không hợp lệ";
    else {
        return (price -= (price * discountPercent) / 100).toFixed(0);
    }
}
applyDiscount(100000); // 90000  (giảm 10% mặc định)
applyDiscount(100000, 20); // 80000
applyDiscount(100000, 0); // 100000
applyDiscount("abc", 10); // "Giá không hợp lệ"
applyDiscount(NaN, 10); // "Giá không hợp lệ"

// Hàm 4: safeCalculate(operation, ...numbers)
function safeCalculate(operation, ...numbers) {
    const validOperations = ["add", "subtract", "multiply", "average"];

    if (!validOperations.includes(operation)) {
        return "Phép tính không được hỗ trợ";
    } else {
        const hasInvalidNumber = numbers.some(
            (n) => typeof n !== "number" || Number.isNaN(n),
        );
        if (hasInvalidNumber) {
            return "Kết quả không hợp lệ";
        }
        switch (operation) {
            case "add":
                return numbers.reduce((sum, n) => sum + n, 0);
            case "subtract":
                return numbers.reduce((acc, n, i) => (i === 0 ? n : acc - n));
            case "multiply":
                return numbers.reduce((acc, n) => acc * n, 1);
            case "average":
                return average(...numbers);
        }
    }
}
