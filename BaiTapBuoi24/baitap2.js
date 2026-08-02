class BankAccount {
    #balance;
    static totalAccounts = 0;
    static totalSystemBalance = 0;

    constructor(owner, initialBalance = 0) {
        if (typeof owner !== "string" || owner.trim() === "") {
            throw new Error("Tên chủ tài khoản không hợp lệ.");
        }
        if (typeof initialBalance !== "number" || initialBalance < 0) {
            throw new Error("Số dư ban đầu không hợp lệ.");
        }

        this.owner = owner;
        this.#balance = initialBalance;
        this.accountNumber = `ACC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        BankAccount.totalAccounts += 1;
        BankAccount.totalSystemBalance += initialBalance;
    }

    get balance() {
        return this.#balance;
    }

    deposit(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Số tiền nạp phải là số dương.");
        }
        this.#balance += amount;
        BankAccount.totalSystemBalance += amount;
        console.log(
            `[${this.accountNumber}] Nạp thành công ${amount}. Số dư hiện tại: ${this.#balance}`,
        );
        return this.#balance;
    }

    withdraw(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Số tiền rút phải là số dương.");
        }
        if (amount > this.#balance) {
            throw new Error("Số dư không đủ để thực hiện giao dịch.");
        }
        this.#balance -= amount;
        BankAccount.totalSystemBalance -= amount;
        console.log(
            `[${this.accountNumber}] Rút thành công ${amount}. Số dư hiện tại: ${this.#balance}`,
        );
        return this.#balance;
    }

    getInfo() {
        return {
            loaiTaiKhoan: this.constructor.name,
            chuTaiKhoan: this.owner,
            soTaiKhoan: this.accountNumber,
            soDu: this.#balance,
        };
    }

    _adjustBalance(amount) {
        this.#balance += amount;
        BankAccount.totalSystemBalance += amount;
    }

    static getSystemSummary() {
        return {
            tongSoTaiKhoan: BankAccount.totalAccounts,
            tongSoDuHeThong: BankAccount.totalSystemBalance,
        };
    }
}

class SavingAccount extends BankAccount {
    #interestRate;
    #minBalance;
    static defaultInterestRate = 0.05;
    static minBalanceRequired = 100000;

    constructor(
        owner,
        initialBalance = 0,
        interestRate = SavingAccount.defaultInterestRate,
    ) {
        super(owner, initialBalance);

        if (typeof interestRate !== "number" || interestRate < 0) {
            throw new Error("Lãi suất không hợp lệ.");
        }

        this.#interestRate = interestRate;
        this.#minBalance = SavingAccount.minBalanceRequired;
    }

    withdraw(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Số tiền rút phải là số dương.");
        }
        if (this.balance - amount < this.#minBalance) {
            throw new Error(
                `Không thể rút. Tài khoản tiết kiệm phải giữ số dư tối thiểu ${this.#minBalance}.`,
            );
        }
        this._adjustBalance(-amount);
        console.log(
            `[${this.accountNumber}] (Tiết kiệm) Rút thành công ${amount}. Số dư hiện tại: ${this.balance}`,
        );
        return this.balance;
    }

    addInterest() {
        const interest = this.balance * this.#interestRate;
        this._adjustBalance(interest);
        console.log(
            `[${this.accountNumber}] Đã cộng lãi ${interest}. Số dư hiện tại: ${this.balance}`,
        );
        return this.balance;
    }

    getInfo() {
        const baseInfo = super.getInfo();
        return {
            ...baseInfo,
            laiSuat: this.#interestRate,
            soDuToiThieu: this.#minBalance,
        };
    }
}

const acc1 = new BankAccount("Nguyễn Văn A", 500000);
acc1.deposit(200000);
acc1.withdraw(100000);
console.log(acc1.getInfo());

console.log("\n--- Tài khoản tiết kiệm ---");
const saving1 = new SavingAccount("Trần Thị B", 1000000, 0.05);
saving1.deposit(500000);
saving1.addInterest();

try {
    saving1.withdraw(1500000);
} catch (error) {
    console.log("Lỗi khi rút tiền:", error.message);
}

saving1.withdraw(200000);
console.log(saving1.getInfo());

console.log("\n--- Thống kê hệ thống ---");
console.log(BankAccount.getSystemSummary());

module.exports = { BankAccount, SavingAccount };
