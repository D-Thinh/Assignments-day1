class Employee {
    constructor(name, baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    getMonthlySalary() {
        return this.baseSalary;
    }

    describe() {
        return `${this.name} - Lương: ${this.getMonthlySalary()}đ`;
    }
}

class Manager extends Employee {
    constructor(name, baseSalary, teamSize) {
        super(name, baseSalary);
        this.teamSize = teamSize;
    }

    getMonthlySalary() {
        const allowance = this.teamSize * 500000;
        return super.getMonthlySalary() + allowance;
    }

    describe() {
        return `[Quản lý] ${super.describe()} (đội ${this.teamSize} người)`;
    }
}

const emp = new Employee("An", 10000000);
console.log(emp.getMonthlySalary()); // 10000000
console.log(emp.describe()); // "An - Lương: 10000000đ"

const manager = new Manager("Bình", 15000000, 5);
console.log(manager.getMonthlySalary()); // 17500000 (15000000 + 5*500000)
console.log(manager.describe());

console.log(manager instanceof Employee); // true
console.log(manager instanceof Manager); // true
console.log(emp instanceof Manager); // false

module.exports = { Employee, Manager };
