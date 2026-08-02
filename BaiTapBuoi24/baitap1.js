class InvalidTypeError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = "InvalidTypeError";
        this.field = field;
        this.value = value;
    }
}

class OutOfRangeError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = "OutOfRangeError";
        this.field = field;
        this.value = value;
    }
}

class InvalidEmailError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = "InvalidEmailError";
        this.field = field;
        this.value = value;
    }
}

class WeakPasswordError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = "WeakPasswordError";
        this.field = field;
        this.value = value;
    }
}

function registerUser(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new InvalidTypeError(
            "Dữ liệu truyền vào phải là một object.",
            "data",
            data,
        );
    }
    const { username, age, email, password } = data;
    if (typeof username !== "string") {
        throw new InvalidTypeError(
            "username phải là kiểu string.",
            "username",
            username,
        );
    }
    if (typeof age !== "number" || Number.isNaN(age)) {
        throw new InvalidTypeError("age phải là kiểu number.", "age", age);
    }
    if (age < 13 || age > 120) {
        throw new OutOfRangeError(
            "age phải nằm trong khoảng từ 13 đến 120.",
            "age",
            age,
        );
    }
    if (typeof email !== "string" || !email.includes("@")) {
        throw new InvalidEmailError(
            "email không hợp lệ, phải chứa ký tự '@'.",
            "email",
            email,
        );
    }
    if (typeof password !== "string" || password.length < 8) {
        throw new WeakPasswordError(
            "password phải có độ dài tối thiểu 8 ký tự.",
            "password",
            password,
        );
    }
    return {
        success: true,
        message: "Đăng ký thành công",
    };
}
function runRegister(data) {
    try {
        const result = registerUser(data);
        console.log(result);
    } catch (error) {
        if (error instanceof InvalidTypeError) {
            console.log(
                `[Lỗi sai kiểu dữ liệu] ${error.message} (field: ${error.field})`,
            );
        } else if (error instanceof OutOfRangeError) {
            console.log(
                `[Lỗi vượt phạm vi] ${error.message} (field: ${error.field}, value: ${error.value})`,
            );
        } else if (error instanceof InvalidEmailError) {
            console.log(`[Lỗi email không hợp lệ] ${error.message}`);
        } else if (error instanceof WeakPasswordError) {
            console.log(`[Lỗi mật khẩu quá ngắn] ${error.message}`);
        } else {
            console.log(`[Lỗi không xác định] ${error.message}`);
        }
    } finally {
        console.log("Quá trình xử lý đăng ký đã kết thúc.");
    }
}

console.log("--- Test case 1: không truyền đối số ---");
runRegister();

console.log("\n--- Test case 2: username sai kiểu ---");
runRegister({ username: 123, age: 20, email: "a@b.com", password: "12345678" });

console.log("\n--- Test case 3: age nhỏ hơn 13 ---");
runRegister({ username: "an", age: 8, email: "a@b.com", password: "12345678" });

console.log("\n--- Test case 4: email không hợp lệ ---");
runRegister({
    username: "an",
    age: 20,
    email: "abgmail.com",
    password: "12345678",
});

console.log("\n--- Test case 5: password quá ngắn ---");
runRegister({ username: "an", age: 20, email: "a@b.com", password: "123" });

console.log("\n--- Test case 6: hợp lệ ---");
runRegister({
    username: "an",
    age: 20,
    email: "a@b.com",
    password: "12345678",
});

module.exports = {
    registerUser,
    InvalidTypeError,
    OutOfRangeError,
    InvalidEmailError,
    WeakPasswordError,
};
