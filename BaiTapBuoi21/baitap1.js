const members = [
    { id: 1, name: "Minh Tran", email: "minh@example.com" },
    { id: 2, name: "Lan Pham", email: "lan@example.com" },
    { id: 3, name: "Huy Nguyen", email: "huy@example.com" },
    { id: 4, name: "Trang Le", email: "trang@example.com" },
    { id: 5, name: "Duc Vo", email: "duc@example.com" },
];

const books = [
    { id: 201, title: "Clean Code", finePerDay: 5000 },
    { id: 202, title: "Atomic Habits", finePerDay: 3000 },
    { id: 203, title: "Sapiens", finePerDay: 4000 },
    { id: 204, title: "Deep Work", finePerDay: 2000 },
    { id: 205, title: "The Pragmatic Programmer", finePerDay: 6000 },
];

const borrowRecords = [
    {
        id: 3001,
        memberId: 1,
        lines: [
            { bookId: 201, lateDays: 2 },
            { bookId: 202, lateDays: 0 },
        ],
    },
    {
        id: 3002,
        memberId: 2,
        lines: [
            { bookId: 202, lateDays: 1 },
            { bookId: 203, lateDays: 3 },
        ],
    },
    {
        id: 3003,
        memberId: 3,
        lines: [
            { bookId: 204, lateDays: 5 },
            { bookId: 205, lateDays: 2 },
        ],
    },
    {
        id: 3004,
        memberId: 4,
        lines: [
            { bookId: 201, lateDays: 1 },
            { bookId: 203, lateDays: 2 },
        ],
    },
    {
        id: 3005,
        memberId: 5,
        lines: [{ bookId: 205, lateDays: 10 }],
    },
    {
        id: 3006,
        memberId: 1,
        lines: [
            { bookId: 201, lateDays: 1 },
            { bookId: 205, lateDays: 3 },
        ],
    },
    {
        id: 3007,
        memberId: 2,
        lines: [
            { bookId: 204, lateDays: 2 },
            { bookId: 203, lateDays: 1 },
        ],
    },
    {
        id: 3008,
        memberId: 3,
        lines: [{ bookId: 202, lateDays: 2 }],
    },
    {
        id: 3009,
        memberId: 4,
        lines: [
            { bookId: 201, lateDays: 1 },
            { bookId: 202, lateDays: 1 },
        ],
    },
    {
        id: 3010,
        memberId: 5,
        lines: [
            { bookId: 203, lateDays: 4 },
            { bookId: 204, lateDays: 3 },
        ],
    },
];
function getMemberFineStatistics(members, books, borrowRecords) {
    const bookMap = new Map(books.map((book) => [book.id, book]));
    const memberMap = new Map();

    for (const member of members) {
        memberMap.set(member.id, {
            id: member.id,
            name: member.name,
            totalFine: 0,
            books: [],
            _bookMap: new Map(),
        });
    }

    for (const record of borrowRecords) {
        if (!Object.hasOwn(record, "lines")) {
            continue;
        }

        const member = memberMap.get(record.memberId);
        if (!member) continue;

        for (const line of record.lines) {
            const book = bookMap.get(line.bookId);

            if (!book) continue;
            const fine = book.finePerDay * line.lateDays;
            member.totalFine += fine;

            if (member._bookMap.has(book.id)) {
                const item = member._bookMap.get(book.id);
                item.lateDays += line.lateDays;
                item.fine = item.lateDays * book.finePerDay;
            } else {
                const item = {
                    title: book.title,
                    lateDays: line.lateDays,
                    fine: fine,
                };

                member._bookMap.set(book.id, item);
                member.books.push(item);
            }
        }
    }
    const result = [];

    for (const member of memberMap.values()) {
        member.books.sort((a, b) => b.fine - a.fine);
        delete member._bookMap;
        Object.freeze(member);
        result.push(member);
    }

    result.sort((a, b) => b.totalFine - a.totalFine);
    Object.freeze(result);
    return result;
}

// 6. Duyệt kết quả theo trang
class MemberPaginator {
    constructor(resultList, pageSize) {
        this.resultList = resultList;
        this.pageSize = pageSize;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.resultList.length; i += this.pageSize) {
            yield this.resultList.slice(i, i + this.pageSize);
        }
    }
}
