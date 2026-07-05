const orders = [
    {
        id: 1,
        customer: "An",
        product: "Áo thun",
        category: "fashion",
        amount: 300000,
        status: "completed",
    },
    {
        id: 2,
        customer: "Bình",
        product: "iPhone 15",
        category: "electronics",
        amount: 25000000,
        status: "completed",
    },
    {
        id: 3,
        customer: "An",
        product: "Quần jean",
        category: "fashion",
        amount: 450000,
        status: "canceled",
    },
    {
        id: 4,
        customer: "Chi",
        product: "Tai nghe",
        category: "electronics",
        amount: 1200000,
        status: "completed",
    },
    {
        id: 5,
        customer: "Bình",
        product: "Giày",
        category: "fashion",
        amount: 900000,
        status: "pending",
    },
    {
        id: 6,
        customer: "An",
        product: "Sạc dự phòng",
        category: "electronics",
        amount: 350000,
        status: "completed",
    },
    {
        id: 7,
        customer: "Duy",
        product: "Áo khoác",
        category: "fashion",
        amount: 600000,
        status: "completed",
    },
];

// Hàm 1: getRevenueByCategory(orders)
function getRevenueByCategory(orders) {
    return orders.reduce((obj, cur) => {
        if (cur.status === "completed") {
            if (!(cur.category in obj)) {
                obj[cur.category] = cur.amount;
            } else {
                obj[cur.category] += cur.amount;
            }
        }
        return obj;
    }, {});
}
getRevenueByCategory(orders);
// {
//   fashion: 900000,       // 300000 + 600000 (đơn canceled bị loại)
//   electronics: 26550000, // 25000000 + 1200000 + 350000
// }

// Hàm 2: getSpendingByCustomer(orders)
function getSpendingByCustomer(orders) {
    return orders.reduce((obj, cur) => {
        if (cur.status === "completed") {
            if (cur.customer in obj) {
                obj[cur.customer] += cur.amount;
            } else {
                obj[cur.customer] = cur.amount;
            }
        }
        return obj;
    }, {});
}
getSpendingByCustomer(orders);
// {
//   An: 650000,      // 300000 + 350000
//   Bình: 25000000,
//   Chi: 1200000,
//   Duy: 600000,
// }

//  Hàm 3: getOrderCountByStatus(orders)
function getOrderCountByStatus(orders) {
    return orders.reduce((obj, cur) => {
        if (cur.status in obj) {
            obj[cur.status]++;
        } else {
            obj[cur.status] = 1;
        }
        return obj;
    }, {});
}
getOrderCountByStatus(orders);
// { completed: 5, canceled: 1, pending: 1 }

// Hàm 4: getTopCustomer(orders)
function getTopCustomer(orders) {
    let orderSort = orders.reduce((obj, cur) => {
        if (cur.status === "completed") {
            if (obj.some((item) => item.customer === cur.customer)) {
                const customerIndex = obj.find(
                    (o) => o.customer === cur.customer,
                );
                customerIndex.amount += cur.amount;
            } else {
                obj.push({
                    customer: cur.customer,
                    amount: cur.amount,
                });
            }
        }
        return obj;
    }, []);
    return orderSort.sort((a, b) => b.amount - a.amount)[0];
}
getTopCustomer(orders);

// Hàm 5: getFullReport(orders)
function getFullReport(orders) {
    return orders.reduce(
        (obj, cur) => {
            obj.statusCount[cur.status] =
                (obj.statusCount[cur.status] || 0) + 1;

            if (cur.status === "completed") {
                obj.totalRevenue += cur.amount;

                obj.revenueByCategory[cur.category] =
                    (obj.revenueByCategory[cur.category] || 0) + cur.amount;

                obj.spendingByCustomer[cur.customer] =
                    (obj.spendingByCustomer[cur.customer] || 0) + cur.amount;
            }
            return obj;
        },
        {
            revenueByCategory: {},
            spendingByCustomer: {},
            statusCount: {},
            totalRevenue: 0,
        },
    );
}
getFullReport(orders);
