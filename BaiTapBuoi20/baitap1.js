// 1
const person = {
    introduce() {
        return `Tôi là ${this.name}, ${this.age} tuổi`;
    },
};

// 2
const employee = Object.create(person);
employee.getInfo = function () {
    return `${this.name} làm ở phòng ${this.department}, lương ${this.salary}`;
};

// 3
const item1 = Object.create(employee);
Object.assign(item1, {
    name: "An",
    age: 25,
    department: "IT",
    salary: 15000000,
});

const item2 = Object.create(employee);
Object.assign(item2, {
    name: "Thư",
    age: 30,
    department: "Sales",
    salary: 18000000,
});

const item3 = Object.create(employee);
Object.assign(item3, {
    name: "Chi",
    age: 28,
    department: "IT",
    salary: 16500000,
});

const item4 = Object.create(employee);
Object.assign(item4, {
    name: "Dũng",
    age: 35,
    department: "HR",
    salary: 14000000,
});

const item5 = Object.create(employee);
Object.assign(item5, {
    name: "Tuấn",
    age: 22,
    department: "Sales",
    salary: 12000000,
});

// 4
function checkOwnProperty(obj, key) {
    return Object.hasOwn(obj, key);
}

// 5
console.log(Object.getPrototypeOf(item1) === employee);
// true
console.log(Object.getPrototypeOf(employee) === person);
// true

const newProto = {
    getInfo() {
        return `${this.name} hiện làm việc tại ${this.department}, thu nhập ${this.salary} VNĐ/tháng`;
    },
};
Object.setPrototypeOf(item4, newProto);
console.log(item4.getInfo());

// 6
console.log(Object.getOwnPropertyNames(item1));

// 7
console.log(Object.getOwnPropertyDescriptor(item1, "salary"));

// 8
Object.seal(item2);

item2.bonus = 1000000;
console.log(item2.bonus);
// undefined
item2.salary = 20000000;
console.log(item2.salary);
// 20000000
console.log(Object.isSealed(item2));
// true

// 9
const items = [item1, item2, item3, item4, item5];
const grouped = Object.groupBy(items, (item) => item.department);
console.log(grouped);

// 10
const lookup = Object.fromEntries([
    ["A001", "An"],
    ["A002", "Thư"],
]);
console.log(lookup);
console.log(lookup["A002"]);
